import { expect, test } from "@playwright/test";

test("the lab is not reachable in a normal production build", async ({ page }) => {
  const response = await page.goto("/lab/physics");
  expect(response?.status()).toBe(404);
});
