import type { Author } from "./types";

// ─────────────────────────────────────────────────────────────────
// Author registry — two canonical authors only, per
// public/00-shared-contracts.md §2.2 and public/04-blog-vastucart-in.md
// §A.2. Person `@id` values are emitted by lib/schema/person.ts and
// must never diverge from the contract.
//
//   Jyotish vertical        → pt-raghav-sharma (named practitioner)
//   Everything else         → vastucart-editorial (editorial desk)
//
// Do NOT introduce additional named authors. Add new lineage experts
// under the Editorial byline with a named reviewer line inside the
// article body, not as a new Person entity.
// ─────────────────────────────────────────────────────────────────

export const AUTHORS: Record<string, Author> = {
  "pt-raghav-sharma": {
    id: "pt-raghav-sharma",
    name: "Pt. Raghav Sharma",
    title: "Jyotish Acharya, Varanasi",
    initials: "RS",
    avatar_url: "/authors/pt-raghav-sharma.webp",
    avatar_gradient: "from-saffron to-gold",
    bio:
      "Varanasi-based practicing Jyotishi with over two decades of consultation experience across Graha and Dasha analysis, muhurta and remedial astrology. Trained in the Parasari and Jaimini traditions through the classical gurukul path.",
    specialization: [
      "Vedic Astrology",
      "Jyotish",
      "Graha placements",
      "Vimshottari Dasha",
      "Parasari Jyotish",
      "Kundali analysis",
      "Yogas",
      "Doshas",
      "Remedial astrology",
    ],
    categories: ["jyotish", "gemstones", "rudraksha"],
    experience_years: 22,
    location: "Varanasi, Uttar Pradesh, India",
    lineage: "Parasari Jyotish (traditional gurukul lineage)",
    article_count: 0,
    schema_same_as: [
      "https://www.linkedin.com/company/vastucart",
      "https://x.com/vastucart",
    ],
  },
  "vastucart-editorial": {
    id: "vastucart-editorial",
    name: "VastuCart Editorial",
    title: "Editorial Desk, Blog by VastuCart",
    initials: "VE",
    avatar_url: "/VastuCartLogo.png",
    avatar_gradient: "from-teal to-dark",
    bio:
      "The in-house editorial team at VastuCart, curating accessible introductions to Vedic astrology, numerology, Vastu Shastra, tarot, stotras, festivals, puja vidhi, gemstones and rudraksha. Articles by this byline are researched collaboratively and reviewed by senior practitioners on staff before publication.",
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

export function getAuthor(id: string): Author | undefined {
  return AUTHORS[id];
}

// Editorial-desk fallback. Use this when a post has no `author_id`
// or references an unknown author. Jyotish posts should still use
// pt-raghav-sharma explicitly.
export const DEFAULT_AUTHOR_ID = "vastucart-editorial";

export function resolveAuthor(id: string | undefined): Author {
  if (id && AUTHORS[id]) return AUTHORS[id];
  return AUTHORS[DEFAULT_AUTHOR_ID];
}
