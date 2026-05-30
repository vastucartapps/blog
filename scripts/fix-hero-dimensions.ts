#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// fix-hero-dimensions.ts
//
// The graha-in-bhava posts declare their hero image-figure as
// 1200×630, but the real `{slug}-hero-v3.webp` is 1060×1048 — a CLS
// bug (declared aspect ratio reserves the wrong box). This corrects
// the DECLARED width/height in the image-figure block to match the
// real file on disk. It does NOT regenerate the image.
//
// Idempotent: running twice changes nothing the second time.
//
// Usage:
//   npx tsx scripts/fix-hero-dimensions.ts --slug <slug> [--slug ...]
//   npx tsx scripts/fix-hero-dimensions.ts --all
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

interface Block {
  type: string;
  filename?: string;
  width?: number;
  height?: number;
  [k: string]: unknown;
}
interface Post {
  slug?: string;
  content?: Block[];
}

const args = process.argv.slice(2);
const slugArgs = (() => {
  const out: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--slug" && args[i + 1]) {
      out.push(args[i + 1]);
      i++;
    }
  }
  return out;
})();
const all = args.includes("--all");

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "jyotish", "graha-in-bhava");
const POSTS_PUBLIC_DIR = path.join(ROOT, "public", "posts");

function listPosts(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(CONTENT_DIR, f));
}

async function processPost(jsonPath: string) {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const post: Post = JSON.parse(raw);
  const slug = post.slug ?? path.basename(jsonPath, ".json");
  const content = post.content ?? [];

  const figure = content.find(
    (b) =>
      b.type === "image-figure" &&
      typeof b.filename === "string" &&
      b.filename.endsWith("-hero-v3.webp"),
  );
  if (!figure || typeof figure.filename !== "string") {
    return { slug, status: "skipped", reason: "no hero-v3 image-figure" };
  }

  const webpPath = path.join(POSTS_PUBLIC_DIR, slug, figure.filename);
  if (!fs.existsSync(webpPath)) {
    return { slug, status: "skipped", reason: `missing webp ${figure.filename}` };
  }

  const meta = await sharp(webpPath).metadata();
  const realW = meta.width;
  const realH = meta.height;
  if (!realW || !realH) {
    return { slug, status: "skipped", reason: "could not read dimensions" };
  }

  const oldW = figure.width;
  const oldH = figure.height;
  if (oldW === realW && oldH === realH) {
    return { slug, status: "unchanged", oldW, oldH };
  }

  figure.width = realW;
  figure.height = realH;
  fs.writeFileSync(jsonPath, JSON.stringify(post, null, 2) + "\n");

  return { slug, status: "changed", oldW, oldH, realW, realH };
}

(async () => {
  const paths = listPosts();
  let targets: string[];
  if (slugArgs.length > 0) {
    targets = paths.filter((p) => slugArgs.includes(path.basename(p, ".json")));
  } else if (all) {
    targets = paths;
  } else {
    console.error("Pass --slug <slug> (repeatable) or --all.");
    process.exit(1);
  }

  if (targets.length === 0) {
    console.error("No matching posts.");
    process.exit(1);
  }

  let changed = 0,
    unchanged = 0,
    skipped = 0,
    failed = 0;
  for (const p of targets) {
    try {
      const r = await processPost(p);
      if (r.status === "changed") {
        changed++;
        console.log(
          `  fixed   ${r.slug} — hero ${r.oldW}x${r.oldH} → ${r.realW}x${r.realH}`,
        );
      } else if (r.status === "unchanged") {
        unchanged++;
        console.log(`  ok      ${r.slug} — already ${r.oldW}x${r.oldH}`);
      } else {
        skipped++;
        console.warn(`  skip    ${r.slug} — ${r.reason}`);
      }
    } catch (err) {
      failed++;
      console.error(`  fail    ${path.basename(p)}: ${(err as Error).message}`);
    }
  }

  console.log(
    `\n  changed ${changed}   unchanged ${unchanged}   skipped ${skipped}   failed ${failed}`,
  );
  if (failed > 0) process.exit(1);
})();
