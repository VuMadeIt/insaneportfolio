// Print browser console output and page errors for a URL. Usage: node scripts/console.mjs <url> [ms]
import { chromium } from "@playwright/test";

const [url, ms = "6000"] = process.argv.slice(2);
const browser = await chromium.launch({
  channel: "msedge",
  args: process.env.SWIFTSHADER
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage();
page.on("console", (m) => console.log(`[${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => console.log(`[pageerror] ${e.message}`));
await page.goto(url);
await page.waitForTimeout(Number(ms));
await browser.close();
