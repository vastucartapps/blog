import { SITE_URL, absoluteUrl, plainText } from "../utils";
import type { ArticlePost } from "../types";
import { getCategory, getSubcategory } from "../categories";
import {
  BLOG_ENTITY_REF,
  BLOG_WEBSITE_REF,
  ORG_REF,
  personId,
  type SchemaEntity,
} from "./constants";
import { reviewerOrgRef } from "./reviewer";
import {
  bhavaConceptId,
  categoryConceptIds,
  lifePathConceptId,
  nakshatraConceptId,
  planetConceptId,
  rashiConceptId,
} from "./concepts";

// ─────────────────────────────────────────────────────────────────
// BlogPosting + WebPage composer.
//
// WebPage is the CreativeWork-legal anchor for cross-reference
// properties (isPartOf, about, mentions, primaryImageOfPage,
// breadcrumb, speakable). The BlogPosting holds article-legal
// fields (headline, author, datePublished, wordCount, etc).
//
// Both entities share the page URL as base. The WebPage @id ends
// in #webpage, the BlogPosting @id ends in #article.
// ─────────────────────────────────────────────────────────────────

export interface BlogPostingBuildResult {
  webPage: SchemaEntity;
  blogPosting: SchemaEntity;
  url: string;
  pageId: string;
  articleId: string;
}

function countWords(post: ArticlePost): number {
  let total = 0;
  for (const block of post.content) {
    if (block.type === "prose") {
      total += plainText(block.html).split(/\s+/).filter(Boolean).length;
    } else if (block.type === "scannable-prose") {
      total += plainText(block.lead_html).split(/\s+/).filter(Boolean).length;
      for (const sub of block.subsections) {
        total += plainText(sub.html).split(/\s+/).filter(Boolean).length;
      }
    } else if (block.type === "pull-quote") {
      total += block.text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === "faq") {
      for (const item of block.items) {
        total += item.a.split(/\s+/).filter(Boolean).length;
      }
    }
  }
  return total;
}

function resolveImageUrl(rawOgImage: string | undefined): string | undefined {
  if (!rawOgImage) return undefined;
  return rawOgImage.startsWith("http") ? rawOgImage : `${SITE_URL}${rawOgImage}`;
}

export function buildBlogPostingSchemas(
  post: ArticlePost
): BlogPostingBuildResult {
  const cat = getCategory(post.category);
  const sub = getSubcategory(post.category, post.subcategory);
  const url = absoluteUrl(`/${post.category}/${post.subcategory}/${post.slug}`);
  const pageId = `${url}#webpage`;
  const articleId = `${url}#article`;

  const image = resolveImageUrl(post.meta.og_image);
  const wordCount = countWords(post);

  // WebPage — holds the cross-ref properties
  const webPage: SchemaEntity = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageId,
    url,
    name: post.meta.title,
    description: post.meta.description,
    inLanguage: "en-IN",
    isPartOf: BLOG_WEBSITE_REF,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntity: { "@id": articleId },
    ...(image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: image,
          },
        }
      : {}),
    speakable: { "@id": `${url}#speakable` },
  };

  // BlogPosting — pure article facts
  const blogPosting: SchemaEntity = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": articleId,
    isPartOf: [BLOG_ENTITY_REF, { "@id": pageId }],
    mainEntityOfPage: { "@id": pageId },
    url,
    headline: post.title,
    name: post.title,
    description: post.meta.description,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@id": personId(post.author_id) },
    publisher: ORG_REF,
    ...(post.reviewer_id
      ? (() => {
          const ref = reviewerOrgRef(post.reviewer_id);
          return ref ? { reviewedBy: ref } : {};
        })()
      : {}),
    articleSection: cat?.label ?? post.category,
    keywords: post.tags.join(", "),
    wordCount,
    timeRequired: `PT${post.reading_time_minutes}M`,
    inLanguage: "en-IN",
    ...(image
      ? {
          image: {
            "@type": "ImageObject",
            url: image,
          },
        }
      : {}),
  };

  // Concept entity mentions — cross-link this article to the
  // canonical concepts on vastucart.in. Every match strengthens the
  // Knowledge Graph tie between the blog and the parent brand.
  const conceptIds = collectConceptIds(post);
  if (conceptIds.length > 0) {
    blogPosting.mentions = conceptIds.map((id) => ({ "@id": id }));
    blogPosting.about = conceptIds.map((id) => ({ "@id": id }));
  } else if (sub?.label) {
    blogPosting.about = [
      {
        "@type": "Thing",
        name: sub.label,
      },
    ];
  }

  return { webPage, blogPosting, url, pageId, articleId };
}

function collectConceptIds(post: ArticlePost): string[] {
  const ids = new Set<string>();

  // Numerology posts store their planet on `ruling_planet`; jyotish
  // posts store it on `planet_id`. Read both so every post emits its
  // ruling-planet entity reference for Knowledge Graph alignment.
  const numerologyPost = post as ArticlePost & {
    ruling_planet?: string;
    number?: number;
  };
  const planet = planetConceptId(post.planet_id ?? numerologyPost.ruling_planet);
  if (planet) ids.add(planet);

  const rashi = rashiConceptId(post.sign_id ?? post.lagna_id);
  if (rashi) ids.add(rashi);

  const nakshatra = nakshatraConceptId(post.nakshatra_id);
  if (nakshatra) ids.add(nakshatra);

  const bhava = bhavaConceptId(post.house_number);
  if (bhava) ids.add(bhava);

  // Per-number life-path concept for the numerology cluster.
  if (post.category === "numerology" && numerologyPost.number) {
    const lp = lifePathConceptId(numerologyPost.number);
    if (lp) ids.add(lp);
  }

  for (const extra of categoryConceptIds(post.category)) {
    ids.add(extra);
  }

  return Array.from(ids);
}
