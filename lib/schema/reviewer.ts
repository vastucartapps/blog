import { SITE_URL } from "../utils";
import {
  ORG_REF,
  REVIEWER_ORG_IDS,
  type SchemaEntity,
} from "./constants";

// ─────────────────────────────────────────────────────────────────
// Reviewer organisations — collective E-E-A-T panels.
//
// We use Organization (not Person) for the reviewer field because:
//   1. We do not name any individual practitioner. Google's 2026
//      YMYL quality rater guidelines flag pseudonymous individual
//      authors at scale. Organisational accountability beats
//      fabricated individual credentials.
//   2. The panel scales: any number of senior practitioners can
//      review without surfacing names.
//   3. The Organization schema cleanly references the parent
//      VastuCart org via parentOrganization.
//
// Canonical reviewer @ids are declared in constants.ts and never
// duplicated. Each post emits its reviewer entity once and points
// the BlogPosting `reviewedBy` field at the @id.
// ─────────────────────────────────────────────────────────────────

interface ReviewerOrg {
  id: string;
  name: string;
  description: string;
  knowsAbout: string[];
  url: string;
}

const REVIEWER_ORGS: Record<string, ReviewerOrg> = {
  "vastucart-jyotish-review-panel": {
    id: REVIEWER_ORG_IDS["vastucart-jyotish-review-panel"],
    name: "VastuCart Jyotish Review Panel",
    description:
      "An in-house collective of senior Vedic astrology practitioners at VastuCart. The panel reviews every Jyotish article for traditional accuracy, terminology, and remedial soundness before publication.",
    knowsAbout: [
      "Vedic Astrology",
      "Parasari Jyotish",
      "Jaimini Jyotish",
      "Vimshottari Dasha",
      "Graha placements",
      "Yogas",
      "Doshas",
      "Remedial astrology",
      "Muhurta",
      "Kundali analysis",
    ],
    url: `${SITE_URL}/reviewers/vastucart-jyotish-review-panel`,
  },
};

export function buildReviewerOrgSchema(slug: string): SchemaEntity | null {
  const org = REVIEWER_ORGS[slug];
  if (!org) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": org.id,
    name: org.name,
    description: org.description,
    url: org.url,
    parentOrganization: ORG_REF,
    knowsAbout: org.knowsAbout,
  };
}

export function reviewerOrgRef(slug: string): { "@id": string } | null {
  const org = REVIEWER_ORGS[slug];
  if (!org) return null;
  return { "@id": org.id };
}

export function buildAllReviewerSchemas(): SchemaEntity[] {
  return Object.keys(REVIEWER_ORGS)
    .map((slug) => buildReviewerOrgSchema(slug))
    .filter((p): p is SchemaEntity => p !== null);
}
