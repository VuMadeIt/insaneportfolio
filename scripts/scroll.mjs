// Viewport screenshots while scrolling a page, as a contact sheet.
// Usage: node scripts/scroll.mjs <route> <name> [steps]   (route without leading slash, "home" for /)
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const [route = "home", name = "scroll", steps = "8"] = process.argv.slice(2);
const [width, height] = (process.env.VIEW ?? "1440x900").split("x").map(Number);
const dir = `.artifacts/scroll/${name}-${width}`;
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width, height } });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(`http://localhost:${process.env.PORT ?? 3100}/${route === "home" ? "" : route}`, {
  waitUntil: "load",
});
await page.waitForTimeout(2500);
const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const files = [];
for (let k = 0; k < Number(steps); k++) {
  const y = Math.round((total * k) / (Number(steps) - 1));
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(900);
  const f = `${dir}/${String(k).padStart(2, "0")}.png`;
  await page.screenshot({ path: f });
  files.push(f);
}
await browser.close();
execFileSync("python", [
  "scripts/sheet.py",
  `${dir}/sheet.png`,
  "4",
  String(Math.round(width / 3)),
  String(Math.round(height / 3)),
  ...files,
]);
console.log(`${dir}/sheet.png  (scroll height ${total})`);
