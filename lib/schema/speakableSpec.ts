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
    // GEO/AEO: target the liftable, self-contained passages — the
    // TL;DR opener, every question-level direct answer, and FAQ
    // answers — so voice assistants and AI engines quote clean blocks.
    cssSelector: [
      "#introduction",
      ".tldr",
      ".geo-answer",
      ".faq-answer",
      ".pull-quote",
      ".prose-block p:first-child",
    ],
  };
}
