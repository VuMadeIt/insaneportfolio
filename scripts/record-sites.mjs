// Film the hover previews for Sweaterify and Liam's portfolio from their live sites (CDP
// screencast, like record-song.mjs). Usage: node scripts/record-sites.mjs [sweaterify|liam-vu]
//   -> public/media/work/<name>.{mp4,webp}
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

const RECIPES = {
  // The default "Noel" knit, its stitch size swept from coarse to fine: one shot of the sweater per step.
  sweaterify: {
    url: "https://sweaterify.vercel.app",
    async frames(page, dir) {
      const size = page.locator("#size");
      const stitch = page.locator("#stitch");
      let n = 0;
      for (let v = 72; v >= 14; v -= 2) {
        await size.fill(String(v));
        await size.dispatchEvent("input");
        await page.waitForTimeout(120);
        const shots = v === 14 ? 12 : 1;
        const png = await stitch.screenshot({ type: "jpeg", quality: 95 });
        for (let k = 0; k < shots; k++) writeFileSync(`${dir}/f${String(n++).padStart(4, "0")}.jpg`, png);
      }
      return 6;
    },
  },
  // The platform intro: board without sound, the train pulls in and the doors open.
  "liam-vu": {
    url: "https://liamvu.vercel.app",
    trim: 3,
    async play(page) {
      await page.waitForTimeout(1500);
      await page.getByRole("button", { name: /Board without sound/ }).click();
      await page.waitForTimeout(8000);
    },
  },
};

const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(RECIPES);
const browser = await chromium.launch({ channel: "msedge", args: ["--enable-gpu"] });
for (const name of names) {
  const recipe = RECIPES[name];
  const dir = `.artifacts/rec-${name}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();
  await page.goto(recipe.url, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  let rate;
  if (recipe.frames) rate = String(await recipe.frames(page, dir));
  else {
    const cdp = await context.newCDPSession(page);
    const stamps = [];
    cdp.on("Page.screencastFrame", async (f) => {
      writeFileSync(`${dir}/f${String(stamps.length).padStart(4, "0")}.jpg`, Buffer.from(f.data, "base64"));
      stamps.push(f.metadata.timestamp);
      await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
    });
    await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, maxWidth: 1600, maxHeight: 1000 });
    await recipe.play(page);
    await cdp.send("Page.stopScreencast");
    // shortcut: screencast frames arrive only when the page repaints, so the rate is averaged; fine for these loops.
    rate = String((stamps.length - 1) / (stamps.at(-1) - stamps[0]));
  }
  await context.close();

  const out = `public/media/work/${name}`;
  execFileSync("ffmpeg", [
    "-v",
    "error",
    "-y",
    "-framerate",
    rate,
    "-i",
    `${dir}/f%04d.jpg`,
    "-ss",
    String(recipe.trim ?? 0),
    "-vf",
    `fps=30,scale='min(1600,iw)':-2:flags=lanczos,format=yuv420p`,
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
    "-sseof",
    "-0.5",
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
  console.log(`${Number(rate).toFixed(1)} fps -> ${out}.mp4`);
}
await browser.close();
