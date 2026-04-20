import { SITE_URL } from "../utils";
import { BLOG_WEBSITE_REF, type SchemaEntity } from "./constants";
import { buildBreadcrumbListSchema, type BreadcrumbNode } from "./breadcrumbList";

export interface CollectionItem {
  name: string;
  url: string;
  description?: string;
}

export interface CollectionPageInput {
  url: string;
  name: string;
  description: string;
  items: CollectionItem[];
  breadcrumb: BreadcrumbNode[];
  about?: string[]; // concept slugs
  inLanguage?: string | string[];
}

// ─────────────────────────────────────────────────────────────────
// CollectionPage + ItemList — used by category, subcategory, and
// authors index pages. Both entities share the page @id as anchor.
// ─────────────────────────────────────────────────────────────────

export function buildCollectionPageSchema(
  input: CollectionPageInput
): SchemaEntity[] {
  const pageId = `${input.url}#page`;
  const listId = `${input.url}#itemlist`;
  const crumbId = `${input.url}#breadcrumb`;

  const entities: SchemaEntity[] = [];

  entities.push({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageId,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage ?? "en-IN",
    isPartOf: BLOG_WEBSITE_REF,
    breadcrumb: { "@id": crumbId },
    mainEntity: { "@id": listId },
    ...(input.about && input.about.length > 0
      ? {
          about: input.about.map((slug) => ({
            "@id": `https://www.vastucart.in/concepts/${slug}#entity`,
          })),
        }
      : {}),
  });

  entities.push({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": listId,
    numberOfItems: input.items.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: input.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  });

  const crumb = buildBreadcrumbListSchema(input.breadcrumb, input.url);
  if (crumb) entities.push(crumb);

  return entities;
}
