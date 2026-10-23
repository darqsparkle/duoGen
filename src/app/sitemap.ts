import type { MetadataRoute } from "next";
import { navLinks, privacyLink, siteConfig } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navLinks.map((link) => ({
      url: new URL(link.href, siteConfig.url).toString(),
      changeFrequency: "monthly" as const,
      priority: link.href === "/" ? 1 : 0.8,
    })),
    { url: new URL(privacyLink.href, siteConfig.url).toString(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
