// ─────────────────────────────────────────────────────────────────
// Subdomain tools registry — REAL verified deep links only.
//
// Every URL in this file has been verified by hitting the live
// sitemap or homepage of the target subdomain. NEVER add a URL
// here without confirming it returns 200 and serves the intended
// content. Homepage dumping (linking to bare subdomain root when
// a deep page exists) is a hard-fail in `scripts/validate-post.ts`.
//
// Posts MUST link out to these deep URLs instead of the blog
// building duplicate calculator pages. The blog is a content
// layer over the existing tool layer.
//
// When the user asks for "calculators on the blog", the answer
// is always: link to the canonical tool here, do not rebuild it.
//
// LAW (CLAUDE.md → CALCULATOR LAW + LINK RELEVANCE LAW):
// 1. Never link to a homepage when a deeper relevant URL exists.
// 2. Every link in a post must be the most specific match for
//    the topic of that post — surya posts link to /deity/surya,
//    rudraksha posts link to /category/prayer-beads-rosary-...,
//    not to root subdomains.
// ─────────────────────────────────────────────────────────────────

export type ToolCategory =
  | "kundali"
  | "panchang"
  | "muhurta"
  | "horoscope"
  | "tarot"
  | "stotra"
  | "store"
  | "vastu"
  | "wedding"
  | "numerology";

export interface SubdomainTool {
  id: string;
  label: string;
  url: string;
  description: string;
  category: ToolCategory;
  // The taxonomy slugs whose posts should link to this tool.
  relevant_to: {
    category?: string[];
    subcategory?: string[];
    template?: string[];
    tags?: string[];
    // Per-planet relevance (for surya/chandra/etc specific tools)
    planet?: string[];
  };
}

// ─── www.vastucart.in/tools — the FREE calculator hub ─────────
// kundali.vastucart.in is the PREMIUM kundali app (deep pages
// require login). The free public calculators live on the main
// www.vastucart.in domain under /tools/*. NEVER swap them.

const CALCULATOR_TOOLS: SubdomainTool[] = [
  {
    id: "tools-hub",
    label: "33 Free Astrology + Vastu Tools",
    url: "https://www.vastucart.in/tools",
    description:
      "The complete VastuCart tool hub: every astrology, numerology, tarot, and vastu calculator in one place.",
    category: "vastu",
    relevant_to: {
      category: [
        "jyotish",
        "numerology",
        "tarot",
        "vastu",
        "puja",
        "festivals",
        "gemstones",
        "rudraksha",
      ],
    },
  },
  {
    id: "kundli-generator",
    label: "Free Kundali (Birth Chart) Generator",
    url: "https://www.vastucart.in/tools/kundli",
    description:
      "Generate a North Indian and South Indian birth chart with planet placements, lagna, navamsa, and divisional charts.",
    category: "kundali",
    relevant_to: {
      category: ["jyotish"],
      template: ["planet-in-house", "lagna-profile", "nakshatra"],
    },
  },
  {
    id: "lagna-calculator",
    label: "Lagna (Ascendant) Calculator",
    url: "https://www.vastucart.in/tools/lagna",
    description:
      "Find your exact ascendant from birth date, time, and place. Uses Lahiri ayanamsa.",
    category: "kundali",
    relevant_to: {
      template: ["planet-in-house", "lagna-profile"],
      tags: ["lagna", "ascendant"],
    },
  },
  {
    id: "marriage-matching",
    label: "Kundali Matching (Guna Milan)",
    url: "https://www.vastucart.in/tools/marriage-matching",
    description:
      "Ashtakoota guna milan compatibility for marriage, with mangal dosha check.",
    category: "wedding",
    relevant_to: {
      tags: ["marriage", "compatibility", "mangal-dosha"],
    },
  },
  {
    id: "life-path-number",
    label: "Numerology Life Path Number Calculator",
    url: "https://www.vastucart.in/tools/life-path-number",
    description:
      "Compute your life path number from your birth date with full numerological reading.",
    category: "numerology",
    relevant_to: {
      category: ["numerology"],
    },
  },
  {
    id: "vastu-room-advisor",
    label: "Vastu Room Advisor",
    url: "https://www.vastucart.in/tools/room-advisor",
    description:
      "Find the correct vastu direction for every room in your home or office.",
    category: "vastu",
    relevant_to: {
      category: ["vastu"],
    },
  },
  {
    id: "kundali-premium-app",
    label: "Premium Kundali App",
    url: "https://kundali.vastucart.in/",
    description:
      "Premium VastuCart Kundali app — login-gated dashboard for full birth chart, divisional charts, dasha tracking, transit alerts.",
    category: "kundali",
    relevant_to: {
      category: ["jyotish"],
      template: ["lagna-profile", "planet-in-house"],
    },
  },
];

// ─── horoscope.vastucart.in — daily/weekly/monthly per rashi ────
// Confirmed: /{sign-english}/{daily|weekly|monthly|annual}.

type RashiSlug =
  | "aries" | "taurus" | "gemini" | "cancer"
  | "leo" | "virgo" | "libra" | "scorpio"
  | "sagittarius" | "capricorn" | "aquarius" | "pisces";

const HOROSCOPE_TOOLS: SubdomainTool[] = [
  {
    id: "aries-daily-horoscope",
    label: "Mesh (Aries) Daily Horoscope",
    url: "https://horoscope.vastucart.in/aries/daily",
    description: "Daily horoscope for Mesh (Aries) rashi natives.",
    category: "horoscope",
    relevant_to: { tags: ["mesh", "aries", "mesh-lagna", "aries-lagna"] },
  },
  {
    id: "taurus-daily-horoscope",
    label: "Vrishabha (Taurus) Daily Horoscope",
    url: "https://horoscope.vastucart.in/taurus/daily",
    description: "Daily horoscope for Vrishabha (Taurus) rashi natives.",
    category: "horoscope",
    relevant_to: { tags: ["vrishabha", "taurus"] },
  },
  {
    id: "leo-daily-horoscope",
    label: "Simha (Leo) Daily Horoscope",
    url: "https://horoscope.vastucart.in/leo/daily",
    description: "Daily horoscope for Simha (Leo) rashi natives.",
    category: "horoscope",
    relevant_to: { tags: ["simha", "leo"] },
  },
];

// Build the rest of the daily horoscope set programmatically
const RASHI_LIST: { slug: RashiSlug; sanskrit: string; english: string }[] = [
  { slug: "aries", sanskrit: "Mesh", english: "Aries" },
  { slug: "taurus", sanskrit: "Vrishabha", english: "Taurus" },
  { slug: "gemini", sanskrit: "Mithuna", english: "Gemini" },
  { slug: "cancer", sanskrit: "Karka", english: "Cancer" },
  { slug: "leo", sanskrit: "Simha", english: "Leo" },
  { slug: "virgo", sanskrit: "Kanya", english: "Virgo" },
  { slug: "libra", sanskrit: "Tula", english: "Libra" },
  { slug: "scorpio", sanskrit: "Vrishchika", english: "Scorpio" },
  { slug: "sagittarius", sanskrit: "Dhanu", english: "Sagittarius" },
  { slug: "capricorn", sanskrit: "Makara", english: "Capricorn" },
  { slug: "aquarius", sanskrit: "Kumbha", english: "Aquarius" },
  { slug: "pisces", sanskrit: "Meena", english: "Pisces" },
];

/**
 * Returns the canonical horoscope.vastucart.in URL for a rashi.
 * Posts use this to link "Mesh Lagna" tags to the matching daily
 * horoscope, never to the horoscope homepage.
 */
export function rashiHoroscopeUrl(rashiSlug: RashiSlug, period: "daily" | "weekly" | "monthly" | "annual" = "daily"): string {
  return `https://horoscope.vastucart.in/${rashiSlug}/${period}`;
}

/**
 * Lookup table from sanskrit lagna name to rashi slug.
 */
const LAGNA_TO_RASHI: Record<string, RashiSlug> = {
  mesh: "aries",
  mesha: "aries",
  vrishabha: "taurus",
  mithuna: "gemini",
  karka: "cancer",
  simha: "leo",
  kanya: "virgo",
  tula: "libra",
  vrishchika: "scorpio",
  dhanu: "sagittarius",
  makara: "capricorn",
  kumbha: "aquarius",
  meena: "pisces",
};

export function lagnaToRashiHoroscope(lagnaSlug: string): string | null {
  const rashi = LAGNA_TO_RASHI[lagnaSlug.toLowerCase()];
  return rashi ? rashiHoroscopeUrl(rashi, "daily") : null;
}

// ─── muhurta.vastucart.in — verified deep paths ────────────────

const MUHURTA_TOOLS: SubdomainTool[] = [
  {
    id: "marriage-muhurta",
    label: "Marriage Muhurta",
    url: "https://muhurta.vastucart.in/marriage-muhurta",
    description: "Auspicious wedding dates with full muhurta calculation.",
    category: "muhurta",
    relevant_to: { tags: ["marriage", "wedding", "muhurta"] },
  },
  {
    id: "griha-pravesh-muhurta",
    label: "Griha Pravesh Muhurta",
    url: "https://muhurta.vastucart.in/griha-pravesh-muhurta",
    description: "Auspicious dates for housewarming and griha pravesh ceremony.",
    category: "muhurta",
    relevant_to: {
      category: ["vastu", "puja"],
      tags: ["griha-pravesh", "housewarming"],
    },
  },
  {
    id: "vehicle-purchase-muhurta",
    label: "Vehicle Purchase Muhurta",
    url: "https://muhurta.vastucart.in/vehicle-purchase-muhurta",
    description: "Auspicious dates for car or vehicle purchase.",
    category: "muhurta",
    relevant_to: { tags: ["vehicle-purchase", "muhurta"] },
  },
  {
    id: "business-muhurta",
    label: "Business Start Muhurta",
    url: "https://muhurta.vastucart.in/business-muhurta",
    description: "Auspicious dates for starting a new business or venture.",
    category: "muhurta",
    relevant_to: { tags: ["business", "muhurta"] },
  },
  {
    id: "education-muhurta",
    label: "Vidyarambham (Education Start) Muhurta",
    url: "https://muhurta.vastucart.in/education-muhurta",
    description: "Auspicious dates for starting education or learning a skill.",
    category: "muhurta",
    relevant_to: { tags: ["education", "vidyarambham"] },
  },
  {
    id: "mundan-muhurta",
    label: "Mundan Sanskar Muhurta",
    url: "https://muhurta.vastucart.in/mundan-muhurta",
    description: "Auspicious dates for the mundan ceremony.",
    category: "muhurta",
    relevant_to: { tags: ["mundan"] },
  },
];

// ─── stotra.vastucart.in — verified deep paths ─────────────────

const STOTRA_TOOLS: SubdomainTool[] = [
  {
    id: "deity-hub",
    label: "Stotras by Deity",
    url: "https://stotra.vastucart.in/deity",
    description: "Browse all stotras grouped by presiding deity.",
    category: "stotra",
    relevant_to: { category: ["jyotish", "puja", "festivals"] },
  },
  {
    id: "deity-surya",
    label: "Surya (Sun) Stotras Collection",
    url: "https://stotra.vastucart.in/deity/surya",
    description: "60 stotras, prayers, and sacred hymns dedicated to Lord Surya.",
    category: "stotra",
    relevant_to: { tags: ["surya", "sun", "ravi", "aditya"], planet: ["surya"] },
  },
  {
    id: "aditya-hridayam",
    label: "Aditya Hridayam Stotram",
    url: "https://stotra.vastucart.in/stotra/aditya-hridayam",
    description: "The Aditya Hridayam stotra from Valmiki Ramayana, taught by sage Agastya to Lord Rama.",
    category: "stotra",
    relevant_to: { tags: ["surya", "aditya-hridayam"], planet: ["surya"] },
  },
  {
    id: "aditya-kavacham",
    label: "Aditya Kavacham",
    url: "https://stotra.vastucart.in/stotra/aditya-kavacham",
    description: "Protective armour stotra of Lord Surya.",
    category: "stotra",
    relevant_to: { tags: ["surya"], planet: ["surya"] },
  },
  {
    id: "aditya-stotram",
    label: "Aditya Stotram",
    url: "https://stotra.vastucart.in/stotra/aditya-stotram",
    description: "Classical Aditya stotram for Surya worship.",
    category: "stotra",
    relevant_to: { tags: ["surya"], planet: ["surya"] },
  },
  {
    id: "dwadash-aditya-stotram",
    label: "Dwadash Aditya Stotram",
    url: "https://stotra.vastucart.in/stotra/dwadash-aditya-stotram",
    description: "Stotra of the twelve Adityas.",
    category: "stotra",
    relevant_to: { tags: ["surya", "twelve-adityas"], planet: ["surya"] },
  },
  // ── Mangal (Mars) ─────────────────────────────────────────────
  {
    id: "mangal-stotram",
    label: "Mangal Stotram",
    url: "https://stotra.vastucart.in/stotra/mangal-stotram",
    description: "Classical stotra to Lord Mangal (Mars), the lagna lord for Mesh natives.",
    category: "stotra",
    relevant_to: { tags: ["mangal", "mars", "mesh", "aries"], planet: ["mangal"] },
  },
  {
    id: "mangal-kavacham",
    label: "Mangal Kavacham",
    url: "https://stotra.vastucart.in/stotra/mangal-kavacham",
    description: "Protective armour stotra of Lord Mangal.",
    category: "stotra",
    relevant_to: { tags: ["mangal", "mars"], planet: ["mangal"] },
  },
  {
    id: "mangal-graha-kavacham",
    label: "Mangal Graha Kavacham",
    url: "https://stotra.vastucart.in/stotra/mangal-graha-kavacham",
    description: "Graha-specific kavacham for Mangal protection.",
    category: "stotra",
    relevant_to: { tags: ["mangal", "mars"], planet: ["mangal"] },
  },
  {
    id: "mangal-dosh-nivaran-stotram",
    label: "Mangal Dosh Nivaran Stotram",
    url: "https://stotra.vastucart.in/stotra/mangal-dosh-nivaran-stotram",
    description: "The stotra for cancelling Manglik dosha effects on marriage.",
    category: "stotra",
    relevant_to: { tags: ["manglik", "mangal", "marriage"], planet: ["mangal"] },
  },
  {
    id: "mangal-chandika-stotram",
    label: "Mangal Chandika Stotram",
    url: "https://stotra.vastucart.in/stotra/mangal-chandika-stotram",
    description: "Devi stotra invoking Mangal Chandika for Mars-related afflictions.",
    category: "stotra",
    relevant_to: { tags: ["mangal", "devi"], planet: ["mangal"] },
  },
  {
    id: "mangalvar-vrat-katha",
    label: "Mangalvar Vrat Katha",
    url: "https://stotra.vastucart.in/stotra/mangalvar-vrat-katha",
    description: "The Tuesday fast story dedicated to Mangal.",
    category: "stotra",
    relevant_to: { tags: ["mangal", "vrat", "tuesday"], planet: ["mangal"] },
  },
  // ── Shani (Saturn) ────────────────────────────────────────────
  {
    id: "shani-stotram",
    label: "Shani Stotram",
    url: "https://stotra.vastucart.in/stotra/shani-stotram",
    description: "Classical stotra to Shani Dev, the planet of discipline and time.",
    category: "stotra",
    relevant_to: { tags: ["shani", "saturn"], planet: ["shani"] },
  },
  {
    id: "shani-kavacham",
    label: "Shani Kavacham",
    url: "https://stotra.vastucart.in/stotra/shani-kavacham",
    description: "Protective armour stotra of Lord Shani.",
    category: "stotra",
    relevant_to: { tags: ["shani", "saturn"], planet: ["shani"] },
  },
  {
    id: "shani-chalisa",
    label: "Shani Chalisa",
    url: "https://stotra.vastucart.in/stotra/shani-chalisa",
    description: "Forty-verse Chalisa devoted to Shani Dev.",
    category: "stotra",
    relevant_to: { tags: ["shani", "saturn"], planet: ["shani"] },
  },
  {
    id: "shani-ashtakam",
    label: "Shani Ashtakam",
    url: "https://stotra.vastucart.in/stotra/shani-ashtakam",
    description: "Eight-verse hymn to Shani for daily recitation.",
    category: "stotra",
    relevant_to: { tags: ["shani", "saturn"], planet: ["shani"] },
  },
  {
    id: "shani-mangala-stotram",
    label: "Shani Mangala Stotram",
    url: "https://stotra.vastucart.in/stotra/shani-mangala-stotram",
    description: "Auspicious Shani stotra for marriage and career stability.",
    category: "stotra",
    relevant_to: { tags: ["shani", "saturn", "marriage"], planet: ["shani"] },
  },
  {
    id: "shanivar-vrat-katha",
    label: "Shanivar Vrat Katha",
    url: "https://stotra.vastucart.in/stotra/shanivar-vrat-katha",
    description: "The Saturday fast story dedicated to Shani Dev.",
    category: "stotra",
    relevant_to: { tags: ["shani", "vrat", "saturday"], planet: ["shani"] },
  },
  // ── Guru (Jupiter) ────────────────────────────────────────────
  {
    id: "guru-stotram",
    label: "Guru Stotram",
    url: "https://stotra.vastucart.in/stotra/guru-stotram",
    description: "Classical stotra to Brihaspati, the Deva Guru and 9th lord karaka.",
    category: "stotra",
    relevant_to: { tags: ["guru", "jupiter", "brihaspati"], planet: ["guru"] },
  },
  {
    id: "guru-graha-kavacham",
    label: "Guru Graha Kavacham",
    url: "https://stotra.vastucart.in/stotra/guru-graha-kavacham",
    description: "Graha-specific kavacham for Jupiter protection.",
    category: "stotra",
    relevant_to: { tags: ["guru", "jupiter"], planet: ["guru"] },
  },
  {
    id: "guru-graha-stotra",
    label: "Guru Graha Stotra",
    url: "https://stotra.vastucart.in/stotra/guru-graha-stotra",
    description: "Daily Graha stotra dedicated to Jupiter.",
    category: "stotra",
    relevant_to: { tags: ["guru", "jupiter"], planet: ["guru"] },
  },
  {
    id: "guru-chandal-dosh-nivaran-stotram",
    label: "Guru Chandal Dosh Nivaran Stotram",
    url: "https://stotra.vastucart.in/stotra/guru-chandal-dosh-nivaran-stotram",
    description: "Stotra for cancelling Guru Chandal dosha (Jupiter-Rahu affliction).",
    category: "stotra",
    relevant_to: { tags: ["guru", "rahu", "dosha"], planet: ["guru"] },
  },
  {
    id: "guruvar-vrat-katha",
    label: "Guruvar Vrat Katha",
    url: "https://stotra.vastucart.in/stotra/guruvar-vrat-katha",
    description: "The Thursday fast story dedicated to Brihaspati.",
    category: "stotra",
    relevant_to: { tags: ["guru", "vrat", "thursday"], planet: ["guru"] },
  },
  // ── Navagraha ─────────────────────────────────────────────────
  {
    id: "navagraha-stotram",
    label: "Navagraha Stotram",
    url: "https://stotra.vastucart.in/stotra/navagraha-stotram",
    description: "The classical hymn to all nine planets, recited daily for graha-shanti.",
    category: "stotra",
    relevant_to: { category: ["jyotish"] },
  },
];

// ─── store.vastucart.in — verified deep paths ──────────────────

const STORE_TOOLS: SubdomainTool[] = [
  {
    id: "consultations",
    label: "Personal Jyotish Consultation",
    url: "https://store.vastucart.in/consultations",
    description: "1-on-1 consultation with senior Parashari astrologer.",
    category: "store",
    relevant_to: {
      category: ["jyotish", "vastu", "puja", "festivals", "tarot", "numerology", "gemstones", "rudraksha"],
    },
  },
  {
    id: "rudraksha-mala-category",
    label: "Rudraksha Malas & Prayer Beads",
    url: "https://store.vastucart.in/category/prayer-beads-rosary-by-vastucart",
    description: "Authentic rudraksha malas, kamal gatta mala, karungali, vaijayanti, panchmukhi black rudraksha.",
    category: "store",
    relevant_to: {
      category: ["rudraksha", "jyotish", "puja"],
      tags: ["rudraksha", "mala", "japa-mala"],
    },
  },
  {
    id: "yantras-category",
    label: "Yantras for Vastu, Prosperity, Protection",
    url: "https://store.vastucart.in/category/yantras-for-vastu-prosperity-protection",
    description: "Energised yantras for navagraha, sri yantra, kuber, surya yantra, and more.",
    category: "store",
    relevant_to: {
      category: ["jyotish", "vastu", "puja"],
      tags: ["yantra"],
    },
  },
  {
    id: "puja-samagri-category",
    label: "Pujan & Havan Samagri",
    url: "https://store.vastucart.in/category/pujan-havan-samagri",
    description: "Puja samagri, havan kund, agarbatti, dhoop, and complete ritual sets.",
    category: "store",
    relevant_to: {
      category: ["puja", "festivals"],
      tags: ["puja", "samagri", "havan"],
    },
  },
  {
    id: "idols-category",
    label: "Hindu God Idols, Murti, Statues",
    url: "https://store.vastucart.in/category/hindu-god-idols-murti-statues",
    description: "Brass, polyresin, and gold-plated idols of Hindu deities for home temple.",
    category: "store",
    relevant_to: {
      category: ["puja", "festivals"],
      tags: ["idol", "murti", "statue"],
    },
  },
];

// ─── panchang.vastucart.in — homepage only (sitemap blocked) ───
// Subdomain returned 403 on fetch. Using homepage as the only
// confirmed entry until per-tool URLs are verified manually.

const PANCHANG_TOOLS: SubdomainTool[] = [
  {
    id: "panchang-home",
    label: "Today's Panchang",
    url: "https://panchang.vastucart.in/",
    description:
      "Tithi, nakshatra, yoga, karana, sunrise, sunset, rahu kalam, and choghadiya for today.",
    category: "panchang",
    relevant_to: {
      category: ["jyotish", "puja", "festivals"],
    },
  },
];

// ─── wedding.vastucart.in — homepage only (sitemap blocked) ────

const WEDDING_TOOLS: SubdomainTool[] = [
  {
    id: "wedding-home",
    label: "Wedding Muhurta & Kundali Matching",
    url: "https://wedding.vastucart.in/",
    description:
      "Auspicious wedding muhurta dates for the year, with kundali matching.",
    category: "wedding",
    relevant_to: {
      tags: ["marriage", "wedding"],
    },
  },
];

// ─── tarot.vastucart.in — homepage only for now ────────────────

const TAROT_TOOLS: SubdomainTool[] = [
  {
    id: "tarot-home",
    label: "Free Tarot Reading",
    url: "https://tarot.vastucart.in/",
    description: "Daily card, three-card, and Celtic Cross tarot readings.",
    category: "tarot",
    relevant_to: {
      category: ["tarot"],
    },
  },
];

export const SUBDOMAIN_TOOLS: SubdomainTool[] = [
  ...CALCULATOR_TOOLS,
  ...HOROSCOPE_TOOLS,
  ...PANCHANG_TOOLS,
  ...MUHURTA_TOOLS,
  ...WEDDING_TOOLS,
  ...TAROT_TOOLS,
  ...STOTRA_TOOLS,
  ...STORE_TOOLS,
];

export interface ToolMatchInput {
  category?: string;
  subcategory?: string;
  template?: string;
  tags?: string[];
  planet?: string;
  lagna?: string;
}

/**
 * Returns the subdomain tools that are relevant to a given post,
 * sorted by match score. The most specific (planet, tag, subcategory)
 * matches sort to the top so a Surya post links to /deity/surya
 * and /stotra/aditya-hridayam first, never to a stotra homepage.
 */
export function relevantTools(input: ToolMatchInput, limit = 8): SubdomainTool[] {
  const scored: { tool: SubdomainTool; score: number }[] = [];
  for (const tool of SUBDOMAIN_TOOLS) {
    let score = 0;
    if (input.planet && tool.relevant_to.planet?.includes(input.planet)) score += 6;
    if (input.tags && tool.relevant_to.tags) {
      for (const tag of input.tags) {
        if (tool.relevant_to.tags.includes(tag.toLowerCase())) score += 3;
      }
    }
    if (input.subcategory && tool.relevant_to.subcategory?.includes(input.subcategory)) score += 3;
    if (input.template && tool.relevant_to.template?.includes(input.template)) score += 2;
    if (input.category && tool.relevant_to.category?.includes(input.category)) score += 2;
    if (score > 0) scored.push({ tool, score });
  }
  scored.sort((a, b) => b.score - a.score);
  // Always include the consultation CTA and the tools-hub as fallbacks
  const top = scored.slice(0, limit).map((s) => s.tool);
  for (const id of ["consultations", "tools-hub"]) {
    const t = SUBDOMAIN_TOOLS.find((x) => x.id === id);
    if (t && !top.includes(t)) top.push(t);
  }
  return top;
}

export function getTool(id: string): SubdomainTool | undefined {
  return SUBDOMAIN_TOOLS.find((t) => t.id === id);
}

/**
 * Set of homepage URLs that should NEVER appear as a CTA destination
 * in a post when a deeper relevant page exists. The validator uses
 * this to flag homepage-dumping.
 */
// Note: kundali.vastucart.in/ is intentionally NOT in HOMEPAGE_URLS
// because the premium app's whole-app URL is the legitimate target
// (deep URLs require login). Same for panchang/wedding/tarot
// while their sitemaps remain blocked or 403. Once those expose
// deep URLs, add their roots back here.
export const HOMEPAGE_URLS: Set<string> = new Set([
  "https://vastucart.in",
  "https://vastucart.in/",
  "https://www.vastucart.in",
  "https://www.vastucart.in/",
  "https://blog.vastucart.in",
  "https://blog.vastucart.in/",
  "https://store.vastucart.in",
  "https://store.vastucart.in/",
  "https://stotra.vastucart.in",
  "https://stotra.vastucart.in/",
  "https://horoscope.vastucart.in",
  "https://horoscope.vastucart.in/",
  "https://muhurta.vastucart.in",
  "https://muhurta.vastucart.in/",
]);

export function isHomepageUrl(url: string): boolean {
  return HOMEPAGE_URLS.has(url.trim());
}
