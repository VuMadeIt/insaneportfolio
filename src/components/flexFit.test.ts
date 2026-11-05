import { describe, expect, it } from "vitest";
import { FILL, LO, WDTHS, WGHTS, bump, markerTargets, restWidthFor, solve } from "./flexFit";

// A stand-in glyph whose advance grows with width and weight, like Roboto Flex's.
const glyph = (base: number) =>
  Float64Array.from(WGHTS.flatMap((wg) => WDTHS.map((wd) => base * (wd / 100) * (0.8 + wg / 2500))));
const grids = [0.6, 0.5, 0.3, 0.55, 0.6, 0.45, 0.5, 0.62].map(glyph);
const target = 4 * FILL;
const restW = restWidthFor(grids, target);
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

describe("flexFit", () => {
  it("rests at a width that fills the column", () => {
    expect(restW).toBeGreaterThan(LO.wdth);
    expect(
      sum(
        solve(
          grids,
          grids.map(() => 0),
          restW,
          target,
        ).width,
      ),
    ).toBeCloseTo(target, 4);
  });

  it("widens the letters near the pointer and still fills the column exactly", () => {
    const es = grids.map((_, i) => bump(2, i, 1.5));
    const rest = solve(
      grids,
      grids.map(() => 0),
      restW,
      target,
    );
    const live = solve(grids, es, restW, target);
    expect(sum(live.width)).toBeCloseTo(target, 4);
    expect(live.axes[2]!.wdth).toBeGreaterThan(rest.axes[2]!.wdth);
    expect(live.axes[7]!.wdth).toBeLessThanOrEqual(rest.axes[7]!.wdth);
  });

  it("puts the phone marker's letter in the lead", () => {
    const rest = solve(
      grids,
      grids.map(() => 0),
      restW,
      target,
    );
    const restCx = rest.left.map((l, i) => l + rest.width[i]! / 2);
    const marker = restCx[5]!;
    const es = markerTargets(grids, restCx, restW, target, marker, 1.5);
    const { left, width } = solve(grids, es, restW, target);
    const under = left.findIndex((l, i) => marker >= l && marker <= l + width[i]!);
    expect(Math.max(...es)).toBe(es[under]);
  });
});
