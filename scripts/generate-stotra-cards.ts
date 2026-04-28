#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// generate-stotra-cards.ts
//
// For every Jyotish/graha-in-bhava post, render the locked
// 1060×1048 stotra parchment SVG to WebP and wire it into the
// in-body image-figure block that follows the post's `stotra`
// content block. Same parchment is shared across the 12 posts of
// any given planet (single canonical Navagraha verse per graha).
//
// Per-post WebP copies are saved at
//   public/posts/{slug}/{slug}-stotra-parchment.webp
// (keeps ImageFigure's existing slug-based src resolution intact).
//
// Usage:
//   npx tsx scripts/generate-stotra-cards.ts                # all
//   npx tsx scripts/generate-stotra-cards.ts --slug <slug>  # one post
//   npx tsx scripts/generate-stotra-cards.ts --dry-run
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildStotraCardSvg } from "../lib/svg/stotra-card";

interface Block {
  type: string;
  filename?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  [k: string]: unknown;
}

interface ManifestEntry {
  filename: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  format?: string;
  [k: string]: unknown;
}

interface Post {
  slug: string;
  template?: string;
  planet_id?: string;
  lagna_id?: string;
  house_number?: number;
  image_manifest?: ManifestEntry[];
  content: Block[];
}

const args = process.argv.slice(2);
const slugArg = (() => {
  const i = args.indexOf("--slug");
  return i >= 0 ? args[i + 1] : null;
})();
const dryRun = args.includes("--dry-run");

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "jyotish", "graha-in-bhava");
const POSTS_PUBLIC_DIR = path.join(ROOT, "public", "posts");

const PLANET_LABEL: Record<string, string> = {
  surya: "Sun",
  chandra: "Moon",
  mangal: "Mars",
  budha: "Mercury",
  guru: "Jupiter",
  shukra: "Venus",
  shani: "Saturn",
  rahu: "Rahu",
  ketu: "Ketu",
};

const STOTRA_NAME: Record<string, string> = {
  surya: "Āditya Stotram",
  chandra: "Chandra Stotram",
  mangal: "Maṅgala Stotram",
  budha: "Budha Stotram",
  guru: "Bṛhaspati Stotram",
  shukra: "Śukra Stotram",
  shani: "Śani Stotram",
  rahu: "Rāhu Stotram",
  ketu: "Ketu Stotram",
};

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

  if (post.template !== "planet-in-house") {
    return { slug: post.slug, status: "skipped", reason: "not planet-in-house" };
  }
  if (!post.planet_id) {
    return { slug: post.slug, status: "skipped", reason: "no planet_id" };
  }

  const stotraIdx = post.content.findIndex((b) => b.type === "stotra");
  if (stotraIdx === -1) {
    return { slug: post.slug, status: "skipped", reason: "no stotra block" };
  }

  // The image-figure that follows the stotra block is the parchment.
  const figIdx = post.content.findIndex(
    (b, i) => i > stotraIdx && b.type === "image-figure",
  );
  if (figIdx === -1 || figIdx > stotraIdx + 3) {
    // Some posts may not have a parchment image-figure right after.
    // Skip rather than rewriting unrelated images.
    return {
      slug: post.slug,
      status: "skipped",
      reason: "no image-figure adjacent to stotra block",
    };
  }

  const oldFigure = post.content[figIdx];
  const oldFilename = oldFigure.filename ?? null;

  const svg = buildStotraCardSvg({ planet_id: post.planet_id });
  const newFilename = `${post.slug}-stotra-parchment.webp`;
  const planetLabel = PLANET_LABEL[post.planet_id] ?? post.planet_id;
  const stotraName = STOTRA_NAME[post.planet_id] ?? "Stotra";

  const newAlt = `${stotraName} verse parchment for ${planetLabel} in Vedic Jyotish`;
  const newCaption = `${stotraName}, the canonical Navagraha verse to ${planetLabel}, with Devanagari, IAST, and English meaning.`;

  const outDir = path.join(POSTS_PUBLIC_DIR, post.slug);
  if (!fs.existsSync(outDir) && !dryRun) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const svgPath = path.join(outDir, `${post.slug}-stotra-parchment.svg`);
  const webpPath = path.join(outDir, newFilename);

  if (!dryRun) {
    fs.writeFileSync(svgPath, svg);
    await sharp(Buffer.from(svg), { density: 144 })
      .resize(1060, 1048, { fit: "contain", background: "#013F47" })
      .webp({ quality: 90 })
      .toFile(webpPath);
  }

  // Rewrite the in-body image-figure block.
  post.content[figIdx] = {
    ...oldFigure,
    filename: newFilename,
    alt: newAlt,
    caption: newCaption,
    width: 1060,
    height: 1048,
  };

  // Update the matching image_manifest entry. If we can find the old
  // filename, update in place; otherwise append.
  const manifest = post.image_manifest ?? [];
  const manifestIdx = oldFilename
    ? manifest.findIndex((m) => m.filename === oldFilename)
    : -1;
  const newManifestEntry: ManifestEntry = {
    filename: newFilename,
    alt: newAlt,
    caption: newCaption,
    width: 1060,
    height: 1048,
    format: "webp",
    style: "Navagraha verse parchment, deep teal + cream + gold",
  };
  if (manifestIdx >= 0) {
    manifest[manifestIdx] = { ...manifest[manifestIdx], ...newManifestEntry };
  } else {
    manifest.push(newManifestEntry);
  }
  post.image_manifest = manifest;

  if (!dryRun) {
    fs.writeFileSync(jsonPath, JSON.stringify(post, null, 2) + "\n");
  }

  return {
    slug: post.slug,
    status: "ok",
    oldFilename,
    newFilename,
  };
}

(async () => {
  const paths = listPosts();
  const targets = slugArg
    ? paths.filter((p) => path.basename(p, ".json") === slugArg)
    : paths;

  if (targets.length === 0) {
    console.error("No matching posts.");
    process.exit(1);
  }

  console.log(
    `Generating stotra parchments for ${targets.length} post(s)${
      dryRun ? " [dry-run]" : ""
    }…`,
  );

  let ok = 0,
    skipped = 0,
    failed = 0;
  for (const p of targets) {
    try {
      const r = await processPost(p);
      if (r.status === "ok") {
        ok++;
        process.stdout.write(".");
      } else {
        skipped++;
        process.stdout.write("s");
      }
    } catch (err) {
      failed++;
      console.error(`\n✗ ${path.basename(p)}:`, (err as Error).message);
    }
  }

  console.log(`\n\n  ok ${ok}   skipped ${skipped}   failed ${failed}`);
})();
