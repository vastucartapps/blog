import { SITE_URL } from "../utils";
import { AUTHORS } from "../authors";
import { ORG_REF, personId, type SchemaEntity } from "./constants";
import type { Author } from "../types";

export type { Author };

// ─────────────────────────────────────────────────────────────────
// Author schema — STRICT, locked 2026-04-28.
//
// We emit @type Organization (NOT Person) for the editorial desk.
// Reasons:
//
//   1. The byline is a brand, not an individual. Emitting Person for
//      a collective byline is dishonest entity modelling and Google's
//      2026 SpamBrain quality signals downrank fake-individual schema.
//   2. The Organization parent-child relationship (parentOrganization
//      VastuCart) consolidates E-E-A-T into one Knowledge Graph node.
//   3. We do NOT fabricate honorifics, alma maters, occupational
//      credentials, individual addresses, or birth cities. Every one
//      of those fields would be a lie for a desk byline.
//
// The function is still named `buildPersonSchema` for backward
// compatibility with callers — its output is now Organization.
// Renaming is a follow-up cleanup, not a behavior change.
// ─────────────────────────────────────────────────────────────────

function authorImageUrl(author: Author): string {
  if (!author.avatar_url) return `${SITE_URL}/VastuCartLogo.png`;
  return author.avatar_url.startsWith("http")
    ? author.avatar_url
    : `${SITE_URL}${author.avatar_url}`;
}

function authorPageUrl(authorSlug: string): string {
  return `${SITE_URL}/authors/${authorSlug}`;
}

export function buildPersonSchema(authorSlug: string): SchemaEntity | null {
  const author = AUTHORS[authorSlug];
  if (!author) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": personId(authorSlug),
    name: author.name,
    description: author.bio,
    image: authorImageUrl(author),
    url: authorPageUrl(authorSlug),
    parentOrganization: ORG_REF,
    knowsAbout: author.specialization,
    sameAs: author.schema_same_as,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jhunjhunu",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
  };
}

export function buildAllPersonSchemas(): SchemaEntity[] {
  return Object.keys(AUTHORS)
    .map((slug) => buildPersonSchema(slug))
    .filter((p): p is SchemaEntity => p !== null);
}
