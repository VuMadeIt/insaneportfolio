import { expect, test } from "@playwright/test";

test("about: statement, timeline with logos, objects with labels, the essay", async ({ page }) => {
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
  // Overlaps are drawn in the chart, not listed again in words.
  await expect(page.getByText("At the same time")).toHaveCount(0);
});

test("inner pages carry the same nav: the four balls home, About, Work, Contact", async ({ page }) => {
  await page.goto("/work");
  const nav = page.getByRole("navigation", { name: "Site" });
  await expect(nav.getByRole("link", { name: "Lucas Vu, home" })).toHaveAttribute("href", "/");
  await expect(nav.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
  await expect(page.locator("footer#contact")).toContainText("lucasvu.work@gmail.com");
});

test("the catalogue: hackathon wins, then selected projects, every row clickable", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("All work");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(["Hackathon wins", "Selected projects"]);
  const rows = page.locator("li.catalogue-row");
  await expect(rows).toHaveCount(14);
  await expect(rows.locator("h3").first()).toHaveText("Ripple");
  await expect(rows.locator("h3").nth(2)).toHaveText("We should go to Japan");
  for (const row of await rows.all()) await expect(row.getByRole("link")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Shufflr" })).toHaveAttribute("href", "/work/shufflr");
  await expect(page.getByRole("link", { name: "Asper" })).toHaveAttribute(
    "href",
    "https://devpost.com/software/asper",
  );
  await expect(page.getByRole("link", { name: "Reboot" })).toHaveAttribute("href", "/work/reboot");
  // The prize opens the description and its object sits beside the title.
  await expect(rows.filter({ hasText: "Reboot" })).toContainText("3rd place at the UofT UDesignathon.");
  await expect(rows.filter({ hasText: "Reboot" }).locator('img[src*="bronze"]')).toHaveCount(1);
  await expect(page.getByText(/My three favourites/)).toHaveCount(0);
});
