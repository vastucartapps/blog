import type { ContentBlock } from "@/lib/types";

const MAX_CHARS = 320;
const MIN_PARAGRAPH_CHARS = 40;
const GLANCE = /at a glance|quick (answer|reference|summary|take)|summary|key points|in short/i;

function toText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function firstParagraph(html: string): string | null {
  for (const m of html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const t = toText(m[1]);
    if (t.length >= MIN_PARAGRAPH_CHARS) return t;
  }
  return null;
}

// Whole sentences only, up to MAX_CHARS. Returns null if even the first
// sentence is longer than the cap (we never cut mid-sentence).
function leadSentences(text: string): string | null {
  const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g);
  if (!sentences) return null;
  let out = "";
  for (const s of sentences) {
    const next = (out ? out + " " : "") + s.trim();
    if (next.length > MAX_CHARS) break;
    out = next;
  }
  return out || null;
}

/**
 * Visible "Quick Takeaway" text for an article, built only from the article's
 * own prose (first real paragraph of the at-a-glance section, else of the first
 * prose block), whole sentences only. Returns null if the article already has
 * an authored tldr block, or has nothing usable. Nothing is generated.
 */
export function buildQuickTakeaway(blocks: ContentBlock[]): string | null {
  if (blocks.some((b) => b.type === "tldr")) return null;
  const proses = blocks.filter((b) => b.type === "prose") as unknown as {
    eyebrow?: string;
    heading?: string;
    html: string;
  }[];
  const glance = proses.filter((b) => GLANCE.test(`${b.eyebrow ?? ""} ${b.heading ?? ""}`));
  for (const b of [...glance, ...proses]) {
    const p = firstParagraph(b.html ?? "");
    const lead = p ? leadSentences(p) : null;
    if (lead) return lead;
  }
  return null;
}
