import { type Page, expect } from "@playwright/test";

/**
 * The home page with the cradle hanging still. A plain load swings People in and the cradle goes
 * on clacking for minutes; a deep link to a story skips that arrival, and Escape lowers the balls.
 */
export async function calmHome(page: Page) {
  await page.goto("/people");
  await expect(page.locator(".hero-frame canvas")).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(2000);
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/$/);
  await page.waitForTimeout(4000);
}
