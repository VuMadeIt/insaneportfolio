import { expect, test } from "@playwright/test";

test("about is a museum room: statement, chronology, objects with labels, the essay", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(page.getByRole("heading", { name: "Chronology" })).toBeVisible();
  await expect(page.getByText("Hackathons North America")).toBeVisible();
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(6);
  await expect(
    page.getByRole("heading", { name: "Why I'm finally ready to call myself a designer" }),
  ).toBeVisible();
  const broken = await page.locator("main img").evaluateAll((imgs) =>
    Promise.all(
      imgs.map(async (img) => {
        const i = img as HTMLImageElement;
        i.loading = "eager";
        await i.decode().catch(() => {});
        return i.naturalWidth === 0 ? i.src : null;
      }),
    ),
  );
  expect(broken.filter(Boolean)).toEqual([]);
});

test("the catalogue lists every project and links case studies", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("All work");
  await expect(page.locator("li.catalogue-row")).toHaveCount(11);
  await expect(page.getByRole("link", { name: "Shufflr" })).toHaveAttribute("href", "/work/shufflr");
  await expect(page.getByRole("link", { name: "Asper" })).toHaveAttribute(
    "href",
    "https://devpost.com/software/asper",
  );
});
