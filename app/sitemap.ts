import type { MetadataRoute } from "next";
import { identities } from "@/content/identities";
import { projects } from "@/content/projects";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/work",
    "/about",
    ...identities.map((i) => `/${i.slug}`),
    ...projects.filter((p) => p.caseStudy).map((p) => `/work/${p.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
