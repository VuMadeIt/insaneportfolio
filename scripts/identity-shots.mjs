// Screenshot /lab/identity and build a comparison sheet against the reference images.
// Usage: node scripts/identity-shots.mjs <name> [query]   ->  .artifacts/identity/<name>.png
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const [name = "round", query = "t=3"] = process.argv.slice(2);
const dir = ".artifacts/identity";
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({
  channel: "msedge",
  args: process.env.SWIFTSHADER
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : ["--enable-gpu", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1600, height: 500 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(`http://localhost:${process.env.PORT ?? 3200}/lab/identity?${query}`, {
  waitUntil: "networkidle",
});
await page.waitForTimeout(Number(process.env.SETTLE ?? 5000));
const shot = `${dir}/${name}-render.png`;
await page.screenshot({ path: shot });
await browser.close();
execFileSync("python", [
  "-c",
  `import cv2,numpy as np
r=cv2.imread('${shot}')
h,w=r.shape[:2]
refs=[cv2.imread('reference/identities/'+n) for n in ['people-eye.jpg','idea-orb.jpg','experiment-atom.png','product-flower.jpg']]
refs=[cv2.resize(x,(int(x.shape[1]*360/x.shape[0]),360)) for x in refs]
cells=[]
px=h/(2*0.29*np.tan(np.radians(9)))
for k,x in enumerate(refs):
  cx=int(w/2+(k-1.5)*0.0325*2.3*px); cy=h//2
  crop=r[cy-180:cy+180, cx-180:cx+180]
  cells.append(np.vstack([crop,cv2.resize(x,(360,360))]))
cv2.imwrite('${dir}/${name}.png',np.hstack(cells))`,
]);
console.log(`${dir}/${name}.png`);
