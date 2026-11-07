// Film the arrival (PLAN 15.19) and track the four balls' screen positions every frame.
// Usage: PORT=3100 node scripts/arrival.mjs [WxH ...]   (default 1440x900 and a 390x844 phone)
// Writes .artifacts/arrival/<W>/video.webm and sheet.png, and prints when People comes into view,
// when it hits, how far Products swings out and when the clacking has died down.
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, writeFileSync } from "node:fs";

const base = `http://localhost:${process.env.PORT ?? 3100}`;
const views = process.argv.slice(2).length ? process.argv.slice(2) : ["1440x900", "390x844"];
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
for (const view of views) {
  const [width, height] = view.split("x").map(Number);
  const phone = width < 600;
  const dir = `.artifacts/arrival/${width}`;
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width, height },
    isMobile: phone,
    hasTouch: phone,
    recordVideo: { dir, size: { width, height } },
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("[pageerror]", e.message));
  await page.addInitScript(() => {
    const track = (window.__track = []);
    const f = () => {
      const balls = [...document.querySelectorAll("button.cradle-target")].map((b) => {
        const r = b.getBoundingClientRect();
        return [Math.round(r.x + r.width / 2), Math.round(r.y + r.height / 2)];
      });
      if (balls.length) track.push([Math.round(performance.now()), balls]);
      if (performance.now() < 30000) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  });
  await page.goto(base, { waitUntil: "load" });
  await page.waitForTimeout(Number(process.env.SECONDS ?? 12) * 1000);
  const track = await page.evaluate(() => window.__track);
  await ctx.close();
  const video = readdirSync(dir).find((f) => f.endsWith(".webm") && f !== "video.webm");
  if (video) renameSync(`${dir}/${video}`, `${dir}/video.webm`);
  writeFileSync(`${dir}/track.json`, JSON.stringify(track));

  const entered = track.findIndex(([, b]) => b[0][0] > 0 && b[0][1] > 0 && b[0][1] < height);
  const before = track[entered]?.[1];
  const after = track.slice(entered);
  const products = ([, b]) => Math.abs(b[3][0] - before[3][0]);
  const hit = after.find((s) => products(s) > 2)?.[0];
  const out = Math.max(...after.map(products));
  const clacking = after.filter((s) => products(s) > 10).at(-1)?.[0];
  const gaps = track.slice(1).map(([t], i) => t - track[i][0]);
  console.log(
    `${view}: People in view ${track[entered]?.[0]} ms, hits ${hit} ms, Products out ${out} px,`,
    `swinging until ${clacking} ms, frames > 34 ms: ${gaps.filter((g) => g > 34).length}/${gaps.length}`,
  );
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    `${dir}/video.webm`,
    "-vf",
    `fps=4,scale=${Math.round(width / 4)}:-1,tile=8x6`,
    "-frames:v",
    "1",
    `${dir}/sheet.png`,
  ]);
}
await browser.close();
