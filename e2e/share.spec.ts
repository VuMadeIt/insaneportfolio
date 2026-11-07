import { expect, test } from "@playwright/test";

const DISCORD = "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)";
const ogImage = (html: string) => /property="og:image" content="([^"]*)"/.exec(html)?.[1];

test("link previews: Discord gets the animated GIF, every other app the still and the video", async ({
  request,
}) => {
  const page = await (await request.get("/")).text();
  expect(ogImage(page)).toMatch(/\/og\/balls\.jpg$/);
  expect(page).toMatch(/property="og:video" content="[^"]*\/og\/cover\.mp4"/);

  const discord = await request.get("/about", { headers: { "user-agent": DISCORD } });
  expect(discord.status()).toBe(200);
  const html = await discord.text();
  expect(ogImage(html)).toMatch(/\/og\/cover\.gif$/);
  expect(html).toContain("About | Lucas Vu");
  expect(html).not.toContain("/og/balls.jpg");

  const gif = await request.get("/og/cover.gif", { headers: { "user-agent": DISCORD } });
  expect(gif.headers()["content-type"]).toBe("image/gif");

  // A case study keeps its own image.
  const ripple = await (await request.get("/work/ripple", { headers: { "user-agent": DISCORD } })).text();
  expect(ogImage(ripple)).toMatch(/\/media\/ripple\//);
});
