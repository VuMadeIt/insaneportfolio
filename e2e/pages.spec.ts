import { expect, test } from "@playwright/test";

test("about is a museum room: statement, timeline with logos, objects with labels, the essay", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(page.getByRole("heading", { name: "Chronology" })).toBeVisible();
  await expect(page.locator(".timeline-stop")).toHaveCount(8);
  await expect(page.locator(".timeline-stop img")).toHaveCount(8);
  await expect(page.locator(".timeline-stop").last()).toContainText("Digital Extremes");
  await expect(page.locator("figure[id]")).toHaveCount(6);
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

test("the timeline slides sideways as the page scrolls down", async ({ page }) => {
  await page.goto("/about");
  const track = page.locator(".timeline-stop").first();
  const x0 = (await track.boundingBox())!.x;
  await page
    .locator("#chronology-title")
    .evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + 600));
  await expect.poll(async () => (await track.boundingBox())!.x, { timeout: 5000 }).toBeLessThan(x0 - 200);
});

test("inner pages have a small Back to Site link and no logo nav", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("link", { name: "Back to Site" })).toHaveAttribute("href", "/");
  await expect(page.getByAltText("i am vu")).toHaveCount(0);
});

test("the catalogue: top three first, every project listed and clickable", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("All work");
  const rows = page.locator("li.catalogue-row");
  await expect(rows).toHaveCount(12);
  await expect(rows.locator("h2").first()).toHaveText("Ripple");
  await expect(rows.locator("h2").nth(2)).toHaveText("We should go to Japan");
  for (const row of await rows.all()) await expect(row.getByRole("link")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Shufflr" })).toHaveAttribute("href", "/work/shufflr");
  await expect(page.getByRole("link", { name: "Asper" })).toHaveAttribute(
    "href",
    "https://devpost.com/software/asper",
  );
  await expect(page.getByRole("link", { name: "Reboot" })).toHaveAttribute(
    "href",
    "https://lucasvu.framer.website/projects/reboot",
  );
  await expect(rows.filter({ hasText: "Reboot" })).toContainText("3rd place");
  expect(await rows.locator("video").count()).toBe(12);
});
