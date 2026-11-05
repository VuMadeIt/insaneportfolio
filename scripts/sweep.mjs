// Visit every route at four widths: collect console errors and save first-screen screenshots.
// Usage: node scripts/sweep.mjs [port]  ->  .artifacts/sweep/<route>-<width>.png
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = `http://localhost:${process.argv[2] ?? 3100}`;
const routes = [
  "/",
  "/people",
  "/ideas",
  "/work",
  "/about",
  "/work/shufflr",
  "/work/ripple",
  "/work/maple-leaf-foods",
  "/work/reboot",
  "/nope",
];
const widths = [
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [390, 844],
];
mkdirSync(".artifacts/sweep", { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
for (const [w, h] of widths) {
  const page = await browser.newPage({
    viewport: { width: w, height: h },
    isMobile: w < 600,
    hasTouch: w < 600,
  });
  page.on(
    "console",
    (m) =>
      m.type() === "error" &&
      !m.text().includes("404") &&
      console.log(`[${w}] console:`, m.text().slice(0, 200)),
  );
  page.on("pageerror", (e) => console.log(`[${w}] pageerror:`, e.message.slice(0, 200)));
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "load" });
    await page.waitForTimeout(r === "/" || r === "/people" || r === "/ideas" ? 3500 : 1200);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 0) console.log(`[${w}] ${r} horizontal overflow ${overflow}px`);
    await page.screenshot({
      path: `.artifacts/sweep/${r === "/" ? "home" : r.slice(1).replace(/\//g, "_")}-${w}.png`,
    });
  }
  await page.close();
}
await browser.close();
console.log("done");
