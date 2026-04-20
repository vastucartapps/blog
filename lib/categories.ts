import type { CategoryDef, NetworkNode } from "./types";

export const CATEGORIES: CategoryDef[] = [
  {
    id: "jyotish",
    slug: "jyotish",
    label: "Jyotish",
    label_hindi: "ज्योतिष",
    description:
      "Classical Vedic astrology, from graha placements and lagna profiles to dashas, yogas, and remedial practice.",
    icon_name: "kundali",
    color_var: "saffron",
    author_id: "pt-raghav-sharma",
    sort_order: 1,
    post_count_target: 600,
    subcategories: [
      { id: "graha-in-bhava", slug: "graha-in-bhava", label: "Graha in Bhava", label_hindi: "ग्रह भाव में", description: "Every planet in every house, interpreted for every lagna.", target_post_count: 108 },
      { id: "graha-states", slug: "graha-states", label: "Graha States", label_hindi: "ग्रह अवस्था", description: "Uchha, neecha, digbali, asta, vakri, baaladi avasthas.", target_post_count: 60 },
      { id: "conjunctions", slug: "conjunctions", label: "Conjunctions", label_hindi: "ग्रह युति", description: "Two-planet, three-planet conjunctions and their yogas.", target_post_count: 80 },
      { id: "lagna-profiles", slug: "lagna-profiles", label: "Lagna Profiles", label_hindi: "लग्न परिचय", description: "Complete lagna personality, career, health and remedies.", target_post_count: 12 },
      { id: "rashi-profiles", slug: "rashi-profiles", label: "Rashi Profiles", label_hindi: "राशि परिचय", description: "The twelve rashis, their nature, lords and karakatva.", target_post_count: 12 },
      { id: "nakshatra", slug: "nakshatra", label: "Nakshatra", label_hindi: "नक्षत्र", description: "All 27 nakshatras with padas, deities and qualities.", target_post_count: 27 },
      { id: "dasha", slug: "dasha", label: "Dasha", label_hindi: "दशा", description: "Vimshottari mahadasha, antardasha and timing techniques.", target_post_count: 60 },
      { id: "yogas", slug: "yogas", label: "Yogas", label_hindi: "योग", description: "Raja yogas, dhana yogas, viparita raja yogas and nabhasa yogas.", target_post_count: 80 },
      { id: "remedies", slug: "remedies", label: "Remedies", label_hindi: "उपाय", description: "Classical remedial measures, mantra, charity and daana.", target_post_count: 40 },
    ],
  },
  {
    id: "numerology",
    slug: "numerology",
    label: "Numerology",
    label_hindi: "अंक ज्योतिष",
    description: "Life path, destiny, name numerology and angel numbers, rooted in Vedic numbers and Chaldean practice.",
    icon_name: "star",
    color_var: "teal",
    author_id: "vastucart-editorial",
    sort_order: 2,
    post_count_target: 150,
    subcategories: [
      { id: "life-path", slug: "life-path", label: "Life Path", label_hindi: "जीवन पथ", description: "Life path numbers 1 through 9 and master numbers.", target_post_count: 12 },
      { id: "destiny-number", slug: "destiny-number", label: "Destiny Number", label_hindi: "भाग्यांक", description: "Destiny and expression numbers from full name.", target_post_count: 12 },
      { id: "name-numerology", slug: "name-numerology", label: "Name Numerology", label_hindi: "नाम अंक", description: "Name vibration and correction for every number.", target_post_count: 18 },
      { id: "angel-numbers", slug: "angel-numbers", label: "Angel Numbers", label_hindi: "परी अंक", description: "Repeating numbers and their spiritual message.", target_post_count: 60 },
      { id: "mobile-numerology", slug: "mobile-numerology", label: "Mobile Numerology", label_hindi: "मोबाइल अंक", description: "Phone number vibration and lucky number selection.", target_post_count: 12 },
      { id: "house-number", slug: "house-number", label: "House Number", label_hindi: "घर का अंक", description: "House number meaning and compatibility with owners.", target_post_count: 12 },
      { id: "dob-analysis", slug: "dob-analysis", label: "DOB Analysis", label_hindi: "जन्मतिथि", description: "Date of birth analysis with psychic and destiny numbers.", target_post_count: 24 },
    ],
  },
  {
    id: "tarot",
    slug: "tarot",
    label: "Tarot",
    label_hindi: "टैरो",
    description: "All 78 tarot cards, spreads, and readings grounded in traditional Rider Waite and Thoth systems.",
    icon_name: "tarot",
    color_var: "rose",
    author_id: "vastucart-editorial",
    sort_order: 3,
    post_count_target: 200,
    subcategories: [
      { id: "major-arcana", slug: "major-arcana", label: "Major Arcana", label_hindi: "मेजर अर्कना", description: "All 22 major arcana cards, upright and reversed.", target_post_count: 22 },
      { id: "minor-arcana", slug: "minor-arcana", label: "Minor Arcana", label_hindi: "माइनर अर्कना", description: "Wands, cups, swords and pentacles, every card covered.", target_post_count: 56 },
      { id: "tarot-spreads", slug: "tarot-spreads", label: "Tarot Spreads", label_hindi: "टैरो स्प्रेड", description: "Celtic cross, three-card, horseshoe and niche spreads.", target_post_count: 30 },
      { id: "tarot-by-zodiac", slug: "tarot-by-zodiac", label: "Tarot by Zodiac", label_hindi: "राशि टैरो", description: "Tarot readings tailored for each sun sign.", target_post_count: 12 },
      { id: "yes-no-tarot", slug: "yes-no-tarot", label: "Yes or No Tarot", label_hindi: "हाँ या नहीं", description: "Single-card yes-or-no reading interpretation.", target_post_count: 20 },
      { id: "love-tarot", slug: "love-tarot", label: "Love Tarot", label_hindi: "प्रेम टैरो", description: "Romance and relationship readings.", target_post_count: 30 },
      { id: "career-tarot", slug: "career-tarot", label: "Career Tarot", label_hindi: "करियर टैरो", description: "Work, wealth and vocation readings.", target_post_count: 30 },
    ],
  },
  {
    id: "vastu",
    slug: "vastu",
    label: "Vastu",
    label_hindi: "वास्तु",
    description: "Vastu shastra for home, office and land, covering direction, room placement, and remedial corrections.",
    icon_name: "vastu",
    color_var: "gold",
    author_id: "vastucart-editorial",
    sort_order: 4,
    post_count_target: 150,
    subcategories: [
      { id: "directions", slug: "directions", label: "Directions", label_hindi: "दिशाएँ", description: "Eight directions, their deities and ideal usage.", target_post_count: 10 },
      { id: "rooms", slug: "rooms", label: "Rooms", label_hindi: "कक्ष", description: "Vastu for kitchen, bedroom, pooja room, study and more.", target_post_count: 18 },
      { id: "entrance", slug: "entrance", label: "Entrance", label_hindi: "द्वार", description: "Main door direction, thresholds and auspicious entries.", target_post_count: 10 },
      { id: "remedies-vastu", slug: "remedies-vastu", label: "Remedies", label_hindi: "वास्तु उपाय", description: "Non-structural corrections for Vastu doshas.", target_post_count: 30 },
      { id: "yantras", slug: "yantras", label: "Yantras", label_hindi: "यंत्र", description: "Yantras for home placement and energetic balance.", target_post_count: 25 },
      { id: "plants-vastu", slug: "plants-vastu", label: "Plants", label_hindi: "वास्तु पौधे", description: "Auspicious plants and their ideal directions.", target_post_count: 20 },
      { id: "colours-vastu", slug: "colours-vastu", label: "Colours", label_hindi: "वास्तु रंग", description: "Wall colours by direction and resident\u2019s nature.", target_post_count: 12 },
    ],
  },
  {
    id: "puja",
    slug: "puja",
    label: "Puja and Vidhi",
    label_hindi: "पूजा विधि",
    description:
      "Complete puja procedures, mantras, samagri, step-by-step vidhi, and significance for every major ritual and deity, from Vastu Puja to Diwali Puja.",
    icon_name: "bell",
    color_var: "saffron",
    author_id: "vastucart-editorial",
    sort_order: 5,
    post_count_target: 104,
    subcategories: [
      { id: "graha-puja", slug: "graha-puja", label: "Graha Puja", label_hindi: "ग्रह पूजा", description: "Puja vidhi for all nine planets.", target_post_count: 9 },
      { id: "deity-puja", slug: "deity-puja", label: "Deity Puja Vidhi", label_hindi: "देवता पूजा", description: "Complete vidhi for major deities such as Ganesh, Lakshmi, Saraswati, Hanuman, Durga and Shiva.", target_post_count: 33 },
      { id: "vrat", slug: "vrat", label: "Vrat and Upvas", label_hindi: "व्रत", description: "Fasting procedures, vrat katha, and significance.", target_post_count: 30 },
      { id: "havan", slug: "havan", label: "Havan and Yagna", label_hindi: "हवन", description: "Fire ritual procedures, samagri, and mantras.", target_post_count: 20 },
      { id: "daily-puja", slug: "daily-puja", label: "Daily Puja Routine", label_hindi: "नित्य पूजा", description: "Morning and evening puja guidance for the home shrine.", target_post_count: 12 },
    ],
  },
  {
    id: "festivals",
    slug: "festivals",
    label: "Festivals",
    label_hindi: "त्यौहार",
    description: "Major Hindu festivals with dates, muhurta and authentic puja procedures.",
    icon_name: "calendar",
    color_var: "rose",
    author_id: "vastucart-editorial",
    sort_order: 6,
    post_count_target: 80,
    subcategories: [
      { id: "major-festivals", slug: "major-festivals", label: "Major Festivals", label_hindi: "मुख्य त्यौहार", description: "Diwali, Holi, Navratri, Ganesh Chaturthi and more.", target_post_count: 20 },
      { id: "ekadashi", slug: "ekadashi", label: "Ekadashi", label_hindi: "एकादशी", description: "All 24 ekadashi vrats, their katha and vidhi.", target_post_count: 24 },
      { id: "amavasya", slug: "amavasya", label: "Amavasya", label_hindi: "अमावस्या", description: "Amavasya significance, pitru tarpan and practice.", target_post_count: 12 },
      { id: "purnima", slug: "purnima", label: "Purnima", label_hindi: "पूर्णिमा", description: "Full moon vrats and lunar observances.", target_post_count: 12 },
      { id: "navratri", slug: "navratri", label: "Navratri", label_hindi: "नवरात्रि", description: "Nine nights, nine devis, complete worship guide.", target_post_count: 12 },
    ],
  },
  {
    id: "gemstones",
    slug: "gemstones",
    label: "Gemstones",
    label_hindi: "रत्न",
    description: "Authentic Jyotish gemstone guidance by planet, lagna, finger, metal and wearing vidhi.",
    icon_name: "gem",
    color_var: "teal",
    author_id: "pt-raghav-sharma",
    sort_order: 7,
    post_count_target: 90,
    subcategories: [
      { id: "by-planet", slug: "by-planet", label: "By Planet", label_hindi: "ग्रह अनुसार", description: "Gemstones for each of the nine planets.", target_post_count: 9 },
      { id: "by-lagna", slug: "by-lagna", label: "By Lagna", label_hindi: "लग्न अनुसार", description: "Recommended gems for every lagna.", target_post_count: 12 },
      { id: "combinations", slug: "combinations", label: "Combinations", label_hindi: "युग्म रत्न", description: "Compatible and contraindicated gem pairings.", target_post_count: 40 },
      { id: "buying-guide", slug: "buying-guide", label: "Buying Guide", label_hindi: "खरीद गाइड", description: "Quality, carat, clarity and sourcing guidance.", target_post_count: 20 },
    ],
  },
  {
    id: "rudraksha",
    slug: "rudraksha",
    label: "Rudraksha",
    label_hindi: "रुद्राक्ष",
    description: "All mukhi rudraksha beads with ruling planet, deity, benefit and wearing protocol.",
    icon_name: "beads",
    color_var: "gold",
    author_id: "pt-raghav-sharma",
    sort_order: 8,
    post_count_target: 60,
    subcategories: [
      { id: "by-mukhi", slug: "by-mukhi", label: "By Mukhi", label_hindi: "मुखी अनुसार", description: "One to fourteen mukhi rudraksha, each explained.", target_post_count: 14 },
      { id: "by-planet", slug: "by-planet", label: "By Planet", label_hindi: "ग्रह अनुसार", description: "Rudraksha recommended for each graha.", target_post_count: 9 },
      { id: "by-lagna", slug: "by-lagna", label: "By Lagna", label_hindi: "लग्न अनुसार", description: "Mukhi selection tailored to your lagna.", target_post_count: 12 },
    ],
  },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategory(categorySlug: string, subSlug: string) {
  const cat = getCategory(categorySlug);
  return cat?.subcategories.find((s) => s.slug === subSlug);
}

// ──────────────────────────────────────────
// VASTUCART NETWORK (Organization sameAs + internal links)
// Source: public/Presence links.txt
// ──────────────────────────────────────────

export const VASTUCART_NETWORK: Record<string, NetworkNode> = {
  "vastucart.in": {
    label: "VastuCart Tools",
    description: "33 free Vastu and astrology tools in one place.",
    domain: "vastucart.in",
    url: "https://vastucart.in",
    icon: "vastu",
    cta_text: "Explore 33 free tools",
    relevant_for: ["vastu", "remedies-vastu", "remedies", "directions", "rooms"],
  },
  "kundali.vastucart.in": {
    label: "Kundali Generator",
    description: "Free birth chart with planetary positions, house cusps and dasha.",
    domain: "kundali.vastucart.in",
    url: "https://kundali.vastucart.in",
    icon: "kundali",
    cta_text: "Get your free Kundali",
    relevant_for: ["jyotish", "lagna-profiles", "graha-in-bhava", "nakshatra", "dasha"],
  },
  "blog.vastucart.in": {
    label: "VastuCart Blog",
    description: "Deep Vedic astrology, Jyotish and spiritual wisdom articles.",
    domain: "blog.vastucart.in",
    url: "https://blog.vastucart.in",
    icon: "book",
    cta_text: "Read more articles",
    relevant_for: [],
  },
  "store.vastucart.in": {
    label: "VastuCart Store",
    description: "Certified gemstones, rudraksha, yantras and puja samagri.",
    domain: "store.vastucart.in",
    url: "https://store.vastucart.in",
    icon: "shop",
    cta_text: "Shop authentic items",
    relevant_for: ["gemstones", "rudraksha", "yantras"],
  },
  "panchang.vastucart.in": {
    label: "Panchang",
    description: "Daily panchang with tithi, nakshatra, yoga, karana and muhurta.",
    domain: "panchang.vastucart.in",
    url: "https://panchang.vastucart.in",
    icon: "panchang",
    cta_text: "View today\u2019s panchang",
    relevant_for: ["festivals", "major-festivals", "ekadashi", "amavasya", "purnima"],
  },
  "stotra.vastucart.in": {
    label: "Stotra Library",
    description: "Authentic Sanskrit stotras with transliteration and meaning.",
    domain: "stotra.vastucart.in",
    url: "https://stotra.vastucart.in",
    icon: "book",
    cta_text: "Open the stotra library",
    relevant_for: ["stotra", "graha-stotra", "deity-stotra", "chalisa", "kavach"],
  },
  "horoscope.vastucart.in": {
    label: "Daily Horoscope",
    description: "Daily, weekly and monthly horoscope for all twelve rashis.",
    domain: "horoscope.vastucart.in",
    url: "https://horoscope.vastucart.in",
    icon: "horoscope",
    cta_text: "Read today\u2019s horoscope",
    relevant_for: ["jyotish", "rashi-profiles", "tarot-by-zodiac"],
  },
  "muhurta.vastucart.in": {
    label: "Muhurta Finder",
    description: "Auspicious muhurta for wedding, travel, business and more.",
    domain: "muhurta.vastucart.in",
    url: "https://muhurta.vastucart.in",
    icon: "muhurta",
    cta_text: "Find your muhurta",
    relevant_for: ["jyotish", "dasha", "remedies", "major-festivals"],
  },
  "wedding.vastucart.in": {
    label: "Wedding Matching",
    description: "Ashtakoot milan, guna matching and mangal dosha analysis.",
    domain: "wedding.vastucart.in",
    url: "https://wedding.vastucart.in",
    icon: "user",
    cta_text: "Match kundalis",
    relevant_for: ["jyotish", "lagna-profiles", "rashi-profiles"],
  },
  "tarot.vastucart.in": {
    label: "Tarot Reading",
    description: "Free tarot readings with detailed interpretations.",
    domain: "tarot.vastucart.in",
    url: "https://tarot.vastucart.in",
    icon: "tarot",
    cta_text: "Draw a tarot card",
    relevant_for: ["tarot", "major-arcana", "minor-arcana", "love-tarot", "career-tarot"],
  },
};

// Organization sameAs for JSON-LD (all subdomains + social presence).
// Source of truth: public/Presence links.txt
export const ORGANIZATION_SAME_AS: string[] = [
  "https://vastucart.in",
  "https://kundali.vastucart.in",
  "https://blog.vastucart.in",
  "https://store.vastucart.in",
  "https://panchang.vastucart.in",
  "https://stotra.vastucart.in",
  "https://horoscope.vastucart.in",
  "https://muhurta.vastucart.in",
  "https://wedding.vastucart.in",
  "https://tarot.vastucart.in",
  "https://www.facebook.com/vastucartindia",
  "https://www.instagram.com/vastucart/",
  "https://vastucart.etsy.com",
  "https://www.amazon.in/s?k=vastucart",
  "https://in.pinterest.com/vastucart/",
  "https://www.threads.com/@vastucart",
  "https://x.com/vastucart",
  "https://www.youtube.com/@vastucart",
  "https://www.linkedin.com/company/vastucart",
];

// Knowledge Graph entity references — Wikidata, DBpedia, Wikipedia.
// Used as additional `sameAs` on the canonical Organization schema
// so Google can match VastuCart entities to existing Knowledge Graph
// nodes for jyotish, vastu, vedic astrology, etc.
export const KNOWLEDGE_GRAPH_REFS: string[] = [
  "https://www.wikidata.org/wiki/Q201930",  // Hindu astrology
  "https://en.wikipedia.org/wiki/Hindu_astrology",
  "https://www.wikidata.org/wiki/Q200878",  // Vastu shastra
  "https://en.wikipedia.org/wiki/Vastu_shastra",
];
