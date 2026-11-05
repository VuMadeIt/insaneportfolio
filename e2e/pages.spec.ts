import { expect, test } from "@playwright/test";

test("about is a museum room: statement, timeline with logos, objects with labels, the essay", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(page.getByRole("heading", { name: "Chronology" })).toBeVisible();
  await expect(page.locator(".timeline-stop")).toHaveCount(8);
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

test("the timeline: one section per role, the ball moves along the axis as the page scrolls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  const stage = page.locator("li.timeline-stop[aria-current='step']");
  await expect(stage).toContainText("The Local Charity");
  await page.locator("#chronology-title").evaluate((el) => {
    const s = el.closest("section")!;
    window.scrollTo(0, s.getBoundingClientRect().top + scrollY + s.offsetHeight - innerHeight);
  });
  await expect(stage).toContainText("Digital Extremes", { timeout: 5000 });
  // Overlaps are shown: Digital Extremes runs alongside Waterloo and Hackathons North America.
  await expect(stage).toContainText("At the same time");
});

test("inner pages carry the site nav and no logo image", async ({ page }) => {
  await page.goto("/work");
  await expect(
    page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "lucas vu" }),
  ).toHaveAttribute("href", "/");
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
  // Title, accolades, description and month only: no meta line.
  await expect(rows.filter({ hasText: "Case study" })).toHaveCount(0);
});
