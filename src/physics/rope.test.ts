import { describe, expect, it } from "vitest";
import { Rope } from "./rope";
import { distance, vec } from "./vec";

const L = 0.45;
const anchor = vec(0, L, 0.1);
const frame = 1 / 60;

function settle(rope: Rope, end = vec(0, 0, 0), seconds = 2) {
  for (let t = 0; t < seconds; t += frame) rope.step(frame, anchor, end);
}

const ropeLength = (r: Rope) => r.points.slice(1).reduce((s, p, i) => s + distance(p, r.points[i]!), 0);

describe("visual rope", () => {
  // Exactly one length below the anchor, offset 0.1 m in depth like a bifilar string.
  const taut = vec(0, anchor.y - Math.sqrt(L * L - 0.1 * 0.1), 0);

  it("is straight when its ends are a full length apart", () => {
    const rope = new Rope(L, 20, anchor, taut);
    settle(rope, taut);
    expect(rope.deviation()).toBeLessThan(5e-5);
  });

  it("sags and keeps its length when the ends come closer", () => {
    const end = vec(0.05, anchor.y - 0.3, 0.05);
    const rope = new Rope(L, 20, anchor, end);
    settle(rope, end, 4);
    expect(rope.deviation()).toBeGreaterThan(0.02);
    expect(Math.abs(ropeLength(rope) / L - 1)).toBeLessThan(0.005);
    const lowest = Math.min(...rope.points.map((p) => p.y));
    expect(lowest).toBeLessThan(end.y);
  });

  it("a hit shivers the taut line, which then straightens again", () => {
    const rope = new Rope(L, 20, anchor, taut);
    settle(rope, taut);
    rope.kick(vec(0.5, 0, 0));
    rope.step(frame, anchor, taut);
    expect(rope.deviation()).toBeGreaterThan(1e-4);
    settle(rope, taut, 0.4);
    expect(rope.deviation()).toBeLessThan(1e-4);
  });

  it("survives violent end motion without NaN", () => {
    const rope = new Rope(L, 20, anchor, taut);
    let seed = 3;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5;
    for (let i = 0; i < 2000; i++)
      rope.step(frame, anchor, vec(rand() * 0.6, anchor.y - 0.45 + rand() * 0.3, rand() * 0.2));
    for (const p of rope.points) expect(Number.isFinite(p.x + p.y + p.z)).toBe(true);
  });
});
