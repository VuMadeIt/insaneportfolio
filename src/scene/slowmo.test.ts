import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { Cradle } from "@/physics/cradle";
import { HOLD, SLOW, advanceClock, restoreTime, slowmo } from "./slowmo";

const STEPS = 2400;

/** State hash after exactly `STEPS` fixed steps, with frames fed through the slow-motion clock. */
function run(hoverAt: (frame: number) => number | null): string {
  restoreTime();
  slowmo.enabled = true;
  const c = new Cradle();
  c.lift(0, (-30 * Math.PI) / 180);
  let hash = "";
  c.beforeStep = (time) => {
    if (Math.round(time / c.config.dt) === STEPS + 1) hash = c.hash();
  };
  for (let f = 0; !hash; f++) {
    slowmo.hover = hoverAt(f);
    c.advance(advanceClock(1 / 60, c));
  }
  return hash;
}

describe("slow motion (PLAN 12.7)", () => {
  it("a varying time scale reaches the same state after N steps as real time", () => {
    const real = run(() => null);
    const scales: number[] = [];
    const slowed = run((f) => {
      scales.push(slowmo.scale);
      return Math.floor(f / 50) % 2 ? 1 : null;
    });
    expect(Math.min(...scales)).toBeCloseTo(SLOW, 3);
    expect(slowed).toBe(real);
  });

  it("one frame of contact with a swinging ball holds slow motion for HOLD seconds, then eases back", () => {
    restoreTime();
    slowmo.enabled = true;
    const c = new Cradle();
    c.lift(0, (-30 * Math.PI) / 180);
    for (let f = 0; f < 30; f++) c.advance(advanceClock(1 / 60, c));
    slowmo.hover = 0;
    c.advance(advanceClock(1 / 60, c));
    slowmo.hover = null;
    const scaleAt = (seconds: number) => {
      for (let t = 0; t < seconds; t += 1 / 60) c.advance(advanceClock(1 / 60, c));
      return slowmo.scale;
    };
    expect(scaleAt(HOLD - 0.1)).toBeCloseTo(SLOW, 3);
    expect(scaleAt(1.2)).toBe(1);
  });

  it("the physics never imports the slow-motion flag", () => {
    const dir = join(process.cwd(), "src/physics");
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts")))
      expect(readFileSync(join(dir, file), "utf8")).not.toMatch(/slowmo|timeScale/i);
  });
});
