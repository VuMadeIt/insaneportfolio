import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A second production build (the lab, LAB=1) can live beside the main one.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // The lab renders the fallback stills from the dev server; the badge must not end up in them.
  devIndicators: false,
  turbopack: { root: import.meta.dirname },
  images: { formats: ["image/avif", "image/webp"] },
  // Discord's link fetcher gets every page with the animated GIF as its preview (app/discord-card).
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path((?!_next/|discord-card)[^.]*)",
          has: [{ type: "header", key: "user-agent", value: ".*Discordbot.*" }],
          destination: "/discord-card/:path",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
