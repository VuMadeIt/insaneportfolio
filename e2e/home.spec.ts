import { expect, test } from "@playwright/test";

test("home shows the status lines, the tagline and the name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("product designer @ warframe")).toBeVisible();
  await expect(page.getByText("the person who gets things moving")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Lucas Vu/);
});

test("the hero nav has about, work and a say hi pill, and no logo", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Site" });
  await expect(nav.getByRole("link", { name: "about" })).toHaveAttribute("href", "/about");
  await expect(nav.getByRole("link", { name: "work" })).toHaveAttribute("href", "/work");
  await expect(nav.getByRole("link", { name: "say hi" })).toHaveAttribute(
    "href",
    "mailto:lucasvu.work@gmail.com",
  );
  await expect(nav.getByRole("img")).toHaveCount(0);
});

test("the work stack: four cards in order, three open case studies, Warframe is coming soon", async ({
  page,
}) => {
  await page.goto("/");
  const titles = page.locator("#work h3");
  await expect(titles).toHaveText(["Shufflr", "Ripple", "Maple Leaf Foods", "Warframe"]);
  for (const [name, slug] of [
    ["Shufflr", "shufflr"],
    ["Ripple", "ripple"],
    ["Maple Leaf Foods", "maple-leaf-foods"],
  ]) {
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute("href", `/work/${slug}`);
  }
  const warframe = page.getByRole("group", { name: "Warframe" });
  await expect(warframe).toContainText("coming soon");
  await expect(page.getByRole("link", { name: "Warframe", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /View all work/ })).toHaveAttribute("href", "/work");
  await expect(page.getByRole("link", { name: "lucasvu.work@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:lucasvu.work@gmail.com",
  );
});

test("covered cards step back: the first card shrinks once the second has slid over it", async ({ page }) => {
  await page.goto("/");
  const first = page.locator("#work li").first();
  const second = page.locator("#work li").nth(1);
  await second.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY));
  await expect
    .poll(async () => (await first.locator("> *").boundingBox())!.width, { timeout: 5000 })
    .toBeLessThan((await second.locator("> *").boundingBox())!.width);
});

test("unknown pages get the 404 in the site's voice", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nothing hangs here.");
});

test("smooth scrolling reaches the close, whose text has risen in", async ({ page }) => {
  await page.goto("/");
  const close = page.getByRole("heading", { name: "Let's get something moving." });
  const inView = () => close.evaluate((el) => el.getBoundingClientRect().top < innerHeight * 0.8);
  for (let k = 0; k < 60 && !(await inView()); k++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(100);
  }
  await expect
    .poll(() => close.evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 8000 })
    .toBeGreaterThan(0.95);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
});
