// Shoots the Passion Nails case-study media from three local builds of the salon app (VuMadeIt/nailsalon),
// each served by `wrangler dev` on fake bookings, never the live staff app (it holds real customers):
//   NIGHT = feat/08-polish (the overnight build), AUDIT = feat/11-micro-animations, NOW = feat/36-staff-service-groups.
// Usage: NIGHT=http://localhost:4411 AUDIT=http://localhost:4412 NOW=http://localhost:4413 PASSWORD=... \
//          node scripts/passion-nails-shots.mjs        (STEPS=shots,films,media to run only some steps)
//   -> .artifacts/passion-nails/*.png, then public/media/passion-nails/*.webp, hero.webp, evolution.webp, loop.{mp4,webp}
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const { NIGHT, AUDIT, NOW, PASSWORD } = process.env;
const STEPS = new Set((process.env.STEPS ?? "shots,films,media").split(","));
const RAW = ".artifacts/passion-nails";
const OUT = "public/media/passion-nails";
const CREAM = "#F4EBDF"; // the salon's own background
mkdirSync(RAW, { recursive: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const phone = (viewport = { width: 390, height: 844 }, scale = 3) =>
  browser.newContext({
    viewport,
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
    timezoneId: "America/Toronto",
  });
const settle = (page, ms = 900) => page.waitForLoadState("networkidle").then(() => page.waitForTimeout(ms));
const shot = (page, name) => page.screenshot({ path: `${RAW}/${name}.png` });

async function staff(base, { lang = "vi" } = {}) {
  const ctx = await phone();
  const page = await ctx.newPage();
  await page.goto(`${base}/staff/login`);
  await settle(page, 400);
  await page.getByRole("radio", { name: lang === "vi" ? "Tiếng Việt" : "EN" }).click();
  await page.locator('input[type="password"]').fill(PASSWORD);
  await page.locator("label.chip", { hasText: "June" }).first().click();
  await page.locator('form button:not([type="button"])').last().click();
  await page.waitForURL(/\/staff$/);
  await settle(page, 1200);
  return page;
}

// The overnight build and the first fix round: the day, an appointment and opening hours.
if (STEPS.has("shots"))
  for (const [tag, base] of [
    ["night", NIGHT],
    ["audit", AUDIT],
  ]) {
    const page = await staff(base);
    await shot(page, `${tag}-day`);
    await page.locator(".card", { hasText: "Maria Santos" }).click();
    await settle(page);
    await shot(page, `${tag}-sheet`);
    await page.goto(`${base}/staff/hours`);
    await settle(page, 1200);
    await shot(page, `${tag}-hours`);
    if (tag === "night") {
      await page.goto(`${base}/staff/login`);
      await settle(page, 400);
      await shot(page, "night-login");
    }
    await page.context().close();
  }

// Today's app, in Vietnamese and in English.
if (STEPS.has("shots"))
  for (const lang of ["vi", "en"]) {
    const page = await staff(NOW, { lang });
    const sfx = lang === "vi" ? "" : "-en";
    await shot(page, `now-day${sfx}`);
    await page.locator(".card", { hasText: "Maria Santos" }).click();
    await settle(page);
    await shot(page, `now-sheet${sfx}`);
    if (lang === "vi") {
      await page.keyboard.press("Escape");
      await page.goto(`${NOW}/staff/hours`);
      await settle(page, 1200);
      await shot(page, "now-hours");
      await page.goto(`${NOW}/staff`);
      await settle(page, 1200);
      // Add booking: a free technician, then a clash that asks first.
      await page.getByRole("navigation").getByRole("link").nth(1).click();
      await settle(page);
      await shot(page, "now-add");
      const dlg = page.getByRole("dialog");
      await dlg.getByPlaceholder(/walk-in/i).fill("Lan");
      await dlg.getByRole("button", { name: /^Manicure with Shellac/ }).click();
      await dlg.getByRole("button", { name: "Dina", exact: true }).click();
      await settle(page, 600);
      await dlg.getByText(/rảnh giờ này/).evaluate((el) => el.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(500);
      await shot(page, "now-add-wheels");
      await dlg.getByRole("button", { name: "Kim", exact: true }).click();
      await settle(page, 600);
      await page.getByRole("button", { name: "Lưu", exact: true }).click();
      await page.waitForTimeout(700);
      await shot(page, "now-sure");
    }
    await page.context().close();
  }

// The customer site: home, the four booking steps (a returning customer), and the confirmation.
if (STEPS.has("shots")) {
  const ctx = await phone();
  await ctx.addInitScript(() =>
    localStorage.setItem(
      "pn-contact",
      JSON.stringify({ name: "Maria Santos", phone: "416 555 0112", email: "" }),
    ),
  );
  const page = await ctx.newPage();
  await page.goto(NOW);
  await settle(page, 1500);
  await shot(page, "site-home");
  await page.goto(`${NOW}/book`);
  await settle(page);
  await page.getByRole("button", { name: /^Manicure with Shellac/ }).click();
  await page.waitForTimeout(400);
  await shot(page, "book-services");
  await page.getByRole("button", { name: "Continue" }).click();
  await settle(page, 600);
  await shot(page, "book-staff");
  await page.getByRole("button", { name: "Continue" }).click();
  await settle(page, 1000);
  const next = page.getByRole("button", { name: /^Try / });
  if (await next.isVisible()) await next.click();
  await page.locator(".chip").first().click();
  await page.waitForTimeout(400);
  await shot(page, "book-time");
  await page.getByRole("button", { name: "Continue" }).click();
  await settle(page, 600);
  await shot(page, "book-details");
  const confirm = page.getByRole("button", { name: "Confirm booking" });
  await confirm.waitFor({ state: "visible" });
  await page.waitForTimeout(3500); // the server rejects forms sent <3 s after opening (bot check)
  await confirm.click();
  await page.getByRole("heading", { name: "You’re booked" }).waitFor();
  await settle(page, 800);
  await shot(page, "book-done");
  await ctx.close();
}

// Two short screen films for the loop: a customer booking, and a tech adding a walk-in in Vietnamese.
async function film(name, ctx, play) {
  const dir = `${RAW}/film-${name}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  const cdp = await ctx.newCDPSession(page);
  const stamps = [];
  cdp.on("Page.screencastFrame", async (f) => {
    writeFileSync(`${dir}/f${String(stamps.length).padStart(4, "0")}.jpg`, Buffer.from(f.data, "base64"));
    stamps.push(f.metadata.timestamp);
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 780, maxHeight: 1688 });
  await play(page);
  await cdp.send("Page.stopScreencast");
  // shortcut: screencast frames arrive only on repaint, so the rate is averaged; fine for a short loop.
  const seconds = stamps.at(-1) - stamps[0];
  return { dir, seconds, rate: String((stamps.length - 1) / seconds) };
}
const smooth = (loc) => loc.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
const tap = async (page, loc, wait = 700) => {
  await smooth(loc);
  await page.waitForTimeout(450);
  await loc.click();
  await page.waitForTimeout(wait);
};

const FILMS = `${RAW}/films.json`;
if (STEPS.has("films")) {
  // The film should show a free technician, so find one off camera first (before the customer film books into the day).
  const techPage = await staff(NOW);
  const tech = techPage.context();
  const openAdd = async (page) => {
    await page.getByRole("navigation").getByRole("link").nth(1).click();
    await settle(page, 500);
    const dlg = page.getByRole("dialog");
    await dlg.getByPlaceholder(/walk-in/i).fill("Mai");
    await dlg.getByRole("button", { name: /^Pedicure$/ }).click();
    return dlg;
  };
  let free;
  {
    const dlg = await openAdd(techPage);
    for (const who of ["Dina", "Alex", "June", "Kim"]) {
      await dlg.getByRole("button", { name: who, exact: true }).click();
      await settle(techPage, 500);
      if (await dlg.getByText(/rảnh giờ này/).isVisible()) {
        free = who;
        break;
      }
    }
    await techPage.goto(`${NOW}/staff`);
    await settle(techPage, 1200);
  }
  const b = await film("staff", tech, async (page) => {
    await page.waitForTimeout(900);
    await tap(page, page.getByRole("navigation").getByRole("link").nth(1), 1100);
    const dlg = page.getByRole("dialog");
    await dlg.getByPlaceholder(/walk-in/i).fill("Mai");
    await page.waitForTimeout(500);
    await tap(page, dlg.getByRole("button", { name: /^Pedicure$/ }));
    await tap(page, dlg.getByRole("button", { name: free ?? "Dina", exact: true }), 1000);
    await smooth(dlg.getByText(/rảnh giờ này|không ai rảnh|Trùng/).first());
    await page.waitForTimeout(1600);
    await tap(page, page.getByRole("button", { name: "Lưu", exact: true }), 1200);
    const sure = page.getByRole("button", { name: "Có, lưu" });
    if (await sure.isVisible()) await tap(page, sure, 1200);
    await smooth(page.locator(".card", { hasText: "Mai" }).first());
    await page.waitForTimeout(2200);
  });
  await tech.close();
  const customer = await phone(undefined, 2);
  await customer.addInitScript(() =>
    localStorage.setItem(
      "pn-contact",
      JSON.stringify({ name: "Ava Nguyen", phone: "416 555 0119", email: "" }),
    ),
  );
  const custPage = await customer.newPage();
  await custPage.goto(`${NOW}/book`);
  await settle(custPage);
  const a = await film("customer", customer, async (page) => {
    await page.waitForTimeout(900);
    await tap(page, page.getByRole("button", { name: /^Pedicure with Shellac/ }));
    await tap(page, page.getByRole("button", { name: "Continue" }), 1100);
    await tap(page, page.getByRole("button", { name: "Continue" }), 1300);
    const next = page.getByRole("button", { name: /^Try / });
    if (await next.isVisible()) await tap(page, next, 1100);
    await tap(page, page.locator(".chip").nth(2));
    await tap(page, page.getByRole("button", { name: "Continue" }), 1800);
    await page.waitForTimeout(1500);
    await tap(page, page.getByRole("button", { name: "Confirm booking" }), 0);
    await page.getByRole("heading", { name: "You’re booked" }).waitFor();
    await page.waitForTimeout(2200);
  });
  await customer.close();

  writeFileSync(FILMS, JSON.stringify({ a, b, free: free ?? null }));
}
await browser.close();

const ff = (...args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);
const webp = (src, out, width) =>
  ff("-i", src, "-vf", `scale=${width}:-2:flags=lanczos`, "-quality", "84", out);

// Single phone screens for the page (780 px wide is 2x their largest size there).
if (STEPS.has("media"))
  for (const n of [
    "night-day",
    "night-sheet",
    "night-hours",
    "night-login",
    "audit-day",
    "now-day",
    "now-day-en",
    "now-sheet",
    "now-sheet-en",
    "now-hours",
    "now-add",
    "now-add-wheels",
    "now-sure",
    "site-home",
    "book-services",
    "book-staff",
    "book-time",
    "book-details",
    "book-done",
  ])
    webp(`${RAW}/${n}.png`, `${OUT}/${n}.webp`, 780);

// Rows of phones on the salon's cream, rendered in the browser so the corners stay crisp.
async function stage(out, names, { width = 1920, height = 1080, phoneH = 900 } = {}) {
  const b2 = await chromium.launch({ channel: "msedge" });
  const page = await b2.newPage({ viewport: { width, height } });
  const imgs = names
    .map((n) => `<img src="data:image/png;base64,${readFileSync(`${RAW}/${n}.png`).toString("base64")}">`)
    .join("");
  await page.setContent(
    `<body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;gap:56px;background:${CREAM}">${imgs}</body>
     <style>img{height:${phoneH}px;border-radius:44px;outline:1px solid rgba(20,18,13,.08)}</style>`,
  );
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${RAW}/${out}.png` });
  await b2.close();
  webp(`${RAW}/${out}.png`, `${OUT}/${out}.webp`, width);
}
if (STEPS.has("media")) {
  await stage("hero", ["site-home", "book-services", "now-day"]);
  await stage("evolution", ["night-day", "audit-day", "now-day"]);

  // The loop: both films side by side on cream, the shorter one holding its last frame.
  const { a, b } = JSON.parse(readFileSync(FILMS, "utf8"));
  const [w, h] = [1600, 1000];
  const cream = CREAM.replace("#", "0x");
  const each = `fps=30,scale=-2:880,pad=iw+120:ih:60:0:color=${cream},tpad=stop_mode=clone:stop_duration=60`;
  ff(
    "-framerate",
    a.rate,
    "-i",
    `${a.dir}/f%04d.jpg`,
    "-framerate",
    b.rate,
    "-i",
    `${b.dir}/f%04d.jpg`,
    "-filter_complex",
    `[0]${each}[l];[1]${each}[r];[l][r]hstack=inputs=2,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2:color=${cream},format=yuv420p[v]`,
    "-map",
    "[v]",
    "-t",
    String(Math.ceil(Math.max(a.seconds, b.seconds))),
    "-c:v",
    "libx264",
    "-crf",
    "24",
    "-preset",
    "slow",
    "-movflags",
    "+faststart",
    "-an",
    `${OUT}/loop.mp4`,
  );
  ff("-ss", "6", "-i", `${OUT}/loop.mp4`, "-frames:v", "1", "-quality", "84", `${OUT}/loop.webp`);
}
console.log("done");
