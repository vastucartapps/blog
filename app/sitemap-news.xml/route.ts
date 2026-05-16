// Google News sitemap — posts published in the last 48 hours.
// Schema: https://www.google.com/schemas/sitemap-news/0.9
//
// Crawled by Googlebot-News for inclusion in Top stories carousels
// and Google News surface. Posts older than 48h drop out.
//
// When zero recent posts exist, this route returns HTTP 404. Empty
// `<urlset>` was previously the cause of GSC's recurring "1 error" on
// this sitemap. A 404 lets Google's sitemap parser drop the URL
// cleanly until news-cadence content is published again. The
// `sitemap-index.xml` route also conditionally omits this child when
// `buildNewsSitemap()` is empty.

import { buildNewsSitemap } from "@/lib/sitemap-builder";

export const revalidate = 600; // 10 minutes — news cadence

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = buildNewsSitemap();

  if (items.length === 0) {
    // No news-eligible posts (none published in the last 48h). Return
    // 404 so Google removes this sitemap from its registry rather than
    // flagging an empty-sitemap error.
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=600, must-revalidate",
      },
    });
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n` +
    items
      .map(
        (item) =>
          `  <url>\n` +
          `    <loc>${escapeXml(item.url)}</loc>\n` +
          `    <news:news>\n` +
          `      <news:publication>\n` +
          `        <news:name>VastuCart Blog</news:name>\n` +
          `        <news:language>en</news:language>\n` +
          `      </news:publication>\n` +
          `      <news:publication_date>${escapeXml(item.publication_date)}</news:publication_date>\n` +
          `      <news:title>${escapeXml(item.title)}</news:title>\n` +
          `      <news:keywords>${escapeXml(item.keywords)}</news:keywords>\n` +
          `    </news:news>\n` +
          `  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, must-revalidate",
    },
  });
}
