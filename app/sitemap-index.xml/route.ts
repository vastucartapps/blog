// Sitemap index — references main, news, and image sitemaps so
// search engines can discover all three from a single entry point.

import { SITE_URL } from "@/lib/utils";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <sitemap>\n` +
    `    <loc>${SITE_URL}/sitemap.xml</loc>\n` +
    `    <lastmod>${now}</lastmod>\n` +
    `  </sitemap>\n` +
    `  <sitemap>\n` +
    `    <loc>${SITE_URL}/sitemap-news.xml</loc>\n` +
    `    <lastmod>${now}</lastmod>\n` +
    `  </sitemap>\n` +
    `  <sitemap>\n` +
    `    <loc>${SITE_URL}/sitemap-image.xml</loc>\n` +
    `    <lastmod>${now}</lastmod>\n` +
    `  </sitemap>\n` +
    `</sitemapindex>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
