#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// generate-numerology-hero-cards.ts
//
// For every numerology Life Path post, build the locked 1060×1048
// hero SVG, render to WebP via sharp, save to
// public/posts/{slug}/{slug}-hero-v3.webp, and update the post JSON's
// image_manifest entry 0 + meta.og_image so the same image surfaces
// as hero, in-body section image, OG/Twitter image and archives card.
//
// Usage:
//   npx tsx scripts/generate-numerology-hero-cards.ts
//   npx tsx scripts/generate-numerology-hero-cards.ts --slug life-path-number-1
//   npx tsx scripts/generate-numerology-hero-cards.ts --dry-run
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildNumerologyHeroCardSvg } from "../lib/svg/numerology-hero-card";

interface Block {
  type: string;
  positive?: string[];
  [k: string]: unknown;
}

interface ManifestEntry {
  filename: string;
  filename_og?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  format?: string;
  [k: string]: unknown;
}

interface Post {
  slug: string;
  category?: string;
  subcategory?: string;
  template?: string;
  number?: number;
  ruling_planet?: string;
  meta?: { og_image?: string; [k: string]: unknown };
  hero?: { tags?: { label: string }[]; [k: string]: unknown };
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
const CONTENT_DIR = path.join(ROOT, "content", "numerology");
const POSTS_PUBLIC_DIR = path.join(ROOT, "public", "posts");

function walk(dir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
}

function pickKeyTraits(post: Post): string[] {
  const eg = post.content?.find(
    (b): b is Block & { positive?: string[] } => b.type === "effects-grid",
  );
  const positives = (eg?.positive ?? []).filter(
    (s): s is string => typeof s === "string" && s.trim().length > 0,
  );
  if (positives.length >= 1) return positives.slice(0, 5);
  const tags = (post.hero?.tags ?? [])
    .map((t) => t.label)
    .filter((s): s is string => typeof s === "string" && s.length > 0);
  return tags.slice(0, 5);
}

async function processPost(jsonPath: string) {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const post: Post = JSON.parse(raw);

  if (post.template !== "numerology-number") {
    return { slug: post.slug, status: "skipped", reason: "not numerology-number" };
  }
  if (!post.number || post.number < 1 || post.number > 9) {
    return {
      slug: post.slug,
      status: "skipped",
      reason: `invalid number: ${post.number}`,
    };
  }

  const traits = pickKeyTraits(post);
  const svg = buildNumerologyHeroCardSvg({
    number: post.number,
    key_traits: traits,
  });

  const outDir = path.join(POSTS_PUBLIC_DIR, post.slug);
  if (!fs.existsSync(outDir) && !dryRun) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svgPath = path.join(outDir, `${post.slug}-hero-v3.svg`);
  const webpPath = path.join(outDir, `${post.slug}-hero-v3.webp`);
  const ogPath = path.join(outDir, `${post.slug}-hero-og-v3.webp`);

  if (!dryRun) {
    fs.writeFileSync(svgPath, svg);

    // Square 1060×1048 for the hero/section/archives surface.
    await sharp(Buffer.from(svg), { density: 144 })
      .resize(1060, 1048, { fit: "contain", background: "#F2EAD3" })
      .webp({ quality: 92 })
      .toFile(webpPath);

    // 1200×630 OG/Twitter card. Centre-crop the square to 1.91:1.
    await sharp(Buffer.from(svg), { density: 144 })
      .resize(1200, 1180, { fit: "contain", background: "#F2EAD3" })
      .extract({ left: 0, top: 275, width: 1200, height: 630 })
      .webp({ quality: 92 })
      .toFile(ogPath);
  }

  // Rewrite manifest entry 0 to point at the new asset (filename
  // and filename_og are the only fields we touch — alt/caption
  // already match the locked numerology copy authored in the post).
  const manifest = post.image_manifest ?? [];
  const heroEntry: ManifestEntry = {
    ...(manifest[0] ?? {}),
    filename: `${post.slug}-hero-v3.webp`,
    filename_og: `${post.slug}-hero-og-v3.webp`,
    width: 1060,
    height: 1048,
    format: "webp",
    alt:
      manifest[0]?.alt ??
      `Life Path Number ${post.number} hero card with ruling-planet glyph and aṅka mandala`,
    caption:
      manifest[0]?.caption ??
      `Life Path Number ${post.number} master card, ruling-planet correspondence and ${post.number}-petal aṅka mandala.`,
  };
  const newManifest = manifest.length === 0 ? [heroEntry] : [heroEntry, ...manifest.slice(1)];
  post.image_manifest = newManifest;
  post.meta = post.meta ?? {};
  post.meta.og_image = `/posts/${post.slug}/${post.slug}-hero-og-v3.webp`;

  // Patch any in-body image-figure that references the previous
  // hero filename so the section image matches the new one.
  if (Array.isArray(post.content)) {
    for (const block of post.content as Array<Record<string, unknown>>) {
      if (
        block?.type === "image-figure" &&
        typeof block.filename === "string" &&
        (block.filename === `${post.slug}-hero.webp` ||
          block.filename === `${post.slug}-hero-v2.webp`)
      ) {
        block.filename = `${post.slug}-hero-v3.webp`;
      }
    }
  }

  if (!dryRun) {
    fs.writeFileSync(jsonPath, JSON.stringify(post, null, 2) + "\n");
  }

  return { slug: post.slug, status: "ok", traits: traits.length };
}

(async () => {
  const files: string[] = [];
  walk(CONTENT_DIR, files);
  const targets = slugArg
    ? files.filter((p) => path.basename(p, ".json") === slugArg)
    : files;

  if (targets.length === 0) {
    console.error("No matching numerology posts.");
    process.exit(1);
  }

  console.log(
    `Generating numerology hero cards for ${targets.length} post(s)${
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
