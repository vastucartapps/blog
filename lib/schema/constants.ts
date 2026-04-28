// ─────────────────────────────────────────────────────────────────
// Canonical @id contracts — never diverge from
// public/00-shared-contracts.md §2.
//
// Every subdomain references these strings verbatim. A typo here
// splits the Knowledge Graph entity across two nodes and Google
// stops merging them.
// ─────────────────────────────────────────────────────────────────

import { SITE_URL } from "../utils";

// 1. Parent organisation (owned by vastucart.in, File 01)
export const ORG_ID = "https://www.vastucart.in/#organization";
export const ORG_HOME_URL = "https://www.vastucart.in/";
export const ORG_LOGO_URL = "https://www.vastucart.in/logo.png";

// 2. Blog — owned by this subdomain
export const BLOG_WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ENTITY_ID = `${SITE_URL}/#blog`;
export const GLOSSARY_ID = `${SITE_URL}/#glossary`;

// 3. Author entity — STRICT, only VastuCart Editorial allowed.
// The map exists for forward compatibility but contains exactly
// ONE entry. Never add a named individual. See lib/authors.ts
// for the full rule.
export const PERSON_IDS: Record<string, string> = {
  "vastucart-editorial": `${SITE_URL}/authors/vastucart-editorial#organization`,
};

export function personId(_authorSlug: string): string {
  // Any input id (including legacy pt-raghav-sharma references in
  // historical posts) resolves to the editorial desk. There is
  // exactly one author entity on this blog.
  return PERSON_IDS["vastucart-editorial"];
}

// 3a. Reviewer organisations — collective panels (no individuals).
// E-E-A-T-safe, scalable, no fabricated credentials. Locked Apr 2026.
export const REVIEWER_ORG_IDS: Record<string, string> = {
  "vastucart-jyotish-review-panel": `${SITE_URL}/reviewers/vastucart-jyotish-review-panel#organization`,
};

export function reviewerOrgId(slug: string): string {
  return (
    REVIEWER_ORG_IDS[slug] ??
    REVIEWER_ORG_IDS["vastucart-jyotish-review-panel"]
  );
}

// 4. Brand facts (locked, identical across every subdomain)
export const BRAND = {
  name: "VastuCart",
  slogan: "Divinely Perfect",
  founded: "2022",
  country: "IN",
  city: "Jhunjhunu",
  region: "Rajasthan",
  postalCode: "333307",
  email: "hi@vastucart.in",
  languages: ["English", "Hindi"],
  blogName: "VastuCart Blog",
  blogDescription:
    "Long-form articles on Jyotish, numerology, tarot, vastu, puja, festivals, gemstones, and rudraksha by practicing Vedic experts at VastuCart.",
} as const;

// 5. External identity (sameAs) — external platforms only, never
// reciprocate sibling subdomains. Locked by contract §4.
export const ORG_SAME_AS: string[] = [
  "https://www.linkedin.com/company/vastucart",
  "https://www.facebook.com/vastucartindia",
  "https://www.instagram.com/vastucart/",
  "https://in.pinterest.com/vastucart/",
  "https://www.threads.com/@vastucart",
  "https://x.com/vastucart",
  "https://vastucart.etsy.com",
  "https://www.amazon.in/s?k=vastucart",
  "https://www.youtube.com/@vastucart",
];

// 6. Concept entity IDs — canonical at vastucart.in/concepts/
export function conceptId(slug: string): string {
  return `https://www.vastucart.in/concepts/${slug}#entity`;
}

// 7. Organization reference (just the @id, per contract §5.2)
export const ORG_REF = { "@id": ORG_ID } as const;

// 8. Blog website reference
export const BLOG_WEBSITE_REF = { "@id": BLOG_WEBSITE_ID } as const;
export const BLOG_ENTITY_REF = { "@id": BLOG_ENTITY_ID } as const;

// 9. Schema types common helper interface
export type SchemaEntity = Record<string, unknown>;

// 10. Home breadcrumb item (every breadcrumb starts here)
export const HOME_BREADCRUMB_ITEM = {
  "@type": "ListItem" as const,
  position: 1,
  name: "Home",
  item: `${SITE_URL}/`,
};
