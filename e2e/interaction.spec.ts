import { expect, test } from "@playwright/test";
import { calmHome } from "./calm";

const ready = async (page: import("@playwright/test").Page) => {
  await page.goto("/");
  await expect(page.locator(".hero-frame canvas")).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(4000);
};

test("tab order runs People to Products with descriptive names", async ({ page }) => {
  await ready(page);
  const names = await page
    .locator("button.cradle-target")
    .evaluateAll((bs) => bs.map((b) => b.getAttribute("aria-label")));
  expect(names).toEqual([
    "People: where every problem starts. Open story.",
    "Ideas: the first push. Open story.",
    "Experiments: built to find out. Open story.",
    "Products: the part you can hold. Open story.",
  ]);
  const people = page.getByRole("button", { name: /^People:/ });
  await people.focus();
  await expect(people).toBeFocused();
  await expect(page.getByText("People", { exact: true })).toHaveCSS("opacity", "1");
});

test("arrow keys push the focused ball", async ({ page }) => {
  await calmHome(page);
  const products = page.getByRole("button", { name: /^Products:/ });
  await products.focus();
  const before = (await products.boundingBox())!.x;
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  const after = (await products.boundingBox())!.x;
  expect(after - before).toBeGreaterThan(5);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("arrow keys do not move the balls", async ({ page }) => {
    await ready(page);
    const products = page.getByRole("button", { name: /^Products:/ });
    await products.focus();
    const before = (await products.boundingBox())!.x;
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);
    expect(Math.abs((await products.boundingBox())!.x - before)).toBeLessThan(1);
  });
});
