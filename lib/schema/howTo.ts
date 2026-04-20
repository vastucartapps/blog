import type { ContentBlock } from "../types";
import type { SchemaEntity } from "./constants";

// ─────────────────────────────────────────────────────────────────
// HowTo — one per puja-vidhi or wearing-ritual content block.
// Gated: emission requires at least 2 steps with non-empty text.
// ─────────────────────────────────────────────────────────────────

export function buildHowToSchemas(
  blocks: ContentBlock[],
  baseUrl: string
): SchemaEntity[] {
  const out: SchemaEntity[] = [];

  for (const b of blocks) {
    if (b.type === "puja-vidhi" && b.steps && b.steps.length >= 2) {
      out.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "@id": `${baseUrl}#howto-puja-vidhi`,
        name: b.heading ?? "Puja vidhi",
        description: b.eyebrow ?? "Step by step puja procedure",
        totalTime: "PT45M",
        step: b.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.description,
        })),
      });
    } else if (
      b.type === "wearing-ritual" &&
      b.steps &&
      b.steps.length >= 2
    ) {
      out.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "@id": `${baseUrl}#howto-wearing-ritual`,
        name: b.heading ?? "Gemstone wearing ritual",
        description: b.eyebrow ?? "Step by step wearing procedure",
        totalTime: "PT30M",
        step: b.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.action,
          text: `${s.action}. ${s.timing}.${
            s.mantra ? " Mantra: " + s.mantra : ""
          }`,
        })),
      });
    }
  }

  return out;
}
