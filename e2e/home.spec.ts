import { expect, test } from "@playwright/test";

test("home shows the corner lines and the name", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("I like getting things moving.")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Lucas Vu/);
});

test("[more] opens a short intro dialog that links to About", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "[more]" }).click();
  const dialog = page.getByRole("dialog", { name: "Lucas Vu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /About me/ })).toHaveAttribute("href", "/about");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
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
