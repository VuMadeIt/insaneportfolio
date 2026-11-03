// Screenshot any URL or local file. Usage: node scripts/shot.mjs <url-or-path> <out.png> [width] [height]
import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [target, out, width = "1440", height = "900"] = process.argv.slice(2);
const url = /^https?:/.test(target) ? target : pathToFileURL(resolve(target)).href;
const browser = await chromium.launch({
  channel: "msedge",
  args: process.env.SWIFTSHADER
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(Number(process.env.SETTLE ?? 500));
await page.screenshot({ path: out });
await browser.close();
