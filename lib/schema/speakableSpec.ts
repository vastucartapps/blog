import type { SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// SpeakableSpecification — hints to voice assistants (Google
// Assistant) which CSS selectors contain speakable content.
// Kept tight to avoid long robotic readouts.
// ─────────────────────────────────────────────────────────────────

const EVERY_PAGE = [".prose-block p:first-child"];

/**
 * Hints to voice assistants and AI engines which passages are liftable.
 *
 * It used to name the same six selectors on every article. Most articles have no geo-answer block and no
 * pull quote, and only 33 of 221 had a `.tldr` element at all, so on the rest those selectors resolved to
 * nothing. Search Console reports that as "no matches found for expression" rather than ignoring it, which
 * is the same fault already fixed on muhurta.
 *
 * Callers now pass the selectors that are true of the page being emitted. The default is the one selector
 * every article satisfies, so a caller that passes nothing still cannot claim something false.
 */
export function buildSpeakableSchema(baseUrl: string, cssSelector: string[] = EVERY_PAGE): SchemaEntity {
  return {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    "@id": `${baseUrl}#speakable`,
    cssSelector: cssSelector.length ? cssSelector : EVERY_PAGE,
  };
}
