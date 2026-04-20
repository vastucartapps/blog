import { getPublishedPosts } from "@/lib/content";
import { getAuthor } from "@/lib/authors";
import { getCategory } from "@/lib/categories";
import { SITE_URL } from "@/lib/utils";
import { BRAND } from "@/lib/schema/constants";

export const revalidate = 1800; // 30 minutes

// ─────────────────────────────────────────────────────────────────
// RSS 2.0 feed with Atom self-link, Dublin Core creator, and
// content:encoded for full-text clients. Served at /feed.xml.
// Discovered via <link rel="alternate" type="application/rss+xml">
// emitted from app/layout.tsx.
// ─────────────────────────────────────────────────────────────────

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCdata(text: string): string {
  // CDATA cannot contain `]]>`; split if it does.
  return text.replace(/\]\]>/g, "]]]]><![CDATA[>");
}

export async function GET() {
  const posts = getPublishedPosts().slice(0, 50);
  const feedUrl = `${SITE_URL}/feed.xml`;
  const now = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/${p.category}/${p.subcategory}/${p.slug}`;
      const author = getAuthor(p.author_id);
      const cat = getCategory(p.category);
      const pubDate = new Date(p.published_at).toUTCString();
      const description = p.meta.description ?? p.subtitle ?? "";
      const ogImage = p.meta.og_image?.startsWith("http")
        ? p.meta.og_image
        : `${SITE_URL}${p.meta.og_image ?? ""}`;
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeCdata(description)}]]></description>
      <dc:creator><![CDATA[${escapeCdata(author?.name ?? "VastuCart Editorial")}]]></dc:creator>
      <category>${escapeXml(cat?.label ?? p.category)}</category>
      ${
        ogImage
          ? `<enclosure url="${escapeXml(ogImage)}" type="image/png" />`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(BRAND.blogName)}</title>
    <link>${SITE_URL}/</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(BRAND.blogDescription)}</description>
    <language>en-IN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>VastuCart Blog feed engine</generator>
    <image>
      <url>${SITE_URL}/VastuCartLogo.png</url>
      <title>${escapeXml(BRAND.blogName)}</title>
      <link>${SITE_URL}/</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
