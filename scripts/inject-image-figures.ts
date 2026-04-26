#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// inject-image-figures.ts
//
// Walks every post under content/ and inserts `image-figure`
// content blocks for each entry in the post's image_manifest at
// the structurally correct slot. Uses filename heuristics to
// classify each image as hero / kundali / gemstone / stotra and
// inserts after the appropriate anchor block.
//
// Idempotent — skips when an image-figure for that filename
// already exists in the content array.
//
// Usage:
//   npx tsx scripts/inject-image-figures.ts                # dry run
//   npx tsx scripts/inject-image-figures.ts --apply        # write
//   npx tsx scripts/inject-image-figures.ts --apply --slug sun-2nd-house-aries-lagna
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

interface Options {
  apply: boolean;
  slug?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

interface ManifestEntry {
  filename: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

interface Block {
  type: string;
  filename?: string;
  [k: string]: unknown;
}

interface Post {
  slug: string;
  image_manifest?: ManifestEntry[];
  content: Block[];
}

type ImageKind = "hero" | "kundali" | "gemstone" | "stotra";

function classifyImage(filename: string): ImageKind {
  const f = filename.toLowerCase();
  if (f.includes("hero")) return "hero";
  if (f.includes("kundali") || f.includes("chart")) return "kundali";
  if (
    /\b(ruby|pearl|coral|emerald|sapphire|diamond|hessonite|cats-eye|gemstone|stone)\b/.test(
      f
    )
  )
    return "gemstone";
  return "stotra";
}

function buildFigureBlock(
  entry: ManifestEntry,
  priority: boolean
): Block {
  return {
    type: "image-figure",
    filename: entry.filename,
    alt: entry.alt,
    caption: entry.caption,
    width: entry.width,
    height: entry.height,
    priority,
    credit: "VastuCart",
  };
}

function findInsertIndex(
  content: Block[],
  kind: ImageKind
): number {
  // Hero: after the first scannable-prose or prose block (the
  // at-a-glance intro), AFTER the pull-quote if one follows.
  if (kind === "hero") {
    let firstNarrative = -1;
    let pullQuoteAfter = -1;
    for (let i = 0; i < content.length; i++) {
      const t = content[i].type;
      if (
        firstNarrative < 0 &&
        (t === "prose" || t === "scannable-prose")
      ) {
        firstNarrative = i;
      } else if (
        firstNarrative >= 0 &&
        t === "pull-quote" &&
        pullQuoteAfter < 0
      ) {
        pullQuoteAfter = i;
        break;
      }
    }
    if (pullQuoteAfter >= 0) return pullQuoteAfter + 1;
    if (firstNarrative >= 0) return firstNarrative + 1;
    return content.length;
  }
  // Kundali: after the kundali-visual block (or before dasha-table)
  if (kind === "kundali") {
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === "kundali-visual") return i + 1;
    }
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === "dasha-table") return i;
    }
    return content.length;
  }
  // Gemstone: after the gemstone block
  if (kind === "gemstone") {
    for (let i = 0; i < content.length; i++) {
      if (content[i].type === "gemstone") return i + 1;
    }
    return content.length;
  }
  // Stotra: after the stotra block
  for (let i = 0; i < content.length; i++) {
    if (content[i].type === "stotra") return i + 1;
  }
  return content.length;
}

function alreadyHasFigure(content: Block[], filename: string): boolean {
  return content.some(
    (b) => b.type === "image-figure" && b.filename === filename
  );
}

function injectFigures(post: Post): { changed: boolean; post: Post } {
  if (!post.image_manifest || post.image_manifest.length === 0) {
    return { changed: false, post };
  }
  let changed = false;
  // Group images by kind so we insert in a stable order
  const buckets: Record<ImageKind, ManifestEntry[]> = {
    hero: [],
    kundali: [],
    gemstone: [],
    stotra: [],
  };
  for (const entry of post.image_manifest) {
    buckets[classifyImage(entry.filename)].push(entry);
  }
  // Insert in order: hero, kundali, gemstone, stotra
  const insertOrder: ImageKind[] = ["hero", "kundali", "gemstone", "stotra"];
  for (const kind of insertOrder) {
    for (const entry of buckets[kind]) {
      if (alreadyHasFigure(post.content, entry.filename)) continue;
      const idx = findInsertIndex(post.content, kind);
      const block = buildFigureBlock(entry, kind === "hero");
      post.content.splice(idx, 0, block);
      changed = true;
    }
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
    const { changed } = injectFigures(post);
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
