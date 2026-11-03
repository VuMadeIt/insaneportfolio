// Usage: node scripts/screens.mjs <tag> [path ...]   (needs a server on PORT, default 3100)
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [tag = "dev", ...paths] = process.argv.slice(2);
const base = `http://localhost:${process.env.PORT ?? 3100}`;
const widths = [
  [1440, 900],
  [768, 1024],
  [390, 844],
];
const dir = `.artifacts/screens/${tag}`;
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({
  channel: "msedge",
  args: process.env.SWIFTSHADER
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--enable-gpu", "--ignore-gpu-blocklist"],
});
// Paths are given without a leading slash ("home", "work/shufflr") so Git Bash does not rewrite them.
for (const route of paths.length ? paths : ["home"]) {
  for (const [width, height] of widths) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${base}/${route === "home" ? "" : route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(Number(process.env.SETTLE ?? 1500));
    const name = `${route.replace(/[/?=&]/g, "_")}-${width}.png`;
    await page.screenshot({ path: `${dir}/${name}`, fullPage: process.env.FULL === "1" });
    await page.close();
    console.log(`${dir}/${name}`);
  }
}
await browser.close();
