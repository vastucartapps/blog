#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// generate-gemstone-cards.ts
//
// For graha-in-bhava posts, build a deterministic 1024×768 gemstone
// card (dark-brand bg, title band, the source gemstone photo in a
// saffron ring) and render it to the exact filename the post already
// references: public/posts/{slug}/{slug}-{gem}.webp. Also writes the
// debug .svg next to it (like generate-kundali-cards.ts).
//
// The PRIMARY gemstone comes from the gemstone content block: the
// first card whose role is "primary" (else the first card carrying an
// image_slug). The OUTPUT filename is read from the image-figure block
// whose filename is `{slug}-{thatGem}.webp` so the render always lands
// on the URL the post already declares.
//
// Does NOT modify post JSON.
//
// Usage:
//   npx tsx scripts/generate-gemstone-cards.ts --slug <slug> [--slug ...]
//   npx tsx scripts/generate-gemstone-cards.ts --all          # everything
//   npx tsx scripts/generate-gemstone-cards.ts --dry-run
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildGemstoneCardSvg } from "../lib/svg/gemstone-card";

interface GemCard {
  name?: string;
  role?: string;
  image_slug?: string;
  icon_variant?: string;
}
interface Block {
  type: string;
  filename?: string;
  cards?: GemCard[];
  [k: string]: unknown;
}
interface Post {
  slug?: string;
  planet_id?: string;
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
const dryRun = args.includes("--dry-run");

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "jyotish", "graha-in-bhava");
const POSTS_PUBLIC_DIR = path.join(ROOT, "public", "posts");
const PUBLIC_DIR = path.join(ROOT, "public");

// Valid public/gemstones/ slugs (mirrors VALID_GEMSTONE_SLUGS).
const VALID_GEM_SLUGS = new Set([
  "blue-sapphire", "cats-eye", "diamond", "emerald", "hessonite",
  "opal", "pearl", "red-coral", "ruby", "yellow-sapphire",
]);

// Map a loose gem label/slug to a valid public/gemstones/ slug.
const GEM_ALIAS: Record<string, string> = {
  coral: "red-coral",
  "red-coral": "red-coral",
  pukhraj: "yellow-sapphire",
  "yellow-sapphire": "yellow-sapphire",
  panna: "emerald",
  emerald: "emerald",
  manik: "ruby",
  ruby: "ruby",
  moti: "pearl",
  pearl: "pearl",
  moonstone: "pearl",
  neelam: "blue-sapphire",
  "blue-sapphire": "blue-sapphire",
  amethyst: "blue-sapphire",
  heera: "diamond",
  diamond: "diamond",
  gomed: "hessonite",
  hessonite: "hessonite",
  "lehsunia": "cats-eye",
  "cats-eye": "cats-eye",
  opal: "opal",
};

function toGemSlug(raw: string): string | null {
  const k = raw.trim().toLowerCase().replace(/\s+/g, "-");
  if (VALID_GEM_SLUGS.has(k)) return k;
  if (GEM_ALIAS[k]) return GEM_ALIAS[k];
  return null;
}

// Title-case a slug for display: "yellow-sapphire" -> "Yellow Sapphire".
function gemDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((p) => (p === "cats" ? "Cat's" : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ")
    .replace("Cat's Eye", "Cat's Eye");
}

const PLANET_DISPLAY: Record<string, string> = {
  surya: "Sun", sun: "Sun",
  chandra: "Moon", moon: "Moon",
  mangal: "Mars", mars: "Mars",
  budha: "Mercury", mercury: "Mercury",
  guru: "Jupiter", jupiter: "Jupiter",
  shukra: "Venus", venus: "Venus",
  shani: "Saturn", saturn: "Saturn",
  rahu: "Rahu", ketu: "Ketu",
};

function listPosts(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(CONTENT_DIR, f));
}

function parsePlanetFromSlug(slug: string): string | undefined {
  const m = slug.match(/^([a-z]+)-\d+(?:st|nd|rd|th)-house-[a-z]+-lagna$/i);
  return m ? m[1] : undefined;
}

async function processPost(jsonPath: string) {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const post: Post = JSON.parse(raw);
  const slug = post.slug ?? path.basename(jsonPath, ".json");

  const content = post.content ?? [];
  const gemBlock = content.find((b) => b.type === "gemstone");
  if (!gemBlock || !Array.isArray(gemBlock.cards)) {
    return { slug, status: "skipped", reason: "no gemstone block" };
  }

  // Primary = first card with role "primary", else first with image_slug.
  const primaryCard =
    gemBlock.cards.find((c) => c.role === "primary" && c.image_slug) ??
    gemBlock.cards.find((c) => c.image_slug);
  if (!primaryCard?.image_slug) {
    return { slug, status: "skipped", reason: "no primary gemstone image_slug" };
  }

  const gemSlug = toGemSlug(primaryCard.image_slug);
  if (!gemSlug) {
    return {
      slug,
      status: "skipped",
      reason: `unmappable gem slug "${primaryCard.image_slug}"`,
    };
  }

  // Output filename: the image-figure that references this gem, i.e.
  // `{slug}-{gem}.webp`. Prefer the declared filename; fall back to the
  // canonical pattern if no figure block names it.
  const expected = `${slug}-${gemSlug}.webp`;
  const figure = content.find(
    (b) => b.type === "image-figure" && b.filename === expected,
  );
  const outFilename = figure?.filename ?? expected;

  const planetId = post.planet_id ?? parsePlanetFromSlug(slug);
  const planetDisplay = planetId ? PLANET_DISPLAY[planetId.toLowerCase()] : undefined;

  const svg = await buildGemstoneCardSvg({
    gemSlug,
    gemName: gemDisplayName(gemSlug),
    planet: planetDisplay,
    publicDir: PUBLIC_DIR,
  });

  const outDir = path.join(POSTS_PUBLIC_DIR, slug);
  if (!fs.existsSync(outDir) && !dryRun) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svgPath = path.join(outDir, outFilename.replace(/\.webp$/, ".svg"));
  const webpPath = path.join(outDir, outFilename);

  if (!dryRun) {
    fs.writeFileSync(svgPath, svg);
    await sharp(Buffer.from(svg), { density: 96 })
      .resize(1024, 768, { fit: "contain", background: "#012F36" })
      .webp({ quality: 90 })
      .toFile(webpPath);
  }

  return { slug, status: "ok", gem: gemSlug, file: outFilename };
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
    `Generating gemstone cards for ${targets.length} post(s)${
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
        console.log(`  ok    ${r.slug} — ${r.gem} → ${r.file}`);
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
