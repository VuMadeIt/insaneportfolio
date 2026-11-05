// Usage: PORT=3200 node scripts/moving-shots.mjs   Films "Let's get things moving." under a moving
// pointer (desktop) and a scroll (phone) into .artifacts/moving/.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = `http://localhost:${process.env.PORT ?? 3200}`;
const dir = ".artifacts/moving";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => m.type() === "error" && console.log("console:", m.text()));
await page.goto(base, { waitUntil: "load" });
await page.locator(".flex-wm").scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
const box = await page.locator(".flex-wm").boundingBox();
for (let k = 0; k <= 6; k++) {
  await page.mouse.move(box.x + (box.width * k) / 6, box.y + box.height / 2, { steps: 6 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: `${dir}/desk-${k}.png`,
    clip: { x: 0, y: box.y - 40, width: 1440, height: box.height + 100 },
  });
}
await page.close();

const phone = await browser.newPage({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
await phone.goto(base, { waitUntil: "load" });
const top = await phone.evaluate(
  () => document.querySelector(".flex-wm").getBoundingClientRect().top + scrollY,
);
for (let k = 0; k <= 4; k++) {
  await phone.evaluate((y) => window.scrollTo(0, y), top - 844 * (0.85 - k * 0.15));
  await phone.waitForTimeout(800);
  await phone.screenshot({ path: `${dir}/phone-${k}.png` });
}
await browser.close();
console.log("done");
