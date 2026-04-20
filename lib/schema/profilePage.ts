import { SITE_URL } from "../utils";
import { AUTHORS } from "../authors";
import {
  BLOG_WEBSITE_REF,
  HOME_BREADCRUMB_ITEM,
  personId,
  type SchemaEntity,
} from "./constants";

// ─────────────────────────────────────────────────────────────────
// ProfilePage schema — one per author page (contract §A.3).
// Wraps the Person via mainEntity and carries the CreativeWork-legal
// properties (isPartOf, breadcrumb) that the Person itself cannot hold.
// ─────────────────────────────────────────────────────────────────

export function buildProfilePageSchema(authorSlug: string): SchemaEntity | null {
  const author = AUTHORS[authorSlug];
  if (!author) return null;

  const url = `${SITE_URL}/authors/${authorSlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    name: `${author.name}, ${author.title}`,
    description: author.bio,
    inLanguage: "en-IN",
    isPartOf: BLOG_WEBSITE_REF,
    mainEntity: { "@id": personId(authorSlug) },
    breadcrumb: {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        HOME_BREADCRUMB_ITEM,
        {
          "@type": "ListItem",
          position: 2,
          name: "Authors",
          item: `${SITE_URL}/authors`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: author.name,
          item: url,
        },
      ],
    },
  };
}
