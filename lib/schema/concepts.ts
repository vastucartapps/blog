import { conceptId } from "./constants";

// ─────────────────────────────────────────────────────────────────
// Concept entity resolvers.
//
// The canonical concept URLs live on vastucart.in at
//   https://www.vastucart.in/concepts/{contract-slug}#entity
// Contract: public/00-shared-contracts.md §3.
//
// Internal taxonomy slugs (used in post.planet_id etc) sometimes
// differ from contract slugs — e.g. internal "mangal" vs contract
// "mangala", internal "guru" vs contract "brihaspati". Every
// translation happens here so post builders stay slug-agnostic.
// ─────────────────────────────────────────────────────────────────

const PLANET_INTERNAL_TO_CONTRACT: Record<string, string> = {
  surya: "surya",
  chandra: "chandra",
  mangal: "mangala",
  mangala: "mangala",
  budha: "budha",
  guru: "brihaspati",
  brihaspati: "brihaspati",
  jupiter: "brihaspati",
  shukra: "shukra",
  venus: "shukra",
  shani: "shani",
  saturn: "shani",
  rahu: "rahu",
  ketu: "ketu",
};

const RASHI_INTERNAL_TO_CONTRACT: Record<string, string> = {
  mesh: "mesha",
  mesha: "mesha",
  aries: "mesha",
  vrishabha: "vrishabha",
  taurus: "vrishabha",
  mithuna: "mithuna",
  gemini: "mithuna",
  karka: "karka",
  cancer: "karka",
  simha: "simha",
  leo: "simha",
  kanya: "kanya",
  virgo: "kanya",
  tula: "tula",
  libra: "tula",
  vrishchika: "vrishchika",
  scorpio: "vrishchika",
  dhanu: "dhanu",
  sagittarius: "dhanu",
  makara: "makara",
  capricorn: "makara",
  kumbha: "kumbha",
  aquarius: "kumbha",
  meena: "meena",
  pisces: "meena",
};

const BHAVA_BY_NUMBER: Record<number, string> = {
  1: "tanu-bhava",
  2: "dhana-bhava",
  3: "sahaja-bhava",
  4: "sukha-bhava",
  5: "putra-bhava",
  6: "ripu-bhava",
  7: "kalatra-bhava",
  8: "ayush-bhava",
  9: "dharma-bhava",
  10: "karma-bhava",
  11: "labha-bhava",
  12: "vyaya-bhava",
};

const CATEGORY_CONCEPT_DEFAULTS: Record<string, string[]> = {
  jyotish: [],
  numerology: ["life-path-number", "destiny-number"],
  tarot: ["major-arcana", "minor-arcana", "rider-waite-deck"],
  vastu: ["vastu-purusha-mandala", "pancha-bhutas"],
  puja: [],
  festivals: [],
  gemstones: [],
  rudraksha: [],
};

export function planetConceptId(internalSlug: string | undefined): string | null {
  if (!internalSlug) return null;
  const slug = PLANET_INTERNAL_TO_CONTRACT[internalSlug.toLowerCase()];
  return slug ? conceptId(slug) : null;
}

export function rashiConceptId(internalSlug: string | undefined): string | null {
  if (!internalSlug) return null;
  const slug = RASHI_INTERNAL_TO_CONTRACT[internalSlug.toLowerCase()];
  return slug ? conceptId(slug) : null;
}

export function nakshatraConceptId(slug: string | undefined): string | null {
  if (!slug) return null;
  return conceptId(slug.toLowerCase());
}

export function bhavaConceptId(houseNumber: number | undefined): string | null {
  if (!houseNumber || !BHAVA_BY_NUMBER[houseNumber]) return null;
  return conceptId(BHAVA_BY_NUMBER[houseNumber]);
}

export function categoryConceptIds(category: string): string[] {
  const slugs = CATEGORY_CONCEPT_DEFAULTS[category] ?? [];
  return slugs.map((s) => conceptId(s));
}
