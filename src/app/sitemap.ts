import type { MetadataRoute } from "next";
import { navLinks, siteConfig } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map((link) => ({
    url: new URL(link.href, siteConfig.url).toString(),
    changeFrequency: "monthly",
    priority: link.href === "/" ? 1 : 0.8,
  }));
}
