import { expect, test } from "@playwright/test";

test("the hero: the name, the balls and the site nav with a sound button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Lucas Vu/);
  const nav = page.getByRole("navigation", { name: "Site" });
  await expect(nav.getByRole("link", { name: "lucas vu" })).toHaveAttribute("href", "/");
  await expect(nav.getByRole("link", { name: "work" })).toHaveAttribute("href", "/work");
  await expect(nav.getByRole("link", { name: "about" })).toHaveAttribute("href", "/about");
  await expect(nav.getByRole("link", { name: "say hi" })).toHaveAttribute(
    "href",
    "mailto:lucasvu.work@gmail.com",
  );
  await expect(page.getByText("product designer @ warframe")).toHaveCount(0);
});

test("the sound button mutes and remembers it", async ({ page }) => {
  await page.goto("/");
  const sound = page.getByRole("button", { name: "Sound on" });
  await sound.click();
  await expect(page.getByRole("button", { name: "Sound off" })).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(page.getByRole("button", { name: "Sound off" })).toBeVisible();
});

test("home lists Ripple and Shufflr with accolades and months, then View more", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#work h3")).toHaveText(["Ripple", "Shufflr"]);
  await expect(page.locator("#work").getByRole("link", { name: "Ripple", exact: true })).toHaveAttribute(
    "href",
    "/work/ripple",
  );
  await expect(page.locator("#work")).toContainText("Most Practical");
  await expect(page.locator("#work")).toContainText("March");
  await expect(page.locator("#work")).not.toContainText("2026");
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

test("footer: clicking empty space drops a ball, clicking a link does not", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const f = (await footer.boundingBox())!;
  const balls = page.locator("footer canvas");
  await page.mouse.move(f.x + f.width / 2, f.y + f.height * 0.4);
  await expect(page.locator(".cursor-ball")).toHaveAttribute("data-state", "drop");
  await page.mouse.click(f.x + f.width / 2, f.y + f.height * 0.4);
  await expect(balls).toHaveAttribute("data-balls", "1");
  await page.locator("footer a", { hasText: "linkedin" }).dispatchEvent("pointerdown", { button: 0 });
  await expect(balls).toHaveAttribute("data-balls", "1");
});

test("unknown pages get the cradle with 404 where the name hangs", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/404/);
  await expect(page.getByRole("link", { name: "return to main site" })).toHaveAttribute("href", "/");
});

test("smooth scrolling reaches the footer", async ({ page }) => {
  await page.goto("/");
  const name = page.getByRole("heading", { name: "i am lucas vu." });
  const inView = () => name.evaluate((el) => el.getBoundingClientRect().top < innerHeight);
  for (let k = 0; k < 80 && !(await inView()); k++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(100);
  }
  expect(await inView()).toBe(true);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
});
