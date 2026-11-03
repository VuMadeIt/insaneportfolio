import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { withConfig } from "./config";
import { maxPenetration } from "./contacts";
import { Cradle } from "./cradle";
import { vec } from "./vec";

const deg = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;
/** No air, no hysteresis: isolates the integrator and the contact model. */
const lossless = withConfig({ airDensity: 0, hysteresis: 0 });

function runFor(c: Cradle, seconds: number, each?: () => void) {
  const steps = Math.round(seconds / c.config.dt);
  for (let s = 0; s < steps; s++) {
    c.step();
    each?.();
  }
}

/** Step until the first impact. Returns the fastest ball speed just before it. */
function untilImpact(c: Cradle) {
  let incoming = 0;
  while (c.events.length === 0) {
    incoming = Math.max(...c.balls.map((b) => Math.abs(b.vel.x)));
    c.step();
  }
  return incoming;
}

/** Continue until the current impact chain is over (no new impact for 20 ms). */
function runChain(c: Cradle) {
  let last = c.time;
  while (c.time - last < 0.02) {
    if (c.drainEvents().length) last = c.time;
    c.step();
  }
  c.drainEvents();
}

/** Period from successive upward zero crossings of x - x_rest, interpolated between substeps. */
function measurePeriod(c: Cradle, i: number, cycles: number) {
  const rest = c.balls[i]!.restAnchors[0].x;
  const crossings: number[] = [];
  let prevX = c.balls[i]!.pos.x - rest;
  let prevT = c.time;
  while (crossings.length < cycles + 1) {
    c.step();
    const x = c.balls[i]!.pos.x - rest;
    if (prevX < 0 && x >= 0) crossings.push(prevT + ((c.time - prevT) * -prevX) / (x - prevX));
    prevX = x;
    prevT = c.time;
  }
  return (crossings[crossings.length - 1]! - crossings[0]!) / cycles;
}

describe("1. single pendulum period", () => {
  for (const theta of [5, 30]) {
    it(`matches 2*pi*sqrt(L/g)*(1 + theta^2/16) within 0.5% at ${theta} deg`, () => {
      const c = new Cradle(withConfig({ ...lossless, count: 1 }));
      c.lift(0, deg(-theta));
      const L = c.derived.pendulumLength;
      const expected = 2 * Math.PI * Math.sqrt(L / c.config.gravity) * (1 + deg(theta) ** 2 / 16);
      const measured = measurePeriod(c, 0, 4);
      expect(Math.abs(measured / expected - 1)).toBeLessThan(0.005);
    });
  }
});

describe("2. one ball in, one ball out", () => {
  it("the far ball leaves with >= 95% of the incoming speed; middle balls barely move", () => {
    const c = new Cradle();
    c.lift(0, deg(-30));
    const incoming = untilImpact(c);
    runChain(c);
    const outgoing = c.balls[3]!.vel.x;
    expect(outgoing / incoming).toBeGreaterThanOrEqual(0.95);
    let middlePeak = 0;
    runFor(c, 0.3, () => {
      middlePeak = Math.max(middlePeak, Math.abs(toDeg(c.angle(1))), Math.abs(toDeg(c.angle(2))));
    });
    expect(middlePeak).toBeLessThan(1);
  });
});

describe("3. n balls in, n balls out", () => {
  for (const n of [2, 3]) {
    it(`${n} lifted -> ${n} leave`, () => {
      const c = new Cradle();
      for (let i = 0; i < n; i++) c.lift(i, deg(-25));
      untilImpact(c);
      runChain(c);
      // Let the chain fully separate, then look at who is swinging out on the far side.
      runFor(c, 0.25);
      const leaving = c.balls.filter((_, i) => toDeg(c.angle(i)) > 3).length;
      const stayed = c.balls.filter((_, i) => Math.abs(toDeg(c.angle(i))) < 1.5).length;
      expect(leaving).toBe(n);
      expect(stayed).toBe(4 - n);
    });
  }
});

describe("4. conservation", () => {
  it("horizontal momentum through each collision chain is conserved within 1%", () => {
    const c = new Cradle();
    c.lift(0, deg(-30));
    // Measured over the steps that contain impacts: the strings are vertical there, so any change
    // in horizontal momentum would come from the contact model.
    for (let chain = 0; chain < 6; chain++) {
      let before = c.momentumX();
      while (c.events.length === 0) {
        before = c.momentumX();
        c.step();
      }
      c.drainEvents();
      let quiet = 0;
      while (quiet < 2) {
        c.step();
        quiet = c.drainEvents().length ? 0 : quiet + 1;
      }
      expect(Math.abs(c.momentumX() - before) / Math.abs(before)).toBeLessThan(0.01);
    }
  });

  it("total energy never increases without input", () => {
    const c = new Cradle();
    c.lift(0, deg(-30));
    // Ball centres rest at y = 0, so energy() is the swing energy above rest.
    const swing = c.energy();
    let prev = swing;
    let worst = 0;
    runFor(c, 20, () => {
      const e = c.energy();
      worst = Math.max(worst, e - prev);
      prev = e;
    });
    expect(worst).toBeLessThan(swing * 1e-6);
  });
});

describe("5. slack strings", () => {
  it("a ball lifted above its arc falls freely, snaps taut, and never overstretches", () => {
    const c = new Cradle(withConfig({ count: 1 }));
    const L = c.derived.pendulumLength;
    const mid = c.anchorMid(0);
    c.place(0, vec(mid.x - 0.6 * L * Math.sin(deg(40)), mid.y - 0.6 * L * Math.cos(deg(40)), 0));
    const y0 = c.balls[0]!.pos.y;
    const e0 = c.energy();
    // Free fall first: after 50 ms the ball has dropped g t^2 / 2 and not moved sideways.
    runFor(c, 0.05);
    expect(y0 - c.balls[0]!.pos.y).toBeCloseTo(0.5 * 9.81 * 0.05 ** 2, 3);
    let worstError = 0;
    let worstEnergy = -Infinity;
    runFor(c, 5, () => {
      worstError = Math.max(worstError, c.maxStringError());
      worstEnergy = Math.max(worstEnergy, c.energy());
    });
    expect(worstError).toBeLessThan(1e-4);
    expect(worstEnergy).toBeLessThanOrEqual(e0 + 1e-9);
    expect(Math.abs(toDeg(c.angle(0)))).toBeLessThan(90);
  });
});

describe("6. torture", () => {
  it("10,000 random drag/release steps: no NaN, interpenetration < 0.05 mm", () => {
    const c = new Cradle();
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const L = c.derived.pendulumLength;
    let worst = 0;
    for (let s = 0; s < 10_000; s++) {
      const r = rand();
      const target = vec((rand() - 0.5) * 2 * L, L * (rand() - 0.2), 0);
      if (r < 0.02) c.grab(Math.floor(rand() * 4), target);
      else if (r < 0.04) c.release();
      else if (r < 0.3) c.moveHand(target);
      c.step();
      c.drainEvents();
      worst = Math.max(worst, maxPenetration(c.balls, c.config.ball.radius));
      for (const b of c.balls)
        expect(Number.isFinite(b.pos.x + b.pos.y + b.pos.z + b.vel.x + b.vel.y + b.vel.z)).toBe(true);
    }
    expect(worst).toBeLessThan(5e-5);
  });
});

describe("7. frame-rate independence", () => {
  it("identical state after 10 s at 30, 60 and 144 fps", () => {
    const hashes = [30, 60, 144].map((fps) => {
      const c = new Cradle();
      c.lift(0, deg(-30));
      c.lift(1, deg(-30));
      for (let f = 0; f < 10 * fps; f++) c.advance(1 / fps);
      expect(c.time).toBeCloseTo(10, 6);
      return c.hash();
    });
    expect(hashes[1]).toBe(hashes[0]);
    expect(hashes[2]).toBe(hashes[0]);
  });
});

describe("8. material independence", () => {
  it("the physics module imports nothing from scene, state, React or three", () => {
    const dir = join(process.cwd(), "src/physics");
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))) {
      const source = readFileSync(join(dir, file), "utf8");
      const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]!);
      for (const spec of imports) expect(spec.startsWith("./"), `${file} imports ${spec}`).toBe(true);
    }
  });

  it("changing material, reveal and identity in the UI store leaves the physics hash unchanged", async () => {
    const { useUi } = await import("../state/ui");
    const run = (fiddle: boolean) => {
      const c = new Cradle();
      c.lift(0, deg(-20));
      runFor(c, 3, () => {
        if (!fiddle) return;
        const ui = useUi.getState();
        ui.setMaterial(ui.material === "chrome" ? "porcelain" : "chrome");
        ui.setReveal(ui.reveal === "a" ? "b" : "a");
        ui.setHovered(ui.hovered === null ? 2 : null);
      });
      return c.hash();
    };
    expect(run(true)).toBe(run(false));
  });
});

describe("9. long run", () => {
  it("after 60 s the swing has decayed and the middle balls have picked up motion", () => {
    const c = new Cradle();
    c.lift(0, deg(-30));
    const swing0 = c.energy();
    let middlePeak = 0;
    let spread = 0;
    runFor(c, 60, () => {
      if (c.time < 50) return;
      const angles = c.balls.map((_, i) => toDeg(c.angle(i)));
      middlePeak = Math.max(middlePeak, Math.abs(angles[1]!), Math.abs(angles[2]!));
      spread = Math.max(spread, Math.max(...angles) - Math.min(...angles));
    });
    // Viscous hysteresis alone leaves exp(-gamma t) of the energy (dE/dt = -gamma * 2 <KE> = -gamma E);
    // impacts can only remove more. It must still be visibly swinging.
    const envelope = Math.exp(-c.config.hysteresis * 60);
    const ratio = c.energy() / swing0;
    expect(ratio).toBeLessThan(envelope);
    expect(ratio).toBeGreaterThan(0.01);
    // Emergent: by the end the middle balls carry real motion and the four swing as one.
    expect(middlePeak).toBeGreaterThan(1);
    expect(spread).toBeLessThan(0.5);
  });
});

describe("10. kinematic anchor glide", () => {
  it("moving the anchors makes the ball lag and swing, then settle, without stretching a string", () => {
    const c = new Cradle(withConfig({ count: 1 }));
    const glide = 0.35;
    const duration = 1.1;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let lag = 0;
    let worstError = 0;
    for (let t = 0; t <= duration + 1e-9; t += c.config.dt) {
      c.setAnchorOffset(0, vec(glide * ease(Math.min(1, t / duration)), 0, 0));
      c.step();
      lag = Math.max(lag, Math.abs(toDeg(c.angle(0))));
      worstError = Math.max(worstError, c.maxStringError());
    }
    expect(lag).toBeGreaterThan(2);
    let late = 0;
    runFor(c, 30, () => {
      worstError = Math.max(worstError, c.maxStringError());
      if (c.time > 25) late = Math.max(late, Math.abs(toDeg(c.angle(0))));
    });
    expect(worstError).toBeLessThan(1e-4);
    expect(late).toBeLessThan(lag);
    expect(c.anchorMid(0).x).toBeCloseTo(glide, 9);
  });
});

describe("choreography hooks", () => {
  it("beforeStep sees simulation time, so anchor paths are frame-rate independent", () => {
    const hashes = [30, 144].map((fps) => {
      const c = new Cradle();
      c.beforeStep = (t) => c.setAnchorOffset(1, vec(0.2 * Math.min(1, t / 1.5), 0.1 * Math.sin(t), 0));
      for (let f = 0; f < 3 * fps; f++) c.advance(1 / fps);
      return c.hash();
    });
    expect(hashes[1]).toBe(hashes[0]);
  });

  it("teleportAnchors carries the ball with its anchors and leaves it hanging still", () => {
    const c = new Cradle();
    c.teleportAnchors(2, vec(-0.15, 0.3, 0));
    c.wake();
    runFor(c, 1);
    expect(c.maxStringError()).toBeLessThan(1e-6);
    expect(Math.abs(toDeg(c.angle(2)))).toBeLessThan(0.01);
    expect(c.balls[2]!.pos.y).toBeCloseTo(0.3, 5);
  });
});

describe("input-shaped glide (choreography)", () => {
  it("two half moves half a period apart leave far less residual swing than one move", () => {
    const residual = (shaped: boolean) => {
      const c = new Cradle(withConfig({ count: 1 }));
      const T = 2 * Math.PI * Math.sqrt(c.derived.pendulumLength / c.config.gravity);
      const D = 0.45;
      const move = 0.3;
      const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) ** 2);
      const part = (t: number, start: number) => ease(Math.min(1, Math.max(0, (t - start) / D)));
      c.beforeStep = (t) =>
        c.setAnchorOffset(
          0,
          vec(shaped ? (move / 2) * (part(t, 0) + part(t, T / 2)) : move * part(t, 0), 0, 0),
        );
      c.wake();
      let lag = 0;
      runFor(c, D + T / 2, () => (lag = Math.max(lag, Math.abs(toDeg(c.angle(0))))));
      let late = 0;
      runFor(c, 3, () => (late = Math.max(late, Math.abs(toDeg(c.angle(0))))));
      return { lag, late };
    };
    const single = residual(false);
    const shaped = residual(true);
    expect(shaped.lag).toBeGreaterThan(2);
    expect(shaped.late).toBeLessThan(single.late * 0.25);
    expect(shaped.late).toBeLessThan(0.6);
  });
});
