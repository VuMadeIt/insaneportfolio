import { expect, test } from "@playwright/test";

test("home shows the corner lines and the name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("I like getting things moving.")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Lucas Vu/);
});
