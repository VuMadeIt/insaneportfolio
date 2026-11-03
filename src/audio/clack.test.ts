import { describe, expect, it } from "vitest";
import { chainClacks } from "./clack";

const hit = (time: number, speed: number, x = 0) => ({ time, a: 0, b: 1, speed, point: { x, y: 0, z: 0 } });

describe("chainClacks", () => {
  it("plays a chain of near-simultaneous impacts as one clack at the loudest speed", () => {
    const { clacks } = chainClacks(
      [hit(1.0, 1.1, -0.03), hit(1.0002, 1.08, 0), hit(1.0004, 1.05, 0.03)],
      -Infinity,
    );
    expect(clacks).toEqual([{ speed: 1.1, x: -0.03 }]);
  });

  it("separates impacts further apart than the chain window", () => {
    expect(chainClacks([hit(1, 1), hit(1.05, 0.5)], -Infinity).clacks).toHaveLength(2);
  });

  it("does not replay a chain that continues into the next frame", () => {
    const first = chainClacks([hit(2, 1)], -Infinity);
    expect(chainClacks([hit(2.003, 0.9)], first.last).clacks).toHaveLength(0);
  });
});
