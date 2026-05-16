// Sitemap index — references main + image sitemaps so search engines
// can discover both from a single entry point.
//
// `sitemap-news.xml` is intentionally NOT advertised here. The blog
// publishes long-form articles (monthly cadence), not news-cadence
// breaking content. Empty Google News sitemaps trigger GSC errors —
// the audit found exactly this: sitemap-news.xml had 1 GSC error
// because `buildNewsSitemap()` returned 0 entries (no posts in the
// last 48h). The route itself still exists for direct access, but
// it is no longer surfaced via the index.

import { SITE_URL } from "@/lib/utils";
import { buildNewsSitemap } from "@/lib/sitemap-builder";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();

  // Only advertise the news sitemap when it has at least one entry.
  // Google's news sitemap validator rejects empty <urlset>s.
  const newsItems = buildNewsSitemap();
  const includeNews = newsItems.length > 0;

  const parts: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    `  <sitemap>`,
    `    <loc>${SITE_URL}/sitemap.xml</loc>`,
    `    <lastmod>${now}</lastmod>`,
    `  </sitemap>`,
    `  <sitemap>`,
    `    <loc>${SITE_URL}/sitemap-image.xml</loc>`,
    `    <lastmod>${now}</lastmod>`,
    `  </sitemap>`,
  ];
  if (includeNews) {
    parts.push(
      `  <sitemap>`,
      `    <loc>${SITE_URL}/sitemap-news.xml</loc>`,
      `    <lastmod>${now}</lastmod>`,
      `  </sitemap>`,
    );
  }
  parts.push(`</sitemapindex>`, ``);

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
