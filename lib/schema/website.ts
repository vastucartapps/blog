import { SITE_URL } from "../utils";
import { BLOG_WEBSITE_ID, BRAND, ORG_REF, type SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// WebSite schema — canonical on this subdomain.
//
// Per public/04-blog-vastucart-in.md §A.1, the WebSite keeps the
// contract @id and references the parent organisation via
// publisher. The SearchAction potentialAction lets Google show an
// inline search box for the site in search results.
// ─────────────────────────────────────────────────────────────────

export function buildWebsiteSchema(): SchemaEntity {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": BLOG_WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: BRAND.blogName,
    description: BRAND.blogDescription,
    inLanguage: ["en", "hi"],
    publisher: ORG_REF,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
