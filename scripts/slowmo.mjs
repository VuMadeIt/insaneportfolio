// Checks slow motion in a real browser: set the cradle swinging, hover a middle ball, and compare
// how fast the outer balls move before and during the hover. Usage: node scripts/slowmo.mjs [url]
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3300/?slowmo=1";
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(5000);
const balls = page.locator("button.cradle-target");
const centre = async (i) => {
  const b = await balls.nth(i).boundingBox();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
};
const start = await centre(0);
await page.mouse.move(start.x, start.y);
await page.mouse.down();
for (let k = 1; k <= 20; k++) await page.mouse.move(start.x - k * 12, start.y - k * 3, { steps: 2 });
await page.mouse.up();
await page.mouse.move(start.x, 40);
await page.waitForTimeout(600);

/** Mean on-screen speed (px/s) of the outer balls over `ms`. */
async function speed(ms) {
  let path = 0;
  let last = [await centre(0), await centre(3)];
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    await page.waitForTimeout(40);
    const now = [await centre(0), await centre(3)];
    path += now.reduce((s, p, i) => s + Math.hypot(p.x - last[i].x, p.y - last[i].y), 0);
    last = now;
  }
  return path / (ms / 1000);
}

const before = await speed(1000);
const mid = await centre(1);
await page.mouse.move(mid.x, mid.y, { steps: 4 });
await page.waitForTimeout(500);
const during = await speed(1000);
await page.mouse.move(mid.x, 40, { steps: 4 });
await page.waitForTimeout(700);
const after = await speed(1000);
console.log(JSON.stringify({ before, during, after, ratio: during / before }));
await browser.close();
