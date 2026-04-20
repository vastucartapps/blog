import { SITE_URL } from "../utils";
import { AUTHORS } from "../authors";
import {
  BLOG_ENTITY_ID,
  BRAND,
  ORG_REF,
  personId,
  type SchemaEntity,
} from "./constants";

// ─────────────────────────────────────────────────────────────────
// Blog schema — canonical on this subdomain (per contract §A.1).
// Declares the Blog as a CreativeWork subtype with both canonical
// authors referenced by @id. The Blog inherits CreativeWork, so
// `about`, `mentions`, and `isPartOf` are legal here (unlike on
// Service or Brand).
// ─────────────────────────────────────────────────────────────────

export function buildBlogEntitySchema(): SchemaEntity {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": BLOG_ENTITY_ID,
    name: BRAND.blogName,
    url: `${SITE_URL}/`,
    description: BRAND.blogDescription,
    inLanguage: ["en", "hi"],
    publisher: ORG_REF,
    author: Object.keys(AUTHORS).map((slug) => ({
      "@id": personId(slug),
    })),
    audience: {
      "@type": "Audience",
      audienceType:
        "Practitioners and students of Vedic astrology, Vastu, numerology, tarot, and traditional Hindu spiritual practice",
    },
  };
}
