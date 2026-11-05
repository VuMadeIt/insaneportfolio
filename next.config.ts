import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The lab renders the fallback stills from the dev server; the badge must not end up in them.
  devIndicators: false,
  turbopack: { root: import.meta.dirname },
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
