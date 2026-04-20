import { SITE_URL } from "../utils";
import {
  BLOG_WEBSITE_REF,
  ORG_REF,
  type SchemaEntity,
} from "./constants";

// ─────────────────────────────────────────────────────────────────
// Service — consultation offering.
//
// Per contract §5.10, Service cannot hold isPartOf / about / mentions
// because Service inherits Intangible, not CreativeWork. To let the
// service page participate in cross-references we emit a WebPage
// wrapper whose mainEntity is the Service; the WebPage carries
// isPartOf/breadcrumb, the Service holds serviceType/provider/offers.
//
// On post pages we reference the consultation Service by @id so the
// rich-result validator does not complain about missing price on a
// descriptive mention.
// ─────────────────────────────────────────────────────────────────

const CONSULTATION_URL = "https://store.vastucart.in/consultations";
const SERVICE_ID = `${SITE_URL}/services/consultation#service`;
const SERVICE_PAGE_ID = `${SITE_URL}/services/consultation#webpage`;

export function buildConsultationServiceSchemas(): SchemaEntity[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": SERVICE_PAGE_ID,
      url: CONSULTATION_URL,
      name: "Personal Jyotish Consultation — VastuCart",
      description:
        "Personalised one-on-one Vedic astrology consultation with senior Parasari Jyotishi on the VastuCart panel.",
      inLanguage: ["en", "hi"],
      isPartOf: BLOG_WEBSITE_REF,
      mainEntity: { "@id": SERVICE_ID },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": SERVICE_ID,
      serviceType: "Personal Jyotish Consultation",
      name: "Personal Jyotish Consultation",
      description:
        "One-on-one Vedic astrology consultation covering Graha placements, Dasha analysis, and tailored remedial guidance.",
      provider: ORG_REF,
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      availableLanguage: ["English", "Hindi"],
      audience: {
        "@type": "Audience",
        audienceType: "Seekers of personalised Vedic astrology guidance",
      },
      offers: {
        "@type": "Offer",
        url: CONSULTATION_URL,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    },
  ];
}

export const CONSULTATION_SERVICE_REF = { "@id": SERVICE_ID } as const;
