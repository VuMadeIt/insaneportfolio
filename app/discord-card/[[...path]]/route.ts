import { SHARE_IMAGE } from "@/content/share";

/**
 * Discord's link preview (PLAN 15.20). Discord animates a GIF image but only plays a video after a
 * click, while X, LinkedIn and Instagram show a GIF's first frame or nothing. So next.config.ts
 * sends only Discord's fetcher here, and it gets the real page with the GIF as its image. The
 * video stays for iMessage, which autoplays it.
 */
export async function GET(request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params;
  const page = new URL(`/${path.join("/")}`, request.url);
  page.search = new URL(request.url).search;
  const res = await fetch(page, { cache: "no-store" });
  const html = await res.text();
  // Case studies preview their own image; only the pages showing the four balls get the GIF.
  const shared = new RegExp(`og:image" content="[^"]*${SHARE_IMAGE.url}"`).test(html);
  return new Response(shared ? html.replaceAll(SHARE_IMAGE.url, "/og/cover.gif") : html, {
    status: res.status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
