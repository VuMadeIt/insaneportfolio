// Shoots the Passion Nails case-study media from local builds of the salon app (VuMadeIt/nailsalon),
// each served by `wrangler dev` on fake bookings, never the live staff app (it holds real customers):
//   NIGHT = feat/08-polish (the overnight build), AUDIT = feat/11-micro-animations, NOW = today's branch.
// Usage: NOW=http://localhost:4413 PASSWORD=... [NIGHT=... AUDIT=...] node scripts/passion-nails-shots.mjs
//   STEPS=now,site,design,films,media (default; add `old` with NIGHT and AUDIT to re-shoot the first builds).
// Seed each local DB first: scripts/passion-nails-seed.mjs.
// Today's screens are shot full height (393 x 852, an iPhone 15) with the phone's safe areas emulated,
// so the page frames them under a see-through status bar (src/components/case/Phone.tsx). The first
// builds never read the safe area, so they stay shot at 390 x 756 between drawn bars in their own colours.
//   -> .artifacts/passion-nails/*.png, then public/media/passion-nails/*.webp and the films (*.mp4 + poster)
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const { NIGHT, AUDIT, NOW, PASSWORD } = process.env;
const STEPS = new Set((process.env.STEPS ?? "now,site,design,films,media").split(","));
const RAW = ".artifacts/passion-nails";
const OUT = "public/media/passion-nails";
const BARS = "src/content/caseStudies/passionNails.bars.json";
mkdirSync(RAW, { recursive: true });
mkdirSync(OUT, { recursive: true });

// iPhone 15: 393 x 852 pt; safe areas 59 top / 34 bottom upright, 59 each side / 21 bottom sideways.
const UPRIGHT = { viewport: { width: 393, height: 852 }, insets: { top: 59, bottom: 34 } };
const SIDEWAYS = { viewport: { width: 852, height: 393 }, insets: { left: 59, right: 59, bottom: 21 } };
const OLD = { viewport: { width: 390, height: 756 } };

const browser = await chromium.launch({ channel: "msedge" });
async function phone({ viewport, insets }, scale = 3) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
    timezoneId: "America/Toronto",
  });
  // A soft dot where a finger lands, so a film can be followed tap by tap.
  await ctx.addInitScript(() =>
    addEventListener(
      "pointerdown",
      (e) => {
        if (!document.documentElement.dataset.taps) return;
        const d = document.createElement("i");
        d.style.cssText = `position:fixed;left:${e.clientX - 22}px;top:${e.clientY - 22}px;width:44px;height:44px;border-radius:50%;background:rgb(14 14 14/.22);box-shadow:0 0 0 2px rgb(255 255 255/.7);pointer-events:none;z-index:2147483647;transition:opacity .6s,transform .6s;`;
        document.body.append(d);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => ((d.style.opacity = "0"), (d.style.transform = "scale(1.6)"))),
        );
        setTimeout(() => d.remove(), 700);
      },
      true,
    ),
  );
  const page = await ctx.newPage();
  if (insets) {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets });
  }
  return page;
}
// Safari keeps the band under the status bar in the page's theme colour (cream); the site never needs
// the inset itself, so the band is drawn here.
const SAFARI = `html{padding-top:59px!important}html::before{content:"";position:fixed;inset:0 0 auto;height:59px;background:#f4ebdf;z-index:99}.top{top:59px!important}`;
const safari = (page) =>
  page.context().addInitScript((css) => {
    document.addEventListener("DOMContentLoaded", () => {
      const s = document.createElement("style");
      s.textContent = css;
      document.head.append(s);
    });
  }, SAFARI);

const settle = (page, ms = 900) => page.waitForLoadState("networkidle").then(() => page.waitForTimeout(ms));
const shot = (page, name) => page.screenshot({ path: `${RAW}/${name}.png` });

// The staff screens are shot at 10:20 on the seeded day (the clock in the page, not the server's).
// Seed and shoot tomorrow (DAY=YYYY-MM-DD) when shooting after hours: the server keeps the real clock,
// so a walk-in at 10:30 today would be "in the past" to it.
const DAY =
  process.env.DAY ?? new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(new Date());
async function staff(base, { lang = "vi", size = UPRIGHT } = {}) {
  const page = await phone(size);
  await page.context().clock.setFixedTime(new Date(`${DAY}T10:20:00-05:00`));
  await page.goto(`${base}/staff/login`);
  await settle(page, 400);
  await page.getByRole("radio", { name: lang === "vi" ? "Tiếng Việt" : "EN" }).click();
  await page.locator('input[type="password"]').fill(PASSWORD);
  await page.locator("label.chip", { hasText: "June" }).first().click();
  await page.locator('form button:not([type="button"])').last().click();
  await page.waitForURL(/\/staff$/);
  await settle(page, 1200);
  // The day strip opens on the chosen day; pin it so every shot starts the same.
  await page
    .locator('.d[aria-pressed="true"]')
    .first()
    .evaluate((el) => el.scrollIntoView({ inline: "start", block: "nearest" }));
  return page;
}

// The overnight build and the first fix round: the day, an appointment and opening hours.
if (STEPS.has("old"))
  for (const [tag, base] of [
    ["night", NIGHT],
    ["audit", AUDIT],
  ]) {
    for (const lang of ["vi", "en"]) {
      const sfx = lang === "vi" ? "" : "-en";
      const page = await staff(base, { lang, size: OLD });
      await shot(page, `${tag}-day${sfx}`);
      await page.locator(".card", { hasText: "Maria Santos" }).click();
      await settle(page);
      await shot(page, `${tag}-sheet${sfx}`);
      await page.goto(`${base}/staff/hours`);
      await settle(page, 1200);
      await shot(page, `${tag}-hours${sfx}`);
      if (tag === "night") {
        await page.goto(`${base}/staff/login`);
        await settle(page, 400);
        await shot(page, `night-login${sfx}`);
      }
      await page.context().close();
    }
  }

// Today's app, in Vietnamese and in English.
if (STEPS.has("now"))
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
      await dlg
        .getByText(/rảnh giờ này|không ai rảnh|Trùng/)
        .first()
        .evaluate((el) => el.scrollIntoView({ block: "center" }));
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
if (STEPS.has("site")) {
  const page = await phone(UPRIGHT);
  await safari(page);
  await page
    .context()
    .addInitScript(() =>
      localStorage.setItem(
        "pn-contact",
        JSON.stringify({ name: "Maria Santos", phone: "416 555 0112", email: "" }),
      ),
    );
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
  // The evening, so the morning stays free for the walk-in film.
  await page.locator(".chip:not(:disabled)").last().click();
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
  await page.context().close();
}

// The /design specimen: the same components in both themes, side by side (desktop, 2x).
if (STEPS.has("design")) {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${NOW}/design`);
  await settle(page, 800);
  await page.locator(".themes").screenshot({ path: `${RAW}/design-themes.png` });
  await ctx.close();
}

// Screen films, one per section, paced so a reader can follow each screen.
async function film(name, page, play, { width = 786, height = 1704 } = {}) {
  const dir = `${RAW}/film-${name}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const stamps = [];
  cdp.on("Page.screencastFrame", async (f) => {
    writeFileSync(`${dir}/f${String(stamps.length).padStart(4, "0")}.jpg`, Buffer.from(f.data, "base64"));
    stamps.push(f.metadata.timestamp);
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await page.evaluate(() => (document.documentElement.dataset.taps = "1"));
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: width, maxHeight: height });
  await play(page);
  await cdp.send("Page.stopScreencast");
  // Frames arrive only on repaint, so each one keeps its own timestamp (ffconcat durations below).
  return { dir, stamps };
}
const smooth = (loc) => loc.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
const tap = async (page, loc, wait = 1400) => {
  await smooth(loc);
  await page.waitForTimeout(700);
  await loc.click();
  await page.waitForTimeout(wait);
};

// FILM_LANG=en films the staff side in English, as "<name>-en"; reseed first, since the Vietnamese
// walk-in takes the free slot. The customer film is English already, so it runs with Vietnamese.
const FL = process.env.FILM_LANG ?? "vi";
const T = {
  vi: {
    free: /rảnh giờ này/,
    status: /rảnh giờ này|không ai rảnh|Trùng/,
    save: "Lưu",
    sure: "Có, lưu",
    byTech: /Theo thợ/,
  },
  en: {
    free: /is free then/,
    status: /is free then|Nobody is free|overlap/i,
    save: "Save",
    sure: "Yes, save",
    byTech: /By staff/,
  },
}[FL];
const SFX = FL === "vi" ? "" : `-${FL}`;
const FILMS = `${RAW}/films${SFX}.json`;
if (STEPS.has("films")) {
  // The film should show a free technician, so find one off camera first (before the customer film books into the day).
  const techPage = await staff(NOW, { lang: FL });
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
      if (await dlg.getByText(T.free).isVisible()) {
        free = who;
        break;
      }
    }
    await techPage.goto(`${NOW}/staff`);
    await settle(techPage, 1200);
  }
  const films = { free: free ?? null };
  films.staff = await film(`staff${SFX}`, techPage, async (page) => {
    await page.waitForTimeout(1500);
    await tap(page, page.getByRole("navigation").getByRole("link").nth(1), 1800);
    const dlg = page.getByRole("dialog");
    await dlg.getByPlaceholder(/walk-in/i).pressSequentially("Mai", { delay: 180 });
    await page.waitForTimeout(900);
    await tap(page, dlg.getByRole("button", { name: /^Pedicure$/ }));
    await tap(page, dlg.getByRole("button", { name: free ?? "Dina", exact: true }), 1200);
    await smooth(dlg.getByText(T.status).first());
    await page.waitForTimeout(2800);
    await tap(page, page.getByRole("button", { name: T.save, exact: true }), 1800);
    const sure = page.getByRole("button", { name: T.sure });
    if (await sure.isVisible()) await tap(page, sure, 1800);
    await smooth(page.locator(".card", { hasText: "Mai" }).first());
    await page.waitForTimeout(3200);
  });
  await techPage.context().close();

  // Sideways: the By-tech timeline, the whole salon's day on one screen.
  const wide = await staff(NOW, { lang: FL, size: SIDEWAYS });
  // Open on the view switch, so the film's first frame (its poster) already shows the day.
  await wide.locator(".controls").evaluate((el) => el.scrollIntoView({ block: "start" }));
  await wide.waitForTimeout(500);
  films.day = await film(
    `day${SFX}`,
    wide,
    async (page) => {
      await page.waitForTimeout(1200);
      // Tapped in place: centring it would scroll back up to the header.
      await page.getByRole("radio", { name: T.byTech }).click();
      await page.waitForTimeout(2200);
      // Scroll the day from morning to closing, slowly enough to read the names.
      for (let i = 0; i < 9; i++) {
        await page.mouse.wheel(0, 120);
        await page.waitForTimeout(650);
      }
      await page.waitForTimeout(1200);
      const block = page.locator(".blk", { hasText: "Chloe Park" }).first();
      if (await block.isVisible()) await tap(page, block, 2600);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1500);
    },
    { width: 1704, height: 786 },
  );
  await wide.context().close();

  if (FL === "vi") {
    const customer = await phone(UPRIGHT, 2);
    await safari(customer);
    await customer
      .context()
      .addInitScript(() =>
        localStorage.setItem(
          "pn-contact",
          JSON.stringify({ name: "Ava Nguyen", phone: "416 555 0119", email: "" }),
        ),
      );
    await customer.goto(`${NOW}/book`);
    await settle(customer);
    films.customer = await film("customer", customer, async (page) => {
      await page.waitForTimeout(1500);
      await tap(page, page.getByRole("button", { name: /^Pedicure with Shellac/ }), 1600);
      await tap(page, page.getByRole("button", { name: "Continue" }), 2200);
      await tap(page, page.getByRole("button", { name: "Continue" }), 2200);
      const next = page.getByRole("button", { name: /^Try / });
      if (await next.isVisible()) await tap(page, next, 1600);
      await tap(page, page.locator(".chip").nth(2), 1400);
      await tap(page, page.getByRole("button", { name: "Continue" }), 2800);
      await tap(page, page.getByRole("button", { name: "Confirm booking" }), 0);
      await page.getByRole("heading", { name: "You’re booked" }).waitFor();
      await page.waitForTimeout(3500);
    });
    await customer.context().close();
  }
  writeFileSync(FILMS, JSON.stringify(films));
}
await browser.close();

const ff = (...args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);
const webp = (src, out, width) =>
  ff("-i", src, "-vf", `scale=${width}:-2:flags=lanczos`, "-quality", "84", out);

// One pixel's colour, as #rrggbb (the app's colour behind the status bar or the home indicator).
const pixel = (src, y) => {
  const [r, g, b] = execFileSync("ffmpeg", [
    "-v",
    "error",
    "-i",
    src,
    "-vf",
    `format=rgb24,crop=1:1:24:${y}`,
    "-frames:v",
    "1",
    "-f",
    "rawvideo",
    "-pix_fmt",
    "rgb24",
    "-",
  ]);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
};
const lum = (hex) =>
  parseInt(hex.slice(1, 3), 16) * 0.3 +
  parseInt(hex.slice(3, 5), 16) * 0.59 +
  parseInt(hex.slice(5, 7), 16) * 0.11;
const bars = existsSync(BARS) ? JSON.parse(readFileSync(BARS, "utf8")) : {};
// First builds: the colours behind the drawn bars. Today's: only whether the clock sits on a dark top.
const measure = (name, src) => {
  const top = pixel(src, 2);
  bars[name] = { top, bottom: pixel(src, "ih-3"), dark: lum(top) < 150 };
};
const measureFull = (name, src, y) => {
  const top = pixel(src, y);
  bars[name] = { top, bottom: top, dark: lum(top) < 150, full: true };
};

const OLD_SHOTS = ["night-day", "night-sheet", "night-hours", "night-login", "audit-day"].flatMap((n) => [
  n,
  `${n}-en`,
]);
const NOW_SHOTS = [
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
];
if (STEPS.has("media")) {
  // 786 px wide is 2x the largest phone on the page.
  for (const n of OLD_SHOTS.filter((n) => existsSync(`${RAW}/${n}.png`))) {
    webp(`${RAW}/${n}.png`, `${OUT}/${n}.webp`, 780);
    measure(n, `${RAW}/${n}.png`);
  }
  for (const n of NOW_SHOTS) {
    webp(`${RAW}/${n}.png`, `${OUT}/${n}.webp`, 786);
    measureFull(n, `${RAW}/${n}.png`, 60);
  }
  // Every film from the last Vietnamese and English runs, named after its frame folder.
  const runs = [`${RAW}/films.json`, `${RAW}/films-en.json`].filter(existsSync);
  for (const { dir, stamps } of runs.flatMap((f) =>
    Object.values(JSON.parse(readFileSync(f, "utf8"))).filter((x) => x?.dir),
  )) {
    const name = dir.split("/film-").pop();
    // Each frame shows until the next repaint, so the film keeps the real pace.
    const list = stamps.map(
      (t, i) =>
        `file 'f${String(i).padStart(4, "0")}.jpg'\nduration ${((stamps[i + 1] ?? t + 1.5) - t).toFixed(4)}`,
    );
    writeFileSync(
      `${dir}/list.txt`,
      `ffconcat version 1.0\n${list.join("\n")}\nfile 'f${String(stamps.length - 1).padStart(4, "0")}.jpg'\n`,
    );
    const wide = name.startsWith("day");
    ff(
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      `${dir}/list.txt`,
      "-vf",
      // Screencast JPEGs are full-range BT.601; left as is, browsers wash the cream out to pale
      // yellow. Convert to tagged limited-range BT.709, what every browser decodes the same way.
      `fps=30,scale=${wide ? "1704:-2" : "786:-2"}:in_color_matrix=bt601:in_range=pc:out_color_matrix=bt709:out_range=tv,format=yuv420p`,
      "-colorspace",
      "bt709",
      "-color_primaries",
      "bt709",
      "-color_trc",
      "bt709",
      "-color_range",
      "tv",
      "-c:v",
      "libx264",
      "-crf",
      "23",
      "-preset",
      "slow",
      "-movflags",
      "+faststart",
      "-an",
      `${OUT}/${name}.mp4`,
    );
    ff(
      "-i",
      `${dir}/f0000.jpg`,
      "-vf",
      `scale=${wide ? 1704 : 786}:-2`,
      "-quality",
      "84",
      `${OUT}/${name}.webp`,
    );
    if (!wide) measureFull(name, `${dir}/f0000.jpg`, name === "customer" ? 40 : 60);
    else bars[name] = { top: "#f4ebdf", bottom: "#f4ebdf", full: true };
  }
  writeFileSync(BARS, `${JSON.stringify(bars, null, 2)}\n`);
}
if (STEPS.has("design")) webp(`${RAW}/design-themes.png`, `${OUT}/design-themes.webp`, 2240);
console.log("done");
