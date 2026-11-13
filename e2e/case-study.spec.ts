import { expect, test } from "@playwright/test";

for (const [slug, title, next] of [
  ["shufflr", "Shufflr", "Ripple"],
  ["ripple", "Ripple", "Maple Leaf Foods"],
  ["reboot", "Reboot", "Passion Nails"],
  ["maple-leaf-foods", "Maple Leaf Foods", "Reboot"],
  ["passion-nails", "Passion Nails", "Shufflr"],
] as const) {
  test(`${title} case study: title, no date above it, claim headlines, next project`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator("article header p").first()).not.toHaveText(/^\d{4}$/);
    await expect(page).toHaveTitle(`${title} | Lucas Vu`);
    await expect(page.getByText("Role", { exact: true })).toBeVisible();
    expect(await page.getByRole("heading", { level: 2 }).count()).toBeGreaterThan(0);
    await expect(page.getByRole("link", { name: new RegExp(`^Next project ${next}`) })).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Work" }),
    ).toHaveAttribute("href", "/work");
  });
}

test("every diagram arrow runs from a box into a box, pointing at it, on desktop and phone", async ({
  page,
}) => {
  // Reduced motion: every diagram rests finished, so boxes are not mid-rise when measured.
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of ["ripple", "shufflr", "passion-nails"]) {
      await page.goto(`/work/${slug}`);
      // Wires are measured after hydration.
      await expect(page.locator("path.dg-wire").first()).toBeAttached();
      const misses = await page.locator(".dg").evaluateAll((dgs) =>
        dgs.flatMap((dg) => {
          // Boxes, and the stacked groups that arrows may also join (a path, a merge's sources).
          const boxes = [...dg.querySelectorAll(".dg-node:not(span)")].map((n) => n.getBoundingClientRect());
          return [...dg.querySelectorAll("path.dg-wire")].flatMap((p) => {
            const path = p as SVGPathElement;
            const svg = path.ownerSVGElement!.getBoundingClientRect();
            const len = path.getTotalLength();
            const at = (l: number) => {
              const pt = path.getPointAtLength(l);
              return { x: svg.left + pt.x, y: svg.top + pt.y };
            };
            const gap = (pt: { x: number; y: number }, r: DOMRect) =>
              Math.hypot(
                Math.max(r.left - pt.x, 0, pt.x - r.right),
                Math.max(r.top - pt.y, 0, pt.y - r.bottom),
              );
            const [start, end, before] = [at(0), at(len), at(Math.max(0, len - 4))];
            // Tips stop just short of their box; a group the arrow runs inside is not its target.
            const target = boxes.find((r) => gap(end, r) > 0 && gap(end, r) <= 10);
            const ok =
              boxes.some((r) => gap(start, r) <= 2) && target && gap(before, target) > gap(end, target);
            return ok ? [] : [path.getAttribute("d")];
          });
        }),
      );
      expect(misses, `${slug} @${width}`).toEqual([]);
    }
  }
});

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

test("a switch cross-fades its screens and says what changed", async ({ page }) => {
  await page.goto("/work/passion-nails");
  const lang = page.getByRole("group", { name: "Language", exact: true });
  await lang.scrollIntoViewIfNeeded();
  const vi = page.getByRole("img", { name: "Today's appointments in Vietnamese" });
  const en = page.getByRole("img", { name: "Today's appointments in English" });
  await expect(vi).toBeVisible();
  await expect(en).toBeHidden(); // aria-hidden while its option is off
  await lang.getByRole("button", { name: "English" }).click();
  await expect(lang.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
  await expect(en).toBeVisible();
  await expect(page.getByText(/^The same screens in English/)).toBeVisible();
});

test("a film plays in view, pauses on request and stays paused, and seeks to a moment", async ({ page }) => {
  await page.goto("/work/passion-nails");
  const film = page.locator('video[aria-label^="A tech adds a walk-in"]');
  await film.scrollIntoViewIfNeeded();
  const paused = () => film.evaluate((v) => (v as HTMLVideoElement).paused);
  await expect.poll(paused, { timeout: 8000 }).toBe(false);
  const controls = film.locator("xpath=ancestor::figure[1]");
  await controls.getByRole("button", { name: "Pause" }).click();
  await expect.poll(paused).toBe(true);
  await page.mouse.wheel(0, 400);
  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(600);
  expect(await paused()).toBe(true); // coming back into view does not override the pause
  await controls.getByRole("slider", { name: "Seek" }).fill("10");
  await expect.poll(() => film.evaluate((v) => Math.round((v as HTMLVideoElement).currentTime))).toBe(10);
});

test("a Vietnamese word shows its English on focus, and screen readers get it inline", async ({ page }) => {
  await page.goto("/work/passion-nails");
  const word = page.locator(".gloss", { hasText: "muộn" }).first();
  await word.scrollIntoViewIfNeeded();
  await expect(word).toHaveAttribute("data-en", "late");
  await expect(word).toContainText("(late)"); // the sr-only copy
  await word.focus();
  await expect.poll(() => word.evaluate((el) => getComputedStyle(el, "::after").opacity)).toBe("1");
});

test("one Tiếng Việt / English tap switches every staff screen on the page", async ({ page }) => {
  await page.goto("/work/passion-nails");
  const tabs = page.getByRole("group", { name: "Screen language" });
  await expect(tabs.first().getByRole("button", { name: "Tiếng Việt" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const walkIn = page.locator('video[aria-label^="A tech adds a walk-in"]');
  await expect(walkIn).toHaveAttribute("src", /staff\.mp4/);
  await tabs.nth(2).scrollIntoViewIfNeeded();
  await tabs.nth(2).getByRole("button", { name: "English" }).click();
  for (const g of await tabs.all())
    await expect(g.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
  await expect(walkIn).toHaveAttribute("src", /staff-en\.mp4/);
  await expect(
    page.getByRole("img", { name: "The first build's day, with five tabs, in English" }),
  ).toBeVisible();
});

test("on a phone a diagram zooms full screen, and films offer full screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work/passion-nails");
  const fig = page.locator("#anyone");
  await fig.getByRole("button", { name: "Zoom in" }).scrollIntoViewIfNeeded();
  await fig.getByRole("button", { name: "Zoom in" }).click();
  const dlg = page.getByRole("dialog", { name: /Any staff/ });
  await expect(dlg).toBeVisible();
  await expect(dlg.getByText("Fewest booked minutes today")).toBeVisible();
  await dlg.getByRole("button", { name: "Zoom in" }).click();
  await dlg.getByRole("button", { name: "Close" }).click();
  await expect(dlg).toBeHidden();
  await expect(page.locator("#walk-in").getByRole("button", { name: "Full screen" })).toBeVisible();
});

test("the design system's measurements can be hidden and shown again", async ({ page }) => {
  await page.goto("/work/passion-nails");
  const sys = page.locator("#system");
  const toggle = sys.getByRole("button", { name: "Hide measurements" });
  await toggle.scrollIntoViewIfNeeded();
  await expect(sys.getByText("Radius 999")).toBeVisible();
  await toggle.click();
  await expect(sys.getByText("Radius 999")).toHaveCount(0);
  await sys.getByRole("button", { name: "Show measurements" }).click();
  await expect(sys.getByText("Radius 999")).toBeVisible();
});
