#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// duplicate-content-audit.ts — cross-post boilerplate detector.
//
// Walks every JSON post under content/, extracts prose, computes
// 5-gram Jaccard overlap between every pair. Flags any pair with
// overlap > 0.40 as a duplicate-content risk (Google's threshold
// for treating two pages as the same).
//
// Programmatic templates that share intro paragraphs across the
// 1296 planet-in-house combinations are caught here. Each post
// must be substantively unique or it should not exist.
//
// Usage:
//   npx tsx scripts/duplicate-content-audit.ts
//   npx tsx scripts/duplicate-content-audit.ts --threshold 0.30
//
// Returns 0 if no pairs above threshold, 1 otherwise.
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

const DEFAULT_THRESHOLD = 0.40;
const NGRAM_SIZE = 5;

interface PostInfo {
  file: string;
  slug: string;
  template: string;
  ngrams: Set<string>;
}

function plain(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function extractProse(post: Record<string, unknown>): string {
  const blocks = (post.content as Array<Record<string, unknown>>) ?? [];
  const out: string[] = [];
  for (const b of blocks) {
    if (b.type === "prose" && typeof b.html === "string") out.push(plain(b.html));
    else if (b.type === "pull-quote" && typeof b.text === "string") out.push((b.text as string).toLowerCase());
    else if (b.type === "faq" && Array.isArray(b.items)) {
      for (const item of b.items as { q: string; a: string }[]) {
        out.push(item.a.toLowerCase());
      }
    }
  }
  return out.join(" ");
}

function ngrams(text: string, n: number): Set<string> {
  const tokens = text.split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i++) {
    out.add(tokens.slice(i, i + n).join(" "));
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  const smaller = a.size < b.size ? a : b;
  const larger = a.size < b.size ? b : a;
  for (const g of smaller) {
    if (larger.has(g)) inter += 1;
  }
  const union = a.size + b.size - inter;
  return inter / union;
}

function walk(dir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith(".json") && entry.name !== "PROGRESS.json") {
      out.push(full);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  let threshold = DEFAULT_THRESHOLD;
  let against: string | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--threshold") threshold = parseFloat(args[i + 1]);
    else if (args[i] === "--against") against = args[i + 1];
  }

  const files: string[] = [];
  walk(path.join(process.cwd(), "content"), files);

  const posts: PostInfo[] = [];
  for (const f of files) {
    try {
      const post = JSON.parse(fs.readFileSync(f, "utf8"));
      if (!post.slug) continue;
      const text = extractProse(post);
      if (text.split(/\s+/).length < 100) continue;
      posts.push({
        file: path.resolve(f),
        slug: post.slug,
        template: post.template ?? "",
        ngrams: ngrams(text, NGRAM_SIZE),
      });
    } catch {
      // skip malformed
    }
  }

  if (against) {
    const target = path.resolve(against);
    const me = posts.find((p) => p.file === target);
    if (!me) {
      console.error(`--against: ${against} not found among loaded posts (needs >=100 words of prose and a slug).`);
      process.exit(2);
    }
    const violations: { a: string; b: string; overlap: number }[] = [];
    for (const other of posts) {
      if (other.file === me.file) continue;
      const o = jaccard(me.ngrams, other.ngrams);
      if (o >= threshold) violations.push({ a: me.slug, b: other.slug, overlap: o });
    }
    violations.sort((a, b) => b.overlap - a.overlap);
    if (violations.length === 0) {
      console.log(`\x1b[32m[PASS]\x1b[0m ${me.slug}: no peer above ${threshold}.`);
      process.exit(0);
    }
    console.log(`\x1b[31m[FAIL]\x1b[0m ${me.slug} overlaps ${violations.length} peer(s) above ${threshold}:`);
    for (const v of violations) console.log(`  ${(v.overlap * 100).toFixed(1)}%  ${v.a}  ↔  ${v.b}`);
    process.exit(1);
  }

  console.log(`Loaded ${posts.length} posts. Comparing ${(posts.length * (posts.length - 1)) / 2} pairs at threshold ${threshold}.\n`);

  const violations: { a: string; b: string; overlap: number }[] = [];
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const o = jaccard(posts[i].ngrams, posts[j].ngrams);
      if (o >= threshold) violations.push({ a: posts[i].slug, b: posts[j].slug, overlap: o });
    }
  }

  violations.sort((a, b) => b.overlap - a.overlap);
  if (violations.length === 0) {
    console.log("\x1b[32m[PASS]\x1b[0m No duplicate-content pairs above threshold.");
    process.exit(0);
  }

  console.log(`\x1b[31m[FAIL]\x1b[0m ${violations.length} pair(s) above ${threshold}:`);
  for (const v of violations) {
    console.log(`  ${(v.overlap * 100).toFixed(1)}%  ${v.a}  ↔  ${v.b}`);
  }
  process.exit(1);
}

main();
