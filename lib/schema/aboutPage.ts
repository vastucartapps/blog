import { SITE_URL } from "../utils";
import { BLOG_WEBSITE_REF, ORG_REF, type SchemaEntity } from "./constants";
import { buildBreadcrumbListSchema, type BreadcrumbNode } from "./breadcrumbList";

export interface AboutPageInput {
  slug: string;
  name: string;
  description: string;
  breadcrumb: BreadcrumbNode[];
  datePublished?: string;
  dateModified?: string;
}

// ─────────────────────────────────────────────────────────────────
// AboutPage — for editorial-standards, classical-sources, and any
// future transparency pages. AboutPage inherits WebPage which
// inherits CreativeWork, so isPartOf + breadcrumb + publisher are
// all legal here.
// ─────────────────────────────────────────────────────────────────

export function buildAboutPageSchema(input: AboutPageInput): SchemaEntity[] {
  const url = `${SITE_URL}/${input.slug}`;
  const pageId = `${url}#page`;
  const crumbId = `${url}#breadcrumb`;
  const entities: SchemaEntity[] = [];

  entities.push({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": pageId,
    url,
    name: input.name,
    description: input.description,
    inLanguage: "en-IN",
    isPartOf: BLOG_WEBSITE_REF,
    publisher: ORG_REF,
    breadcrumb: { "@id": crumbId },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  });

  const crumb = buildBreadcrumbListSchema(input.breadcrumb, url);
  if (crumb) entities.push(crumb);

  return entities;
}
