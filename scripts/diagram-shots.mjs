// Every case-study diagram, table and chart at desktop and phone widths: screenshots into
// .artifacts/diagrams/, and a check that nothing scrolls sideways inside itself or overflows.
// Usage: PORT=3100 node scripts/diagram-shots.mjs
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = `http://localhost:${process.env.PORT ?? 3100}`;
const dir = ".artifacts/diagrams";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", args: ["--enable-gpu"] });
let problems = 0;
for (const [w, h] of [
  [1440, 900],
  [768, 1024],
  [390, 844],
]) {
  const page = await browser.newPage({
    viewport: { width: w, height: h },
    isMobile: w < 600,
    hasTouch: w < 600,
  });
  for (const slug of ["ripple", "shufflr", "reboot", "maple-leaf-foods", "about"]) {
    await page.goto(`${base}/${slug === "about" ? "about" : `work/${slug}`}`, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    // Scroll through so every chart draws in.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += h * 0.8) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1200);
    const found = await page.evaluate(() => {
      const scrollers = [...document.querySelectorAll("main *")].filter((el) => {
        const s = getComputedStyle(el);
        return /(auto|scroll)/.test(s.overflowX) && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0;
      });
      return {
        scrollers: scrollers.map((el) => `${el.tagName}.${String(el.className).slice(0, 50)}`),
        overflow: document.documentElement.scrollWidth - innerWidth,
        diagrams: document.querySelectorAll(".dg").length,
      };
    });
    if (found.scrollers.length || found.overflow > 0) {
      problems++;
      console.log(`PROBLEM ${slug} @${w}`, JSON.stringify(found));
    }
    const dgs = await page.locator(".dg").all();
    for (const [i, dg] of dgs.entries()) {
      await dg.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await dg.screenshot({ path: `${dir}/${slug}-${i}-${w}.png` });
    }
    console.log(`${slug} @${w}: ${found.diagrams} diagrams, ok`);
  }
  await page.close();
}
await browser.close();
console.log(problems ? `${problems} problem(s)` : "no sideways scrolling or overflow anywhere");
process.exit(problems ? 1 : 0);
