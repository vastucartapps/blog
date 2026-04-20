import { SITE_URL } from "../utils";
import {
  BLOG_ENTITY_REF,
  BLOG_WEBSITE_REF,
  ORG_REF,
  personId,
  type SchemaEntity,
} from "./constants";
import { buildBreadcrumbListSchema, type BreadcrumbNode } from "./breadcrumbList";
import { buildFAQPageSchema, type FAQInput } from "./faqPage";

export interface PillarPart {
  name: string;
  url: string;
  description?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export interface PillarSchemaInput {
  category: string;
  categoryLabel: string;
  name: string;
  headline: string;
  description: string;
  wordCount: number;
  image?: string;
  authorSlug: string;
  datePublished: string;
  dateModified: string;
  parts: PillarPart[];
  breadcrumb: BreadcrumbNode[];
  conceptSlugs?: string[];
  faq?: FAQInput[];
}

// ─────────────────────────────────────────────────────────────────
// Pillar pages — the topical authority anchor for each category.
// Emits:
//   • WebPage (cross-ref anchor)
//   • Article typed as the pillar (id: …#pillar)
//   • CollectionPage + ItemList (sister entity) for the cluster
//   • BreadcrumbList
//   • FAQPage if provided
// All entities share a single baseUrl so @id fragments stay flat.
// ─────────────────────────────────────────────────────────────────

export function buildPillarSchemas(input: PillarSchemaInput): SchemaEntity[] {
  const url = `${SITE_URL}/${input.category}/complete-guide`;
  const pageId = `${url}#webpage`;
  const pillarId = `${url}#pillar`;
  const listId = `${url}#itemlist`;
  const crumbId = `${url}#breadcrumb`;

  const entities: SchemaEntity[] = [];

  entities.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageId,
    url,
    name: input.name,
    description: input.description,
    inLanguage: "en-IN",
    isPartOf: BLOG_WEBSITE_REF,
    mainEntity: { "@id": pillarId },
    breadcrumb: { "@id": crumbId },
    ...(input.image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: input.image,
          },
        }
      : {}),
  });

  entities.push({
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": pillarId,
    isPartOf: [BLOG_ENTITY_REF, { "@id": pageId }],
    mainEntityOfPage: { "@id": pageId },
    url,
    headline: input.headline,
    name: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@id": personId(input.authorSlug) },
    publisher: ORG_REF,
    articleSection: input.categoryLabel,
    inLanguage: "en-IN",
    wordCount: input.wordCount,
    ...(input.image
      ? {
          image: { "@type": "ImageObject", url: input.image },
        }
      : {}),
    ...(input.parts.length > 0
      ? {
          hasPart: input.parts.map((p) => ({
            "@type": "LearningResource",
            name: p.name,
            url: p.url.startsWith("http") ? p.url : `${SITE_URL}${p.url}`,
            ...(p.description ? { description: p.description } : {}),
            learningResourceType: "Article",
            educationalLevel: p.level ?? "Intermediate",
          })),
        }
      : {}),
    ...(input.conceptSlugs && input.conceptSlugs.length > 0
      ? {
          mentions: input.conceptSlugs.map((slug) => ({
            "@id": `https://www.vastucart.in/concepts/${slug}#entity`,
          })),
          about: input.conceptSlugs.map((slug) => ({
            "@id": `https://www.vastucart.in/concepts/${slug}#entity`,
          })),
        }
      : {}),
  });

  entities.push({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": listId,
    numberOfItems: input.parts.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: input.parts.map((part, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: part.name,
      url: part.url.startsWith("http") ? part.url : `${SITE_URL}${part.url}`,
    })),
  });

  const crumb = buildBreadcrumbListSchema(input.breadcrumb, url);
  if (crumb) entities.push(crumb);

  if (input.faq && input.faq.length >= 2) {
    const faq = buildFAQPageSchema(input.faq, url);
    if (faq) entities.push(faq);
  }

  return entities;
}
