import { SITE_URL } from "../utils";
import { BLOG_WEBSITE_REF, ORG_REF, type SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// Book schema — for classical-sources page.
//
// Each Sanskrit text is emitted as a Book (CreativeWork subtype),
// with inLanguage: Sanskrit, genre, and author where historically
// attributed. The Book @id is stable so future references can cite
// it by @id across pages.
// ─────────────────────────────────────────────────────────────────

export interface BookInput {
  id: string; // slug used in @id fragment
  name: string;
  alternateName?: string[]; // sanskrit + transliteration
  author?: string;
  genre: string;
  description: string;
  inLanguage?: string | string[];
  /** Approximate century or date if known. */
  datePublished?: string;
  /** External knowledge graph references. */
  sameAs?: string[];
  /** Anchor URL back to the classical-sources page entry. */
  url?: string;
}

export function buildBookSchema(
  input: BookInput,
  hostUrl: string
): SchemaEntity {
  const url = input.url ?? `${hostUrl}#${input.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${hostUrl}#book-${input.id}`,
    name: input.name,
    ...(input.alternateName && input.alternateName.length > 0
      ? { alternateName: input.alternateName }
      : {}),
    ...(input.author
      ? {
          author: {
            "@type": "Person",
            name: input.author,
          },
        }
      : {}),
    genre: input.genre,
    description: input.description,
    inLanguage: input.inLanguage ?? "sa",
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.sameAs && input.sameAs.length > 0 ? { sameAs: input.sameAs } : {}),
    isPartOf: BLOG_WEBSITE_REF,
    publisher: ORG_REF,
    url,
    mainEntityOfPage: hostUrl,
  };
}

export function buildBookSchemas(
  inputs: BookInput[],
  hostUrl: string
): SchemaEntity[] {
  return inputs.map((b) => buildBookSchema(b, hostUrl));
}

export const CLASSICAL_BOOKS: BookInput[] = [
  {
    id: "bphs",
    name: "Brihat Parashara Hora Shastra",
    alternateName: ["बृहत् पाराशर होरा शास्त्र", "BPHS"],
    author: "Maharshi Parashara",
    genre: "Jyotish (Vedic Astrology)",
    description:
      "Foundational Parashari treatise on houses, planets, yogas, dashas, and remedies. Primary reference for classical Jyotish interpretation.",
    sameAs: [
      "https://en.wikipedia.org/wiki/Brihat_Parashara_Hora_Shastra",
    ],
  },
  {
    id: "jaimini-sutras",
    name: "Jaimini Sutras",
    alternateName: ["जैमिनि सूत्र", "Jaimini Sutra"],
    author: "Maharshi Jaimini",
    genre: "Jyotish (Vedic Astrology)",
    description:
      "System of chara dashas, arudha lagnas, and karaka-based analysis. Used alongside the Parashari framework for specialised timing.",
  },
  {
    id: "saravali",
    name: "Saravali",
    alternateName: ["सारावली"],
    author: "Kalyan Varma",
    genre: "Jyotish (Vedic Astrology)",
    description:
      "Tenth-century compendium on natal analysis. Strong reference for planetary conjunctions, yogas, and marriage timing.",
    datePublished: "0900",
  },
  {
    id: "phaladeepika",
    name: "Phaladeepika",
    alternateName: ["फलदीपिका"],
    author: "Mantreswara",
    genre: "Jyotish (Vedic Astrology)",
    description:
      "Classical predictive manual on longevity, profession, and special nakshatra combinations.",
  },
  {
    id: "brihat-jataka",
    name: "Brihat Jataka",
    alternateName: ["बृहत् जातक"],
    author: "Varahamihira",
    genre: "Jyotish (Vedic Astrology)",
    description:
      "Sixth-century natal astrology text. Definitive on planetary dignity, house meanings, and early yoga formulations.",
    datePublished: "0550",
    sameAs: ["https://en.wikipedia.org/wiki/Var%C4%81hamihira"],
  },
  {
    id: "brihat-samhita",
    name: "Brihat Samhita",
    alternateName: ["बृहत् संहिता"],
    author: "Varahamihira",
    genre: "Jyotish and Vastu",
    description:
      "Encyclopaedic treatise on omens, planetary influences on society, muhurta selection, and civic architecture.",
    datePublished: "0550",
    sameAs: ["https://en.wikipedia.org/wiki/Brihat_Samhita"],
  },
  {
    id: "manasara",
    name: "Manasara",
    alternateName: ["मानसार"],
    genre: "Vastu Shastra",
    description:
      "Ancient Sanskrit manual on architecture and sculpture. Primary source for direction, room placement, and temple geometry.",
    sameAs: ["https://en.wikipedia.org/wiki/Manasara"],
  },
  {
    id: "mayamatam",
    name: "Mayamatam",
    genre: "Vastu Shastra",
    description:
      "South Indian Vastu and Shilpa classic. Used alongside Manasara for Vastu Purusha Mandala and site selection.",
  },
  {
    id: "vishwakarma-prakash",
    name: "Vishwakarma Prakash",
    genre: "Vastu Shastra",
    description:
      "Vastu text attributed to Vishwakarma. Informs entrance placement, brahmasthana rules, and residential Vastu.",
  },
  {
    id: "rider-waite",
    name: "The Pictorial Key to the Tarot",
    author: "A. E. Waite",
    genre: "Tarot",
    description:
      "Canonical Rider Waite tarot imagery and interpretive manual. Reference deck for Major and Minor Arcana articles.",
    inLanguage: "en",
    datePublished: "1910",
    sameAs: [
      "https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_tarot_deck",
      "https://en.wikipedia.org/wiki/A._E._Waite",
    ],
  },
  {
    id: "nirnaya-sindhu",
    name: "Nirnaya Sindhu",
    alternateName: ["निर्णय सिन्धु"],
    author: "Kamalakara Bhatta",
    genre: "Festivals and Muhurta",
    description:
      "Seventeenth-century authority on vrata, tithi, muhurta, and ritual timing. Drives festival date resolution and ekadashi logic.",
    datePublished: "1612",
  },
  {
    id: "dharma-sindhu",
    name: "Dharma Sindhu",
    author: "Kashinath Upadhyay",
    genre: "Festivals and Puja",
    description:
      "Companion text to Nirnaya Sindhu. Consulted for puja procedure, auspicious timing, and samskara sequences.",
  },
  {
    id: "garuda-purana",
    name: "Garuda Purana",
    alternateName: ["गरुड़ पुराण"],
    genre: "Purana (Sacred History)",
    description:
      "Puranic source for Rudraksha lineage, mukhi classification, and Shiva worship principles.",
    sameAs: ["https://en.wikipedia.org/wiki/Garuda_Purana"],
  },
  {
    id: "rudraksha-jabala-upanishad",
    name: "Rudraksha Jabala Upanishad",
    genre: "Upanishad",
    description:
      "Primary Upanishadic text on the origin and classification of Rudraksha. Authoritative for mukhi significance.",
    sameAs: ["https://en.wikipedia.org/wiki/Rudraksha_Jabala_Upanishad"],
  },
  {
    id: "ratna-pariksha",
    name: "Ratna Pariksha",
    genre: "Gemmology",
    description:
      "Classical gemmology treatises within the Garuda Purana and Agni Purana traditions. Informs quality, carat, and wearing guidance for Jyotish gemstones.",
  },
  {
    id: "pythagorean-numerology",
    name: "Pythagorean Numerology",
    genre: "Numerology",
    description:
      "The A=1..Z=26 reduction system. Used for Life Path, Destiny, and Expression number calculations.",
    inLanguage: "en",
  },
  {
    id: "chaldean-numerology",
    name: "Chaldean Numerology",
    genre: "Numerology",
    description:
      "Older Chaldean letter-value table based on sound vibration. Applied for name numerology corrections and vibration analysis.",
    inLanguage: "en",
  },
];
