// Fits restitution and suspension hysteresis to a real recording. Usage:
//   python scripts/audio/analyse.py reference/audio/*.mp3 > reference/audio/analysis.json
//   npx jiti scripts/physics/calibrate.ts
//
// The recording is a desk cradle, so we simulate *its* geometry (5 balls, pendulum length from the
// clack interval), fit the two loss parameters there, and carry them over to our cradle: restitution
// is a property of the steel contact, hysteresis of the string, neither of the size.
//
// Loudness model: Hertzian contact gives peak force ~ v^(6/5), and the peak sound pressure follows the
// peak force, so level_dB = 24 log10(v_impact) + const. Clacks that clip (> -1 dBFS) are excluded.
import { readFileSync } from "node:fs";
import { withConfig } from "../../src/physics/config";
import { Cradle } from "../../src/physics/cradle";

const FILE = "131596_1554038.mp3";
const HERTZ_EXPONENT = 1.2;
const deg = (d: number) => (d * Math.PI) / 180;

interface Analysis {
  file: string;
  onsets: number[];
  levels_db: number[];
}
const rec = (JSON.parse(readFileSync("reference/audio/analysis.json", "utf8")) as Analysis[]).find((a) =>
  a.file.endsWith(FILE),
)!;
const first = rec.levels_db.findIndex((l) => l < -1);
const recLevels = rec.levels_db.slice(first).map((l) => l - rec.levels_db[first]!);
const recIntervals = rec.onsets.slice(1).map((t, i) => t - rec.onsets[i]!);

function simulate(restitution: number, hysteresis: number, lift: number, stringLength: number) {
  const c = new Cradle(
    withConfig({
      count: 5,
      ball: { radius: 0.0095, restitution },
      stringLength,
      anchorHalfSpread: 0.04,
      eyeletHeight: 0.003,
      hysteresis,
    }),
  );
  c.lift(0, deg(-lift));
  const chains: { t: number; v: number }[] = [];
  let last = -1;
  for (let s = 0; s < (rec.onsets.at(-1)! - rec.onsets[0]! + 0.5) / c.config.dt; s++) {
    c.step();
    for (const e of c.drainEvents()) {
      if (e.time - last > 0.03) chains.push({ t: e.time, v: 0 });
      chains.at(-1)!.v = Math.max(chains.at(-1)!.v, e.speed);
      last = e.time;
    }
  }
  return chains;
}

// The microphone sat closer to one end, so left and right clacks alternate by ~2 dB. Score on the
// mean of each consecutive pair, which cancels that.
const pairMean = (xs: number[]) => xs.slice(1).map((x, i) => (x + xs[i]!) / 2);
const recPairs = pairMean(recLevels);

function score(chains: { t: number; v: number }[]) {
  if (chains.length < rec.onsets.length) return { level: Infinity, interval: Infinity };
  const ref = chains[first]!.v;
  const sim = pairMean(recLevels.map((_, k) => 20 * HERTZ_EXPONENT * Math.log10(chains[first + k]!.v / ref)));
  let level = 0;
  for (let k = 0; k < recPairs.length; k++) level += (sim[k]! - recPairs[k]!) ** 2;
  level /= recPairs.length / recLevels.length;
  let interval = 0;
  for (let k = 0; k < recIntervals.length; k++)
    interval += (chains[k + 1]!.t - chains[k]!.t - recIntervals[k]!) ** 2;
  return { level: Math.sqrt(level / recLevels.length), interval: Math.sqrt(interval / recIntervals.length) };
}

// The string length only sets the timing; fit it first at a typical lift.
let bestLength = 0;
let bestInterval = Infinity;
for (let l = 0.09; l <= 0.13; l += 0.0025) {
  const { interval } = score(simulate(0.97, 0.05, 30, l));
  if (interval < bestInterval) [bestLength, bestInterval] = [l, interval];
}
console.log(`string length ${bestLength.toFixed(4)} m, interval rmse ${(bestInterval * 1000).toFixed(1)} ms`);

const results: { e: number; h: number; lift: number; level: number; interval: number }[] = [];
for (const e of [0.95, 0.955, 0.96, 0.965, 0.97, 0.975, 0.98])
  for (const h of [0, 0.05, 0.1, 0.15])
    for (const lift of [30, 40]) results.push({ e, h, lift, ...score(simulate(e, h, lift, bestLength)) });
results.sort((a, b) => a.level - b.level);
console.log("best fits (level rmse dB, interval rmse ms):");
for (const r of results.slice(0, 8))
  console.log(
    `  e=${r.e} hysteresis=${r.h} lift=${r.lift}  level ${r.level.toFixed(2)} dB  interval ${(r.interval * 1000).toFixed(1)} ms`,
  );

const best = results[0]!;
const chains = simulate(best.e, best.h, best.lift, bestLength);
console.log("clack   rec dB   sim dB   rec dt   sim dt");
for (let k = 0; k < recLevels.length; k++) {
  const i = first + k;
  const sim = 20 * HERTZ_EXPONENT * Math.log10(chains[i]!.v / chains[first]!.v);
  const recDt = i > 0 ? recIntervals[i - 1]! : 0;
  const simDt = i > 0 ? chains[i]!.t - chains[i - 1]!.t : 0;
  console.log(
    `${String(i).padStart(5)}  ${recLevels[k]!.toFixed(1).padStart(7)}  ${sim.toFixed(1).padStart(7)}  ${recDt.toFixed(3)}  ${simDt.toFixed(3)}`,
  );
}
