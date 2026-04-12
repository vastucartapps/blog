// Google Image sitemap — every in-body image referenced by an
// image_manifest entry on every published post.
// Schema: https://www.google.com/schemas/sitemap-image/1.1
//
// Image search ranks each image as its own search result, so this
// sitemap multiplies the indexable surface significantly.

import { buildImageSitemap } from "@/lib/sitemap-builder";

export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = buildImageSitemap();

  // Group by page URL — Google image sitemap allows multiple
  // <image:image> blocks under a single <url>.
  const grouped = new Map<string, typeof items>();
  for (const it of items) {
    if (!grouped.has(it.page_url)) grouped.set(it.page_url, []);
    grouped.get(it.page_url)!.push(it);
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    Array.from(grouped.entries())
      .map(
        ([pageUrl, imgs]) =>
          `  <url>\n` +
          `    <loc>${escapeXml(pageUrl)}</loc>\n` +
          imgs
            .map(
              (img) =>
                `    <image:image>\n` +
                `      <image:loc>${escapeXml(img.image_url)}</image:loc>\n` +
                `      <image:title>${escapeXml(img.title)}</image:title>\n` +
                `      <image:caption>${escapeXml(img.caption)}</image:caption>\n` +
                `      <image:license>https://vastucart.in/license</image:license>\n` +
                `    </image:image>`
            )
            .join("\n") +
          `\n  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
