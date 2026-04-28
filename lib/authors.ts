import type { Author } from "./types";

// ─────────────────────────────────────────────────────────────────
// Author registry — STRICT, locked 2026-04-28.
//
// EXACTLY ONE entity may appear here, and EXACTLY ONE entity may
// appear as the byline anywhere on this blog: VastuCart Editorial.
//
// NEVER add another entry to this map. NEVER add a named individual,
// real or invented. Multiple author personas split E-E-A-T signal
// and look like a content farm; a single brand byline consolidates
// authority into the parent VastuCart Organization.
//
// Reviewers are a different role with their own registry in
// `lib/schema/reviewer.ts` (currently `vastucart-jyotish-review-panel`).
// Reviewers are emitted via `reviewedBy`, NEVER via `author`.
//
// If a future requirement asks to credit an individual contributor,
// put their name in a "Contributions by ..." or "Reviewed by ..."
// line inside the article body. Do NOT introduce a new entry here.
// Do NOT emit a Person schema for them.
// ─────────────────────────────────────────────────────────────────

export const AUTHORS: Record<string, Author> = {
  "vastucart-editorial": {
    id: "vastucart-editorial",
    name: "VastuCart Editorial",
    title: "Editorial Desk, Blog by VastuCart",
    initials: "VE",
    avatar_url: "/VastuCartLogo.png",
    avatar_gradient: "from-teal to-dark",
    bio:
      "The in-house editorial team at VastuCart. We research, write, and edit long-form articles on Vedic astrology, numerology, Vastu Shastra, tarot, stotras, festivals, puja vidhi, gemstones, and rudraksha. Every Jyotish article is reviewed by the VastuCart Jyotish Review Panel before publication.",
    specialization: [
      "Vedic Astrology",
      "Jyotish",
      "Numerology",
      "Vastu Shastra",
      "Tarot",
      "Hindu Festivals",
      "Puja Vidhi",
      "Stotras",
      "Gemstones",
      "Rudraksha",
    ],
    categories: [
      "jyotish",
      "numerology",
      "tarot",
      "vastu",
      "puja",
      "festivals",
      "gemstones",
      "rudraksha",
    ],
    experience_years: 6,
    location: "Jhunjhunu, Rajasthan, India",
    lineage: "Collaborative editorial desk",
    article_count: 0,
    schema_same_as: [
      "https://www.linkedin.com/company/vastucart",
      "https://www.facebook.com/vastucartindia",
      "https://www.instagram.com/vastucart/",
      "https://x.com/vastucart",
    ],
  },
};

export const DEFAULT_AUTHOR_ID = "vastucart-editorial";

export function getAuthor(id: string): Author | undefined {
  return AUTHORS[id];
}

// Always returns VastuCart Editorial. Any unknown or legacy id
// (e.g. the scrapped pt-raghav-sharma) silently resolves to the
// editorial desk so historical content doesn't break.
export function resolveAuthor(_id: string | undefined): Author {
  return AUTHORS[DEFAULT_AUTHOR_ID];
}
