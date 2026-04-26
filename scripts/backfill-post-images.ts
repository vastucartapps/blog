#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// backfill-post-images.ts
//
// For past posts that ship without on-disk images, generate SVGs
// from the documented templates in docs/IMAGE_SOP.md §11, then run
// scripts/svg-to-webp.ts to deliver WebP files. Idempotent.
//
// Usage (run in a separate terminal alongside the main author loop):
//   npx tsx scripts/backfill-post-images.ts
//   npx tsx scripts/backfill-post-images.ts --category jyotish
//   npx tsx scripts/backfill-post-images.ts --slug sun-2nd-house-aries-lagna
//   npx tsx scripts/backfill-post-images.ts --convert  # also run sharp
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

interface BackfillOptions {
  category?: string;
  subcategory?: string;
  slug?: string;
  convert: boolean;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(process.cwd(), "public", "posts");

// ── Brand palette per planet (locked, see IMAGE_SOP.md §11.1)
const PLANET_COLOURS: Record<string, { primary: string; accent: string; glyph: string }> = {
  surya:    { primary: "#e8840a", accent: "#FFD27A", glyph: "☉" },
  chandra:  { primary: "#338a95", accent: "#E0F4F7", glyph: "☽" },
  mangal:   { primary: "#c94444", accent: "#FFB7B7", glyph: "♂" },
  budha:    { primary: "#338a95", accent: "#9FE5C8", glyph: "☿" },
  guru:     { primary: "#f4b942", accent: "#FFE9B0", glyph: "♃" },
  shukra:   { primary: "#e8840a", accent: "#FFE0EC", glyph: "♀" },
  shani:    { primary: "#013F47", accent: "#9DA8AC", glyph: "♄" },
  rahu:     { primary: "#013F47", accent: "#7B6FB7", glyph: "☊" },
  ketu:     { primary: "#338a95", accent: "#9DA8AC", glyph: "☋" },
};

const SIGN_GLYPHS: Record<string, string> = {
  mesha:      "♈",
  vrishabha:  "♉",
  mithuna:    "♊",
  karka:      "♋",
  simha:      "♌",
  kanya:      "♍",
  tula:       "♎",
  vrishchika: "♏",
  dhanu:      "♐",
  makara:     "♑",
  kumbha:     "♒",
  meena:      "♓",
};

const SIGN_BY_HOUSE_FOR_LAGNA: Record<string, string[]> = {
  // Mesha lagna: house N is sign N from Mesha
  mesha: [
    "mesha", "vrishabha", "mithuna", "karka", "simha", "kanya",
    "tula", "vrishchika", "dhanu", "makara", "kumbha", "meena",
  ],
};

interface PostMeta {
  slug: string;
  category: string;
  subcategory: string;
  planet_id?: string;
  house_number?: number;
  lagna_id?: string;
  image_manifest?: ImageManifestEntry[];
}

interface ImageManifestEntry {
  filename: string;
  alt: string;
  width?: number;
  height?: number;
  format?: string;
  style?: string;
}

function loadPosts(opts: BackfillOptions): PostMeta[] {
  const posts: PostMeta[] = [];
  walk(CONTENT_DIR, (file) => {
    if (!file.endsWith(".json")) return;
    try {
      const post = JSON.parse(fs.readFileSync(file, "utf-8")) as PostMeta;
      if (opts.category && post.category !== opts.category) return;
      if (opts.subcategory && post.subcategory !== opts.subcategory) return;
      if (opts.slug && post.slug !== opts.slug) return;
      posts.push(post);
    } catch {
      // skip
    }
  });
  return posts;
}

function walk(dir: string, cb: (file: string) => void): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

function pickSignForPlacement(
  lagnaId: string | undefined,
  houseNumber: number | undefined
): string | undefined {
  if (!lagnaId || !houseNumber) return undefined;
  const ring = SIGN_BY_HOUSE_FOR_LAGNA[lagnaId];
  if (!ring) return undefined;
  return ring[(houseNumber - 1) % 12];
}

function svgHero(post: PostMeta, alt: string): string {
  const planet = post.planet_id ?? "surya";
  const sign = pickSignForPlacement(post.lagna_id, post.house_number);
  const c = PLANET_COLOURS[planet] ?? PLANET_COLOURS.surya;
  const signGlyph = sign ? SIGN_GLYPHS[sign] ?? "" : "";
  const houseLabel = post.house_number ? String(post.house_number) : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeAttr(alt)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.primary}"/>
      <stop offset="100%" stop-color="#013F47"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.4" r="0.5">
      <stop offset="0%" stop-color="${c.accent}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${c.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="850" cy="280" r="220" fill="url(#glow)"/>
  <text x="850" y="360" text-anchor="middle" font-family="serif" font-size="240" fill="${c.accent}" opacity="0.85">${c.glyph}</text>
  <text x="850" y="500" text-anchor="middle" font-family="serif" font-size="80" fill="#faf6ef" opacity="0.7">${signGlyph}</text>
  <text x="120" y="540" font-family="serif" font-size="180" fill="#faf6ef" opacity="0.08" font-weight="700">${houseLabel}</text>
  <rect x="0" y="600" width="1200" height="30" fill="#013F47"/>
</svg>`;
}

function svgKundali(post: PostMeta, alt: string): string {
  const planet = post.planet_id ?? "surya";
  const c = PLANET_COLOURS[planet] ?? PLANET_COLOURS.surya;
  const house = post.house_number ?? 1;
  // Approximate house centres in a North-Indian diamond (1024×1024)
  const HOUSE_CENTRES: Record<number, [number, number]> = {
    1: [512, 280],
    2: [280, 200],
    3: [180, 350],
    4: [280, 512],
    5: [180, 680],
    6: [280, 820],
    7: [512, 740],
    8: [740, 820],
    9: [840, 680],
    10: [740, 512],
    11: [840, 350],
    12: [740, 200],
  };
  const [cx, cy] = HOUSE_CENTRES[house] ?? [512, 512];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-label="${escapeAttr(alt)}">
  <rect width="1024" height="1024" fill="#faf6ef"/>
  <rect x="62" y="62" width="900" height="900" fill="none" stroke="#013F47" stroke-width="3"/>
  <line x1="62" y1="62" x2="962" y2="962" stroke="#013F47" stroke-width="2"/>
  <line x1="962" y1="62" x2="62" y2="962" stroke="#013F47" stroke-width="2"/>
  <polygon points="512,62 962,512 512,962 62,512" fill="none" stroke="#013F47" stroke-width="3"/>
  <circle cx="${cx}" cy="${cy}" r="60" fill="${c.primary}" opacity="0.18"/>
  <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-family="serif" font-size="64" fill="${c.primary}">${c.glyph}</text>
  <text x="${cx}" y="${cy - 75}" text-anchor="middle" font-family="serif" font-size="22" fill="#013F47" opacity="0.6">house ${house}</text>
</svg>`;
}

function svgGemstone(post: PostMeta, alt: string, gemSlug: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" role="img" aria-label="${escapeAttr(alt)}">
  <defs>
    <radialGradient id="velvet" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="#1a2530"/>
      <stop offset="100%" stop-color="#000"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="768" fill="url(#velvet)"/>
  <image href="/gemstones/${gemSlug}.png" x="262" y="134" width="500" height="500" preserveAspectRatio="xMidYMid meet"/>
  <text x="512" y="700" text-anchor="middle" font-family="serif" font-size="32" fill="#faf6ef">${escapeAttr(gemSlug.replace(/-/g, " "))}</text>
</svg>`;
}

function svgStotra(post: PostMeta, alt: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" role="img" aria-label="${escapeAttr(alt)}">
  <defs>
    <linearGradient id="parchment" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FBF5E2"/>
      <stop offset="100%" stop-color="#E8DDB7"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="768" fill="url(#parchment)"/>
  <rect x="40" y="40" width="944" height="688" fill="none" stroke="#c9a84c" stroke-width="6"/>
  <text x="512" y="220" text-anchor="middle" font-family="serif" font-size="56" fill="#013F47" font-style="italic">Sanskrit verse</text>
  <text x="512" y="320" text-anchor="middle" font-family="serif" font-size="48" fill="#013F47">on parchment</text>
  <text x="512" y="500" text-anchor="middle" font-family="serif" font-style="italic" font-size="32" fill="#5a4a30">— Stotra opening line</text>
</svg>`;
}

function escapeAttr(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  }[c] ?? c));
}

function pickTemplate(filename: string): "hero" | "kundali" | "gemstone" | "stotra" | "hero" {
  const f = filename.toLowerCase();
  if (f.includes("kundali") || f.includes("chart")) return "kundali";
  if (f.includes("gemstone") || /\b(ruby|pearl|coral|emerald|sapphire|diamond|hessonite|cats-eye)\b/.test(f)) return "gemstone";
  if (f.includes("stotra") || f.includes("chalisa") || f.includes("kavacham") || f.includes("hridayam") || f.includes("gayatri")) return "stotra";
  return "hero";
}

function gemstoneSlugFromFilename(filename: string): string {
  const f = filename.toLowerCase();
  for (const slug of ["blue-sapphire", "yellow-sapphire", "cats-eye", "red-coral", "hessonite", "diamond", "emerald", "pearl", "ruby"]) {
    if (f.includes(slug)) return slug;
  }
  return "ruby";
}

function generateSvgs(post: PostMeta): { written: number; existing: number } {
  if (!post.image_manifest || post.image_manifest.length === 0) {
    return { written: 0, existing: 0 };
  }
  const postDir = path.join(POSTS_DIR, post.slug);
  fs.mkdirSync(postDir, { recursive: true });
  let written = 0;
  let existing = 0;
  for (const img of post.image_manifest) {
    const webpName = img.filename;
    const svgName = webpName.replace(/\.webp$/i, ".svg");
    const svgPath = path.join(postDir, svgName);
    const webpPath = path.join(postDir, webpName);
    if (fs.existsSync(webpPath) || fs.existsSync(svgPath)) {
      existing++;
      continue;
    }
    const tpl = pickTemplate(webpName);
    let svg: string;
    if (tpl === "kundali") svg = svgKundali(post, img.alt);
    else if (tpl === "gemstone")
      svg = svgGemstone(post, img.alt, gemstoneSlugFromFilename(webpName));
    else if (tpl === "stotra") svg = svgStotra(post, img.alt);
    else svg = svgHero(post, img.alt);
    fs.writeFileSync(svgPath, svg);
    written++;
  }
  return { written, existing };
}

function parseArgs(): BackfillOptions {
  const args = process.argv.slice(2);
  const opts: BackfillOptions = { convert: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--category" && args[i + 1]) {
      opts.category = args[i + 1];
      i++;
    } else if (args[i] === "--subcategory" && args[i + 1]) {
      opts.subcategory = args[i + 1];
      i++;
    } else if (args[i] === "--slug" && args[i + 1]) {
      opts.slug = args[i + 1];
      i++;
    } else if (args[i] === "--convert") {
      opts.convert = true;
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs();
  const posts = loadPosts(opts);
  console.log(`Backfilling images for ${posts.length} post(s)`);
  let totalWritten = 0;
  let totalExisting = 0;
  for (const post of posts) {
    const { written, existing } = generateSvgs(post);
    if (written > 0) {
      console.log(`  + ${post.slug}: ${written} new SVG(s), ${existing} existed`);
    }
    totalWritten += written;
    totalExisting += existing;
  }
  console.log(`\n${totalWritten} SVGs written, ${totalExisting} already existed.`);
  if (opts.convert && totalWritten > 0) {
    console.log(`\nRunning svg-to-webp...`);
    execSync("npx tsx scripts/svg-to-webp.ts", { stdio: "inherit" });
  } else if (totalWritten > 0) {
    console.log(`\nRun: npx tsx scripts/svg-to-webp.ts  (or rerun with --convert)`);
  }
}

main();
