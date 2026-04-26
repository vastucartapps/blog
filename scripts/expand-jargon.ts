#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// expand-jargon.ts
//
// Walks every post under content/ and:
//   1. Expands the FIRST occurrence of each astrological abbreviation
//      (2L, 7L, 4L, 5L, 6L, 3L, 8H, 9H, 10H, 11H, 12H, 1H) inside
//      prose / scannable-prose HTML and pull-quote text into the
//      long-form ("the lord of the 2nd house, called the 2L").
//   2. Injects an `astro-glossary` content block right after the
//      first scannable-prose / prose block, defining the terms the
//      post uses.
//
// Idempotent — checks if expansion + glossary already exist.
//
// Usage:
//   npx tsx scripts/expand-jargon.ts                 # dry run
//   npx tsx scripts/expand-jargon.ts --apply         # write
//   npx tsx scripts/expand-jargon.ts --apply --slug sun-1st-house-aries-lagna
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

interface Options {
  apply: boolean;
  slug?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

interface Block {
  type: string;
  html?: string;
  text?: string;
  lead_html?: string;
  subsections?: { html: string }[];
  [k: string]: unknown;
}

interface Post {
  slug: string;
  category?: string;
  content: Block[];
  [k: string]: unknown;
}

const HOUSE_NAMES: Record<string, { name: string; sanskrit: string; rules: string }> = {
  "1": { name: "1st house", sanskrit: "Pratham Bhava", rules: "the self, body, and personality" },
  "2": { name: "2nd house", sanskrit: "Dhana Bhava", rules: "wealth, family, and speech" },
  "3": { name: "3rd house", sanskrit: "Parakrama Bhava", rules: "courage, effort, and younger siblings" },
  "4": { name: "4th house", sanskrit: "Sukha Sthana", rules: "mother, home, and emotional foundation" },
  "5": { name: "5th house", sanskrit: "Putra Bhava", rules: "creativity, children, and merit" },
  "6": { name: "6th house", sanskrit: "Ripu Bhava", rules: "enemies, debts, disease, and service" },
  "7": { name: "7th house", sanskrit: "Yuvati Bhava", rules: "marriage, partnership, and contracts" },
  "8": { name: "8th house", sanskrit: "Randhra Bhava", rules: "transformation, occult, and joint finances" },
  "9": { name: "9th house", sanskrit: "Dharma Bhava", rules: "father, philosophy, and higher learning" },
  "10": { name: "10th house", sanskrit: "Karma Bhava", rules: "career, public reputation, and authority" },
  "11": { name: "11th house", sanskrit: "Labha Bhava", rules: "gains, networks, and elder siblings" },
  "12": { name: "12th house", sanskrit: "Vyaya Bhava", rules: "loss, expenses, foreign lands, and moksha" },
};

// Walk all prose-containing HTML in the post and find which abbrevs
// appear. Returns a deduped sorted list.
function collectAbbreviations(content: Block[]): string[] {
  const found = new Set<string>();
  const re = /\b(\d{1,2})(L|H)\b/g;
  for (const block of content) {
    const html = collectHtml(block);
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const n = parseInt(m[1], 10);
      if (n >= 1 && n <= 12) found.add(`${n}${m[2]}`);
    }
  }
  return Array.from(found).sort((a, b) => {
    const na = parseInt(a, 10);
    const nb = parseInt(b, 10);
    return na - nb;
  });
}

function collectHtml(block: Block): string {
  const parts: string[] = [];
  if (typeof block.html === "string") parts.push(block.html);
  if (typeof block.text === "string") parts.push(block.text);
  if (typeof block.lead_html === "string") parts.push(block.lead_html);
  if (Array.isArray(block.subsections)) {
    for (const sub of block.subsections) {
      if (sub && typeof sub.html === "string") parts.push(sub.html);
    }
  }
  return parts.join(" ");
}

// Replace the FIRST occurrence of each abbreviation with the
// long-form expansion, only on the FIRST time it shows up across
// the whole post. Subsequent occurrences stay shorthand.
function expandFirstOccurrences(
  content: Block[],
  abbreviations: string[]
): { changed: boolean; content: Block[] } {
  let changed = false;
  const expanded = new Set<string>();

  const rewriteHtml = (html: string): string => {
    let out = html;
    for (const abbr of abbreviations) {
      if (expanded.has(abbr)) continue;
      // Match standalone abbreviation, not inside an existing
      // long-form expansion ("called the 2L").
      const re = new RegExp(`(?<!called the )(?<!\\bthe )(?<![\\w-])${abbr}(?![\\w-])`);
      const match = re.exec(out);
      if (match) {
        const num = abbr.slice(0, -1);
        const kind = abbr.slice(-1);
        const info = HOUSE_NAMES[num];
        if (!info) continue;
        const replacement =
          kind === "L"
            ? `<strong>lord of the ${info.name}</strong> (also called the ${abbr})`
            : `<strong>${info.name}</strong> (called <em>${info.sanskrit}</em>, the house of ${info.rules})`;
        out = out.replace(re, replacement);
        expanded.add(abbr);
        changed = true;
      }
    }
    return out;
  };

  for (const block of content) {
    if (typeof block.html === "string") {
      const next = rewriteHtml(block.html);
      if (next !== block.html) block.html = next;
    }
    if (typeof block.lead_html === "string") {
      const next = rewriteHtml(block.lead_html);
      if (next !== block.lead_html) block.lead_html = next;
    }
    if (Array.isArray(block.subsections)) {
      for (const sub of block.subsections) {
        if (sub && typeof sub.html === "string") {
          const next = rewriteHtml(sub.html);
          if (next !== sub.html) sub.html = next;
        }
      }
    }
  }
  return { changed, content };
}

interface GlossaryBlock {
  type: "astro-glossary";
  eyebrow: string;
  heading: string;
  intro_html: string;
  terms: { term: string; meaning: string }[];
}

function buildGlossaryBlock(abbreviations: string[]): GlossaryBlock {
  const terms: { term: string; meaning: string }[] = [];
  // Always include a friendly framing pair
  terms.push({
    term: "Lagna",
    meaning:
      "the rising sign at the moment of your birth — also called the ascendant. It anchors the whole chart.",
  });
  terms.push({
    term: "Bhava",
    meaning:
      "Sanskrit for 'house' — one of the twelve life-area sectors in your birth chart.",
  });
  for (const abbr of abbreviations) {
    const num = abbr.slice(0, -1);
    const kind = abbr.slice(-1);
    const info = HOUSE_NAMES[num];
    if (!info) continue;
    if (kind === "L") {
      terms.push({
        term: abbr,
        meaning: `Lord of the ${info.name} (${info.sanskrit}). The planet that rules whichever sign sits in your ${info.name}, governing ${info.rules}.`,
      });
    } else {
      terms.push({
        term: abbr,
        meaning: `The ${info.name}, called ${info.sanskrit}, the seat of ${info.rules}.`,
      });
    }
  }
  return {
    type: "astro-glossary",
    eyebrow: "Quick reference",
    heading: "Astrology terms used in this article",
    intro_html:
      "<p>A short glossary so the structural reading lands clearly. We expand each term on first use and use the shorthand afterwards.</p>",
    terms,
  };
}

function alreadyHasGlossary(content: Block[]): boolean {
  return content.some((b) => b.type === "astro-glossary");
}

function findGlossaryInsertIndex(content: Block[]): number {
  // After the first scannable-prose or prose block (the at-a-glance).
  for (let i = 0; i < content.length; i++) {
    const t = content[i].type;
    if (t === "scannable-prose" || t === "prose") {
      // If a pull-quote follows, insert after the pull-quote
      const next = content[i + 1];
      if (next && next.type === "pull-quote") return i + 2;
      return i + 1;
    }
  }
  return Math.min(2, content.length);
}

function migratePost(post: Post): { changed: boolean; post: Post } {
  if (!Array.isArray(post.content)) return { changed: false, post };
  const abbreviations = collectAbbreviations(post.content);
  let changed = false;

  // Expand jargon
  const exp = expandFirstOccurrences(post.content, abbreviations);
  if (exp.changed) changed = true;

  // Inject glossary if the post uses any abbreviations and doesn't
  // already have one.
  if (
    abbreviations.length > 0 &&
    !alreadyHasGlossary(post.content) &&
    post.category === "jyotish"
  ) {
    const idx = findGlossaryInsertIndex(post.content);
    const block = buildGlossaryBlock(abbreviations);
    post.content.splice(idx, 0, block as unknown as Block);
    changed = true;
  }
  return { changed, post };
}

function walk(dir: string, cb: (file: string) => void): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = { apply: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--apply") opts.apply = true;
    else if (args[i] === "--slug" && args[i + 1]) {
      opts.slug = args[i + 1];
      i++;
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs();
  const files: string[] = [];
  walk(CONTENT_DIR, (f) => {
    if (f.endsWith(".json")) files.push(f);
  });
  let updated = 0;
  let unchanged = 0;
  for (const file of files) {
    let post: Post;
    try {
      post = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      continue;
    }
    if (opts.slug && post.slug !== opts.slug) continue;
    const { changed } = migratePost(post);
    if (changed) {
      updated++;
      if (opts.apply) {
        fs.writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
      }
      console.log(`  ${opts.apply ? "✓" : "~"} ${path.basename(file)}`);
    } else {
      unchanged++;
    }
  }
  console.log(
    `\n${updated} ${opts.apply ? "updated" : "would update"}, ${unchanged} unchanged.`
  );
  if (!opts.apply && updated > 0) {
    console.log(`\nRun with --apply to write changes.`);
  }
}

main();
