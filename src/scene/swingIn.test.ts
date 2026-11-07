import { describe, expect, it } from "vitest";
import { Cradle } from "@/physics/cradle";
import { vec } from "@/physics/vec";
import { glideAt, planSwingIn } from "./swingIn";

const c0 = new Cradle();
const L = c0.derived.pendulumLength;
const g = c0.config.gravity;
const HIT = Math.sqrt(2 * g * L * (1 - Math.cos(Math.PI / 6)));

/** Let People go per the plan in a fresh cradle; returns where it started and its first impact. */
function run(distance: number) {
  const plan = planSwingIn(distance, HIT, L, g);
  const c = new Cradle();
  const restX = c.balls[0]!.pos.x;
  c.teleportAnchors(0, vec(glideAt(plan, 0), 0, 0));
  c.lift(0, -plan.angle);
  c.push(0, plan.speed);
  const startX = c.balls[0]!.pos.x;
  const t0 = c.time;
  c.beforeStep = (time) => c.setAnchorOffset(0, vec(glideAt(plan, time - t0), 0, 0));
  while (c.time - t0 < 3) {
    c.step();
    const hit = c.drainEvents()[0];
    if (hit) return { plan, travel: restX - startX, hit, after: hit.time - t0 };
  }
  throw new Error("no impact");
}

describe("People swings in (PLAN 15.19)", () => {
  // A phone, a 1440 x 900 laptop, a 1920 x 1080 desktop and a 21:9 monitor.
  for (const distance of [0.12, 0.34, 0.37, 0.6]) {
    it(`starts ${distance} m out and hits at the same speed`, () => {
      const { plan, travel, hit, after } = run(distance);
      expect(travel).toBeGreaterThanOrEqual(distance - 1e-3);
      expect(hit.a).toBe(0);
      expect(hit.b).toBe(1);
      expect(hit.speed / HIT).toBeGreaterThan(0.97);
      expect(hit.speed / HIT).toBeLessThan(1.01);
      // The anchor has stopped when the ball meets its neighbour.
      expect(Math.abs(after - plan.duration)).toBeLessThan(0.01);
    });
  }

  it("a phone gets a pure swing, a wide screen a glide", () => {
    expect(planSwingIn(0.12, HIT, L, g).speed).toBe(0);
    expect(planSwingIn(0.6, HIT, L, g).angle).toBe(0);
  });
});
