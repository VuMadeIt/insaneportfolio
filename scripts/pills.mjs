// Finds pills (fully rounded boxes) whose text wrapped onto a second line, on every route at phone widths.
// Usage: PORT=3100 node scripts/pills.mjs
import { chromium } from "@playwright/test";
const routes = [
  "",
  "about",
  "work",
  "people",
  "work/passion-nails",
  "work/shufflr",
  "work/ripple",
  "work/reboot",
  "work/maple-leaf-foods",
];
const b = await chromium.launch({ channel: "msedge" });
let bad = 0;
for (const w of [390, 768]) {
  const p = await b.newPage({ viewport: { width: w, height: 844 } });
  for (const r of routes) {
    await p.goto(`http://localhost:${process.env.PORT ?? 3100}/${r}`, { waitUntil: "load" });
    await p.waitForTimeout(800);
    const found = await p.evaluate(() =>
      [...document.querySelectorAll("body *")].flatMap((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (!r.width || s.display === "none" || parseFloat(s.borderTopLeftRadius) < r.height / 2 - 1)
          return [];
        // Only the pill's own words: text nodes directly inside it, each line counted once (4 px slack).
        const tops = [...el.childNodes]
          .filter((n) => n.nodeType === 3 && n.textContent.trim())
          .flatMap((n) => {
            const range = document.createRange();
            range.selectNodeContents(n);
            return [...range.getClientRects()].filter((q) => q.width > 1).map((q) => q.top);
          })
          .sort((a, b) => a - b);
        const lines = tops.filter((t, i) => i === 0 || t - tops[i - 1] > 4).length;
        return lines > 1
          ? [`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}" (${lines} lines)`]
          : [];
      }),
    );
    for (const f of found) console.log(`[${w}] /${r}: ${f}`);
    bad += found.length;
  }
  await p.close();
}
console.log(bad ? `${bad} wrapped pills` : "no wrapped pills");
await b.close();
