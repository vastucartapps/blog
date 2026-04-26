#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// generate-infographic-cards.ts
//
// Walks every Jyotish post and generates two composed-SVG
// infographic cards from the post's existing structured data:
//
//   1. {slug}-career-infographic.svg — built from
//      effects-grid.career[] items
//   2. {slug}-remedies-infographic.svg — built from gemstone +
//      stotra + planet metadata
//
// SVGs are saved to public/posts/{slug}/. Then the standard
// scripts/svg-to-webp.ts converts to delivered WebP. Both files
// are referenced in the post's image_manifest and rendered via
// image-figure blocks for full image SEO.
//
// Usage:
//   npx tsx scripts/generate-infographic-cards.ts                # all
//   npx tsx scripts/generate-infographic-cards.ts --slug <slug>
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import {
  buildCareerCardSvg,
  buildRemediesCardSvg,
} from "../lib/svg/infographic-card";

interface Options {
  slug?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_PUBLIC_DIR = path.join(process.cwd(), "public", "posts");

interface Block {
  type: string;
  career?: string[];
  cards?: { name?: string; role?: string; sub?: string }[];
  intro_html?: string;
  yantra?: { name?: string; direction?: string };
  stotra?: { title?: string; eyebrow?: string };
  [k: string]: unknown;
}

interface Post {
  slug: string;
  category?: string;
  planet_id?: string;
  house_number?: number;
  lagna_id?: string;
  hero?: { title_html?: string };
  meta?: { title?: string };
  content: Block[];
}

const HOUSE_SANSKRIT: Record<number, string> = {
  1: "Pratham Bhava",
  2: "Dhana Bhava",
  3: "Parakrama Bhava",
  4: "Sukha Sthana",
  5: "Putra Bhava",
  6: "Ripu Bhava",
  7: "Yuvati Bhava",
  8: "Randhra Bhava",
  9: "Dharma Bhava",
  10: "Karma Bhava",
  11: "Labha Bhava",
  12: "Vyaya Bhava",
};

const LAGNA_LABEL: Record<string, string> = {
  mesha: "Mesh Lagna",
  vrishabha: "Vrishabha Lagna",
  mithuna: "Mithuna Lagna",
  karka: "Karka Lagna",
  simha: "Simha Lagna",
  kanya: "Kanya Lagna",
  tula: "Tula Lagna",
  vrishchika: "Vrishchika Lagna",
  dhanu: "Dhanu Lagna",
  makara: "Makara Lagna",
  kumbha: "Kumbha Lagna",
  meena: "Meena Lagna",
};

const PLANET_COLOURS: Record<
  string,
  { primary: string; accent: string }
> = {
  surya: { primary: "#013F47", accent: "#e8840a" },
  chandra: { primary: "#013F47", accent: "#338a95" },
  mangal: { primary: "#5a1414", accent: "#c94444" },
  budha: { primary: "#013F47", accent: "#338a95" },
  guru: { primary: "#7a4d00", accent: "#f4b942" },
  shukra: { primary: "#5a1d3e", accent: "#e8840a" },
  shani: { primary: "#012a30", accent: "#7a8a8f" },
  rahu: { primary: "#013F47", accent: "#7B6FB7" },
  ketu: { primary: "#013F47", accent: "#9DA8AC" },
};

const PLANET_DAY: Record<string, string> = {
  surya: "Sunday at sunrise",
  chandra: "Monday at sunrise",
  mangal: "Tuesday at sunrise",
  budha: "Wednesday at sunrise",
  guru: "Thursday at sunrise",
  shukra: "Friday at sunrise",
  shani: "Saturday evening",
  rahu: "Saturday evening (Rahu hora)",
  ketu: "Tuesday evening (Ketu hora)",
};

const PLANET_COLOUR_LABEL: Record<string, string> = {
  surya: "Saffron, red, gold",
  chandra: "White, silver, soft cream",
  mangal: "Red, copper, warm amber",
  budha: "Green, jade, emerald",
  guru: "Yellow, gold, turmeric",
  shukra: "White, pink, cream",
  shani: "Dark blue, grey, black",
  rahu: "Indigo, smoke, deep blue",
  ketu: "Smoke grey, muted earth tones",
};

const PLANET_DONATION: Record<string, string> = {
  surya: "Books, scholarships, dharmic causes",
  chandra: "Milk, white cloth, food to mothers",
  mangal: "Red lentils, copper, food to soldiers",
  budha: "Books, stationery, scholarship funds",
  guru: "Yellow flowers, turmeric, teaching grants",
  shukra: "White flowers, sweets, refined gifts",
  shani: "Sesame oil, iron, food to elders",
  rahu: "Foreign-aid causes, food to strangers",
  ketu: "Food to monastics, books, charity",
};

const PLANET_DEFAULT_GEMSTONE: Record<string, string> = {
  surya: "Ruby (Manikya)",
  chandra: "Pearl (Mukta)",
  mangal: "Red Coral (Moonga)",
  budha: "Emerald (Panna)",
  guru: "Yellow Sapphire (Pukhraj)",
  shukra: "Diamond (Hira)",
  shani: "Blue Sapphire (Neelam)",
  rahu: "Hessonite (Gomed)",
  ketu: "Cats Eye (Lehsunia)",
};

const PLANET_DEFAULT_MANTRA: Record<string, string> = {
  surya: "Aditya Hridayam",
  chandra: "Chandra Kavacham",
  mangal: "Hanuman Chalisa",
  budha: "Saraswati Stotram",
  guru: "Vishnu Sahasranama",
  shukra: "Shri Suktam",
  shani: "Shani Stotram",
  rahu: "Rahu Kavacham",
  ketu: "Ketu Kavacham",
};

const PLANET_DEFAULT_YANTRA: Record<string, string> = {
  surya: "Surya Yantra (east wall)",
  chandra: "Chandra Yantra (north-west)",
  mangal: "Mangal Yantra (south)",
  budha: "Budha Yantra (north)",
  guru: "Guru Yantra (north-east)",
  shukra: "Shukra Yantra (south-east)",
  shani: "Shani Yantra (west)",
  rahu: "Rahu Yantra (south-west)",
  ketu: "Ketu Yantra (south-west)",
};

function deriveSignature(post: Post): string {
  // Look for the deep-dive scannable-prose heading or pull-quote
  for (const b of post.content) {
    if (b.type === "scannable-prose" && typeof b.heading === "string") {
      const h = b.heading as string;
      if (/why/i.test(h) || /signature/i.test(h)) {
        // Take a phrase from the heading (trim "Why" / "produces")
        return h
          .replace(/^Why\s+/i, "")
          .replace(/\s+produces\s+.*$/i, "")
          .replace(/\s+for\s+.*$/i, "")
          .replace(/\s+the\s+/i, " ")
          .trim()
          .replace(/^./, (c) => c.toUpperCase());
      }
    }
  }
  return "Reviewed practitioner study";
}

function getCareerItems(post: Post): string[] | null {
  for (const b of post.content) {
    if (b.type === "effects-grid" && Array.isArray(b.career)) {
      return b.career.slice(0, 6);
    }
  }
  return null;
}

function getGemstoneName(post: Post): string {
  for (const b of post.content) {
    if (b.type === "gemstone" && Array.isArray(b.cards)) {
      const primary = b.cards.find((c) => c.role === "primary");
      if (primary?.name) return primary.name;
    }
  }
  return PLANET_DEFAULT_GEMSTONE[post.planet_id ?? ""] ?? "Consult Jyotishi";
}

function getMantraName(post: Post): string {
  for (const b of post.content) {
    if (b.type === "stotra" && b.stotra) {
      const s = b.stotra as { eyebrow?: string; title?: string };
      if (s.eyebrow) return s.eyebrow;
      if (s.title) return s.title.replace(/^Shri\s+/i, "");
    }
  }
  return PLANET_DEFAULT_MANTRA[post.planet_id ?? ""] ?? "Daily mantra";
}

function getYantraDescription(post: Post): string {
  for (const b of post.content) {
    if (b.type === "yantra" && b.yantra) {
      const y = b.yantra as { name?: string; direction?: string };
      if (y.name) {
        return y.direction ? `${y.name} · ${y.direction}` : y.name;
      }
    }
  }
  return PLANET_DEFAULT_YANTRA[post.planet_id ?? ""] ?? "Consult practitioner";
}

function generateForPost(post: Post): { written: number; skipped: number } {
  if (post.category !== "jyotish") return { written: 0, skipped: 0 };
  if (!post.planet_id || !post.house_number || !post.lagna_id) {
    return { written: 0, skipped: 0 };
  }

  const careerItems = getCareerItems(post);
  if (!careerItems) return { written: 0, skipped: 0 };

  const houseSanskrit =
    HOUSE_SANSKRIT[post.house_number] ?? `${post.house_number}th house`;
  const lagnaLabel = LAGNA_LABEL[post.lagna_id] ?? post.lagna_id;
  const colours = PLANET_COLOURS[post.planet_id] ?? PLANET_COLOURS.surya;
  const signature = deriveSignature(post);

  const careerSvg = buildCareerCardSvg({
    planet_id: post.planet_id,
    house_number: post.house_number,
    house_sanskrit: houseSanskrit,
    lagna_label: lagnaLabel,
    signature_phrase: signature,
    items: careerItems,
    primary_color: colours.primary,
    accent_color: colours.accent,
  });

  const remediesSvg = buildRemediesCardSvg({
    planet_id: post.planet_id,
    house_number: post.house_number,
    house_sanskrit: houseSanskrit,
    lagna_label: lagnaLabel,
    mantra_name: getMantraName(post),
    gemstone_name: getGemstoneName(post),
    day_label: PLANET_DAY[post.planet_id] ?? "Daily at sunrise",
    colour_label:
      PLANET_COLOUR_LABEL[post.planet_id] ?? "Brand-aligned colour",
    yantra_name: getYantraDescription(post),
    donation_label: PLANET_DONATION[post.planet_id] ?? "Charity to dharmic causes",
    primary_color: colours.primary,
    accent_color: colours.accent,
  });

  const dir = path.join(POSTS_PUBLIC_DIR, post.slug);
  fs.mkdirSync(dir, { recursive: true });
  const careerPath = path.join(dir, `${post.slug}-career-infographic.svg`);
  const remediesPath = path.join(dir, `${post.slug}-remedies-infographic.svg`);

  fs.writeFileSync(careerPath, careerSvg);
  fs.writeFileSync(remediesPath, remediesSvg);

  return { written: 2, skipped: 0 };
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
  const opts: Options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--slug" && args[i + 1]) {
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
  let totalWritten = 0;
  let postsProcessed = 0;
  for (const file of files) {
    let post: Post;
    try {
      post = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      continue;
    }
    if (opts.slug && post.slug !== opts.slug) continue;
    const { written } = generateForPost(post);
    if (written > 0) {
      totalWritten += written;
      postsProcessed++;
      console.log(`  ✓ ${post.slug}: ${written} infographic SVGs`);
    }
  }
  console.log(
    `\n${totalWritten} SVGs written across ${postsProcessed} post(s).`
  );
  if (totalWritten > 0) {
    console.log(`\nNext: npx tsx scripts/svg-to-webp.ts`);
  }
}

main();
