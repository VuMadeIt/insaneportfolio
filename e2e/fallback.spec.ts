import { expect, test } from "@playwright/test";

test.use({ launchOptions: { args: ["--disable-webgl", "--disable-webgl2", "--disable-3d-apis"] } });

test("without WebGL the hero keeps the pre-rendered still and mounts no canvas", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img.cradle-still")).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.locator("canvas")).toHaveCount(0);
  const loaded = await page
    .locator("img.cradle-still")
    .evaluate((img: HTMLImageElement) => img.naturalWidth > 0);
  expect(loaded).toBe(true);
});
