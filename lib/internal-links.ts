// ─────────────────────────────────────────────────────────────────
// VastuCart internal linking registry.
//
// Single source of truth for every internal URL the blog links to.
// Components import these helpers, never hardcode paths. Slug
// mismatches fail at compile time, not at runtime as 404s.
//
// Cluster linking philosophy:
//   1. Topical clusters — Mesh Lagna posts all link back to the
//      Mesh Lagna profile page (the cluster pillar). Surya posts all
//      link back to the Surya profile page. The pillar then links
//      to every cluster post and to the relevant subcategory page.
//   2. Cross-cluster links — every planet-in-house post links to
//      the matching planet-in-house post for the *next* lagna in the
//      zodiac wheel and the *previous* lagna, and to the same planet
//      in adjacent houses. This builds the rashi-chakra cluster.
//   3. Subdomain network links — every post emits an
//      internal-links block pointing to relevant VastuCart subdomain
//      tools (kundali.vastucart.in, store.vastucart.in, etc).
//   4. Author cluster — every post by an author links to that
//      author's profile page, and the author profile page links back
//      to every post by that author.
//
// Read more in docs/INTERNAL_LINKING.md
// ─────────────────────────────────────────────────────────────────

import { CATEGORIES, getCategory, getSubcategory } from "./categories";

// ─── Canonical slug constants ───────────────────────────────────

export const PLANET_SLUGS = {
  surya: "surya",
  chandra: "chandra",
  mangal: "mangal",
  budha: "budha",
  guru: "guru",
  shukra: "shukra",
  shani: "shani",
  rahu: "rahu",
  ketu: "ketu",
} as const;
export type PlanetSlug = keyof typeof PLANET_SLUGS;

export const PLANET_LABELS: Record<PlanetSlug, { english: string; sanskrit: string }> = {
  surya:   { english: "Sun",     sanskrit: "Surya"   },
  chandra: { english: "Moon",    sanskrit: "Chandra" },
  mangal:  { english: "Mars",    sanskrit: "Mangal"  },
  budha:   { english: "Mercury", sanskrit: "Budha"   },
  guru:    { english: "Jupiter", sanskrit: "Guru"    },
  shukra:  { english: "Venus",   sanskrit: "Shukra"  },
  shani:   { english: "Saturn",  sanskrit: "Shani"   },
  rahu:    { english: "Rahu",    sanskrit: "Rahu"    },
  ketu:    { english: "Ketu",    sanskrit: "Ketu"    },
};

export const LAGNA_SLUGS = {
  mesh:        "mesh",
  vrishabha:   "vrishabha",
  mithuna:     "mithuna",
  karka:       "karka",
  simha:       "simha",
  kanya:       "kanya",
  tula:        "tula",
  vrishchika:  "vrishchika",
  dhanu:       "dhanu",
  makara:      "makara",
  kumbha:      "kumbha",
  meena:       "meena",
} as const;
export type LagnaSlug = keyof typeof LAGNA_SLUGS;

export const LAGNA_LABELS: Record<LagnaSlug, { english: string; sanskrit: string }> = {
  mesh:       { english: "Aries",       sanskrit: "Mesh"       },
  vrishabha:  { english: "Taurus",      sanskrit: "Vrishabha"  },
  mithuna:    { english: "Gemini",      sanskrit: "Mithuna"    },
  karka:      { english: "Cancer",      sanskrit: "Karka"      },
  simha:      { english: "Leo",         sanskrit: "Simha"      },
  kanya:      { english: "Virgo",       sanskrit: "Kanya"      },
  tula:       { english: "Libra",       sanskrit: "Tula"       },
  vrishchika: { english: "Scorpio",     sanskrit: "Vrishchika" },
  dhanu:      { english: "Sagittarius", sanskrit: "Dhanu"      },
  makara:     { english: "Capricorn",   sanskrit: "Makara"     },
  kumbha:     { english: "Aquarius",    sanskrit: "Kumbha"     },
  meena:      { english: "Pisces",      sanskrit: "Meena"      },
};

export const HOUSE_SANSKRIT: Record<number, string> = {
  1:  "Tanu Bhava",
  2:  "Dhana Bhava",
  3:  "Sahaja Bhava",
  4:  "Sukha Bhava",
  5:  "Putra Bhava",
  6:  "Ari Bhava",
  7:  "Yuvati Bhava",
  8:  "Randhra Bhava",
  9:  "Dharma Bhava",
  10: "Karma Bhava",
  11: "Labha Bhava",
  12: "Vyaya Bhava",
};

export const ORDINAL: Record<number, string> = {
  1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th",
  7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
};

// ─── URL builders ───────────────────────────────────────────────

export function categoryUrl(categorySlug: string): string {
  return `/${categorySlug}`;
}

export function subcategoryUrl(categorySlug: string, subcategorySlug: string): string {
  return `/${categorySlug}/${subcategorySlug}`;
}

export function postUrl(
  categorySlug: string,
  subcategorySlug: string,
  postSlug: string
): string {
  return `/${categorySlug}/${subcategorySlug}/${postSlug}`;
}

export function authorUrl(authorSlug: string): string {
  return `/authors/${authorSlug}`;
}

export function planetInHouseUrl(
  planet: PlanetSlug,
  house: number,
  lagna: LagnaSlug
): string {
  return `/jyotish/graha-in-bhava/${planet}-${ORDINAL[house]}-house-${LAGNA_LABELS[lagna].english.toLowerCase()}-lagna`;
}

export function lagnaProfileUrl(lagna: LagnaSlug): string {
  return `/jyotish/lagna-profiles/${lagna}-lagna-complete-guide`;
}

export function planetProfileUrl(planet: PlanetSlug): string {
  return `/jyotish/graha-states/${planet}-complete-guide`;
}

export function nakshatraUrl(slug: string): string {
  return `/jyotish/nakshatra/${slug}`;
}

export function gemstoneUrl(slug: string): string {
  return `/gemstones/by-planet/${slug}`;
}

// ─── Cluster builders ───────────────────────────────────────────

export interface ClusterLink {
  label: string;
  href: string;
  context?: string;
}

/**
 * Cluster links for a planet-in-house post. Returns the canonical
 * set of internal links that every such post must include.
 */
export function planetInHouseCluster(
  planet: PlanetSlug,
  house: number,
  lagna: LagnaSlug
): ClusterLink[] {
  const links: ClusterLink[] = [];

  // Adjacent houses for the same planet + lagna
  if (house > 1) {
    links.push({
      label: `${PLANET_LABELS[planet].sanskrit} in the ${ORDINAL[house - 1]} house`,
      href: planetInHouseUrl(planet, house - 1, lagna),
      context: "Previous house",
    });
  }
  if (house < 12) {
    links.push({
      label: `${PLANET_LABELS[planet].sanskrit} in the ${ORDINAL[house + 1]} house`,
      href: planetInHouseUrl(planet, house + 1, lagna),
      context: "Next house",
    });
  }

  // Same planet, same house, adjacent lagna in zodiac wheel
  const lagnaList = Object.keys(LAGNA_SLUGS) as LagnaSlug[];
  const idx = lagnaList.indexOf(lagna);
  const nextLagna = lagnaList[(idx + 1) % lagnaList.length];
  links.push({
    label: `${PLANET_LABELS[planet].sanskrit} in ${ORDINAL[house]} house, ${LAGNA_LABELS[nextLagna].sanskrit} Lagna`,
    href: planetInHouseUrl(planet, house, nextLagna),
    context: "Next lagna",
  });

  // Pillar pages — lagna profile and planet profile
  links.push({
    label: `${LAGNA_LABELS[lagna].sanskrit} Lagna complete profile`,
    href: lagnaProfileUrl(lagna),
    context: "Pillar — lagna",
  });
  links.push({
    label: `${PLANET_LABELS[planet].sanskrit} planet complete profile`,
    href: planetProfileUrl(planet),
    context: "Pillar — planet",
  });

  return links;
}

/**
 * Resolve a known taxonomy phrase ("Mesh Lagna", "Pratham Bhava", "Surya")
 * to its canonical internal URL. Returns null if not a recognised entity.
 * Used by inline tag/meta linking on the post hero so any reference to
 * a known entity automatically becomes a hyperlink.
 */
export function resolveEntityLink(label: string): string | null {
  const norm = label.trim().toLowerCase();

  // Lagna names — both sanskrit and english forms
  for (const [slug, l] of Object.entries(LAGNA_LABELS) as [LagnaSlug, typeof LAGNA_LABELS[LagnaSlug]][]) {
    if (
      norm === `${l.sanskrit.toLowerCase()} lagna` ||
      norm === `${l.english.toLowerCase()} lagna` ||
      norm === l.sanskrit.toLowerCase() ||
      norm === `${l.english.toLowerCase()} ascendant`
    ) {
      return lagnaProfileUrl(slug);
    }
  }

  // Planet names
  for (const [slug, p] of Object.entries(PLANET_LABELS) as [PlanetSlug, typeof PLANET_LABELS[PlanetSlug]][]) {
    if (norm === p.sanskrit.toLowerCase() || norm === p.english.toLowerCase()) {
      return planetProfileUrl(slug);
    }
  }

  // House sanskrit names
  for (const [num, name] of Object.entries(HOUSE_SANSKRIT)) {
    if (norm === name.toLowerCase()) {
      return `/jyotish/graha-in-bhava#house-${num}`;
    }
  }

  // Category and subcategory labels
  for (const cat of CATEGORIES) {
    if (norm === cat.label.toLowerCase()) return categoryUrl(cat.slug);
    for (const sub of cat.subcategories) {
      if (norm === sub.label.toLowerCase()) {
        return subcategoryUrl(cat.slug, sub.slug);
      }
    }
  }

  return null;
}

// ─── Slug validation (compile-time + runtime) ──────────────────

/**
 * Throws in development if a category/subcategory slug pair does not
 * exist in the registry. Used by content loaders and the seed script.
 */
export function assertValidCategoryPair(
  categorySlug: string,
  subcategorySlug: string
): void {
  const cat = getCategory(categorySlug);
  if (!cat) {
    throw new Error(`Unknown category slug: "${categorySlug}"`);
  }
  const sub = getSubcategory(categorySlug, subcategorySlug);
  if (!sub) {
    throw new Error(
      `Unknown subcategory "${subcategorySlug}" under category "${categorySlug}"`
    );
  }
}

export function isValidCategoryPair(
  categorySlug: string,
  subcategorySlug: string
): boolean {
  const cat = getCategory(categorySlug);
  if (!cat) return false;
  return cat.subcategories.some((s) => s.slug === subcategorySlug);
}

export function categoryPillarUrl(categorySlug: string): string {
  return `/${categorySlug}/complete-guide`;
}

export function tagUrl(tagLabel: string): string {
  return `/tag/${slugifyTag(tagLabel)}`;
}

export function slugifyTag(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Enterprise nav-strip and cross-category bridge helpers ─────
//
// Every post — regardless of category, regardless of which terminal
// authored it — receives the same automatic outbound link set on
// render. The mechanism lives in components/post/BlockRenderer
// (server-side) which calls these helpers and auto-injects the
// rendered components above the related-posts block.
//
// Authors do NOT need to remember to wire pillar/subcategory/author
// links into post.json. The render layer guarantees them.

export interface PillarStripLink {
  label: string;
  href: string;
  sub?: string;
  kind: "category" | "subcategory" | "pillar" | "author";
}

/**
 * Standard pillar-strip emitted on every post. Always returns four
 * links: subcategory hub, category landing, category complete-guide
 * pillar, and author profile.
 */
export function pillarStripLinks(args: {
  category: string;
  subcategory: string;
  author_id: string;
}): PillarStripLink[] {
  const cat = getCategory(args.category);
  const sub = getSubcategory(args.category, args.subcategory);
  return [
    {
      label: sub?.label ?? args.subcategory,
      href: subcategoryUrl(args.category, args.subcategory),
      sub: `Browse all ${sub?.label?.toLowerCase() ?? args.subcategory} articles`,
      kind: "subcategory",
    },
    {
      label: `${cat?.label ?? args.category} hub`,
      href: categoryUrl(args.category),
      sub: `The full ${cat?.label?.toLowerCase() ?? args.category} library`,
      kind: "category",
    },
    {
      label: `${cat?.label ?? args.category} complete guide`,
      href: categoryPillarUrl(args.category),
      sub: "Pillar page across every subtopic",
      kind: "pillar",
    },
    {
      label: "Editorial desk",
      href: authorUrl(args.author_id),
      sub: "Author profile and review panel",
      kind: "author",
    },
  ];
}

// Map a planet slug (internal taxonomy) → "well-known" cluster URLs
// in other categories. Targets are *candidates* — the renderer must
// verify each one exists before emitting.
const PLANET_CROSS_TARGETS: Record<
  string,
  { lifePath: number; gemstoneSlug: string; gemstoneName: string }
> = {
  surya:   { lifePath: 1, gemstoneSlug: "ruby",            gemstoneName: "Ruby"           },
  chandra: { lifePath: 2, gemstoneSlug: "pearl",           gemstoneName: "Pearl"          },
  guru:    { lifePath: 3, gemstoneSlug: "yellow-sapphire", gemstoneName: "Yellow Sapphire" },
  rahu:    { lifePath: 4, gemstoneSlug: "hessonite",       gemstoneName: "Hessonite"      },
  budha:   { lifePath: 5, gemstoneSlug: "emerald",         gemstoneName: "Emerald"        },
  shukra:  { lifePath: 6, gemstoneSlug: "diamond",         gemstoneName: "Diamond"        },
  ketu:    { lifePath: 7, gemstoneSlug: "cats-eye",        gemstoneName: "Cat's Eye"      },
  shani:   { lifePath: 8, gemstoneSlug: "blue-sapphire",   gemstoneName: "Blue Sapphire"  },
  mangal:  { lifePath: 9, gemstoneSlug: "red-coral",       gemstoneName: "Red Coral"      },
};

export interface CrossCategoryBridge {
  label: string;
  href: string;
  sub: string;
  /** Source category, used by the UI to colour-code the chip. */
  to_category: string;
}

/**
 * Compute candidate cross-category bridges for a post. The caller
 * (BlockRenderer) must verify each `href` resolves to a real post
 * before rendering — `verifyHref` lets the caller plug in
 * `(href) => getPostBySlug(slugFromHref) !== null`.
 *
 * The function returns up to 6 candidates ordered by relevance; the
 * caller picks the first 3 that resolve.
 */
export function crossCategoryBridgeCandidates(args: {
  category: string;
  subcategory: string;
  planet_id?: string;
  ruling_planet?: string;
  number?: number;
  lagna_id?: string;
}): CrossCategoryBridge[] {
  const planetSlug = (args.planet_id ?? args.ruling_planet ?? "").toLowerCase();
  const planetMeta = PLANET_CROSS_TARGETS[planetSlug];
  const out: CrossCategoryBridge[] = [];

  // Numerology → Jyotish + Gemstone bridges, when ruling_planet present.
  if (args.category === "numerology" && planetMeta) {
    const planetEnglish = PLANET_LABELS[planetSlug as PlanetSlug]?.english;
    if (planetEnglish) {
      out.push({
        label: `${PLANET_LABELS[planetSlug as PlanetSlug].sanskrit} planet pillar (Jyotish)`,
        href: planetProfileUrl(planetSlug as PlanetSlug),
        sub: `Full Jyotish profile of your ruling planet`,
        to_category: "jyotish",
      });
    }
    out.push({
      label: `${planetMeta.gemstoneName} for ${args.number ? `Life Path ${args.number}` : "your number"}`,
      href: `/gemstones/by-planet/${planetMeta.gemstoneSlug}`,
      sub: `Wearing protocol and contraindications`,
      to_category: "gemstones",
    });
  }

  // Jyotish → Numerology + Gemstone bridges.
  if (args.category === "jyotish" && planetMeta) {
    out.push({
      label: `Life Path Number ${planetMeta.lifePath} (Numerology)`,
      href: `/numerology/life-path/life-path-number-${planetMeta.lifePath}`,
      sub: `The numerology archetype for the same ruling planet`,
      to_category: "numerology",
    });
    out.push({
      label: `${planetMeta.gemstoneName} (Gemstone)`,
      href: `/gemstones/by-planet/${planetMeta.gemstoneSlug}`,
      sub: `Ratna for this planet`,
      to_category: "gemstones",
    });
  }

  // Gemstone → Jyotish + Numerology bridges, when planet_id known.
  if (args.category === "gemstones" && planetMeta) {
    out.push({
      label: `${PLANET_LABELS[planetSlug as PlanetSlug]?.sanskrit ?? "Planet"} planet pillar (Jyotish)`,
      href: planetProfileUrl(planetSlug as PlanetSlug),
      sub: `Full Jyotish reading for this planet`,
      to_category: "jyotish",
    });
    out.push({
      label: `Life Path Number ${planetMeta.lifePath} (Numerology)`,
      href: `/numerology/life-path/life-path-number-${planetMeta.lifePath}`,
      sub: `Numerology archetype this stone supports`,
      to_category: "numerology",
    });
  }

  return out;
}
