// Prints the headline numbers of the default cradle. Usage: npx jiti scripts/physics/probe.ts
import { withConfig } from "../../src/physics/config";
import { Cradle } from "../../src/physics/cradle";

const deg = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

const c = new Cradle(withConfig({}));
console.log(
  "mass",
  c.derived.mass.toFixed(3),
  "kg  L",
  c.derived.pendulumLength.toFixed(4),
  "m  T0",
  (2 * Math.PI * Math.sqrt(c.derived.pendulumLength / 9.81)).toFixed(3),
  "s",
);
c.lift(0, deg(-30));
const e0 = c.energy();
let chainStart = -1;
let chainPeak = 0;
let lastEvent = -1;
const chains: { t: number; v: number }[] = [];
let middle = 0;
let worstString = 0;
for (let s = 0; s < 60 / c.config.dt; s++) {
  c.step();
  worstString = Math.max(worstString, c.maxStringError());
  for (const e of c.drainEvents()) {
    if (e.time - lastEvent > 0.03) {
      if (chainStart >= 0) chains.push({ t: chainStart, v: chainPeak });
      chainStart = e.time;
      chainPeak = 0;
    }
    chainPeak = Math.max(chainPeak, e.speed);
    lastEvent = e.time;
  }
  if (Math.round(c.time / c.config.dt) % Math.round(10 / c.config.dt) === 0) {
    console.log(
      `t=${c.time.toFixed(0)}s E/E0=${(c.energy() / e0).toFixed(3)} angles`,
      c.balls.map((_, i) => toDeg(c.angle(i)).toFixed(2)).join(" "),
      "middle peak so far",
      middle.toFixed(2),
    );
    middle = 0;
  }
  middle = Math.max(middle, Math.abs(toDeg(c.angle(1))), Math.abs(toDeg(c.angle(2))));
}
const db = chains.map((ch) => 20 * Math.log10(ch.v / chains[0]!.v));
console.log(
  "chains",
  chains.length,
  "first intervals",
  chains
    .slice(1, 6)
    .map((ch, i) => (ch.t - chains[i]!.t).toFixed(3))
    .join(" "),
);
console.log(
  "dB by clack",
  db
    .filter((_, i) => i % 5 === 0)
    .map((d) => d.toFixed(1))
    .join(" "),
);
console.log("worst string error (mm)", (worstString * 1000).toFixed(5));
