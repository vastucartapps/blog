import { SITE_URL } from "../utils";
import { BRAND, GLOSSARY_ID, type SchemaEntity } from "./constants";

export interface DefinedTermEntry {
  id: string;
  name: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────
// DefinedTermSet + DefinedTerm × N. Declares the glossary of
// Sanskrit terms that recur across the blog so Google can link each
// first-use italicised term to its authoritative definition.
// ─────────────────────────────────────────────────────────────────

const DEFAULT_TERMS: DefinedTermEntry[] = [
  {
    id: "jyotish",
    name: "Jyotish",
    description:
      "Classical Vedic astrology, the science of light and time, codified in Parashari and Jaimini systems.",
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
];

export function buildDefinedTermSchemas(
  terms?: DefinedTermEntry[]
): SchemaEntity[] {
  const list = terms && terms.length > 0 ? terms : DEFAULT_TERMS;

  const entities: SchemaEntity[] = [];

  entities.push({
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": GLOSSARY_ID,
    name: `${BRAND.blogName} Glossary`,
    description:
      "Canonical glossary of Sanskrit terms used across the VastuCart Jyotish, Tarot, Numerology, Vastu, Puja, Festivals, Gemstones, and Rudraksha knowledge cluster.",
    url: `${SITE_URL}/glossary`,
  });

  for (const term of list) {
    entities.push({
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/glossary#${term.id}`,
      name: term.name,
      description: term.description,
      inDefinedTermSet: { "@id": GLOSSARY_ID },
      termCode: term.id,
      url: `${SITE_URL}/glossary#${term.id}`,
    });
  }

  return entities;
}
