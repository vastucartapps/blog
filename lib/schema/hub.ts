import { SITE_URL } from "../utils";
import {
  BLOG_ENTITY_REF,
  BLOG_WEBSITE_REF,
  ORG_REF,
  conceptId,
  personId,
  type SchemaEntity,
} from "./constants";
import { buildBreadcrumbListSchema, type BreadcrumbNode } from "./breadcrumbList";
import { buildFAQPageSchema, type FAQInput } from "./faqPage";
import { buildSpeakableSchema } from "./speakableSpec";

// speakableId referenced above when setting webPage.speakable
// (matches buildSpeakableSchema output)

// ─────────────────────────────────────────────────────────────────
// Enterprise hub schema builder.
//
// A "hub" page is any listing page that aggregates cluster content:
// category index, subcategory index, authors index, glossary,
// editorial-standards, classical-sources. Posts have their own
// builder (lib/schema/post.ts). Pillar pages have their own builder
// (lib/schema/pillar.ts).
//
// Every hub emits:
//   • WebPage            (cross-ref anchor — holds isPartOf, about,
//                         mentions, primaryImageOfPage, breadcrumb,
//                         speakable; cannot attach these to
//                         CollectionPage directly without ambiguity)
//   • CollectionPage     (mainEntity of WebPage, carries name + desc)
//   • ItemList           (numbered children of the hub)
//   • BreadcrumbList
//   • SiteNavigationElement (nav links on the page — helps Google
//                            pick the right sitelinks)
//   • FAQPage            (if provided)
//   • SpeakableSpecification
//   • Person reference   (author/editor of the hub)
// ─────────────────────────────────────────────────────────────────

export interface HubListItem {
  name: string;
  url: string;
  description?: string;
  image?: string;
  position?: number;
}

export interface HubNavItem {
  name: string;
  url: string;
}

export interface HubSchemaInput {
  url: string;
  pageType?: "CollectionPage" | "ProfilePage" | "AboutPage";
  name: string;
  description: string;
  heroImage?: string;
  inLanguage?: string | string[];
  breadcrumb: BreadcrumbNode[];
  items: HubListItem[];
  /** Ordered navigation links shown on the hub (subcategory chips etc). */
  navigation?: HubNavItem[];
  /** Curated FAQs displayed + emitted as FAQPage. */
  faq?: FAQInput[];
  /** Concept entity slugs for `about` + `mentions` cross-refs. */
  conceptSlugs?: string[];
  /** Author byline slug for the hub (optional). */
  authorSlug?: string;
  datePublished?: string;
  dateModified?: string;
}

export function buildHubSchemas(input: HubSchemaInput): SchemaEntity[] {
  const { url } = input;
  const pageType = input.pageType ?? "CollectionPage";
  const webPageId = `${url}#webpage`;
  const pageId = `${url}#page`;
  const listId = `${url}#itemlist`;
  const navId = `${url}#nav`;
  const crumbId = `${url}#breadcrumb`;
  const speakableId = `${url}#speakable`;

  const entities: SchemaEntity[] = [];

  // Concept references shared across about/mentions
  const conceptRefs = (input.conceptSlugs ?? []).map((slug) => ({
    "@id": conceptId(slug),
  }));

  // 1. WebPage — cross-ref anchor
  const webPage: SchemaEntity = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": webPageId,
    url,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage ?? "en-IN",
    isPartOf: BLOG_WEBSITE_REF,
    publisher: ORG_REF,
    breadcrumb: { "@id": crumbId },
    mainEntity: { "@id": pageId },
    speakable: { "@id": speakableId },
    ...(input.heroImage
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: input.heroImage.startsWith("http")
              ? input.heroImage
              : `${SITE_URL}${input.heroImage}`,
          },
        }
      : {}),
    ...(conceptRefs.length > 0 ? { about: conceptRefs, mentions: conceptRefs } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
  entities.push(webPage);

  // 2. The actual page entity — CollectionPage by default
  const pageEntity: SchemaEntity = {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": pageId,
    url,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage ?? "en-IN",
    isPartOf: BLOG_ENTITY_REF,
    hasPart: input.items.slice(0, 50).map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      ...(item.description ? { description: item.description } : {}),
    })),
    ...(conceptRefs.length > 0 ? { about: conceptRefs } : {}),
    ...(input.authorSlug
      ? { author: { "@id": personId(input.authorSlug) } }
      : {}),
  };
  entities.push(pageEntity);

  // 3. ItemList — ordered children
  if (input.items.length > 0) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": listId,
      numberOfItems: input.items.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: input.items.map((item, i) => ({
        "@type": "ListItem",
        position: item.position ?? i + 1,
        name: item.name,
        url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      })),
    });
  }

  // 4. BreadcrumbList
  const crumb = buildBreadcrumbListSchema(input.breadcrumb, url);
  if (crumb) entities.push(crumb);

  // 5. SiteNavigationElement — helps Google pick sitelinks
  if (input.navigation && input.navigation.length > 0) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "@id": navId,
      name: `${input.name} navigation`,
      hasPart: input.navigation.map((n) => ({
        "@type": "WebPage",
        name: n.name,
        url: n.url.startsWith("http") ? n.url : `${SITE_URL}${n.url}`,
      })),
    });
  }

  // 6. FAQPage — curated FAQs turn hubs into Q&A rich results.
  // buildFAQPageSchema emits `${url}#faq` which stays under the same
  // base so cross-refs can find it.
  if (input.faq && input.faq.length >= 2) {
    const faq = buildFAQPageSchema(input.faq, url);
    if (faq) entities.push(faq);
  }

  // 7. SpeakableSpecification — stable @id matches webPage.speakable ref
  entities.push(buildSpeakableSchema(url));

  return entities;
}
