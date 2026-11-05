import { expect, test } from "@playwright/test";

const ready = async (page: import("@playwright/test").Page, path = "/") => {
  await page.goto(path);
  await expect(page.locator(".hero-frame canvas")).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(3000);
};

test("clicking a ball opens its story at its own URL; Escape returns", async ({ page }) => {
  await ready(page);
  const box = (await page.getByRole("button", { name: /^Ideas:/ }).boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/ideas$/);
  await expect(page.getByRole("heading", { level: 2, name: "Ideas" })).toBeVisible();
  await expect(page).toHaveTitle("Ideas | Lucas Vu");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#story-title")).toHaveCount(0);
});

test("no back arrow: the browser back button closes the story", async ({ page }) => {
  await ready(page);
  await page.getByRole("button", { name: /^People:/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/people$/);
  await expect(page.getByRole("link", { name: "Back to the cradle" })).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/people$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test("clicking empty wall closes the story", async ({ page }) => {
  await ready(page, "/experiments");
  await page.mouse.click(1100, 120);
  await expect(page).toHaveURL(/\/$/);
});

test("a direct load renders the story immediately with only the chosen ball on screen", async ({ page }) => {
  await ready(page, "/products");
  await expect(page.getByRole("heading", { level: 2, name: "Products" })).toBeVisible();
  await expect(page.getByText("The part you can hold.")).toHaveCSS("opacity", "1");
  const visible = await page.locator("button.cradle-target:not([hidden])").count();
  expect(visible).toBe(1);
  const box = (await page.getByRole("button", { name: /^Products:/ }).boundingBox())!;
  // Left third of a 1280 wide viewport.
  expect(box.x + box.width / 2).toBeGreaterThan(330);
  expect(box.x + box.width / 2).toBeLessThan(530);
});

test("the story text is server-rendered for every identity", async ({ request }) => {
  for (const [slug, line] of [
    ["people", "Where every problem starts."],
    ["ideas", "The first push."],
    ["experiments", "Built to find out."],
    ["products", "The part you can hold."],
  ]) {
    const html = await (await request.get(`/${slug}`)).text();
    expect(html).toContain(line);
  }
});

test("interrupting the choreography mid-flight is safe", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await ready(page);
  const people = page.getByRole("button", { name: /^People:/ });
  for (let k = 0; k < 3; k++) {
    await people.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(250 + k * 150);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
  }
  await expect(page).toHaveURL(/\/$/);
  await page.waitForTimeout(4000);
  const ys = await page
    .locator("button.cradle-target")
    .evaluateAll((bs) => bs.map((b) => b.getBoundingClientRect().y));
  expect(Math.max(...ys) - Math.min(...ys)).toBeLessThan(6);
  expect(errors).toEqual([]);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("the story opens without travel", async ({ page }) => {
    await ready(page);
    await page.getByRole("button", { name: /^People:/ }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/people$/);
    await page.waitForTimeout(300);
    const box = (await page.getByRole("button", { name: /^People:/ }).boundingBox())!;
    expect(box.x + box.width / 2).toBeLessThan(530);
    await expect(page.locator("button.cradle-target:not([hidden])")).toHaveCount(1);
  });
});
