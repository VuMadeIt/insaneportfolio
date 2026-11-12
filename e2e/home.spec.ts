import { expect, test } from "@playwright/test";

test("the hero: the name, the balls and the site nav with a sound button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Lucas Vu/);
  const nav = page.getByRole("navigation", { name: "Site" });
  await expect(nav.getByRole("link", { name: "Lucas Vu, home" })).toHaveAttribute("href", "/");
  await expect(nav.getByRole("link", { name: "work" })).toHaveAttribute("href", "/work");
  await expect(nav.getByRole("link", { name: "about" })).toHaveAttribute("href", "/about");
  await expect(nav.getByRole("link", { name: "contact" })).toHaveAttribute(
    "href",
    "mailto:lucasvu.work@gmail.com",
  );
  await expect(page.getByText("product designer @ warframe")).toHaveCount(0);
});

test("after clicking a nav link the bar still hides on scroll down", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html.lenis")).toHaveCount(1, { timeout: 30_000 });
  await page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "about" }).click();
  await expect(page).toHaveURL(/\/about$/);
  const bar = page.locator("header.site-nav");
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 1200);
  await expect(bar).toHaveAttribute("data-hidden", "");
  await expect.poll(() => bar.evaluate((el) => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(0);
});

test("the balls drop in from above when the page opens", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  // Watched in the page every frame: the first load compiles the scene's shaders, which can hold
  // the main thread for seconds headless, and a poll from outside could miss the balls in the air.
  const dropped = await page
    .locator("button.cradle-target")
    .first()
    .evaluate(
      (b) =>
        new Promise<boolean>((done) => {
          let above = false;
          const t0 = performance.now();
          const f = () => {
            const top = b.getBoundingClientRect().top;
            above ||= top < -50;
            if (above && top > 150) return done(true);
            if (performance.now() - t0 > 40_000) return done(false);
            requestAnimationFrame(f);
          };
          f();
        }),
    );
  expect(dropped).toBe(true);
});

test("the nav hides while scrolling down and comes back on scroll up", async ({ page }) => {
  await page.goto("/");
  const bar = page.locator("header.site-nav");
  await expect(bar).not.toHaveAttribute("data-hidden");
  // Hydrated: smooth scrolling has started.
  await expect(page.locator("html.lenis")).toHaveCount(1, { timeout: 30_000 });
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 1200);
  await expect(bar).toHaveAttribute("data-hidden", "");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1150);
  await page.mouse.wheel(0, -200);
  await expect(bar).not.toHaveAttribute("data-hidden");
});

test("the sound button mutes and remembers it", async ({ page }) => {
  await page.goto("/");
  const sound = page.getByRole("button", { name: "Sound on" });
  await sound.click();
  await expect(page.getByRole("button", { name: "Sound off" })).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(page.getByRole("button", { name: "Sound off" })).toBeVisible();
});

test("home lists Reboot, Passion Nails and Shufflr without prize objects, then View more", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#work h3")).toHaveText(["Reboot", "Passion Nails", "Shufflr"]);
  await expect(page.locator("#work").getByRole("link", { name: "Reboot", exact: true })).toHaveAttribute(
    "href",
    "/work/reboot",
  );
  await expect(page.locator("#work")).not.toContainText("Most Practical");
  await expect(page.locator('#work img[src*="objects"]')).toHaveCount(0);
  await expect(page.locator("#work")).toContainText("February 2026");
  await expect(page.getByRole("link", { name: /View more work/ })).toHaveAttribute("href", "/work");
});

test("home rows play their video inside the row, date under the title", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const row = page.locator("#work li.catalogue-row").first();
  const video = row.locator("video:visible");
  await video.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v) => !(v as HTMLVideoElement).paused), { timeout: 8000 })
    .toBe(true);
  const [v, title, date] = await Promise.all(
    [video, row.locator("h3"), row.getByText("February 2026")].map((l) => l.boundingBox()),
  );
  // Inside the row (into its padding, short of the rules), so the row never grows for it.
  const li = (await row.boundingBox())!;
  expect(v!.y).toBeGreaterThan(li.y);
  expect(v!.y + v!.height).toBeLessThan(li.y + li.height);
  expect(date!.y).toBeGreaterThan(title!.y + title!.height - 1);
  await page.mouse.move(v!.x - 300, v!.y + 20, { steps: 4 });
  await expect(page.locator(".work-preview")).toHaveCount(0);
});

test("on /work a row's video follows the pointer and goes when the pointer leaves", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work");
  const row = page.locator("li.catalogue-row").first();
  await row.scrollIntoViewIfNeeded();
  const box = (await row.boundingBox())!;
  await page.mouse.move(box.x + 200, box.y + box.height / 2, { steps: 4 });
  await page.mouse.move(box.x + 400, box.y + box.height / 2, { steps: 6 });
  await expect(page.locator(".work-preview[data-on]")).toHaveCount(1);
  await expect(page.locator(".cursor-ball")).toHaveAttribute("data-state", "hide");
  await page.mouse.move(box.x + 400, box.y - 150, { steps: 6 });
  await expect(page.locator(".work-preview[data-on]")).toHaveCount(0);
});

test("the page stays light: no fade to black", async ({ page }) => {
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  for (const sel of ["#work", "footer"])
    expect(await page.locator(sel).evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(
      "rgb(14, 14, 12)",
    );
});

test("the moving line fills its column and swells under the pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const wm = page.locator(".flex-wm");
  await wm.scrollIntoViewIfNeeded();
  await expect(wm).toHaveAttribute("data-live", "");
  await expect(page.getByRole("heading", { name: "Let\u2019s get things moving." })).toBeVisible();
  const box = (await wm.boundingBox())!;
  const first = page.locator(".flex-l").first();
  const weight = () =>
    first.evaluate((el) => Number(/"wght" ([\d.]+)/.exec(el.style.fontVariationSettings)![1]));
  await page.mouse.move(box.x + 10, box.y + box.height / 2, { steps: 8 });
  await expect.poll(weight, { timeout: 30_000 }).toBeGreaterThan(650);
  await page.mouse.move(box.x + box.width - 5, box.y + box.height / 2, { steps: 8 });
  await expect.poll(weight, { timeout: 15_000 }).toBeLessThan(450);
  // The letters still add up to the column: the last one ends at its right edge.
  const right = await page
    .locator(".flex-l")
    .last()
    .evaluate((el) => el.getBoundingClientRect().right);
  expect(Math.abs(right - (box.x + box.width))).toBeLessThan(box.width * 0.02);
});

test("unknown pages get the cradle with 404 where the name hangs", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/404/);
  await expect(page.getByRole("link", { name: "return to main site" })).toHaveCount(0);
});

test("smooth scrolling reaches the footer", async ({ page }) => {
  await page.goto("/");
  const name = page.locator("footer#contact");
  const inView = () => name.evaluate((el) => el.getBoundingClientRect().top < innerHeight);
  for (let k = 0; k < 80 && !(await inView()); k++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(100);
  }
  expect(await inView()).toBe(true);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
});

test("on a phone the menu slides away on scroll down and comes back on scroll up", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work");
  const bar = page.locator("header", { has: page.getByRole("button", { name: "menu" }) });
  const shift = () => bar.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  await page.evaluate(() => scrollBy(0, 600));
  await page.evaluate(() => new Promise((r) => setTimeout(r, 100)));
  await page.evaluate(() => scrollBy(0, 300));
  await expect.poll(shift).toBeLessThan(-40);
  await page.evaluate(() => scrollBy(0, -60));
  await expect.poll(shift).toBe(0);
});
