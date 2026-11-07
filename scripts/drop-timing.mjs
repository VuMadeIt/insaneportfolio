// When do the balls drop in, against the tagline rising in? Times in ms from navigation start.
// Usage: PORT=3100 node scripts/drop-timing.mjs [runs]   (cold cache each run)
import { chromium } from "@playwright/test";

const base = `http://localhost:${process.env.PORT ?? 3100}`;
const runs = Number(process.argv[2] ?? 3);
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
for (const [w, h, mobile] of [
  [1440, 900, false],
  [390, 844, true],
]) {
  for (let r = 0; r < runs; r++) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      isMobile: mobile,
      hasTouch: mobile,
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      const t = (window.__t = {});
      const f = () => {
        const now = performance.now();
        const ball = document.querySelectorAll("button.cradle-target")[1]?.getBoundingClientRect();
        if (ball) {
          t.ballsMounted ??= now;
          if (ball.bottom > 0) t.ballInView ??= now;
          if (t.ballInView && Math.abs(ball.top - (t.last ?? 0)) < 0.3) t.still = (t.still ?? 0) + 1;
          else t.still = 0;
          if (t.still > 20) t.ballSettled ??= now - 20 * 16;
          t.last = ball.top;
        }
        if (document.querySelector(".hero-still")?.getAttribute("data-state") === "live") t.live ??= now;
        const a = document.querySelector(".giant-caption")?.getAnimations()[0];
        if (a && a.startTime != null) t.tagline ??= a.startTime + 1100;
        if (!t.ballSettled && now < 20000) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    });
    await page.goto(base, { waitUntil: "load" });
    await page.waitForFunction(() => window.__t.ballSettled || performance.now() > 19000, null, {
      timeout: 25000,
    });
    const t = await page.evaluate(() => {
      const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime;
      const { ballsMounted, live, ballInView, ballSettled, tagline } = window.__t;
      return { fcp, tagline, ballsMounted, live, ballInView, ballSettled };
    });
    console.log(
      `${w} run ${r}:`,
      Object.entries(t)
        .map(([k, v]) => `${k} ${v?.toFixed(0)}`)
        .join(", "),
    );
    await ctx.close();
  }
}
await browser.close();
