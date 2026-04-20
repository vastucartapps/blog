import type { SchemaEntity } from "./constants";

export interface FAQInput {
  q: string;
  a: string;
}

// ─────────────────────────────────────────────────────────────────
// FAQPage — emits only when at least 2 real Q/A pairs exist, per
// Google's FAQ rich result guidelines. Returns null otherwise.
// ─────────────────────────────────────────────────────────────────

export function buildFAQPageSchema(
  items: FAQInput[],
  baseUrl: string
): SchemaEntity | null {
  const valid = items.filter((i) => i.q?.trim() && i.a?.trim());
  if (valid.length < 2) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}#faq`,
    mainEntity: valid.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.a,
      },
    })),
  };
}
