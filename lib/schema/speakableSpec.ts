import type { SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// SpeakableSpecification — hints to voice assistants (Google
// Assistant) which CSS selectors contain speakable content.
// Kept tight to avoid long robotic readouts.
// ─────────────────────────────────────────────────────────────────

export function buildSpeakableSchema(baseUrl: string): SchemaEntity {
  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    "@id": `${baseUrl}#speakable`,
    cssSelector: ["#introduction", ".pull-quote", ".prose-block p:first-child"],
  };
}
