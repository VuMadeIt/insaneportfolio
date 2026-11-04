import { expect, test } from "@playwright/test";

test("the hero: the name, the balls and the site nav with a sound button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Lucas Vu/);
  const nav = page.getByRole("navigation", { name: "Site" });
  await expect(nav.getByRole("link", { name: "Lucas Vu, home" })).toHaveAttribute("href", "/");
  await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/work");
  await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  await expect(nav.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
  await expect(page.getByText("product designer @ warframe")).toHaveCount(0);
});

test("the nav hides while scrolling down and comes back on scroll up", async ({ page }) => {
  await page.goto("/");
  const bar = page.locator("header.site-nav");
  await expect(bar).not.toHaveAttribute("data-hidden");
  // Hydrated: smooth scrolling has started.
  await expect(page.locator("html.lenis")).toHaveCount(1);
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

test("home lists Ripple and Shufflr with their prize objects and dates, then View more", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#work h3")).toHaveText(["Ripple", "Shufflr"]);
  await expect(page.locator("#work").getByRole("link", { name: "Ripple", exact: true })).toHaveAttribute(
    "href",
    "/work/ripple",
  );
  await expect(page.locator("#work")).not.toContainText("Most Practical");
  await expect(page.locator("#work").getByAltText(/1st place/)).toHaveCount(1);
  await expect(page.locator("#work")).toContainText("March 2026");
  await expect(page.getByRole("link", { name: /View more work/ })).toHaveAttribute("href", "/work");
});

test("a row's video follows the pointer and goes when the pointer leaves", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const row = page.locator("#work li.catalogue-row").first();
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

test("the ball drops into the o of moving and comes to rest", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const line = page.locator(".moving-line");
  await expect(line).toHaveAttribute("data-armed", "");
  await line.scrollIntoViewIfNeeded();
  await expect(line).toHaveAttribute("data-in", "");
  const ball = page.locator(".moving-ball");
  await expect.poll(() => ball.evaluate((el) => el.style.transform), { timeout: 5000 }).toBe("");
  await expect(page.getByRole("heading", { name: "Let's get things moving." })).toBeVisible();
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
