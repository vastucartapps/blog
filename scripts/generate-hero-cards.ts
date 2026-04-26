#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// generate-hero-cards.ts
//
// For every Jyotish/graha-in-bhava post, build the locked
// 1060×1048 hero SVG, render it to WebP via sharp, save to
// public/posts/{slug}/{slug}-hero.webp, and update the post JSON's
// image_manifest first entry + meta.og_image so the same image
// surfaces as hero, in-body section image, OG/Twitter image, and
// archives card thumbnail.
//
// Usage:
//   npx tsx scripts/generate-hero-cards.ts                 # all posts
//   npx tsx scripts/generate-hero-cards.ts --slug <slug>   # one post
//   npx tsx scripts/generate-hero-cards.ts --dry-run       # no writes
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildHeroCardSvg } from "../lib/svg/hero-card";

interface Block {
  type: string;
  positive?: string[];
  [k: string]: unknown;
}

interface Post {
  slug: string;
  category?: string;
  subcategory?: string;
  template?: string;
  planet_id?: string;
  house_number?: number;
  lagna_id?: string;
  title?: string;
  meta?: { og_image?: string; [k: string]: unknown };
  hero?: { tags?: { label: string }[]; [k: string]: unknown };
  image_manifest?: ManifestEntry[];
  content: Block[];
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

const args = process.argv.slice(2);
const slugArg = (() => {
  const i = args.indexOf("--slug");
  return i >= 0 ? args[i + 1] : null;
})();
const dryRun = args.includes("--dry-run");

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

function pickKeyTraits(post: Post): string[] {
  const eg = post.content?.find(
    (b): b is Block & { positive?: string[] } => b.type === "effects-grid",
  );
  const positives = (eg?.positive ?? []).filter(
    (s): s is string => typeof s === "string" && s.trim().length > 0,
  );
  if (positives.length >= 1) return positives.slice(0, 5);
  // Fallback to hero.tags labels if effects-grid is missing.
  const tags = (post.hero?.tags ?? [])
    .map((t) => t.label)
    .filter((s): s is string => typeof s === "string" && s.length > 0);
  return tags.slice(0, 5);
}

async function processPost(jsonPath: string) {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const post: Post = JSON.parse(raw);

  if (post.template !== "planet-in-house") {
    return { slug: post.slug, status: "skipped", reason: "not planet-in-house" };
  }
  if (!post.planet_id || !post.lagna_id || !post.house_number) {
    return {
      slug: post.slug,
      status: "skipped",
      reason: "missing planet_id/lagna_id/house_number",
    };
  }

  const traits = pickKeyTraits(post);

  const svg = buildHeroCardSvg({
    planet_id: post.planet_id,
    lagna_id: post.lagna_id,
    house_number: post.house_number,
    key_traits: traits,
  });

  const outDir = path.join(POSTS_PUBLIC_DIR, post.slug);
  if (!fs.existsSync(outDir)) {
    if (!dryRun) fs.mkdirSync(outDir, { recursive: true });
  }

  const svgPath = path.join(outDir, `${post.slug}-hero.svg`);
  const webpPath = path.join(outDir, `${post.slug}-hero.webp`);
  const ogPath = path.join(outDir, `${post.slug}-hero-og.webp`);

  if (!dryRun) {
    fs.writeFileSync(svgPath, svg);

    // Render canonical 1060×1048 WebP for hero / section / archives.
    await sharp(Buffer.from(svg), { density: 144 })
      .resize(1060, 1048, { fit: "contain", background: "#F2EAD3" })
      .webp({ quality: 92 })
      .toFile(webpPath);

    // Render a 1200×630 cropped variant for OG / Twitter cards.
    // Center-crop the square hero to a 1.91:1 ratio so the chart
    // and main labels stay within the safe area.
    await sharp(Buffer.from(svg), { density: 144 })
      .resize(1200, 1180, { fit: "contain", background: "#F2EAD3" })
      .extract({ left: 0, top: 275, width: 1200, height: 630 })
      .webp({ quality: 92 })
      .toFile(ogPath);
  }

  // Update first manifest entry to point at the new asset.
  const newHeroAlt =
    `${capitalize(post.planet_id)} in the ${ordinal(post.house_number)} house ` +
    `for ${post.lagna_id} lagna, North Indian D-1 chart hero card`;
  const newHeroCaption =
    `${capitalize(post.planet_id)} placed in the ${ordinal(post.house_number)} ` +
    `house of the ${post.lagna_id} lagna kundali.`;

  const oldManifest = post.image_manifest ?? [];
  const newFirst: ManifestEntry = {
    ...(oldManifest[0] ?? {}),
    filename: `${post.slug}-hero.webp`,
    filename_og: `${post.slug}-hero-og.webp`,
    alt: oldManifest[0]?.alt ?? newHeroAlt,
    caption: oldManifest[0]?.caption ?? newHeroCaption,
    width: 1060,
    height: 1048,
    format: "webp",
  };
  const newManifest =
    oldManifest.length === 0 ? [newFirst] : [newFirst, ...oldManifest.slice(1)];

  post.image_manifest = newManifest;
  post.meta = post.meta ?? {};
  post.meta.og_image = `/posts/${post.slug}/${post.slug}-hero-og.webp`;

  if (!dryRun) {
    fs.writeFileSync(jsonPath, JSON.stringify(post, null, 2) + "\n");
  }

  return { slug: post.slug, status: "ok", traits: traits.length };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function ordinal(n: number): string {
  const map: Record<number, string> = {
    1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th", 6: "6th",
    7: "7th", 8: "8th", 9: "9th", 10: "10th", 11: "11th", 12: "12th",
  };
  return map[n] ?? `${n}th`;
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
    `Generating hero cards for ${targets.length} post(s)${
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
