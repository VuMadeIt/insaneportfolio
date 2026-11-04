// Render the small objects (nav balls, the ball in "moving", the prizes) from /lab/object into
// public/media/objects as transparent WebP. Needs a dev server (the lab 404s in production).
// Usage: PORT=3200 node scripts/objects.mjs [kind ...]
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const base = `http://localhost:${process.env.PORT ?? 3200}/lab/object`;
// CSS px; rendered at 2x. Prizes share one square so they all sit at the same size.
const SIZES = {
  balls: [400, 100],
  ball: [240, 240],
  gold: [240, 240],
  bronze: [240, 240],
  cash: [240, 240],
  airpods: [240, 240],
};
const kinds = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SIZES);
mkdirSync(".artifacts/objects", { recursive: true });
mkdirSync("public/media/objects", { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
for (const kind of kinds) {
  const [width, height] = SIZES[kind];
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  page.on("pageerror", (e) => console.error(kind, e.message));
  await page.goto(`${base}?o=${kind}`, { waitUntil: "load", timeout: 120_000 });
  await page.waitForSelector("body[data-ready]", { state: "attached", timeout: 120_000 });
  await page.waitForTimeout(1500);
  const png = `.artifacts/objects/${kind}.png`;
  await page.screenshot({ path: png, omitBackground: true });
  await page.close();
  const out = `public/media/objects/${kind}.webp`;
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-i",
    png,
    "-c:v",
    "libwebp",
    "-quality",
    "90",
    "-pix_fmt",
    "yuva420p",
    out,
  ]);
  console.log(out);
}
await browser.close();
