// Films a burger menu: load, hover, open, row hover, close.  node scripts/menu-film.mjs <url> <tag> [toggleSelector]
// Frames land in .artifacts/menu/<tag>/ (12 fps from a recorded video), for side-by-side checks.
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";

const [url, tag, toggleSel = "button[aria-expanded], .NavigationBurger-button"] = process.argv.slice(2);
const dir = `.artifacts/menu/${tag}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(2500);
const toggle = page.locator(toggleSel).first();
const box = await toggle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
await page.waitForTimeout(1500);
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
await page.waitForTimeout(1800);
const row = page.locator("nav a").nth(1);
const rb = await row.boundingBox();
await page.mouse.move(rb.x + 30, rb.y + rb.height / 2, { steps: 10 });
await page.waitForTimeout(1500);
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
await page.waitForTimeout(1500);
await page.mouse.move(700, 600, { steps: 10 });
await page.waitForTimeout(1200);
await ctx.close();
await browser.close();
const video = readdirSync(dir).find((f) => f.endsWith(".webm"));
renameSync(`${dir}/${video}`, `${dir}/film.webm`);
execFileSync("ffmpeg", [
  "-v",
  "error",
  "-y",
  "-i",
  `${dir}/film.webm`,
  "-vf",
  "fps=12,crop=760:720:340:0,scale=380:-1",
  `${dir}/f-%03d.png`,
]);
console.log(dir, readdirSync(dir).length - 1, "frames");
