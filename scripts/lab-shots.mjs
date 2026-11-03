// Screenshot /lab under several look overrides and crop to the cradle.
// Usage: node scripts/lab-shots.mjs <dir> "<name>:<query>" ...   e.g. "hdri-a:hdri=white_studio_03"
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [dir, ...variants] = process.argv.slice(2);
const base = `http://localhost:${process.env.PORT ?? 3200}/lab`;
const [width, height] = (process.env.VIEW ?? "1440x900").split("x").map(Number);
const clip = process.env.CLIP ? JSON.parse(process.env.CLIP) : { x: 380, y: 200, width: 680, height: 560 };
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: process.env.SWIFTSHADER
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--enable-gpu", "--ignore-gpu-blocklist"],
});
async function shoot(name, query) {
  const page = await browser.newPage({ viewport: { width, height } });
  try {
    await page.goto(`${base}?${query}`, { waitUntil: "networkidle", timeout: 90_000 });
    await page.addStyleTag({
      content: "[class*='leva'], #leva__root, nextjs-portal { display: none !important; }",
    });
    await page.waitForTimeout(Number(process.env.SETTLE ?? 7000));
    await page.screenshot({
      path: `${dir}/${name}.png`,
      clip: process.env.FULLVIEW ? undefined : clip,
      timeout: 90_000,
    });
  } finally {
    await page.close();
  }
}

for (const v of variants) {
  const [name, query = ""] = v.split(":");
  for (let attempt = 1; ; attempt++) {
    try {
      await shoot(name, query);
      break;
    } catch (e) {
      if (attempt >= 3) throw e;
      console.warn(`retry ${name}: ${e.message.split("\n")[0]}`);
    }
  }
  console.log(`${dir}/${name}.png`);
}
await browser.close();
