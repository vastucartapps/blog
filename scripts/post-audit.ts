#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// post-audit.ts — single-shot per-post audit pipeline.
//
// Runs the full SOP gate against one post:
//   1. validate-post.ts  (100-point checklist)
//   2. duplicate-content-audit.ts (5-gram Jaccard cross-post)
//   3. SEO audit (keyword density + lingual variation)
//   4. internal-link-graph.ts (orphan + dead link + anchor)
//   5. Featured image existence check (warns if placeholder)
//
// Returns 0 only when all gates pass. This is the publish gate.
// Run before marking any post `status: ready`.
//
// Usage:
//   npx tsx scripts/post-audit.ts content/jyotish/.../slug.json
//
// Run on every post under content/:
//   npx tsx scripts/post-audit.ts --all
// ─────────────────────────────────────────────────────────────────

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

interface GateResult {
  name: string;
  passed: boolean;
  output: string;
  durationMs: number;
}

function runGate(name: string, cmd: string, args: string[]): GateResult {
  const start = Date.now();
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  const output = (res.stdout ?? "") + (res.stderr ?? "");
  return {
    name,
    passed: res.status === 0,
    output: output.trim(),
    durationMs: Date.now() - start,
  };
}

function runFeaturedImageCheck(file: string): GateResult {
  const start = Date.now();
  try {
    const post = JSON.parse(fs.readFileSync(file, "utf8"));
    const slug: string = post.slug;
    const ogPath = path.join(process.cwd(), "public", "og", `${slug}.png`);
    const ogExists = fs.existsSync(ogPath);
    const manifest: { filename: string }[] = post.image_manifest ?? [];
    const dir = path.join(process.cwd(), "public", "posts", slug);
    let realCount = 0;
    let placeholderCount = 0;
    for (const img of manifest) {
      if (fs.existsSync(path.join(dir, img.filename))) realCount += 1;
      else placeholderCount += 1;
    }
    const lines: string[] = [];
    if (ogExists) lines.push(`og: real /og/${slug}.png present`);
    else lines.push(`og: PLACEHOLDER (file /og/${slug}.png missing — will render gracefully)`);
    lines.push(`in-body: ${realCount} real, ${placeholderCount} placeholder of ${manifest.length} manifest entries`);
    return {
      name: "featured-image",
      passed: true, // never fails — placeholders are intentional pre-API
      output: lines.join("\n"),
      durationMs: Date.now() - start,
    };
  } catch (e) {
    return {
      name: "featured-image",
      passed: false,
      output: `error: ${(e as Error).message}`,
      durationMs: Date.now() - start,
    };
  }
}

function audit(file: string): boolean {
  console.log(`\n${BOLD}${CYAN}═══ Post audit: ${path.basename(file)} ═══${RESET}\n`);

  const gates: GateResult[] = [
    runGate("validate-post", "npx", ["tsx", "scripts/validate-post.ts", file]),
    runGate("seo-audit", "npx", ["tsx", "scripts/seo-audit.ts", file]),
    runGate("duplicate-content", "npx", ["tsx", "scripts/duplicate-content-audit.ts"]),
    runGate("internal-link-graph", "npx", ["tsx", "scripts/internal-link-graph.ts"]),
    runFeaturedImageCheck(file),
  ];

  let allPassed = true;
  for (const g of gates) {
    const tag = g.passed ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
    const time = `${DIM}(${(g.durationMs / 1000).toFixed(1)}s)${RESET}`;
    console.log(`  [${tag}] ${BOLD}${g.name}${RESET} ${time}`);
    const indented = g.output
      .split("\n")
      .filter((l) => l.length > 0)
      .map((l) => `      ${DIM}${l}${RESET}`)
      .join("\n");
    if (indented) console.log(indented);
    if (!g.passed) allPassed = false;
  }

  console.log("");
  if (allPassed) {
    console.log(`${GREEN}${BOLD}✓ POST AUDIT PASSED${RESET} — ${path.basename(file)} is ready to publish.\n`);
  } else {
    console.log(`${RED}${BOLD}✗ POST AUDIT FAILED${RESET} — fix the gates above before marking as ready.\n`);
  }
  return allPassed;
}

function walk(dir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      entry.name !== "PROGRESS.json"
    ) {
      out.push(full);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("usage: post-audit.ts <file.json> [--all]");
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
    if (!audit(f)) allPassed = false;
  }
  if (files.length > 1) {
    console.log(`${BOLD}═══ Summary ═══${RESET}`);
    console.log(`  ${files.length} posts audited`);
    console.log(`  status: ${allPassed ? GREEN + "ALL PASSED" : RED + "SOME FAILED"}${RESET}\n`);
  }
  process.exit(allPassed ? 0 : 1);
}

main();
