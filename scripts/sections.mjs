// One viewport shot per case-study section (after its reveal), and the page's length in screens.
// Usage: node scripts/sections.mjs <slug> [tag]   VIEW=1440x900 (default), PORT=3100
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [slug = "passion-nails", tag = slug] = process.argv.slice(2);
const [width, height] = (process.env.VIEW ?? "1440x900").split("x").map(Number);
const dir = `.artifacts/sections/${tag}-${width}`;
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width, height } });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(`http://localhost:${process.env.PORT ?? 3100}/work/${slug}`, { waitUntil: "load" });
await page.waitForTimeout(2000);
await page.screenshot({ path: `${dir}/00-top.png` });
const ids = await page.$$eval("section.case-block", (s) => s.map((x) => x.id));
for (const [i, id] of ids.entries()) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 40);
  }, id);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${dir}/${String(i + 1).padStart(2, "0")}-${id}.png` });
}
const screens = await page.evaluate(() => document.documentElement.scrollHeight / innerHeight);
console.log(`${ids.length} sections, ${screens.toFixed(1)} screens tall -> ${dir}`);
await browser.close();
