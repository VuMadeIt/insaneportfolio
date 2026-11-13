import type { NextConfig } from "next";
import { PN_MEDIA } from "./src/content/caseStudies/mediaRev";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A second production build (the lab, LAB=1) can live beside the main one.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // The lab renders the fallback stills from the dev server; the badge must not end up in them.
  devIndicators: false,
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
    // Local images take no query, except the Passion Nails media's revision (re-shot under the same names).
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/media/passion-nails/**", search: PN_MEDIA },
    ],
  },
};

export default nextConfig;
