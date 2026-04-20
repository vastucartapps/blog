import { getPublishedPosts } from "@/lib/content";
import { getAuthor } from "@/lib/authors";
import { SITE_URL } from "@/lib/utils";
import { BRAND } from "@/lib/schema/constants";

export const revalidate = 1800;

// ─────────────────────────────────────────────────────────────────
// JSON Feed 1.1 spec. Leaner than RSS, consumed by modern readers
// (NetNewsWire, Reeder, Feedbin). Served at /feed.json.
// ─────────────────────────────────────────────────────────────────

export async function GET() {
  const posts = getPublishedPosts().slice(0, 50);
  const feedUrl = `${SITE_URL}/feed.json`;

  const items = posts.map((p) => {
    const url = `${SITE_URL}/${p.category}/${p.subcategory}/${p.slug}`;
    const author = getAuthor(p.author_id);
    const ogImage = p.meta.og_image?.startsWith("http")
      ? p.meta.og_image
      : `${SITE_URL}${p.meta.og_image ?? ""}`;
    return {
      id: url,
      url,
      title: p.title,
      summary: p.meta.description ?? p.subtitle,
      content_html: `<p>${p.subtitle ?? p.meta.description ?? ""}</p>`,
      date_published: p.published_at,
      date_modified: p.updated_at,
      authors: author
        ? [
            {
              name: author.name,
              url: `${SITE_URL}/authors/${author.id}`,
            },
          ]
        : [
            {
              name: "VastuCart Editorial",
              url: `${SITE_URL}/authors/vastucart-editorial`,
            },
          ],
      tags: p.tags,
      language: "en-IN",
      ...(ogImage ? { image: ogImage } : {}),
    };
  });

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: BRAND.blogName,
    description: BRAND.blogDescription,
    home_page_url: `${SITE_URL}/`,
    feed_url: feedUrl,
    language: "en-IN",
    icon: `${SITE_URL}/VastuCartLogo.png`,
    favicon: `${SITE_URL}/favicon.ico`,
    authors: [
      {
        name: "Pt. Raghav Sharma",
        url: `${SITE_URL}/authors/pt-raghav-sharma`,
      },
      {
        name: "VastuCart Editorial",
        url: `${SITE_URL}/authors/vastucart-editorial`,
      },
    ],
    items,
  };

  return Response.json(feed, {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
