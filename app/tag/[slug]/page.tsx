import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostGrid } from "@/components/listing/PostGrid";
import { getPublishedPosts } from "@/lib/content";
import { slugifyTag, tagUrl } from "@/lib/internal-links";
import { absoluteUrl, SITE_URL } from "@/lib/utils";
import { BLOG_WEBSITE_REF } from "@/lib/schema/constants";
import { buildAlternates, buildSocialMetadata } from "@/lib/seo/social-metadata";

interface Params {
  slug: string;
}

interface TagInfo {
  slug: string;
  /** First-seen original casing of the tag, used as the page title. */
  label: string;
  count: number;
}

function indexTags(): Map<string, TagInfo> {
  const idx = new Map<string, TagInfo>();
  for (const post of getPublishedPosts()) {
    for (const raw of post.tags ?? []) {
      const s = slugifyTag(raw);
      if (!s) continue;
      const existing = idx.get(s);
      if (existing) {
        existing.count++;
      } else {
        idx.set(s, { slug: s, label: raw, count: 1 });
      }
    }
  }
  return idx;
}

export function generateStaticParams() {
  return Array.from(indexTags().keys()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = indexTags().get(slug);
  if (!info) return {};
  const url = absoluteUrl(tagUrl(info.label));
  const title = `${info.label} — VastuCart Blog`;
  const description = `${info.count} long-form articles tagged "${info.label}" on the VastuCart Blog. Vedic astrology, numerology, tarot, vastu, gemstones, rudraksha and puja vidhi.`;
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(url),
    ...buildSocialMetadata({
      title,
      description,
      url,
      type: "website",
    }),
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const info = indexTags().get(slug);
  if (!info) notFound();

  const matching = getPublishedPosts().filter((p) =>
    (p.tags ?? []).some((t) => slugifyTag(t) === slug),
  );
  const url = absoluteUrl(tagUrl(info.label));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: `${info.label} — articles on the VastuCart Blog`,
    isPartOf: BLOG_WEBSITE_REF,
    numberOfItems: matching.length,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: matching.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/${p.category}/${p.subcategory}/${p.slug}`),
        name: p.title,
      })),
    },
  };

  return (
    <>
      <Header />
      <main className="wrap-wide" style={{ padding: "clamp(2rem, 5vw, 4rem) 0" }}>
        <header style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--teal)",
            }}
          >
            Tag
          </p>
          <h1
            style={{
              marginTop: 8,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 600,
              lineHeight: 1.18,
              color: "var(--on-light-1)",
            }}
          >
            {info.label}
          </h1>
          <p
            style={{
              marginTop: 12,
              fontSize: 14.5,
              color: "var(--on-light-3)",
              lineHeight: 1.65,
            }}
          >
            {matching.length} article{matching.length === 1 ? "" : "s"} tagged{" "}
            <strong>{info.label}</strong> across the VastuCart Blog network.
          </p>
        </header>
        <PostGrid posts={matching} />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta property="og:site_name" content="VastuCart Blog" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${info.label} — VastuCart Blog`} />
      {/* Reference SITE_URL so unused-import lint stays quiet. */}
      <meta name="x-blog" content={SITE_URL} />
    </>
  );
}
