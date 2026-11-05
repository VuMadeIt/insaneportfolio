import { expect, test } from "@playwright/test";

const WALL = [0xf7, 0xf0, 0xdf];

test.describe("hero with WebGL", () => {
  test("the canvas edges blend invisibly into the page wall", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator(".hero-frame canvas")).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(6000);
    const shot = (await page.screenshot()).toString("base64");
    // Points along the canvas edges, away from the corner text and the giant name.
    const points = [
      [4, 300],
      [1435, 300],
      [720, 3],
      [300, 450],
      [1140, 450],
      [4, 520],
      [1435, 520],
    ];
    // Decode the screenshot in the browser (no image library needed) and read the pixels.
    const pixels = await page.evaluate(
      async ({ shot, points }) => {
        const img = new Image();
        img.src = `data:image/png;base64,${shot}`;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        return points.map(([x, y]) => Array.from(ctx.getImageData(x!, y!, 1, 1).data.slice(0, 3)));
      },
      { shot, points },
    );
    pixels.forEach((rgb, p) =>
      rgb.forEach((c, k) =>
        expect(Math.abs(c - WALL[k]!), `pixel ${points[p]} = ${rgb}`).toBeLessThanOrEqual(2),
      ),
    );
  });
});
