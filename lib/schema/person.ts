import { SITE_URL } from "../utils";
import { AUTHORS } from "../authors";
import { ORG_REF, personId, type SchemaEntity } from "./constants";
import type { Author } from "../types";
import type { Author as AuthorShape } from "../types";

// Re-export typed Author so consumers can import from one place
export type { Author };

// ─────────────────────────────────────────────────────────────────
// Canonical Person schemas — owned by this subdomain (contract §2.2).
//
// Pt. Raghav Sharma emits a full E-E-A-T signature: honorificPrefix,
// jobTitle, alumniOf, knowsAbout, address, hasCredential, sameAs.
//
// VastuCart Editorial emits the team byline — jobTitle, description,
// image, knowsAbout, sameAs — but no address or personal credential
// (because it's an editorial desk, not an individual). Honesty on
// these fields is what E-E-A-T rewards; fabricated credentials hurt.
// ─────────────────────────────────────────────────────────────────

function authorImageUrl(author: AuthorShape): string {
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

  const base: SchemaEntity = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(authorSlug),
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    image: authorImageUrl(author),
    url: authorPageUrl(authorSlug),
    worksFor: ORG_REF,
    knowsAbout: author.specialization,
    sameAs: author.schema_same_as,
  };

  if (authorSlug === "pt-raghav-sharma") {
    return {
      ...base,
      honorificPrefix: "Pandit",
      alumniOf: {
        "@type": "EducationalOrganization",
        name: author.lineage ?? "Parasari Jyotish (traditional gurukul lineage)",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Varanasi",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Traditional gurukul training",
        competencyRequired: "Parasari and Jaimini Jyotish lineage",
      },
      hasOccupation: {
        "@type": "Occupation",
        name: "Jyotish Acharya",
        occupationLocation: {
          "@type": "City",
          name: "Varanasi",
        },
        skills: author.specialization.join(", "),
      },
    };
  }

  // vastucart-editorial — editorial desk byline
  return {
    ...base,
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
