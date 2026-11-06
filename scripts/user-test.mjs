// User tests for every animation that matters, under several conditions.
// Usage: node scripts/user-test.mjs <site base> [lab base]
//   e.g. node scripts/user-test.mjs http://localhost:3100 http://localhost:3400
// Prints PASS / FAIL per check and scenario; exits 1 on any failure.
import { chromium } from "@playwright/test";

const [site = "http://localhost:3100", lab] = process.argv.slice(2);
const results = [];
const record = (scenario, check, ok, note = "") => {
  results.push({ scenario, check, ok, note });
  console.log(`${ok ? "PASS" : "FAIL"}  ${scenario.padEnd(18)} ${check}${note ? `  (${note})` : ""}`);
};
const browser = await chromium.launch({
  channel: "msedge",
  args: ["--enable-gpu", "--ignore-gpu-blocklist"],
});

async function open(scenario, url) {
  const phone = scenario.startsWith("phone");
  const ctx = await browser.newContext({
    viewport: phone
      ? { width: 390, height: 844 }
      : scenario.startsWith("tablet")
        ? { width: 768, height: 1024 }
        : { width: 1440, height: 900 },
    isMobile: phone,
    hasTouch: phone,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  if (scenario.startsWith("slow")) {
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 1.6e6 / 8,
      uploadThroughput: 750e3 / 8,
    });
  }
  await page.goto(url, { waitUntil: "commit", timeout: 120_000 });
  return { ctx, page, errors, phone };
}

// Watches the first ball's button in the page every frame: it must be seen above the screen, then
// hanging in view (the drop), within `ms`.
const watchDrop = (page, ms) =>
  page.evaluate(
    (ms) =>
      new Promise((done) => {
        let above = false;
        let minTop = Infinity;
        const t0 = performance.now();
        // Looked up every frame: a client navigation mounts new buttons.
        const f = () => {
          const top = document.querySelector("button.cradle-target")?.getBoundingClientRect().top;
          if (top !== undefined) {
            minTop = Math.min(minTop, top);
            above ||= top < -40;
            if (above && top > innerHeight * 0.12) return done(true);
          }
          if (performance.now() - t0 > ms)
            return done(
              `no drop seen: top ${top?.toFixed(0)}, min ${minTop.toFixed(0)}, scrollY ${scrollY}, ${location.pathname}`,
            );
          requestAnimationFrame(f);
        };
        f();
      }),
    ms,
  );

async function home(scenario) {
  const url = scenario === "proxy" ? process.env.PROXY : site;
  if (!url) return;
  const { ctx, page, errors, phone } = await open(scenario, url);
  const slow = scenario.startsWith("slow");
  try {
    // The hero is never empty: within 6 s either the live scene or the still is showing.
    const drop = watchDrop(page, slow ? 60_000 : 25_000).catch(() => false);
    await page.waitForTimeout(6000);
    const hero = await page.evaluate(() => {
      const still = document.querySelector(".hero-still");
      return {
        live: still?.getAttribute("data-state") === "live",
        stillShown: still ? getComputedStyle(still).visibility === "visible" : false,
      };
    });
    record(
      scenario,
      "hero shows balls by 6 s (live or still)",
      hero.live || hero.stillShown,
      JSON.stringify(hero),
    );
    record(scenario, "balls drop in from above", await drop);

    // Idle sway: once down, the balls keep swinging a few millimetres, together. Not on touch
    // devices (PLAN 15.18), where they hang still so the scene stops rendering.
    const sway = await page.evaluate(
      () =>
        new Promise((done) => {
          const xs = [];
          const t0 = performance.now();
          const f = () => {
            const r = document.querySelector("button.cradle-target")?.getBoundingClientRect();
            if (r) xs.push(r.left);
            if (performance.now() - t0 < 4000) requestAnimationFrame(f);
            else done(Math.max(...xs) - Math.min(...xs));
          };
          setTimeout(f, 1500);
        }),
    );
    record(
      scenario,
      phone ? "balls hang still on a phone" : "balls sway slightly while idle",
      phone ? sway < 0.8 : sway > 0.8 && sway < 40,
      `range ${sway.toFixed(1)} px`,
    );

    const tagline = await page.evaluate(() => {
      const c = document.querySelector(".giant-caption");
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return {
        text: c.textContent,
        inView: r.left >= 0 && r.right <= innerWidth + 1,
        op: getComputedStyle(c).opacity,
      };
    });
    record(
      scenario,
      "tagline above VU, fully on screen",
      !!tagline && tagline.text.includes("product design engineer") && tagline.inView && tagline.op === "1",
      JSON.stringify(tagline),
    );

    if (phone) {
      // Phones: the whole nav is the menu pill.
      const toggle = page.getByRole("button", { name: "menu" });
      await toggle.click();
      await page.waitForTimeout(1300);
      const names = await page.locator("#haven-menu ul").first().locator("a").allInnerTexts();
      record(
        scenario,
        "menu opens with home, work, about, contact",
        names.join(",") === "home,work,about,contact",
        names.join(","),
      );
      const sound = page.locator("#haven-menu button[aria-pressed]");
      const before = await sound.innerText();
      await sound.click();
      const after = await sound.innerText();
      record(scenario, "menu sound switch toggles", before !== after, `${before} -> ${after}`);
      if (after.includes("off")) await sound.click();
      await page.mouse.click(30, 700);
      await page.waitForTimeout(900);
      record(
        scenario,
        "tapping outside closes the menu",
        (await toggle.getAttribute("aria-expanded")) === "false",
      );
    } else {
      const home = page
        .getByRole("navigation", { name: "Site" })
        .getByRole("link", { name: "Lucas Vu, home" });
      const src = await home.locator("img").getAttribute("src");
      const left = (await home.boundingBox()).x;
      record(scenario, "nav: one ball at the left edge", /ball\.webp/.test(src) && left < 48, `x ${left}`);
    }

    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      // A story opens on a click and closes on a click anywhere; there is no back arrow.
      await page.getByRole("button", { name: /^People:/ }).click({ force: true });
      await page.waitForURL(/\/people$/, { timeout: 15_000 });
      await page.waitForTimeout(2500);
      const arrow = await page.getByRole("link", { name: "Back to the cradle" }).count();
      record(scenario, "story has no back arrow", arrow === 0);
      await page.mouse.click(1300, 120);
      const closed = await page
        .waitForURL((u) => u.pathname === "/", { timeout: 10_000 })
        .then(
          () => true,
          () => false,
        );
      record(scenario, "clicking anywhere closes the story", closed);
      await page.waitForTimeout(2500);
    }
    await page
      .waitForFunction(
        () => document.documentElement.classList.contains("lenis") || matchMedia("(pointer: coarse)").matches,
        null,
        { timeout: 60_000 },
      )
      .catch(() => {});

    // Text rises in as it scrolls into view.
    await page.locator("#work").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    const revealed = await page
      .locator("#work .reveal")
      .first()
      .evaluate((el) => Number(getComputedStyle(el).opacity));
    record(scenario, "work rows rise into view", revealed > 0.95, `opacity ${revealed}`);

    const wide = (page.viewportSize()?.width ?? 0) >= 1024;
    const playing = (selector) =>
      page
        .waitForFunction(
          (sel) => [...document.querySelectorAll(sel)].some((v) => v.currentTime > 0.2 && !v.paused),
          selector,
          { timeout: slow ? 30_000 : 10_000 },
        )
        .then(
          () => true,
          () => false,
        );
    // Every home row plays its video as it comes on screen: in the row on desktop, under it on phones.
    await page.locator("#work li.catalogue-row video:visible").first().scrollIntoViewIfNeeded();
    record(scenario, "row video plays as it scrolls in", await playing("#work li.catalogue-row video"));
    if (wide) {
      // The cursor ball trails the pointer.
      await page.mouse.move(40, 450, { steps: 6 });
      await page.waitForTimeout(600);
      const cursor = await page.evaluate(() => {
        const o = document.querySelector(".cursor-outer");
        const m = /translate3d\(([\d.-]+)px, ([\d.-]+)px/.exec(o.style.transform);
        return { shown: getComputedStyle(o).opacity, x: Number(m?.[1]), y: Number(m?.[2]) };
      });
      const near = Math.abs(cursor.x - 40) < 30 && Math.abs(cursor.y - 450) < 30;
      record(
        scenario,
        "cursor ball follows the pointer",
        near && cursor.shown === "1",
        JSON.stringify(cursor),
      );
    }

    // The moving line goes live and swells (pointer on desktop, scroll on phones).
    const wm = page.locator(".flex-wm");
    await wm.scrollIntoViewIfNeeded();
    const live = await wm.evaluate(
      (el) =>
        new Promise((done) => {
          const t0 = performance.now();
          const f = () =>
            el.hasAttribute("data-live")
              ? done(true)
              : performance.now() - t0 > 30_000
                ? done(false)
                : setTimeout(f, 100);
          f();
        }),
    );
    record(scenario, "moving line is live", live);
    const lineFont = await page.evaluate(() => ({
      ruler: document.querySelectorAll(".flex-ruler, .flex-marker").length,
      family: getComputedStyle(document.querySelector(".flex-l")).fontFamily,
    }));
    record(
      scenario,
      "moving line: text only, in General Sans",
      lineFont.ruler === 0 && /general/i.test(lineFont.family),
      lineFont.family.slice(0, 40),
    );
    const visible = await wm.evaluate((el) => Number(getComputedStyle(el).opacity));
    record(scenario, "moving line is visible", visible > 0.95, `opacity ${visible}`);
    const maxWeight = () =>
      page.$$eval(".flex-l", (ls) =>
        Math.max(...ls.map((l) => Number(/"wght" ([\d.]+)/.exec(l.style.fontVariationSettings)?.[1] ?? 0))),
      );
    if (phone) {
      await page.mouse.wheel(0, 300).catch(() => {});
      await page.evaluate(() => scrollBy(0, 250));
      await page.waitForTimeout(1500);
    } else {
      const b = await wm.boundingBox();
      await page.mouse.move(b.x + b.width * 0.3, b.y + b.height / 2, { steps: 10 });
      await page.waitForTimeout(slow ? 3000 : 1200);
    }
    const w = await maxWeight();
    record(scenario, "moving line swells", w > 550, `max wght ${w.toFixed(0)}`);

    if (!phone) {
      // After clicking a nav link the bar still hides on scroll down.
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(600);
      await page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "about" }).click();
      await page.waitForURL(/\/about$/, { timeout: 30_000 });
      await page.waitForTimeout(800);
      await page.mouse.move(700, 500);
      await page.mouse.wheel(0, 1400);
      const hidden = await page
        .waitForFunction(
          () => document.querySelector("header.site-nav").getBoundingClientRect().bottom <= 0,
          null,
          { timeout: 8000 },
        )
        .then(
          () => true,
          () => false,
        );
      record(scenario, "nav hides on scroll after a click", hidden);
      // About: scrolling moves through the objects; the index jumps straight to one.
      const index = page.getByRole("navigation", { name: "Objects" }).getByRole("link");
      // Let the smooth scroll from the last wheel finish, then go to the section like a reader.
      await page.waitForTimeout(1500);
      await page.evaluate(() =>
        window.scrollTo(
          0,
          document.querySelector("#objects-title").closest("section").getBoundingClientRect().top + scrollY,
        ),
      );
      await page.waitForTimeout(800);
      const first = await index.first().getAttribute("aria-current");
      // The title sits just below the top as the stage pins; a screen of wheel passes one object.
      await page.mouse.wheel(0, 1300);
      await page.waitForTimeout(1500);
      const scrolled = await index.nth(1).getAttribute("aria-current");
      await index.nth(2).click();
      await page.waitForTimeout(2200);
      const jumped =
        (await index.nth(2).getAttribute("aria-current")) === "true" &&
        (await page.getByRole("heading", { name: "Life Changing Memories with the Elderly" }).count()) === 1;
      record(
        scenario,
        "about: scroll moves to the next object, index jumps",
        first === "true" && scrolled === "true" && jumped,
        `first ${first}, after scroll ${scrolled}, jumped ${jumped}`,
      );
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(400);
      // Coming back home drops the balls again.
      const back = watchDrop(page, slow ? 60_000 : 25_000).catch(
        (e) => `watch lost: ${e.message.slice(0, 80)}`,
      );
      await page.goBack();
      const result = await back;
      record(scenario, "balls drop again on coming back", result === true, String(result));
    }
    const html = await (await fetch(url)).text();
    record(
      scenario,
      "link preview: og:video and og:image",
      /property="og:video" content="[^"]*\/og\/cover\.mp4"/.test(html) &&
        /property="og:image" content="[^"]*\/og\/balls\.jpg"/.test(html),
    );
    const devpost = await page
      .locator('footer a[aria-label="Devpost"]')
      .getAttribute("href")
      .catch(() => null);
    record(
      scenario,
      "footer links to Devpost",
      devpost === "https://devpost.com/LucasMadeIt",
      String(devpost),
    );
    record(scenario, "no page errors", errors.length === 0, errors.slice(0, 2).join(" | "));
  } finally {
    await ctx.close();
  }
}

async function labs() {
  const { ctx, page, errors } = await open("lab", `${lab}/lab/type?font=fraunces`);
  try {
    await page.waitForTimeout(1500);
    const family = await page
      .locator("h1")
      .first()
      .evaluate((h) => getComputedStyle(h).fontFamily);
    record("lab type", "switches the typeface", /fraunces/i.test(family), family.slice(0, 60));
    record("lab", "no page errors", errors.length === 0, errors.slice(0, 2).join(" | "));
  } finally {
    await ctx.close();
  }
}

for (const scenario of (process.env.ONLY ?? "desktop,proxy,slow desktop,tablet,phone").split(","))
  await home(scenario);
if (lab) await labs();
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
