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
  numerology: ["vedic-numerology", "ank-jyotish", "life-path-number", "destiny-number", "psychic-number"],
  tarot: ["major-arcana", "minor-arcana", "rider-waite-deck"],
  vastu: ["vastu-purusha-mandala", "pancha-bhutas"],
  puja: [],
  festivals: [],
  gemstones: [],
  rudraksha: [],
};

// Per-number entities for the life-path cluster. Each post points to
// its own specific concept node (life-path-1#entity through
// life-path-9#entity) so the Knowledge Graph can resolve "Life Path 1"
// as a distinct topic from "Life Path 2" rather than collapsing the
// whole cluster into one "life-path-number" entity.
const LIFE_PATH_BY_NUMBER: Record<number, string> = {
  1: "life-path-1",
  2: "life-path-2",
  3: "life-path-3",
  4: "life-path-4",
  5: "life-path-5",
  6: "life-path-6",
  7: "life-path-7",
  8: "life-path-8",
  9: "life-path-9",
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

export function lifePathConceptId(n: number | undefined): string | null {
  if (!n || !LIFE_PATH_BY_NUMBER[n]) return null;
  return conceptId(LIFE_PATH_BY_NUMBER[n]);
}
