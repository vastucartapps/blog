import {
  BRAND,
  ORG_HOME_URL,
  ORG_ID,
  ORG_LOGO_URL,
  ORG_SAME_AS,
  type SchemaEntity,
} from "./constants";

// ─────────────────────────────────────────────────────────────────
// Organization reference.
//
// Per public/00-shared-contracts.md §5.2, only vastucart.in (File 01)
// canonically declares the Organization. This blog references it by
// @id everywhere a publisher/author/provider is needed.
//
// `buildOrganizationReference()` returns just the @id pointer — that
// is what publishers/authors/providers use.
//
// `buildOrganizationStub()` is a minimal anchor we emit ONCE on the
// blog homepage so Google can match the @id even if it has not yet
// crawled vastucart.in. The stub is intentionally thin (name, url,
// logo only) so vastucart.in's canonical declaration wins whenever
// Google sees both.
// ─────────────────────────────────────────────────────────────────

export function buildOrganizationReference(): { "@id": string } {
  return { "@id": ORG_ID };
}

export function buildOrganizationStub(): SchemaEntity {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND.name,
    url: ORG_HOME_URL,
    logo: {
      "@type": "ImageObject",
      url: ORG_LOGO_URL,
      width: 1024,
      height: 1024,
      caption: BRAND.name,
    },
    slogan: BRAND.slogan,
    foundingDate: BRAND.founded,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: BRAND.city,
      addressRegion: BRAND.region,
      postalCode: BRAND.postalCode,
      addressCountry: BRAND.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: BRAND.email,
      url: `${ORG_HOME_URL}contact`,
      areaServed: BRAND.country,
      availableLanguage: BRAND.languages,
    },
    sameAs: ORG_SAME_AS,
  };
}
