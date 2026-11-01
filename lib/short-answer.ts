import type { ArticlePost } from "./types";

/**
 * Where an article's short answer actually lives.
 *
 * Articles here answer their question up front in one of two shapes. Thirty-three carry a written `tldr`
 * block labelled "The short answer". A hundred and seventy-seven open instead with a prose block under the
 * eyebrow "At a glance", which is the same thing by another name and was written first.
 *
 * Only the first shape was reachable by a machine. The speakable hint named `.tldr` on every article,
 * including the 188 that have no such element, so on those it pointed at nothing: the "no matches found
 * for expression" that Search Console reports, and the same fault already fixed on muhurta. The answer the
 * other articles do carry reached neither the hint nor the structured data.
 *
 * So the answer is found once, here, wherever it is written, and everything downstream asks this rather
 * than guessing from a class name.
 */

export interface ShortAnswer {
  /** What the reader sees above it. */
  label: string;
  html: string;
  /**
   * The quotable passage as plain text: the opening paragraph, not the whole block.
   *
   * The "At a glance" blocks run to two thousand characters. That is a section, and a machine handed a
   * section as an answer quotes a fragment of it starting halfway through a thought. The first paragraph
   * is where these articles put the answer itself, and `text` is the opening sentences of it, cut at a
   * sentence boundary so a quote of it can never begin mid-thought.
   */
  text: string;
  /** The whole opening paragraph, which `text` is always a prefix of. */
  paragraph: string;
  /** Which shape it was written in, so a written block always beats the prose opener. */
  source: "tldr" | "glance";
  /** Its position in `content`, so the renderer marks the right block and not merely the first. */
  index: number;
}

const GLANCE = /glance|quick reference|quick answer|short answer/i;

// Two block types carry the opener. `scannable-prose` is prose with the sub-headings broken out, and 36
// articles use it for exactly the summary the others write as `prose`; leaving it out made nine articles
// look as though they answered nothing.
const PROSE_TYPES = new Set(["prose", "scannable-prose"]);

/** The opening paragraph of a block, which is the answer; the rest elaborates on it. */
export function firstParagraph(html: string): string {
  const m = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  return htmlToText(m ? m[1] : html);
}

/**
 * The part of the opening paragraph a machine will actually quote.
 *
 * These articles write long: the median opening paragraph is 742 characters and the longest is 1,519.
 * That is this site's register and it is not going to be shortened. But a featured snippet or an assistant
 * takes a couple of sentences, and handing it 1,500 characters means it chooses the cut itself, usually
 * mid-thought.
 *
 * So the cut is made here, and only ever at a sentence boundary, always from the beginning. The result is
 * a true extract of what the reader sees, never a paraphrase and never a fragment starting mid-sentence.
 * A first sentence longer than the budget is kept whole rather than broken.
 */
export function quotablePassage(paragraph: string, budget = 420): string {
  const sentences = paragraph.match(/[^.?!]+[.?!]+(?:\s|$)/g);
  if (!sentences || sentences.length === 0) return paragraph;
  let out = "";
  for (const sentence of sentences) {
    if (out && (out + sentence).trim().length > budget) break;
    out += sentence;
  }
  return (out || sentences[0]).trim();
}

export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function shortAnswerOf(post: ArticlePost): ShortAnswer | null {
  return shortAnswerIn((post.content ?? []) as unknown[]);
}

/**
 * The same answer, found from the blocks alone.
 *
 * The renderer has the blocks and not the post, and it has to mark the very block the structured data
 * quotes. Asking the same function means the id can never end up on a different block from the text.
 */
export function shortAnswerIn(content: unknown[]): ShortAnswer | null {
  const blocks = (content ?? []) as Array<Record<string, unknown>>;

  // A block written to be the answer wins, wherever it sits.
  const tldrIndex = blocks.findIndex((b) => b.type === "tldr" && typeof b.html === "string");
  if (tldrIndex !== -1) {
    const b = blocks[tldrIndex];
    return {
      label: typeof b.label === "string" && b.label.trim() ? b.label : "The short answer",
      html: b.html as string,
      paragraph: firstParagraph(b.html as string),
      text: quotablePassage(firstParagraph(b.html as string)),
      source: "tldr",
      index: tldrIndex,
    };
  }

  // Otherwise the opening prose, but only where its eyebrow says it is a summary. A prose block with no
  // eyebrow is the body of the article, and quoting the body as an answer is how a snippet ends up
  // starting halfway through a sentence.
  // `scannable-prose` keeps its opener in `lead_html` and its body in `subsections`, so the lead is
  // already the passage we want rather than something to be cut out of a longer one.
  const bodyOf = (b: Record<string, unknown>): string | null =>
    typeof b.html === "string" ? b.html : typeof b.lead_html === "string" ? b.lead_html : null;

  const glanceIndex = blocks.findIndex(
    (b) => PROSE_TYPES.has(String(b.type)) && bodyOf(b) !== null && GLANCE.test(String(b.eyebrow ?? ""))
  );
  if (glanceIndex !== -1) {
    const b = blocks[glanceIndex];
    const body = bodyOf(b) as string;
    return {
      label: String(b.eyebrow),
      html: body,
      paragraph: firstParagraph(body),
      text: quotablePassage(firstParagraph(body)),
      source: "glance",
      index: glanceIndex,
    };
  }

  return null;
}

/**
 * The speakable selectors for one article, naming only what that article contains.
 *
 * The old list was the same six selectors for every page. Most pages have no geo-answer block and no pull
 * quote, and a selector that resolves to nothing is reported as an error rather than ignored.
 */
export function speakableSelectorsFor(post: ArticlePost): string[] {
  const types = new Set((post.content ?? []).map((b) => (b as { type?: string }).type));
  const selectors: string[] = [];
  if (shortAnswerOf(post)) selectors.push("#tldr");
  if (types.has("geo-answer")) selectors.push(".geo-answer");
  if (types.has("faq")) selectors.push(".faq-answer");
  if (types.has("pull-quote")) selectors.push(".pull-quote");
  // Always present: every article renders prose.
  selectors.push(".prose-block p:first-child");
  return selectors;
}
