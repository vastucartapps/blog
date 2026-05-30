#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// generate-kundali-cards.ts
//
// For graha-in-bhava posts, build a deterministic 1024×1024 North-
// Indian kundali card (matching the on-page KundaliVisual chart) and
// render it to public/posts/{slug}/{slug}-north-indian-kundali.webp so
// the post's existing image-figure stops 404-ing. Also writes the
// debug .svg next to it (like generate-hero-cards.ts).
//
// Does NOT modify post JSON — the filename is already referenced.
//
// Usage:
//   npx tsx scripts/generate-kundali-cards.ts --slug <slug> [--slug ...]
//   npx tsx scripts/generate-kundali-cards.ts --all          # everything
//   npx tsx scripts/generate-kundali-cards.ts --dry-run
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildKundaliCardSvg } from "../lib/svg/kundali-card";

interface Post {
  slug: string;
  template?: string;
  planet_id?: string;
  house_number?: number;
  lagna_id?: string;
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

// Parse planet / house / lagna from a slug like
// "guru-7th-house-pisces-lagna" or "jupiter-10th-house-aries-lagna".
function parseSlug(slug: string): {
  planet?: string;
  house?: number;
  lagna?: string;
} {
  const m = slug.match(/^([a-z]+)-(\d+)(?:st|nd|rd|th)-house-([a-z]+)-lagna$/i);
  if (!m) return {};
  return { planet: m[1], house: Number(m[2]), lagna: m[3] };
}

async function processPost(jsonPath: string) {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const post: Post = JSON.parse(raw);
  const slug = post.slug ?? path.basename(jsonPath, ".json");

  const fromSlug = parseSlug(slug);
  const planet = post.planet_id ?? fromSlug.planet;
  const house = post.house_number ?? fromSlug.house;
  const lagna = post.lagna_id ?? fromSlug.lagna;

  if (!planet || !house || !lagna) {
    return {
      slug,
      status: "skipped",
      reason: "missing planet/house/lagna (post fields + slug)",
    };
  }

  const svg = buildKundaliCardSvg({ planet, house, lagna });

  const outDir = path.join(POSTS_PUBLIC_DIR, slug);
  if (!fs.existsSync(outDir) && !dryRun) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svgPath = path.join(outDir, `${slug}-north-indian-kundali.svg`);
  const webpPath = path.join(outDir, `${slug}-north-indian-kundali.webp`);

  if (!dryRun) {
    fs.writeFileSync(svgPath, svg);
    await sharp(Buffer.from(svg), { density: 96 })
      .resize(1024, 1024, { fit: "contain", background: "#012F36" })
      .webp({ quality: 90 })
      .toFile(webpPath);
  }

  return { slug, status: "ok" };
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

  console.log(
    `Generating kundali cards for ${targets.length} post(s)${
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
        console.log(`  ok    ${r.slug}`);
      } else {
        skipped++;
        console.log(`  skip  ${r.slug} — ${r.reason}`);
      }
    } catch (err) {
      failed++;
      console.error(`  fail  ${path.basename(p)}: ${(err as Error).message}`);
    }
  }

  console.log(`\n  ok ${ok}   skipped ${skipped}   failed ${failed}`);
  if (failed > 0) process.exit(1);
})();
