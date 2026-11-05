// Frames of the About timeline as it is scrolled. PORT=3300 node scripts/timeline-shots.mjs [WxH]
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const [width, height] = (process.argv[2] ?? "1440x900").split("x").map(Number);
const dir = `.artifacts/timeline-${width}`;
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", args: ["--enable-gpu"] });
const page = await browser.newPage({ viewport: { width, height } });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(`http://localhost:${process.env.PORT ?? 3100}/about`, { waitUntil: "load" });
await page.waitForTimeout(2000);
const top = await page
  .locator("#chronology-title")
  .evaluate((el) => el.closest("section").getBoundingClientRect().top + scrollY);
const length = await page
  .locator("#chronology-title")
  .evaluate((el) => el.closest("section").offsetHeight - innerHeight);
const files = [];
for (let k = 0; k <= 8; k++) {
  await page.evaluate((y) => window.scrollTo(0, y), top + (length * k) / 8);
  await page.waitForTimeout(1100);
  const f = `${dir}/${k}.png`;
  await page.screenshot({ path: f });
  files.push(f);
}
execFileSync("python", [
  "scripts/sheet.py",
  `${dir}/sheet.png`,
  "3",
  "640",
  String(Math.round((640 * height) / width)),
  ...files,
]);
console.log(`${dir}/sheet.png`);
await browser.close();
