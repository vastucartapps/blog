// ─────────────────────────────────────────────────────────────────
// Master keyword variation registry.
//
// Every Sanskrit term used in the blog has its full set of
// Romanised, Hindi, and English variations registered here. The
// keyword research phase pulls from this file. The lint phase
// uses it to detect spelling drift across posts.
//
// Variations are user-typed Romanisations from real Indian search
// queries. They are not strict IAST.
// ─────────────────────────────────────────────────────────────────

export interface TermVariation {
  /** Canonical kebab-case identifier used in slugs and code */
  canonical: string;
  /** Devanagari Sanskrit / Hindi spelling */
  devanagari: string;
  /** IAST academic Romanisation */
  iast?: string;
  /** All Romanised variants users actually type in Google */
  hindi_romanised: string[];
  /** English equivalents and synonyms */
  english: string[];
  /** Related Sanskrit terms (synonyms, alternate names) */
  related: string[];
}

export const PLANET_VARIATIONS: Record<string, TermVariation> = {
  surya: {
    canonical: "surya",
    devanagari: "सूर्य",
    iast: "sūrya",
    hindi_romanised: ["surya", "soorya", "soorja", "sury", "suriya"],
    english: ["sun", "sol", "sooraj"],
    related: ["aditya", "ravi", "bhanu", "arka", "savita", "mitra", "pushan"],
  },
  chandra: {
    canonical: "chandra",
    devanagari: "चन्द्र",
    iast: "candra",
    hindi_romanised: ["chandra", "chandrama", "chandr", "chand", "chandar"],
    english: ["moon", "lunar"],
    related: ["soma", "indu", "shashi", "rajani", "nishakara"],
  },
  mangal: {
    canonical: "mangal",
    devanagari: "मंगल",
    iast: "maṅgala",
    hindi_romanised: ["mangal", "mangala", "mangla", "mangol"],
    english: ["mars", "the red planet"],
    related: ["kuja", "angarak", "bhauma", "lohita", "skanda"],
  },
  budha: {
    canonical: "budha",
    devanagari: "बुध",
    iast: "budha",
    hindi_romanised: ["budha", "budh", "budhh", "boodh"],
    english: ["mercury"],
    related: ["soumya", "rohinesha", "saumya", "vidhuja"],
  },
  guru: {
    canonical: "guru",
    devanagari: "गुरु",
    iast: "guru",
    hindi_romanised: ["guru", "gurudev", "gurudeva"],
    english: ["jupiter"],
    related: ["brihaspati", "brhaspati", "vyas", "devaguru", "angiras"],
  },
  shukra: {
    canonical: "shukra",
    devanagari: "शुक्र",
    iast: "śukra",
    hindi_romanised: ["shukra", "shukr", "sukra", "sukr"],
    english: ["venus"],
    related: ["bhrigu", "bhargav", "kavi", "ushanas", "daityaguru"],
  },
  shani: {
    canonical: "shani",
    devanagari: "शनि",
    iast: "śani",
    hindi_romanised: ["shani", "shanee", "shaneeshwar", "shanaiscara"],
    english: ["saturn"],
    related: ["shanaischara", "manda", "krura", "yamabhrata", "kalapurusha"],
  },
  rahu: {
    canonical: "rahu",
    devanagari: "राहु",
    iast: "rāhu",
    hindi_romanised: ["rahu", "raahu", "rahuu"],
    english: ["north node", "dragon's head", "ascending node"],
    related: ["tamograha", "bhujanga", "vidhuntuda"],
  },
  ketu: {
    canonical: "ketu",
    devanagari: "केतु",
    iast: "ketu",
    hindi_romanised: ["ketu", "kethu", "keth", "kethoo"],
    english: ["south node", "dragon's tail", "descending node"],
    related: ["dhwajagrah", "shikhi", "moksha karaka"],
  },
};

export const LAGNA_VARIATIONS: Record<string, TermVariation> = {
  mesh: {
    canonical: "mesh",
    devanagari: "मेष",
    iast: "meṣa",
    hindi_romanised: ["mesh", "mesha", "mesham", "mes"],
    english: ["aries", "ram"],
    related: ["mesh rashi", "mesh lagna"],
  },
  vrishabha: {
    canonical: "vrishabha",
    devanagari: "वृषभ",
    iast: "vṛṣabha",
    hindi_romanised: ["vrishabha", "vrishabh", "vrushabh", "vrshabh", "vrishab"],
    english: ["taurus", "bull"],
    related: ["vrishabh rashi", "vrishabh lagna"],
  },
  mithuna: {
    canonical: "mithuna",
    devanagari: "मिथुन",
    iast: "mithuna",
    hindi_romanised: ["mithuna", "mithun", "mithoon"],
    english: ["gemini", "twins"],
    related: ["mithun rashi", "mithun lagna"],
  },
  karka: {
    canonical: "karka",
    devanagari: "कर्क",
    iast: "karka",
    hindi_romanised: ["karka", "karkat", "karkata", "kark"],
    english: ["cancer", "crab"],
    related: ["karka rashi", "karka lagna"],
  },
  simha: {
    canonical: "simha",
    devanagari: "सिंह",
    iast: "siṁha",
    hindi_romanised: ["simha", "sinha", "sinh", "singh"],
    english: ["leo", "lion"],
    related: ["simha rashi", "simha lagna"],
  },
  kanya: {
    canonical: "kanya",
    devanagari: "कन्या",
    iast: "kanyā",
    hindi_romanised: ["kanya", "kanyaa", "kanyaka"],
    english: ["virgo", "virgin", "maiden"],
    related: ["kanya rashi", "kanya lagna"],
  },
  tula: {
    canonical: "tula",
    devanagari: "तुला",
    iast: "tulā",
    hindi_romanised: ["tula", "tulaa", "tulha"],
    english: ["libra", "scales", "balance"],
    related: ["tula rashi", "tula lagna"],
  },
  vrishchika: {
    canonical: "vrishchika",
    devanagari: "वृश्चिक",
    iast: "vṛścika",
    hindi_romanised: ["vrishchika", "vrischika", "vrushchik", "vrshchik"],
    english: ["scorpio", "scorpion"],
    related: ["vrishchik rashi", "vrishchik lagna"],
  },
  dhanu: {
    canonical: "dhanu",
    devanagari: "धनु",
    iast: "dhanu",
    hindi_romanised: ["dhanu", "dhanus", "dhanush"],
    english: ["sagittarius", "archer"],
    related: ["dhanu rashi", "dhanu lagna"],
  },
  makara: {
    canonical: "makara",
    devanagari: "मकर",
    iast: "makara",
    hindi_romanised: ["makara", "makar", "magar"],
    english: ["capricorn", "sea-goat"],
    related: ["makar rashi", "makar lagna"],
  },
  kumbha: {
    canonical: "kumbha",
    devanagari: "कुम्भ",
    iast: "kumbha",
    hindi_romanised: ["kumbha", "kumbh", "kumbha rashi"],
    english: ["aquarius", "water bearer"],
    related: ["kumbh rashi", "kumbh lagna"],
  },
  meena: {
    canonical: "meena",
    devanagari: "मीन",
    iast: "mīna",
    hindi_romanised: ["meena", "meen", "meena rashi"],
    english: ["pisces", "fish"],
    related: ["meen rashi", "meen lagna"],
  },
};

export const TERM_VARIATIONS: Record<string, TermVariation> = {
  kundali: {
    canonical: "kundali",
    devanagari: "कुंडली",
    hindi_romanised: ["kundali", "kundli", "kundla", "kundlee"],
    english: ["birth chart", "natal chart", "horoscope chart", "janma kundali"],
    related: ["lagna chart", "rasi chart", "navamsa chart"],
  },
  dasha: {
    canonical: "dasha",
    devanagari: "दशा",
    hindi_romanised: ["dasha", "dasa", "dosa"],
    english: ["planetary period", "period", "mahadasha"],
    related: ["mahadasha", "antardasha", "vimshottari"],
  },
  vidhi: {
    canonical: "vidhi",
    devanagari: "विधि",
    hindi_romanised: ["vidhi", "vidhee", "vidhee", "bidhi"],
    english: ["procedure", "ritual", "method", "step by step"],
    related: ["puja vidhi", "havan vidhi"],
  },
  kaal: {
    canonical: "kaal",
    devanagari: "काल",
    hindi_romanised: ["kaal", "kal", "kalam", "kaalam"],
    english: ["time", "period", "auspicious window"],
    related: ["pradosh kaal", "rahu kaal", "muhurta kaal"],
  },
  puja: {
    canonical: "puja",
    devanagari: "पूजा",
    hindi_romanised: ["puja", "pooja", "pujaa"],
    english: ["worship", "ritual", "prayer service"],
    related: ["puja vidhi", "deity puja", "graha puja"],
  },
  havan: {
    canonical: "havan",
    devanagari: "हवन",
    hindi_romanised: ["havan", "hawan", "homam", "haven"],
    english: ["fire ritual", "fire ceremony", "yajna"],
    related: ["yajna", "yagna", "homa"],
  },
  muhurta: {
    canonical: "muhurta",
    devanagari: "मुहूर्त",
    hindi_romanised: ["muhurta", "muhurt", "mahurat", "muhoorat"],
    english: ["auspicious time", "auspicious window", "election timing"],
    related: ["abhijit muhurta", "brahma muhurta", "godhuli muhurta"],
  },
  panchang: {
    canonical: "panchang",
    devanagari: "पंचांग",
    hindi_romanised: ["panchang", "panchanga", "panchaang", "pancang"],
    english: ["almanac", "vedic calendar", "daily panchang"],
    related: ["tithi", "nakshatra", "yoga", "karana", "vara"],
  },
  nakshatra: {
    canonical: "nakshatra",
    devanagari: "नक्षत्र",
    hindi_romanised: ["nakshatra", "nakshatr", "nakshtr", "nakshatram"],
    english: ["lunar mansion", "constellation", "asterism"],
    related: ["pada", "lord", "deity"],
  },
  graha: {
    canonical: "graha",
    devanagari: "ग्रह",
    hindi_romanised: ["graha", "grah", "grih"],
    english: ["planet", "celestial body"],
    related: ["navagraha", "graha shanti"],
  },
  bhava: {
    canonical: "bhava",
    devanagari: "भाव",
    hindi_romanised: ["bhava", "bhav", "bhaav"],
    english: ["house", "field", "domain"],
    related: ["pratham bhava", "kendra", "trikona", "dusthana"],
  },
  stotra: {
    canonical: "stotra",
    devanagari: "स्तोत्र",
    hindi_romanised: ["stotra", "stotram", "stotr", "strot"],
    english: ["hymn", "praise hymn", "sacred recitation"],
    related: ["aditya hridayam", "chandra stotra", "mangala stotra"],
  },
  rudraksha: {
    canonical: "rudraksha",
    devanagari: "रुद्राक्ष",
    hindi_romanised: ["rudraksha", "rudraksh", "rudraaksh", "rudrakcha"],
    english: ["rudraksha bead", "elaeocarpus seed"],
    related: ["mukhi", "ek mukhi", "panch mukhi"],
  },
  ratna: {
    canonical: "ratna",
    devanagari: "रत्न",
    hindi_romanised: ["ratna", "ratan", "rattan"],
    english: ["gemstone", "gem", "jewel"],
    related: ["navaratna", "manik", "moti", "moonga"],
  },
  yantra: {
    canonical: "yantra",
    devanagari: "यंत्र",
    hindi_romanised: ["yantra", "yantram", "yantr"],
    english: ["sacred geometric diagram", "mystical diagram"],
    related: ["sri yantra", "surya yantra", "mahalaxmi yantra"],
  },
  vastu: {
    canonical: "vastu",
    devanagari: "वास्तु",
    hindi_romanised: ["vastu", "vaastu", "wastu"],
    english: ["vedic architecture", "spatial science", "vastu shastra"],
    related: ["vastu shastra", "vastu purusha", "dik"],
  },
  diwali: {
    canonical: "diwali",
    devanagari: "दीवाली",
    hindi_romanised: ["diwali", "deepavali", "dipavali", "deewali"],
    english: ["festival of lights"],
    related: ["lakshmi puja", "dhanteras", "naraka chaturdashi", "bhai dooj"],
  },
};

/**
 * Look up all variations of a single term across the three registries.
 */
export function getVariations(canonical: string): TermVariation | null {
  return (
    PLANET_VARIATIONS[canonical] ??
    LAGNA_VARIATIONS[canonical] ??
    TERM_VARIATIONS[canonical] ??
    null
  );
}

/**
 * Returns every Romanised + English variant of a canonical term as a
 * flat array. Used by `seo-audit.ts` to count keyword density across
 * spelling variants.
 */
export function flatVariants(canonical: string): string[] {
  const v = getVariations(canonical);
  if (!v) return [canonical];
  return [
    v.canonical,
    ...v.hindi_romanised,
    ...v.english,
    ...v.related,
  ];
}

/**
 * The full registry as a flat object for export to other tools.
 */
export const ALL_VARIATIONS: Record<string, TermVariation> = {
  ...PLANET_VARIATIONS,
  ...LAGNA_VARIATIONS,
  ...TERM_VARIATIONS,
};
