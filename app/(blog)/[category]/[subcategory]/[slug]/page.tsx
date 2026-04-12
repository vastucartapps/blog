import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostHero } from "@/components/post/PostHero";
import { LagnaPillarHero } from "@/components/post/LagnaPillarHero";
import { BlockRenderer } from "@/components/post/BlockRenderer";
import { getCategory, getSubcategory } from "@/lib/categories";
import { getPostBySlug, getPublishedPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";
import { buildPostSchema } from "@/lib/schema-builder";
import { LAGNA_LABELS, type LagnaSlug } from "@/lib/internal-links";

interface Params {
  category: string;
  subcategory: string;
  slug: string;
}

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({
    category: p.category,
    subcategory: p.subcategory,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = absoluteUrl(`/${post.category}/${post.subcategory}/${post.slug}`);
  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: post.meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.meta.og_title ?? post.meta.title,
      description: post.meta.og_description ?? post.meta.description,
      url,
      images: [{ url: post.meta.og_image }],
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [absoluteUrl(`/authors/${post.author_id}`)],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.og_title ?? post.meta.title,
      description: post.meta.og_description ?? post.meta.description,
      images: [post.meta.og_image],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const cat = getCategory(post.category);
  const sub = getSubcategory(post.category, post.subcategory);
  if (!cat || !sub) notFound();

  const breadcrumb = [
    { label: cat.label, href: `/${cat.slug}` },
    { label: sub.label, href: `/${cat.slug}/${sub.slug}` },
    { label: post.title },
  ];

  // Source of truth for JSON-LD: buildPostSchema() emits all 22+
  // entities as a flat array of objects. Each one becomes its own
  // <script type="application/ld+json"> tag — Google's spec says
  // every script must have exactly one @type at the top level
  // (no arrays, no duplicates).
  const schemas = buildPostSchema(post);
  const seenIds = new Set<string>();
  const dedupedSchemas = schemas.filter((s) => {
    const id = (s["@id"] ?? `${s["@type"]}:${s.name ?? ""}`) as string;
    if (seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });

  // Lagna profile posts get the pillar hero (a topical hub for the
  // 100+ cluster posts under that lagna). Every other template uses
  // the regular PostHero.
  const isLagnaPillar = post.template === "lagna-profile";
  // Normalise lagna_id since posts may use "mesha" while LAGNA_LABELS keys use "mesh"
  const rawLagnaId = (post.lagna_id ?? "").toLowerCase();
  const normalisedLagnaId = (rawLagnaId === "mesha" ? "mesh" : rawLagnaId) as LagnaSlug;
  const lagnaLabels = LAGNA_LABELS[normalisedLagnaId] ?? null;

  // For the pillar hero we strip the content's first stat-strip
  // because the hero already shows it in the ribbon. Avoids
  // visual duplication.
  const renderableContent = isLagnaPillar
    ? post.content.filter((b, i) => !(i === 0 && b.type === "stat-strip"))
    : post.content;

  // Pull stats for the pillar ribbon. Prefer the post's stat-strip
  // cells; fall back to a sensible default derived from lagna.
  const firstStatStrip = post.content.find((b) => b.type === "stat-strip") as
    | { cells: { label: string; value: string; sub?: string }[] }
    | undefined;
  const pillarStats = firstStatStrip?.cells ?? [];

  return (
    <>
      <Header />
      <article>
        {isLagnaPillar && lagnaLabels ? (
          <LagnaPillarHero
            breadcrumb={breadcrumb}
            lagnaId={normalisedLagnaId}
            badgeLabel={post.hero.badge_label}
            title={post.title}
            sanskritName={`${lagnaLabels.sanskrit} Lagna`}
            englishName={`${lagnaLabels.english} Ascendant`}
            description={post.hero.description}
            stats={pillarStats}
          />
        ) : (
          <PostHero
            breadcrumb={breadcrumb}
            badgeLabel={post.hero.badge_label}
            titleHtml={post.hero.title_html}
            description={post.hero.description}
            meta={post.hero.meta}
            tags={post.hero.tags}
            authorId={post.author_id}
            category={post.category}
          />
        )}
        <main className="wrap-article" style={{ paddingBottom: "5rem" }}>
          <BlockRenderer blocks={renderableContent} category={post.category} />
        </main>
      </article>
      <Footer />
      {dedupedSchemas.map((entity, i) => (
        <script
          key={`ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entity) }}
        />
      ))}
    </>
  );
}
