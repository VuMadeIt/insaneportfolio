/** Link previews need absolute URLs: the site's own, else Vercel's production domain. */
export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/**
 * The link preview in every app (PLAN 15.21): the four balls hanging, Lucas's render (PLAN 15.18).
 * No video or GIF: only iMessage and Discord would play one.
 */
export const SHARE_IMAGE = {
  url: "/og/balls.jpg",
  width: 1200,
  height: 630,
  alt: "The four dark metal balls of a Newton's cradle hanging on fine strings",
};

/** Spread into a page's `openGraph` (Next replaces the whole object, so pages must repeat it). */
export const shareGraph = {
  siteName: "Lucas Vu",
  type: "website" as const,
  images: [SHARE_IMAGE],
};
