/**
 * The model behind "Let's get things moving." (MovingLine.tsx), after Kern Society's hero
 * (shockingmike.github.io/kern-society), set in the site's General Sans (PLAN 15.11). Every letter
 * has a state s in [0, 1] on a two-segment path: s = 0 hairline and condensed, s = 0.5 the line's
 * rest, s = 1 heaviest and extended. General Sans has a weight axis (200-700) but no width axis, so
 * width is a horizontal scale in percent (`wdth` 100 = the drawn letter). Each letter gets an
 * emphasis e in [-1, 1] (from the pointer, a pulse or the scroll on phones), and one shared offset
 * is solved so the advances always add up to the column: near letters widen, far letters condense,
 * and the line never overflows or opens a gap.
 */

export interface Axes {
  wght: number;
  /** Horizontal scale, percent. */
  wdth: number;
}

/** The site's heading weight. */
export const REST_WGHT = 350;
export const LO: Axes = { wght: 200, wdth: 55 };
export const HI: Axes = { wght: 700, wdth: 150 };
/** The grid of advances: every glyph measured at these weights; width scales them linearly. */
export const WGHTS = [200, 300, 400, 500, 600, 700];
export const WDTHS = [LO.wdth, HI.wdth];
/** Guard against sub-pixel rounding. */
export const FILL = 0.998;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function axesAt(s: number, restW: number): Axes {
  if (s <= 0.5) return { wght: lerp(LO.wght, REST_WGHT, s / 0.5), wdth: lerp(LO.wdth, restW, s / 0.5) };
  const u = (s - 0.5) / 0.5;
  return { wght: lerp(REST_WGHT, HI.wght, u), wdth: lerp(restW, HI.wdth, u) };
}

const cell = (arr: number[], v: number) => {
  let i = 0;
  while (i < arr.length - 2 && v > arr[i + 1]!) i++;
  return i;
};

/** Bilinear lookup of a glyph's advance (em) in its measured wght x wdth grid. */
export function advance(grid: ArrayLike<number>, a: Axes): number {
  const i = cell(WGHTS, a.wght);
  const j = cell(WDTHS, a.wdth);
  const u = clamp((a.wght - WGHTS[i]!) / (WGHTS[i + 1]! - WGHTS[i]!), 0, 1);
  const v = clamp((a.wdth - WDTHS[j]!) / (WDTHS[j + 1]! - WDTHS[j]!), 0, 1);
  const n = WDTHS.length;
  return lerp(
    lerp(grid[i * n + j]!, grid[i * n + j + 1]!, v),
    lerp(grid[(i + 1) * n + j]!, grid[(i + 1) * n + j + 1]!, v),
    u,
  );
}

const bisect = (f: (x: number) => number, target: number, lo: number, hi: number) => {
  for (let k = 0; k < 24; k++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > target) hi = mid;
    else lo = mid;
  }
  return lo;
};

/** Total advance (em) of a line resting at width `wdth`. */
export const restEm = (grids: ArrayLike<number>[], wdth: number) =>
  grids.reduce((sum, g) => sum + advance(g, { wght: REST_WGHT, wdth }), 0);

/** The resting width at which the line fills `targetEm` exactly. */
export const restWidthFor = (grids: ArrayLike<number>[], targetEm: number) =>
  restEm(grids, HI.wdth) <= targetEm ? HI.wdth : bisect((w) => restEm(grids, w), targetEm, LO.wdth, HI.wdth);

/** Axes and left edges (em) of every letter for these emphases, filling `targetEm`. */
export function solve(grids: ArrayLike<number>[], es: number[], restW: number, targetEm: number) {
  const axesFor = (offset: number) => es.map((e) => axesAt(clamp(offset + e * 0.5, 0, 1), restW));
  const total = (offset: number) => axesFor(offset).reduce((sum, a, i) => sum + advance(grids[i]!, a), 0);
  // At -0.5 every letter is a hairline (always narrower than the column), at 1.5 always wider.
  const axes = axesFor(bisect(total, targetEm, -0.5, 1.5));
  const left: number[] = [];
  const width: number[] = [];
  let x = 0;
  axes.forEach((a, i) => {
    const w = advance(grids[i]!, a);
    left.push(x);
    width.push(w);
    x += w;
  });
  return { axes, left, width };
}

/** A Gaussian bump around `x`: +1 under it, -1 far away. */
export const bump = (x: number, c: number, radius: number) => 2 * Math.exp(-((x - c) ** 2) / radius ** 2) - 1;

/**
 * Phone targets for one marker position (Kern's fixed point): start from the resting centres,
 * re-measure against the layout those emphases produce, then make the letter really under the
 * marker the leader so it keeps the marker as it widens. Depends on the marker alone.
 */
export function markerTargets(
  grids: ArrayLike<number>[],
  restCx: number[],
  restW: number,
  targetEm: number,
  markerEm: number,
  radiusEm: number,
): number[] {
  let es = restCx.map((c) => bump(markerEm, c, radiusEm));
  for (let pass = 0; pass < 5; pass++) {
    const { left, width } = solve(grids, es, restW, targetEm);
    es = es.map((e, i) => lerp(e, bump(markerEm, left[i]! + width[i]! / 2, radiusEm), 0.6));
  }
  const { left, width } = solve(grids, es, restW, targetEm);
  let lead = left.findIndex((l, i) => markerEm >= l && markerEm <= l + width[i]!);
  if (lead < 0) lead = markerEm <= 0 ? 0 : es.length - 1;
  const MARGIN = 0.06;
  const others = Math.max(...es.filter((_, i) => i !== lead));
  if (es[lead]! < others + MARGIN) {
    es[lead] = Math.min(1, others + MARGIN);
    es = es.map((e, i) => (i === lead ? e : Math.min(e, es[lead]! - MARGIN)));
  }
  return es;
}
