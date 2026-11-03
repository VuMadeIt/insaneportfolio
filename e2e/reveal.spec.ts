import { expect, test } from "@playwright/test";

/** Mean colour of a square region of the page, decoded in the browser from a screenshot. */
async function meanColour(page: import("@playwright/test").Page, x: number, y: number, size: number) {
  const shot = (
    await page.screenshot({ clip: { x: x - size / 2, y: y - size / 2, width: size, height: size } })
  ).toString("base64");
  return page.evaluate(async (data) => {
    const img = new Image();
    img.src = `data:image/png;base64,${data}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(0, 0, c.width, c.height).data;
    const sum = [0, 0, 0];
    for (let i = 0; i < px.length; i += 4) for (let k = 0; k < 3; k++) sum[k]! += px[i + k]!;
    return sum.map((s) => s / (px.length / 4));
  }, shot);
}

test("hovering a ball reveals its identity, leaving it restores the chrome", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".hero-frame canvas")).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(4000);
  const box = (await page.getByRole("button", { name: /^People:/ }).boundingBox())!;
  const [cx, cy] = [box.x + box.width / 2, box.y + box.height / 2];
  const chrome = await meanColour(page, cx, cy, 40);
  await page.mouse.move(cx, cy);
  await page.waitForTimeout(1500);
  const eye = await meanColour(page, cx, cy, 40);
  // The iris is saturated colour around a black pupil; chrome here is grey.
  const spread = (c: number[]) => Math.max(...c) - Math.min(...c);
  expect(spread(eye)).toBeGreaterThan(spread(chrome) + 8);
  await page.mouse.move(20, 880);
  await page.waitForTimeout(1500);
  const back = await meanColour(page, cx, cy, 40);
  back.forEach((c, k) => expect(Math.abs(c - chrome[k]!)).toBeLessThan(12));
});
