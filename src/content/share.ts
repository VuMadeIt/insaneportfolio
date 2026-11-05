/**
 * The link preview (PLAN 15.14): one of the cradle's balls swinging in and out of frame, filmed
 * from the real scene by scripts/og.mjs. iMessage plays the video looping and muted; Discord shows
 * it with a play button; everywhere else (X, Slack, LinkedIn, WhatsApp) shows the still.
 */
/** Link previews need absolute URLs: the site's own, else Vercel's production domain. */
export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
// Next resolves image URLs against metadataBase but not video ones.
const video = new URL("/og/cover.mp4", SITE).href;

export const SHARE_IMAGE = {
  url: "/og/cover.jpg",
  width: 1200,
  height: 630,
  alt: "A dark metal ball from a Newton's cradle swinging on a fine string",
};

export const SHARE_VIDEO = {
  url: video,
  secureUrl: video,
  type: "video/mp4",
  width: 1200,
  height: 630,
};

/** Spread into a page's `openGraph` (Next replaces the whole object, so pages must repeat it). */
export const shareGraph = {
  siteName: "Lucas Vu",
  type: "website" as const,
  images: [SHARE_IMAGE],
  videos: [SHARE_VIDEO],
};
