// Phone frame rate: an iPhone-sized viewport at DPR 3 with a 4x slower CPU, on the real GPU.
// Measures frames and long tasks from load (the arrival, ARRIVAL ms), then idle and scrolling.
// Usage: PORT=3100 node scripts/perf.mjs [route ...]   (routes without a leading slash; "home" for /)
// DESKTOP=1 measures a 1440 x 900 laptop at DPR 2 without CPU throttling instead.
import { chromium } from "@playwright/test";

const base = `http://localhost:${process.env.PORT ?? 3100}`;
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["home", "about", "work/ripple"];
const desktop = !!process.env.DESKTOP;
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});
for (const route of routes) {
  const ctx = await browser.newContext(
    desktop
      ? { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }
      : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  );
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (!desktop) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  if (process.env.CSS)
    await page.addInitScript(
      (css) =>
        addEventListener("DOMContentLoaded", () =>
          document.head.append(Object.assign(document.createElement("style"), { textContent: css })),
        ),
      process.env.CSS,
    );
  await page.goto(`${base}/${route === "home" ? "" : route}`, { waitUntil: "load" });
  const sample = (ms, scroll) =>
    page.evaluate(
      ([ms, scroll]) =>
        new Promise((done) => {
          const frames = [];
          let long = 0;
          const po = new PerformanceObserver((l) => l.getEntries().forEach((e) => (long += e.duration)));
          po.observe({ type: "longtask" });
          const t0 = performance.now();
          let last = t0;
          const f = (now) => {
            frames.push(now - last);
            last = now;
            if (scroll) window.scrollBy(0, 12);
            if (now - t0 < ms) requestAnimationFrame(f);
            else {
              po.disconnect();
              const sorted = [...frames].sort((a, b) => a - b);
              done({
                fps: Math.round((frames.length / (now - t0)) * 1000),
                p95: Math.round(sorted[Math.floor(sorted.length * 0.95)]),
                janky: frames.filter((d) => d > 34).length,
                longTaskMs: Math.round(long),
              });
            }
          };
          requestAnimationFrame(f);
        }),
      [ms, scroll],
    );
  const arrival = await sample(Number(process.env.ARRIVAL ?? 5000), false);
  const idle = await sample(4000, false);
  const scrolling = await sample(4000, true);
  console.log(
    route,
    "arrival",
    JSON.stringify(arrival),
    "idle",
    JSON.stringify(idle),
    "scroll",
    JSON.stringify(scrolling),
  );
  await ctx.close();
}
await browser.close();
