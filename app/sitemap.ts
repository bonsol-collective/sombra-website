import type { MetadataRoute } from "next";

/**
 * Generates /sitemap.xml at build time. Single-page marketing site today;
 * whitepaper is the only additional indexable asset.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://sombra.tech",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://sombra.tech/whitepaper.pdf",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
