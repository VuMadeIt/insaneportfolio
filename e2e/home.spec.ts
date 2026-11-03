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

test("four featured exhibits, each with a wall label and a way in, then all work and a close", async ({
  page,
}) => {
  await page.goto("/");
  for (const title of ["Shufflr", "Ripple", "Maple Leaf Foods", "Warframe"]) {
    await expect(page.getByRole("heading", { level: 3, name: title })).toHaveCount(1);
  }
  await expect(page.getByRole("link", { name: /View case study/ })).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Ask me about it/ })).toHaveAttribute("href", "/work/warframe");
  await expect(page.getByRole("link", { name: /View all work/ })).toHaveAttribute("href", "/work");
  await expect(page.getByRole("link", { name: "lucasvu.work@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:lucasvu.work@gmail.com",
  );
});

test("unknown pages get the 404 in the site's voice", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nothing hangs here.");
});

test("smooth scrolling reaches the close, whose text has risen in", async ({ page }) => {
  await page.goto("/");
  const close = page.getByRole("heading", { name: "Let's get something moving." });
  for (let k = 0; k < 40 && !(await close.isVisible()); k++) await page.mouse.wheel(0, 1200);
  await close.scrollIntoViewIfNeeded();
  await expect(close).toHaveCSS("opacity", "1", { timeout: 5000 });
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
});
