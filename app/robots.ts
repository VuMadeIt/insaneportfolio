import type { MetadataRoute } from "next";
import { SITE } from "@/content/share";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/lab" }, sitemap: `${SITE}/sitemap.xml` };
}
