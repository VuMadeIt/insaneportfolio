// Interaction check for the home footer, the cursor and the work rows (PLAN 13.1-13.4).
// Usage: PORT=3300 node scripts/check-footer.mjs   Saves .artifacts/check/*.png and prints findings.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const port = process.env.PORT ?? 3100;
const dir = ".artifacts/check";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
page.on("console", (m) => m.type() === "error" && console.log("[console]", m.text().slice(0, 200)));
await page.goto(`http://localhost:${port}/`, { waitUntil: "load" });
await page.waitForTimeout(2500);

// Hover a work row: the floating video should appear under the pointer and the cursor ball hide.
const row = page.locator("#work li.catalogue-row").first();
await row.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
const box = await row.boundingBox();
await page.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 5 });
await page.mouse.move(box.x + box.width * 0.45, box.y + box.height / 2, { steps: 10 });
await page.waitForTimeout(1200);
console.log("cursor over row:", await page.locator(".cursor-ball").getAttribute("data-state"));
console.log("preview on:", await page.locator(".work-preview[data-on]").count());
await page.screenshot({ path: `${dir}/row-hover.png` });
await page.mouse.move(box.x + box.width * 0.45, box.y - 120, { steps: 6 });
await page.waitForTimeout(700);
console.log("preview after leaving:", await page.locator(".work-preview[data-on]").count());

// Footer: drop balls in empty space, try a link (no ball), then let them settle.
const footer = page.locator("footer");
await footer.scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
const f = await footer.boundingBox();
const name = await page.locator(".footer-name").boundingBox();
await page.mouse.move(f.x + f.width * 0.5, f.y + f.height * 0.4, { steps: 8 });
await page.waitForTimeout(600);
console.log("cursor in footer:", await page.locator(".cursor-ball").getAttribute("data-state"));
await page.screenshot({ path: `${dir}/footer-cursor.png` });
const xs = [0.18, 0.3, 0.42, 0.5, 0.58, 0.7, 0.82, 0.33, 0.66];
for (const k of xs) {
  await page.mouse.move(name.x + name.width * k, f.y + f.height * 0.36, { steps: 3 });
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(260);
}
const email = page.locator("footer a[href^='mailto']");
const before = page.url();
const eb = await email.boundingBox();
await page.mouse.move(eb.x + 10, eb.y + eb.height / 2, { steps: 4 });
console.log("cursor on email link:", await page.locator(".cursor-ball").getAttribute("data-state"));
await page.waitForTimeout(400);
await page.screenshot({ path: `${dir}/footer-falling.png` });
await page.waitForTimeout(4000);
await page.screenshot({ path: `${dir}/footer-settled.png` });
console.log("url unchanged:", page.url() === before);
await browser.close();
