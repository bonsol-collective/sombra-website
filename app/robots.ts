import type { MetadataRoute } from "next";

/**
 * Generates /robots.txt at build time. Allows all crawlers and points
 * them at the sitemap for faster indexing on DevNet-beta launch.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://sombra.tech/sitemap.xml",
    host: "https://sombra.tech",
  };
}
