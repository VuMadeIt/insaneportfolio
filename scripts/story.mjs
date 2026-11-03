// Film the click choreography: open a story, then close it. Usage: node scripts/story.mjs [name] [port]
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const [name = "People", port = "3100"] = process.argv.slice(2);
const [width, height] = (process.env.VIEW ?? "1440x900").split("x").map(Number);
const dir = `.artifacts/story/${width}`;
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({
  viewport: { width, height },
  hasTouch: width < 600,
  isMobile: width < 600,
});
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(4000);
const box = await page.getByRole("button", { name: new RegExp(`^${name}:`) }).boundingBox();
const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
if (width < 600) {
  await page.touchscreen.tap(x, y);
  await page.waitForTimeout(600);
  await page.touchscreen.tap(x, y);
} else {
  await page.mouse.move(x, y);
  await page.waitForTimeout(500);
  await page.mouse.click(x, y);
}
const frames = [];
const t0 = Date.now();
for (const at of [100, 350, 600, 900, 1200, 1600, 2100, 3000]) {
  await page.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
  const f = `${dir}/open-${String(at).padStart(4, "0")}.png`;
  await page.screenshot({ path: f });
  frames.push(f);
}
console.log("url after open:", page.url());
await page.keyboard.press("Escape");
for (const at of [300, 900, 2000]) {
  await page.waitForTimeout(at === 300 ? 300 : at === 900 ? 600 : 1100);
  const f = `${dir}/close-${at}.png`;
  await page.screenshot({ path: f });
  frames.push(f);
}
console.log("url after close:", page.url());
await browser.close();
execFileSync("python", [
  "scripts/sheet.py",
  `${dir}/sheet.png`,
  "4",
  String(Math.round(width / 3)),
  String(Math.round(height / 3)),
  ...frames,
]);
console.log(`${dir}/sheet.png`);
