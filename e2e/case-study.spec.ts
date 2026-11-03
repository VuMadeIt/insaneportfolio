import { expect, test } from "@playwright/test";

for (const [slug, title, next] of [
  ["shufflr", "Shufflr", "Ripple"],
  ["ripple", "Ripple", "Maple Leaf Foods"],
  ["maple-leaf-foods", "Maple Leaf Foods", "Shufflr"],
] as const) {
  test(`${title} case study: title, wall label, claim headlines, next exhibit`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page).toHaveTitle(`${title} | Lucas Vu`);
    await expect(page.getByText("Role", { exact: true })).toBeVisible();
    expect(await page.getByRole("heading", { level: 2 }).count()).toBeGreaterThan(0);
    await expect(page.getByRole("link", { name: new RegExp(`^Next exhibit ${next}`) })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "work" }),
    ).toBeVisible();
  });
}

test("Warframe has no case study page", async ({ page }) => {
  const res = await page.goto("/work/warframe");
  expect(res?.status()).toBe(404);
});

test("coded visuals: counters land on the real number, the prototype video follows the scroll", async ({
  page,
}) => {
  await page.goto("/work/shufflr");
  const stat = page.getByLabel("56%");
  await stat.scrollIntoViewIfNeeded();
  await expect(stat).toHaveText("56%", { timeout: 5000 });
  const video = page.locator('video[aria-label^="The shuffle prototype"]');
  await video.scrollIntoViewIfNeeded();
  const at = () => video.evaluate((v) => (v as HTMLVideoElement).currentTime);
  await expect.poll(at, { timeout: 8000 }).toBeGreaterThan(0);
  const before = await at();
  await page.mouse.wheel(0, 400);
  await expect.poll(at, { timeout: 5000 }).toBeGreaterThan(before);
});

test("the Figma prototype loads only when asked", async ({ page }) => {
  await page.goto("/work/ripple");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Open the prototype" }).click();
  await expect(page.locator('iframe[title="Ripple prototype in Figma"]')).toHaveCount(1);
});
