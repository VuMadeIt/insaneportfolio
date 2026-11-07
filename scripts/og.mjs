// Films the share preview (PLAN 15.14): one ball swinging in and out of frame, rendered from the
// real scene one exact frame at a time, cut to a seamless two-swing loop.
// Needs a server with the lab (dev, or LAB=1). Usage: PORT=3200 node scripts/og.mjs [angle]
// Writes public/og/cover.mp4 (H.264, 1200x630, faststart) and public/og/cover.jpg.
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const base = `http://localhost:${process.env.PORT ?? 3200}/lab/og`;
const angle = Number(process.argv[2] ?? 32);
const dir = ".artifacts/og";
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
mkdirSync("public/og", { recursive: true });

const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(base, { waitUntil: "load", timeout: 120_000 });
await page.waitForFunction(() => window.__frame, null, { timeout: 120_000 });
// Warm up until the scene is live and its reflections are filled in.
for (let k = 0; k < 400 && !(await page.$("body[data-ready]")); k++)
  await page.evaluate(() => window.__frame());
for (let k = 0; k < 20; k++) await page.evaluate(() => window.__frame());

// Release, let one swing pass (the strings settle), then film.
await page.evaluate((a) => window.__release(a), angle);
const xs = [];
for (let k = 0; k < 30; k++) await page.evaluate(() => window.__frame());
const FRAMES = 210;
for (let k = 0; k < FRAMES; k++) {
  xs.push(await page.evaluate(() => window.__frame()));
  await page.screenshot({ path: `${dir}/f-${String(k).padStart(4, "0")}.png` });
}
await browser.close();

// A seamless loop: from one right-hand turning point to the one two swings later.
const peaks = xs.flatMap((x, i) =>
  i > 0 && i < xs.length - 1 && x > xs[i - 1] && x >= xs[i + 1] ? [i] : [],
);
if (peaks.length < 3) throw new Error(`not enough swings filmed: peaks ${peaks}`);
const [start, , end] = peaks;
console.log(
  `angle ${angle}, peaks ${peaks.join(",")}, loop ${start}-${end} (${((end - start) / 30).toFixed(2)} s)`,
);

execFileSync("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-framerate",
  "30",
  "-start_number",
  String(start),
  "-i",
  `${dir}/f-%04d.png`,
  "-frames:v",
  String(end - start),
  "-vf",
  "scale=1200:630:flags=lanczos",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "22",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  "public/og/cover.mp4",
]);
// The still: the ball just past the bottom of its swing, near the middle, strings leaning.
const loop = xs.slice(start, end);
const still = start + loop.indexOf(loop.reduce((a, b) => (Math.abs(b + 0.05) < Math.abs(a + 0.05) ? b : a)));
execFileSync("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-i",
  `${dir}/f-${String(still).padStart(4, "0")}.png`,
  "-vf",
  "scale=1200:630:flags=lanczos",
  "-q:v",
  "3",
  "public/og/cover.jpg",
]);
// The same loop as a GIF, for Discord, which animates a GIF image but only plays a video on a click.
execFileSync("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-i",
  "public/og/cover.mp4",
  "-vf",
  "fps=20,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle",
  "-loop",
  "0",
  "public/og/cover.gif",
]);
console.log("public/og/cover.mp4, cover.gif, cover.jpg (still frame", still, ")");
