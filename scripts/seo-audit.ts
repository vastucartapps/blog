#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// seo-audit.ts — keyword density, anchor variation, schema count.
//
// Usage:
//   npx tsx scripts/seo-audit.ts content/jyotish/.../slug.json
//   npx tsx scripts/seo-audit.ts --all
//
// Returns 0 on pass (score >= 85), 1 on fail.
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { flatVariants } from "../lib/keyword-variations";

interface PostJSON {
  slug: string;
  category: string;
  meta?: {
    title?: string;
    description?: string;
    focus_keyword?: string;
    secondary_keywords?: string[];
  };
  keyword_brief?: {
    focus_keyword?: string;
    secondary_keywords?: string[];
    lsi_terms?: string[];
    density_targets?: {
      focus_min?: number;
      focus_max?: number;
      secondary_min?: number;
      secondary_max?: number;
    };
  };
  content?: Array<{ type: string; html?: string; text?: string }>;
  schema?: Record<string, unknown>;
}

function plain(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function totalProseText(post: PostJSON): string {
  return (post.content ?? [])
    .map((b) => (b.type === "prose" ? b.html ?? "" : b.type === "pull-quote" ? b.text ?? "" : ""))
    .map(plain)
    .join(" ");
}

function densityOf(text: string, phrase: string): number {
  if (!phrase) return 0;
  const total = text.split(/\s+/).filter(Boolean).length;
  if (total === 0) return 0;
  // Count occurrences of phrase as a substring (allows multi-word phrases)
  const count = (text.match(new RegExp(phrase.toLowerCase(), "g")) ?? []).length;
  return count / total;
}

function audit(post: PostJSON): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;
  const text = totalProseText(post);
  const kb = post.keyword_brief ?? {};
  const focus = kb.focus_keyword ?? post.meta?.focus_keyword ?? "";
  const focusMin = kb.density_targets?.focus_min ?? 0.008;
  const focusMax = kb.density_targets?.focus_max ?? 0.015;
  const secondaryMin = kb.density_targets?.secondary_min ?? 0.003;
  const secondaryMax = kb.density_targets?.secondary_max ?? 0.006;

  // Focus keyword density. We penalize MISSING keywords heavily and
  // OVER-stuffing harshly, but tolerate slightly-low density since
  // modern SEO does not reward keyword stuffing. The strict check is
  // "must appear at least once".
  if (focus) {
    const d = densityOf(text, focus);
    if (d === 0) {
      issues.push(`focus keyword "${focus}" never appears in prose`);
      score -= 15;
    } else if (d < focusMin) {
      issues.push(`focus keyword "${focus}" density ${(d * 100).toFixed(2)}% below ${(focusMin * 100).toFixed(2)}%`);
      score -= 4;
    } else if (d > focusMax) {
      issues.push(`focus keyword "${focus}" density ${(d * 100).toFixed(2)}% above ${(focusMax * 100).toFixed(2)}% — keyword stuffing risk`);
      score -= 12;
    }
  } else {
    issues.push("no focus_keyword");
    score -= 10;
  }

  // Secondary keyword densities. Same logic — missing is penalised,
  // slightly low is just a warning.
  for (const sec of kb.secondary_keywords ?? []) {
    const d = densityOf(text, sec);
    if (d === 0) {
      issues.push(`secondary "${sec}" never appears in prose`);
      score -= 3;
    } else if (d < secondaryMin) {
      issues.push(`secondary "${sec}" density ${(d * 100).toFixed(2)}% below ${(secondaryMin * 100).toFixed(2)}%`);
      score -= 1;
    } else if (d > secondaryMax) {
      issues.push(`secondary "${sec}" density ${(d * 100).toFixed(2)}% above ${(secondaryMax * 100).toFixed(2)}% — over-optimised`);
      score -= 2;
    }
  }

  // LSI presence
  for (const lsi of kb.lsi_terms ?? []) {
    if (!text.includes(lsi.toLowerCase())) {
      issues.push(`LSI term "${lsi}" missing from prose`);
      score -= 2;
    }
  }

  // Lingual variation count: focus keyword should have ≥2 spelling variants present
  if (focus) {
    const canonicalGuess = focus.split(" ").pop() ?? "";
    const variants = flatVariants(canonicalGuess);
    const found = variants.filter((v) => text.includes(v.toLowerCase())).length;
    if (found < 2) {
      issues.push(`only ${found} spelling variant(s) of focus term — should be 2+ for Romanised SEO`);
      score -= 3;
    }
  }

  // Title length
  const t = post.meta?.title ?? "";
  if (t.length > 60) {
    issues.push(`meta.title ${t.length} chars > 60`);
    score -= 5;
  }
  // Description length
  const desc = post.meta?.description ?? "";
  if (desc.length > 155) {
    issues.push(`meta.description ${desc.length} chars > 155`);
    score -= 5;
  }
  // Focus keyword in title
  if (focus && t && !t.toLowerCase().includes(focus.toLowerCase().split(" ")[0])) {
    issues.push(`focus keyword first word not in title`);
    score -= 3;
  }
  // Focus keyword in first 100 chars of description
  if (focus && desc) {
    const first100 = desc.slice(0, 100).toLowerCase();
    if (!first100.includes(focus.toLowerCase().split(" ")[0])) {
      issues.push(`focus keyword first word not in first 100 chars of description`);
      score -= 3;
    }
  }

  // Schema entity count
  const schemaCount = Object.keys(post.schema ?? {}).length;
  if (schemaCount < 18) {
    issues.push(`schema entity count ${schemaCount}, want 22`);
    score -= 5;
  }

  return { score: Math.max(0, score), issues };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("usage: seo-audit.ts <file.json> [--all]");
    process.exit(2);
  }
  const files: string[] = [];
  if (args[0] === "--all") {
    walk(path.join(process.cwd(), "content"), files);
  } else {
    files.push(...args);
  }
  let allPassed = true;
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    const post = JSON.parse(fs.readFileSync(f, "utf8")) as PostJSON;
    const r = audit(post);
    const passed = r.score >= 85;
    const colour = passed ? "\x1b[32m" : "\x1b[31m";
    console.log(`${colour}[${passed ? "PASS" : "FAIL"}]\x1b[0m ${post.slug} — SEO score ${r.score}/100`);
    for (const i of r.issues) console.log(`  - ${i}`);
    if (!passed) allPassed = false;
  }
  process.exit(allPassed ? 0 : 1);
}

function walk(dir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
}

main();
