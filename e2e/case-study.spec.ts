import { expect, test } from "@playwright/test";

for (const [slug, title, next] of [
  ["shufflr", "Shufflr", "Ripple"],
  ["ripple", "Ripple", "Maple Leaf Foods"],
  ["maple-leaf-foods", "Maple Leaf Foods", "Warframe"],
  ["warframe", "Warframe", "Shufflr"],
] as const) {
  test(`${title} case study: title, wall label, claim headlines, next exhibit`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} | Lucas Vu`);
    await expect(page.getByText("Role", { exact: true })).toBeVisible();
    expect(await page.getByRole("heading", { level: 2 }).count()).toBeGreaterThan(0);
    await expect(page.getByRole("link", { name: new RegExp(`^${next}.*Next exhibit`) })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "work" }),
    ).toBeVisible();
  });
}

test("Warframe invites a conversation instead of inventing content", async ({ page }) => {
  await page.goto("/work/warframe");
  await expect(page.getByRole("link", { name: /Ask me about it/ })).toHaveAttribute(
    "href",
    /^mailto:lucasvu\.work@gmail\.com/,
  );
});
