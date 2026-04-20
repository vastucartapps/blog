import type { DefinedTermEntry } from "./schema/definedTerm";

// ─────────────────────────────────────────────────────────────────
// Master glossary of Sanskrit terms used across the blog.
// Every entry is emitted as a DefinedTerm on /glossary AND pulled
// into the post-level DefinedTermSet when the term is referenced.
// Additions ship here, never inline in a component or per-post.
// ─────────────────────────────────────────────────────────────────

export const GLOSSARY_TERMS: DefinedTermEntry[] = [
  {
    id: "jyotish",
    name: "Jyotish",
    description:
      "Classical Vedic astrology, the science of light and time, codified in the Parashari and Jaimini systems.",
  },
  {
    id: "lagna",
    name: "Lagna",
    description:
      "The ascending sign on the eastern horizon at the moment of birth, the first house of a horoscope.",
  },
  {
    id: "graha",
    name: "Graha",
    description:
      "A planet or celestial body that exerts measurable influence in classical Jyotish.",
  },
  {
    id: "bhava",
    name: "Bhava",
    description:
      "A house of the horoscope; the twelve bhavas partition the sky relative to the lagna.",
  },
  {
    id: "rashi",
    name: "Rashi",
    description:
      "A zodiac sign. The twelve rashis, each 30 degrees, begin at Mesha (Aries).",
  },
  {
    id: "nakshatra",
    name: "Nakshatra",
    description:
      "A lunar mansion. The twenty-seven nakshatras divide the zodiac into 13°20′ arcs.",
  },
  {
    id: "dasha",
    name: "Dasha",
    description:
      "A planetary period. Vimshottari dasha, the most widely used system, spans 120 years across all nine grahas.",
  },
  {
    id: "karaka",
    name: "Karaka",
    description:
      "A significator. Each graha signifies specific life areas; for example, Surya is karaka for soul and father.",
  },
  {
    id: "yoga",
    name: "Yoga",
    description:
      "A combination of planets that creates a specific effect. Classical texts list hundreds of yogas.",
  },
  {
    id: "dosha",
    name: "Dosha",
    description:
      "An affliction in the chart. Common examples include Mangal Dosha, Kaal Sarp Dosha, and Pitru Dosha.",
  },
  {
    id: "muhurta",
    name: "Muhurta",
    description:
      "An auspicious moment selected for beginning an activity, calculated using panchanga.",
  },
  {
    id: "panchanga",
    name: "Panchanga",
    description:
      "The five-limb Vedic calendar: tithi, vara, nakshatra, yoga, and karana.",
  },
  {
    id: "tithi",
    name: "Tithi",
    description:
      "A lunar day. Thirty tithis cover a lunar month across Shukla and Krishna paksha.",
  },
  {
    id: "kundali",
    name: "Kundali",
    description:
      "A natal chart mapping graha positions at the moment of birth. Also called jataka or janma kundali.",
  },
  {
    id: "varga",
    name: "Varga",
    description:
      "A divisional chart. The sixteen vargas (shodashavarga) refine the birth chart for specific life areas.",
  },
  {
    id: "puja",
    name: "Puja",
    description:
      "A devotional ritual. Procedures are codified as vidhi, with specific samagri and mantras.",
  },
  {
    id: "stotra",
    name: "Stotra",
    description:
      "A Sanskrit hymn of praise. Stotras for each graha and deity carry specific remedial and devotional power.",
  },
  {
    id: "mantra",
    name: "Mantra",
    description:
      "A Sanskrit sound formula. Repetition is governed by count (japa), purification, and intent.",
  },
  {
    id: "yantra",
    name: "Yantra",
    description:
      "A geometric diagram that embodies a deity or graha, installed in homes and temples for specific benefits.",
  },
  {
    id: "rudraksha",
    name: "Rudraksha",
    description:
      "The sacred seed of Elaeocarpus ganitrus. Mukhi classification ties each bead to a specific graha or deity.",
  },
  {
    id: "ratna",
    name: "Ratna",
    description:
      "A gemstone. Jyotish ratna shastra prescribes specific ratnas for each graha to amplify or remediate their effect.",
  },
  {
    id: "vastu",
    name: "Vastu Shastra",
    description:
      "The classical Indian science of architecture. Governs direction, room placement, and energetic balance.",
  },
  {
    id: "brahmasthana",
    name: "Brahmasthana",
    description:
      "The sacred centre of a plot or structure in Vastu. Kept open and free of heavy construction.",
  },
  {
    id: "pancha-bhutas",
    name: "Pancha Bhutas",
    description:
      "The five great elements: prithvi (earth), jala (water), agni (fire), vayu (air), akasha (ether).",
  },
  {
    id: "guna-milan",
    name: "Guna Milan",
    description:
      "Eight-koota marriage compatibility analysis based on nakshatra matching. Yields a score out of 36.",
  },
  {
    id: "vimshottari",
    name: "Vimshottari Dasha",
    description:
      "The 120-year planetary period system based on nakshatra lordships, the primary Parashari dasha.",
  },
];

export function findTermsInText(text: string): DefinedTermEntry[] {
  const lower = text.toLowerCase();
  return GLOSSARY_TERMS.filter((t) =>
    lower.includes(t.name.toLowerCase())
  );
}
