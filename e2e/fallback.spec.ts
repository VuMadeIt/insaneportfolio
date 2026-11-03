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

test("without WebGL the same four doors open the same stories as plain HTML", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Identities" });
  await expect(nav.getByRole("link")).toHaveCount(4);
  await nav.getByRole("link", { name: /^Experiments:/ }).click();
  await expect(page).toHaveURL(/\/experiments$/);
  await expect(page.getByRole("heading", { level: 2, name: "Experiments" })).toBeVisible();
});
