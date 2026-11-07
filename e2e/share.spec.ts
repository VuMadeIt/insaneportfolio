import { expect, test } from "@playwright/test";

const ogImage = (html: string) => /property="og:image" content="([^"]*)"/.exec(html)?.[1];

test("link previews: every app gets balls.jpg, with no video", async ({ request }) => {
  for (const agent of ["Mozilla/5.0", "Mozilla/5.0 (compatible; Discordbot/2.0)", "Twitterbot/1.0"]) {
    const html = await (await request.get("/", { headers: { "user-agent": agent } })).text();
    expect(ogImage(html)).toMatch(/\/og\/balls\.jpg$/);
    expect(html).toMatch(/name="twitter:image" content="[^"]*\/og\/balls\.jpg"/);
    expect(html).not.toContain('property="og:video');
  }
});
