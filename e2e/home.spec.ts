import { expect, test } from "@playwright/test";

test("the hero is only the balls and the name: no nav, no status lines, no tagline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Lucas Vu/);
  await expect(page.getByRole("navigation", { name: "Site" })).toHaveCount(0);
  await expect(page.getByText("product designer @ warframe")).toHaveCount(0);
  await expect(page.getByText("the person who gets things moving")).toHaveCount(0);
});

test("home lists the top four, each opening its case study or Devpost, with accolades", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#work h3")).toHaveText([
    "Ripple",
    "Shufflr",
    "We should go to Japan",
    "Maple Leaf Foods",
  ]);
  for (const [name, href] of [
    ["Ripple", "/work/ripple"],
    ["Shufflr", "/work/shufflr"],
    ["We should go to Japan", "https://devpost.com/software/a-nhsi8g"],
    ["Maple Leaf Foods", "/work/maple-leaf-foods"],
  ] as const) {
    await expect(page.locator("#work").getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      href,
    );
  }
  await expect(page.locator("#work")).toContainText("Most Practical");
  await expect(page.getByRole("link", { name: /View more work/ })).toHaveAttribute("href", "/work");
});

test("the page turns black at the quote; the about teaser and photos open /about", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("#strip-title")
    .evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY));
  await expect
    .poll(() => page.locator("#work").evaluate((el) => getComputedStyle(el).backgroundColor), {
      timeout: 8000,
    })
    .toBe("rgb(14, 14, 12)");
  await expect(page.getByRole("heading", { name: /get things moving\./ })).toBeVisible();
  await expect(page.getByRole("link", { name: /More about me/ })).toHaveAttribute("href", "/about");
  await expect(page.getByRole("link", { name: /Read more on About/ })).toHaveCount(4);
  await expect(page.getByRole("link", { name: /Remembrance Day/ })).toHaveAttribute("href", "/about#cadets");
});

test("unknown pages get the cradle with 404 where the name hangs", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/404/);
  await expect(page.getByRole("link", { name: "return to main site" })).toHaveAttribute("href", "/");
});

test("smooth scrolling reaches the close, whose text has risen in", async ({ page }) => {
  await page.goto("/");
  const close = page.getByRole("heading", { name: "Let's talk." });
  const inView = () => close.evaluate((el) => el.getBoundingClientRect().top < innerHeight * 0.8);
  for (let k = 0; k < 80 && !(await inView()); k++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(100);
  }
  await expect
    .poll(() => close.evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 8000 })
    .toBeGreaterThan(0.95);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
});
