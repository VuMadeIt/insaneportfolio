// Check that the fallback still lines up with the live canvas: screenshot the home page with and
// without WebGL at several sizes and write a 50/50 blend. Usage: node scripts/align.mjs [port]
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const base = `http://localhost:${process.argv[2] ?? 3200}/`;
const dir = ".artifacts/align";
mkdirSync(dir, { recursive: true });
const sizes = [
  [1440, 900],
  [1100, 900],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
];
for (const webgl of [true, false]) {
  const args = webgl
    ? process.env.SWIFTSHADER
      ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
      : ["--enable-gpu", "--ignore-gpu-blocklist"]
    : ["--disable-webgl", "--disable-webgl2", "--disable-3d-apis"];
  const browser = await chromium.launch({ channel: "msedge", args });
  for (const [w, h] of sizes) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(base, { waitUntil: "networkidle", timeout: 90_000 });
    await page.waitForTimeout(webgl ? 9000 : 1500);
    await page.screenshot({ path: `${dir}/${w}x${h}-${webgl ? "live" : "still"}.png` });
    await page.close();
  }
  await browser.close();
}
for (const [w, h] of sizes) {
  const p = `${dir}/${w}x${h}`;
  execFileSync("python", [
    "-c",
    `import cv2;a=cv2.imread('${p}-live.png');b=cv2.imread('${p}-still.png');cv2.imwrite('${p}-blend.png',cv2.addWeighted(a,0.5,b,0.5,0))`,
  ]);
  console.log(`${p}-blend.png`);
}
