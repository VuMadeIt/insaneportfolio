// Render the pre-rendered cradle stills (LCP image and no-WebGL fallback) from the real scene.
// Needs a server with the lab enabled (dev, or LAB=1). Usage: node scripts/still.mjs
// Output sizes match the framing in src/scene/framing.ts and `.cradle-still` in globals.css:
// landscape 1:1 (0.8 m x 0.8 m of world), portrait 0.36 m x 0.78 m.
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const base = `http://localhost:${process.env.PORT ?? 3200}/lab/still`;
const shots = [
  { name: "cradle-landscape", width: 1000, height: 1000, scale: 2 },
  { name: "cradle-portrait", width: 450, height: 975, scale: 2 },
];
mkdirSync(".artifacts/still", { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: process.env.SWIFTSHADER
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--enable-gpu", "--ignore-gpu-blocklist"],
});
for (const s of shots) {
  const page = await browser.newPage({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: s.scale,
  });
  await page.goto(`${base}${process.env.QUERY ?? ""}`, { waitUntil: "networkidle", timeout: 90_000 });
  await page.waitForSelector("body[data-ready]", { state: "attached", timeout: 90_000 });
  await page.waitForTimeout(6000);
  const png = `.artifacts/still/${s.name}.png`;
  await page.screenshot({ path: png, omitBackground: true });
  await page.close();
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-i",
    png,
    "-c:v",
    "libwebp",
    "-quality",
    "88",
    "-pix_fmt",
    "yuva420p",
    `public/fallback/${s.name}.webp`,
  ]);
  console.log(`public/fallback/${s.name}.webp`);
}
await browser.close();
