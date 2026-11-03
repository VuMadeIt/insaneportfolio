import { describe, expect, it } from "vitest";
import { Pit } from "./pit";

const run = (pit: Pit, seconds: number) => {
  for (let t = 0; t < seconds; t += 1 / 60) pit.step(1 / 60);
};

function pit() {
  const p = new Pit();
  p.setBounds(1000, 800);
  // A word: 300px wide, 20px tall, in the middle.
  p.setBoxes([{ x: 350, y: 500, w: 300, h: 20 }]);
  return p;
}

describe("footer ball pit (PLAN 13.4)", () => {
  it("a ball dropped over a word comes to rest on top of it", () => {
    const p = pit();
    const b = p.drop(500, 100, 20);
    run(p, 4);
    expect(b.y).toBeCloseTo(480, 0);
    expect(Math.abs(b.x - 500)).toBeLessThan(5);
    expect(p.awake).toBe(false);
  });

  it("a ball dropped over the end of a word rolls off its corner onto the floor", () => {
    const p = pit();
    const b = p.drop(655, 100, 20);
    run(p, 6);
    expect(b.y).toBeCloseTo(780, 0);
    expect(b.x).toBeGreaterThan(670);
  });

  it("a fast ball never passes through a thin line of text", () => {
    const p = pit();
    const b = p.drop(500, 300, 20);
    b.vy = 4000;
    run(p, 3);
    expect(b.y).toBeLessThan(500);
  });

  it("a ball dropped onto a resting ball rolls away; they never overlap", () => {
    const p = pit();
    const a = p.drop(500, 100, 20);
    run(p, 3);
    const b = p.drop(504, 100, 20);
    run(p, 6);
    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(39);
    for (const ball of [a, b]) expect(Number.isFinite(ball.x + ball.y)).toBe(true);
  });

  it("walls keep every ball inside, and the oldest ball goes past the limit", () => {
    const p = pit();
    p.maxBalls = 3;
    const first = p.drop(30, 100, 20, -3000);
    p.drop(970, 100, 20, 3000);
    p.drop(500, 100, 20);
    run(p, 2);
    for (const b of p.balls) expect(b.x).toBeGreaterThanOrEqual(19.5);
    p.drop(200, 100, 20);
    expect(p.balls).not.toContain(first);
    expect(p.balls).toHaveLength(3);
  });

  it("hits report their speed for the clack, quiet contacts do not", () => {
    const p = pit();
    p.drop(500, 100, 20);
    const loud = Array.from({ length: 90 }, () => p.step(1 / 60)).flat();
    expect(loud.length).toBeGreaterThan(0);
    expect(Math.max(...loud.map((i) => i.speed))).toBeGreaterThan(1000);
    run(p, 3);
    expect(p.step(1 / 60)).toEqual([]);
  });
});
