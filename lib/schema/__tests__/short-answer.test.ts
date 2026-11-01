import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildPostSchema } from "../post";
import { shortAnswerOf, speakableSelectorsFor } from "../../short-answer";
import type { ArticlePost } from "../../types";

/**
 * The short answer, on every article and only where it exists.
 *
 * An article that opens with a direct answer is one a search result or an assistant can quote. This site
 * already writes those: 33 articles carry a `tldr` block and 177 more open with an "At a glance" prose
 * block saying the same kind of thing. Neither was reachable by a machine unless it happened to be the
 * first kind, because only `.tldr` was named in the speakable hint.
 *
 * That left two faults. On 188 of 221 articles the hint pointed at a selector matching nothing, which is
 * the error Search Console reports as "no matches found for expression" and the same fault already fixed
 * on muhurta. And the answer those 177 articles do carry was invisible to the structured data.
 *
 * These tests hold the fix: every article has an answer, one function finds it wherever it is written,
 * the structured data carries that exact text, and the speakable hint names only selectors whose elements
 * are actually on the page it is emitted for.
 */

function* articleFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* articleFiles(full);
    else if (name.endsWith(".json") && full.split(/[\\/]/).length >= 4) yield full;
  }
}

function loadPosts(): ArticlePost[] {
  const posts: ArticlePost[] = [];
  for (const file of articleFiles(join(process.cwd(), "content"))) {
    try {
      const post = JSON.parse(readFileSync(file, "utf8")) as ArticlePost;
      if (post && typeof post.slug === "string" && Array.isArray(post.content)) posts.push(post);
    } catch {
      /* not an article */
    }
  }
  return posts;
}

const posts = loadPosts();
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
// The house rules in CLAUDE.md, applied to the one passage most likely to be quoted elsewhere.
const FILLER = /\b(it is worth noting|it is important to understand|delve|tapestry|realm|dive into|in conclusion|furthermore)\b/i;

test("every article has a short answer", () => {
  assert.ok(posts.length > 200, `only ${posts.length} articles loaded`);
  const without = posts.filter((p) => !shortAnswerOf(p)).map((p) => p.slug);
  assert.deepEqual(without, [], `these articles answer nothing up front:\n  ${without.join("\n  ")}`);
});

test("the answer is a real passage, and obeys the house rules", () => {
  const bad: string[] = [];
  for (const post of posts) {
    const a = shortAnswerOf(post);
    if (!a) continue;
    if (a.text.length < 120) bad.push(`${post.slug}: only ${a.text.length} characters`);
    // The budget applies to a passage of several sentences. One sentence is never broken in half, so a
    // single long sentence is allowed through here and is a writing problem rather than a markup one.
    const sentences = (a.text.match(/[.?!]+(\s|$)/g) ?? []).length;
    if (a.text.length > 560 && sentences > 1)
      bad.push(`${post.slug}: ${a.text.length} characters over ${sentences} sentences, too long to quote`);
    if (a.text.length > 560 && sentences <= 1)
      bad.push(`${post.slug}: opens with a single ${a.text.length}-character sentence, a run-on`);
    // A quote has to be a true extract, from the start, ending where a sentence ends.
    if (!a.paragraph.startsWith(a.text.slice(0, 80)))
      bad.push(`${post.slug}: the quotable passage is not the start of the paragraph`);
    if (!/[.?!]$/.test(a.text)) bad.push(`${post.slug}: ends mid-sentence, "...${a.text.slice(-40)}"`);
    if (EMOJI.test(a.text)) bad.push(`${post.slug}: contains an emoji`);
    if (/[–—]/.test(a.text)) bad.push(`${post.slug}: contains an em or en dash`);
    if (FILLER.test(a.text)) bad.push(`${post.slug}: filler, "${a.text.match(FILLER)?.[0]}"`);
  }
  assert.deepEqual(bad, [], `\n  ${bad.join("\n  ")}`);
});

test("a written tldr block wins over the prose opener", () => {
  const withBoth = posts.find(
    (p) =>
      p.content.some((b) => (b as { type?: string }).type === "tldr") &&
      p.content.some(
        (b) =>
          (b as { type?: string; eyebrow?: string }).type === "prose" &&
          /glance/i.test((b as { eyebrow?: string }).eyebrow ?? "")
      )
  );
  assert.ok(withBoth, "no article carries both, so this cannot be checked");
  assert.equal(shortAnswerOf(withBoth!)?.source, "tldr");
});

test("the structured data carries the same words the reader sees", () => {
  const missing: string[] = [];
  for (const post of posts.slice(0, 40)) {
    const a = shortAnswerOf(post);
    const json = JSON.stringify(buildPostSchema(post));
    if (!a) continue;
    if (!json.includes('"#tldr"') && !json.includes("#tldr")) missing.push(`${post.slug}: no TL;DR node`);
    // The first sentence is enough to prove it is the same passage and not a paraphrase.
    const first = a.text.split(/(?<=[.?])\s/)[0].slice(0, 60);
    if (first.length > 20 && !json.includes(JSON.stringify(first).slice(1, -1)))
      missing.push(`${post.slug}: the node does not carry the visible text`);
  }
  assert.deepEqual(missing, [], `\n  ${missing.join("\n  ")}`);
});

test("the speakable hint names only selectors that are on the page", () => {
  const lying: string[] = [];
  for (const post of posts) {
    const sels = speakableSelectorsFor(post);
    const types = new Set(post.content.map((b) => (b as { type?: string }).type));
    if (sels.includes(".geo-answer") && !types.has("geo-answer")) lying.push(`${post.slug}: .geo-answer`);
    if (sels.includes(".faq-answer") && !types.has("faq")) lying.push(`${post.slug}: .faq-answer`);
    if (sels.includes(".pull-quote") && !types.has("pull-quote")) lying.push(`${post.slug}: .pull-quote`);
    if (sels.includes("#tldr") && !shortAnswerOf(post)) lying.push(`${post.slug}: #tldr`);
    if (!sels.length) lying.push(`${post.slug}: no selectors at all`);
  }
  assert.deepEqual(lying, [], `selectors pointing at nothing:\n  ${lying.join("\n  ")}`);
});

test("the block that carries it is addressable, and is not a tinted left bar", () => {
  // Three block types can carry the answer, so all three must be able to take the id, and the renderer
  // must hand it to exactly the block the schema quoted.
  for (const name of ["TldrBlock", "ProseBlock", "ScannableProse"]) {
    const block = readFileSync(join(process.cwd(), `components/post/${name}.tsx`), "utf8");
    assert.match(block, /id=\{anchor \? "tldr"/, `${name} cannot be pointed at by a selector`);
    assert.doesNotMatch(
      block,
      /border(Left|Right|Top|Bottom)\s*:/,
      `${name}: a coloured bar on one side is decoration standing in for hierarchy; use a full hairline`
    );
  }
  const renderer = readFileSync(join(process.cwd(), "components/post/BlockRenderer.tsx"), "utf8");
  assert.match(renderer, /shortAnswerIn\(blocks\)/, "the renderer decides for itself which block is the answer");
  assert.equal(
    (renderer.match(/anchor=\{i === answerIndex\}/g) ?? []).length,
    3,
    "not every block type that can be the answer is being marked"
  );
});
