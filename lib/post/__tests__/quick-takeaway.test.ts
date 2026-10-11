import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildQuickTakeaway } from "../quick-takeaway";
import type { ContentBlock } from "../../types";

const prose = (html: string, extra: Record<string, string> = {}) =>
  ({ type: "prose", html, ...extra }) as unknown as ContentBlock;

test("returns null when the article has no prose", () => {
  assert.equal(buildQuickTakeaway([{ type: "divider" } as ContentBlock]), null);
});

test("returns null when the article already has a tldr block", () => {
  const blocks = [
    { type: "tldr", html: "<p>Short answer here.</p>" } as unknown as ContentBlock,
    prose("<p>Some long prose paragraph about the topic. It continues here.</p>"),
  ];
  assert.equal(buildQuickTakeaway(blocks), null);
});

test("uses only words from the article, strips tags and entities", () => {
  const out = buildQuickTakeaway([
    prose("<p>Mars in the <a href='/x'>8th house</a> is a &amp; careful placement. Second sentence follows.</p>"),
  ]);
  assert.equal(out, "Mars in the 8th house is a & careful placement. Second sentence follows.");
});

test("prefers an at-a-glance section over an earlier prose block", () => {
  const out = buildQuickTakeaway([
    prose("<p>Intro paragraph that is long enough to count as a real paragraph. More.</p>"),
    prose("<p>Glance paragraph is the summary. It has two sentences.</p>", { eyebrow: "At a glance" }),
  ]);
  assert.match(out ?? "", /^Glance paragraph is the summary\./);
});

test("caps length at a sentence boundary and never mid-sentence", () => {
  const long = Array.from({ length: 12 }, (_, i) => `Sentence number ${i} says something specific.`).join(" ");
  const out = buildQuickTakeaway([prose(`<p>${long}</p>`)]) ?? "";
  assert.ok(out.length <= 320, `length ${out.length}`);
  assert.ok(out.endsWith("."));
  assert.ok(long.startsWith(out));
});

test("skips paragraphs too short to be a takeaway", () => {
  const out = buildQuickTakeaway([prose("<p>Hi.</p><p>This second paragraph is the first real one with substance.</p>")]);
  assert.equal(out, "This second paragraph is the first real one with substance.");
});

test("every published article: output is a substring of its own text", () => {
  function* files(dir: string): Generator<string> {
    for (const n of readdirSync(dir)) {
      const f = join(dir, n);
      if (statSync(f).isDirectory()) yield* files(f);
      else if (n.endsWith(".json") && f.split(/[\\/]/).length >= 4) yield f;
    }
  }
  let withTakeaway = 0;
  let total = 0;
  for (const f of files(join(process.cwd(), "content"))) {
    let post: { content?: ContentBlock[] };
    try {
      post = JSON.parse(readFileSync(f, "utf8"));
    } catch {
      continue;
    }
    if (!Array.isArray(post.content)) continue;
    total++;
    const out = buildQuickTakeaway(post.content);
    if (!out) continue;
    withTakeaway++;
    const plain = JSON.stringify(post.content)
      .replace(/<[^>]+>/g, "")
      .replace(/\\"/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ");
    const probe = out.replace(/\s+/g, " ").slice(0, 60);
    assert.ok(plain.includes(probe), `${f} takeaway not found in own content`);
    assert.ok(!/[\u2014]/.test(out) || plain.includes("\u2014"), "no invented em dash");
  }
  assert.ok(total > 100, `only ${total} articles scanned`);
  assert.ok(withTakeaway > 0.8 * total - 40, `too few takeaways: ${withTakeaway}/${total}`);
});
