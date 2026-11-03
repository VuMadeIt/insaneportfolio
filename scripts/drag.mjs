// Drag the left ball out and release it, screenshotting the swing. Usage: node scripts/drag.mjs [port]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = `http://localhost:${process.argv[2] ?? 3200}/`;
const dir = ".artifacts/drag";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: process.env.SWIFTSHADER
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
page.on("console", (m) => m.type() === "error" && console.log("[console]", m.text()));
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(6000);
const box = await page.locator("button.cradle-target").first().boundingBox();
if (!box) throw new Error("no ball button");
const x = box.x + box.width / 2;
const y = box.y + box.height / 2;
console.log("ball 0 at", x, y, "size", box.width);
await page.mouse.move(x, y);
await page.mouse.down();
for (let k = 1; k <= 20; k++) await page.mouse.move(x - k * 12, y - k * 3, { steps: 2 });
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/0-held.png` });
await page.mouse.up();
for (let k = 1; k <= 4; k++) {
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${dir}/${k}-swing.png` });
}
await browser.close();
