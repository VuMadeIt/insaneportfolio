/**
 * The link preview (PLAN 15.14): one of the cradle's balls swinging in and out of frame, filmed
 * from the real scene by scripts/og.mjs. iMessage plays the video looping and muted; Discord shows
 * it with a play button; everywhere else (X, Slack, LinkedIn, WhatsApp) shows the still.
 */
export const SHARE_IMAGE = {
  url: "/og/cover.jpg",
  width: 1200,
  height: 630,
  alt: "A dark metal ball from a Newton's cradle swinging on a fine string",
};

export const SHARE_VIDEO = {
  url: "/og/cover.mp4",
  secureUrl: "/og/cover.mp4",
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
