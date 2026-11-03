// Film the live Google song search rebuild for its hover preview: the start screen, a tap on the
// mic (a fake microphone), then "Listening...". CDP screencast frames give a clean, sharp capture.
// Usage: node scripts/record-song.mjs  ->  public/media/work/search-a-song.{mp4,webp}
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

const dir = ".artifacts/rec";
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
});
const context = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  permissions: ["microphone"],
});
const page = await context.newPage();
await page.goto("https://google-song-search.vercel.app", { waitUntil: "load" });
await page.waitForTimeout(2000);
const cdp = await context.newCDPSession(page);
const stamps = [];
cdp.on("Page.screencastFrame", async (f) => {
  writeFileSync(`${dir}/f${String(stamps.length).padStart(4, "0")}.jpg`, Buffer.from(f.data, "base64"));
  stamps.push(f.metadata.timestamp);
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95 });
await page.waitForTimeout(2500);
await page.getByRole("button", { name: "Start listening" }).click();
await page.waitForTimeout(6000);
await cdp.send("Page.stopScreencast");
await browser.close();

const rate = String((stamps.length - 1) / (stamps.at(-1) - stamps[0]));
const out = "public/media/work/search-a-song";
execFileSync("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-framerate",
  rate,
  "-i",
  `${dir}/f%04d.jpg`,
  "-vf",
  "fps=30,scale=1600:-2:flags=lanczos,format=yuv420p",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "20",
  "-movflags",
  "+faststart",
  `${out}.mp4`,
]);
execFileSync("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-ss",
  "1",
  "-i",
  `${out}.mp4`,
  "-frames:v",
  "1",
  "-c:v",
  "libwebp",
  "-quality",
  "88",
  `${out}.webp`,
]);
console.log(`${stamps.length} frames at ${Number(rate).toFixed(1)} fps -> ${out}.mp4`);
