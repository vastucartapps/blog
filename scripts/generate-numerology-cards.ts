#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// generate-numerology-cards.ts
//
// Walks every numerology post under content/numerology/ and produces
// the full 6-image set referenced by the post's image_manifest:
//
//   1. {slug}-hero-v3.svg + .webp (1060×1048)
//   2. {slug}-hero-og-v3.webp     (1200×630, cropped from hero)
//   3. {slug}-career-infographic.svg + .webp (1200×800)
//   4. {slug}-remedies-infographic.svg + .webp (1200×800)
//   5. {slug}-stotra-parchment.svg + .webp (1060×1048)
//   6. {slug}-mandala.svg + .webp (1024×1024)
//   7. {slug}-{ratna}.webp (1024×768) — gemstone vignette overlay
//
// Same workflow grammar as scripts/generate-hero-cards.ts (jyotish):
//   npx tsx scripts/generate-numerology-cards.ts          # all
//   npx tsx scripts/generate-numerology-cards.ts --slug life-path-number-1
//   npx tsx scripts/generate-numerology-cards.ts --dry-run
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { buildNumerologyHeroCardSvg } from "../lib/svg/numerology-hero-card";
import { buildNumerologyMandalaSvg } from "../lib/svg/numerology-mandala";
import {
  buildNumerologyCareerCardSvg,
  buildNumerologyRemediesCardSvg,
} from "../lib/svg/numerology-infographic";
import { buildStotraCardSvg } from "../lib/svg/stotra-card";

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
  template?: string;
  number?: number;
  ruling_planet?: string;
  ruling_day?: string;
  title?: string;
  meta?: { og_image?: string; [k: string]: unknown };
  hero?: { tags?: { label: string }[]; [k: string]: unknown };
  image_manifest?: ManifestEntry[];
  content: Array<Record<string, unknown>>;
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
const GEMSTONES_DIR = path.join(ROOT, "public", "gemstones");

const PLANET_DAY: Record<string, string> = {
  surya: "Sunday at sunrise",
  chandra: "Monday at moonrise",
  mangal: "Tuesday at sunrise",
  budha: "Wednesday at sunrise",
  guru: "Thursday at sunrise",
  shukra: "Friday at sunrise",
  shani: "Saturday at sunset",
  rahu: "Saturday at sunrise (Rahu hora)",
  ketu: "Wednesday at sunrise (Ketu hora)",
};
const PLANET_COLOUR_LABEL: Record<string, string> = {
  surya: "Saffron, red, gold",
  chandra: "Cream, soft white, silver",
  mangal: "Red, crimson, deep coral",
  budha: "Emerald green, jade, mint",
  guru: "Golden yellow, saffron, turmeric",
  shukra: "Rose-gold, cream, soft pink",
  shani: "Dark blue, black, deep grey",
  rahu: "Indigo, smoke grey, electric blue",
  ketu: "Smoke grey, soft maroon, muted earth",
};
const PLANET_DEFAULT_DONATION: Record<string, string> = {
  surya: "Wheat, jaggery, books, copper",
  chandra: "Milk, white cloth, rice",
  mangal: "Red lentils, copper, food to soldiers",
  budha: "Books, stationery, scholarship funds",
  guru: "Yellow flowers, turmeric, books, ghee",
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
  ketu: "Cat's Eye (Lehsunia)",
};
const PLANET_DEFAULT_MANTRA: Record<string, string> = {
  surya: "Aditya Stotram",
  chandra: "Chandra Stotram",
  mangal: "Mangal Stotram",
  budha: "Budha Stotram",
  guru: "Brihaspati Stotram",
  shukra: "Shukra Stotram",
  shani: "Shani Stotram",
  rahu: "Rahu Stotram",
  ketu: "Ketu Stotram",
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
const ARCHETYPE_BY_NUMBER: Record<number, string> = {
  1: "Sun-ruled originator",
  2: "Moon-ruled diplomat",
  3: "Jupiter-ruled teacher",
  4: "Rahu-ruled disruptor",
  5: "Mercury-ruled communicator",
  6: "Venus-ruled aesthete",
  7: "Ketu-ruled mystic",
  8: "Saturn-ruled architect",
  9: "Mars-ruled warrior",
};

function listPosts(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const out: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
    }
  }
  walk(CONTENT_DIR);
  return out;
}

function pickKeyTraits(post: Post): string[] {
  const eg = (post.content ?? []).find(
    (b): b is Record<string, unknown> & { type: string } =>
      (b as { type: string }).type === "effects-grid",
  ) as Record<string, unknown> | undefined;
  const positives = (eg?.positive as string[] | undefined) ?? [];
  if (positives.length) return positives.slice(0, 5);
  const tags = (post.hero?.tags ?? [])
    .map((t) => t.label)
    .filter((s): s is string => typeof s === "string" && s.length > 0);
  return tags.slice(0, 5);
}

function pickCareerItems(post: Post): string[] {
  const eg = (post.content ?? []).find(
    (b): b is Record<string, unknown> & { type: string } =>
      (b as { type: string }).type === "effects-grid",
  ) as Record<string, unknown> | undefined;
  return ((eg?.career as string[] | undefined) ?? []).slice(0, 6);
}

function pickGemstoneInfo(post: Post): { name: string; slug: string | null } {
  const block = (post.content ?? []).find(
    (b): b is Record<string, unknown> & { type: string } =>
      (b as { type: string }).type === "gemstone",
  ) as Record<string, unknown> | undefined;
  const cards = (block?.cards as Array<Record<string, unknown>> | undefined) ?? [];
  const primary = cards.find((c) => c.role === "primary");
  if (primary) {
    return {
      name: (primary.name as string) ?? PLANET_DEFAULT_GEMSTONE[post.ruling_planet ?? ""] ?? "Consult Jyotishi",
      slug: (primary.image_slug as string) ?? null,
    };
  }
  return {
    name: PLANET_DEFAULT_GEMSTONE[post.ruling_planet ?? ""] ?? "Consult Jyotishi",
    slug: null,
  };
}

function pickYantraInfo(post: Post): string {
  const block = (post.content ?? []).find(
    (b): b is Record<string, unknown> & { type: string } =>
      (b as { type: string }).type === "yantra",
  ) as Record<string, unknown> | undefined;
  const y = block?.yantra as Record<string, unknown> | undefined;
  if (y?.name) {
    return y.direction ? `${y.name} · ${y.direction}` : (y.name as string);
  }
  return PLANET_DEFAULT_YANTRA[post.ruling_planet ?? ""] ?? "Consult practitioner";
}

function pickMantraInfo(post: Post): string {
  const block = (post.content ?? []).find(
    (b): b is Record<string, unknown> & { type: string } =>
      (b as { type: string }).type === "stotra",
  ) as Record<string, unknown> | undefined;
  const s = block?.stotra as Record<string, unknown> | undefined;
  if (s?.eyebrow) return s.eyebrow as string;
  if (s?.title) return (s.title as string).replace(/^Shri\s+/i, "");
  return PLANET_DEFAULT_MANTRA[post.ruling_planet ?? ""] ?? "Daily mantra";
}

function findManifestByFilename(post: Post, filename: string): ManifestEntry | undefined {
  return (post.image_manifest ?? []).find((m) => m.filename === filename);
}

async function processPost(jsonPath: string) {
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const post: Post = JSON.parse(raw);

  if (post.category !== "numerology") {
    return { slug: post.slug, status: "skipped", reason: "not numerology" };
  }
  if (post.template !== "numerology-number") {
    return { slug: post.slug, status: "skipped", reason: "not numerology-number" };
  }
  if (!post.number || !post.ruling_planet || !post.ruling_day) {
    return { slug: post.slug, status: "skipped", reason: "missing number/ruling_planet/ruling_day" };
  }

  const traits = pickKeyTraits(post);
  const careerItems = pickCareerItems(post);
  const gemstone = pickGemstoneInfo(post);
  const archetype = ARCHETYPE_BY_NUMBER[post.number] ?? "life-path archetype";

  const outDir = path.join(POSTS_PUBLIC_DIR, post.slug);
  if (!fs.existsSync(outDir) && !dryRun) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. HERO 1060×1048 + OG 1200×630
  const heroSvg = buildNumerologyHeroCardSvg({
    number: post.number,
    ruling_planet: post.ruling_planet,
    ruling_day: post.ruling_day,
    ratna: gemstone.name,
    key_traits: traits,
  });
  const heroSvgPath = path.join(outDir, `${post.slug}-hero-v3.svg`);
  const heroWebpPath = path.join(outDir, `${post.slug}-hero-v3.webp`);
  const heroOgPath = path.join(outDir, `${post.slug}-hero-og-v3.webp`);
  if (!dryRun) {
    fs.writeFileSync(heroSvgPath, heroSvg);
    await sharp(Buffer.from(heroSvg), { density: 144 })
      .resize(1060, 1048, { fit: "contain", background: "#F2EAD3" })
      .webp({ quality: 92 })
      .toFile(heroWebpPath);
    await sharp(Buffer.from(heroSvg), { density: 144 })
      .resize(1200, 1180, { fit: "contain", background: "#F2EAD3" })
      .extract({ left: 0, top: 275, width: 1200, height: 630 })
      .webp({ quality: 92 })
      .toFile(heroOgPath);
  }

  // 2. CAREER INFOGRAPHIC 1200×800
  const careerSvg = buildNumerologyCareerCardSvg({
    number: post.number,
    ruling_planet: post.ruling_planet,
    ruling_day: post.ruling_day,
    archetype,
    items: careerItems.length ? careerItems : ["Career fit one", "Career fit two", "Career fit three", "Career fit four", "Career fit five", "Career fit six"],
  });
  const careerSvgPath = path.join(outDir, `${post.slug}-career-infographic.svg`);
  const careerWebpPath = path.join(outDir, `${post.slug}-career-infographic.webp`);
  if (!dryRun) {
    fs.writeFileSync(careerSvgPath, careerSvg);
    await sharp(Buffer.from(careerSvg), { density: 144 })
      .resize(1200, 800, { fit: "contain", background: "#F2EAD3" })
      .webp({ quality: 92 })
      .toFile(careerWebpPath);
  }

  // 3. REMEDIES INFOGRAPHIC 1200×800
  const remediesSvg = buildNumerologyRemediesCardSvg({
    number: post.number,
    ruling_planet: post.ruling_planet,
    ruling_day: post.ruling_day,
    archetype,
    mantra_name: pickMantraInfo(post),
    gemstone_name: gemstone.name,
    day_label: PLANET_DAY[post.ruling_planet] ?? `${post.ruling_day} at sunrise`,
    colour_label: PLANET_COLOUR_LABEL[post.ruling_planet] ?? "Brand-aligned colour",
    yantra_name: pickYantraInfo(post),
    donation_label: PLANET_DEFAULT_DONATION[post.ruling_planet] ?? "Charity to dharmic causes",
  });
  const remediesSvgPath = path.join(outDir, `${post.slug}-remedies-infographic.svg`);
  const remediesWebpPath = path.join(outDir, `${post.slug}-remedies-infographic.webp`);
  if (!dryRun) {
    fs.writeFileSync(remediesSvgPath, remediesSvg);
    await sharp(Buffer.from(remediesSvg), { density: 144 })
      .resize(1200, 800, { fit: "contain", background: "#F2EAD3" })
      .webp({ quality: 92 })
      .toFile(remediesWebpPath);
  }

  // 4. STOTRA PARCHMENT (existing builder, takes planet_id)
  const stotraSvg = buildStotraCardSvg({ planet_id: post.ruling_planet });
  const stotraSvgPath = path.join(outDir, `${post.slug}-stotra-parchment.svg`);
  const stotraWebpPath = path.join(outDir, `${post.slug}-stotra-parchment.webp`);
  if (!dryRun) {
    fs.writeFileSync(stotraSvgPath, stotraSvg);
    await sharp(Buffer.from(stotraSvg), { density: 144 })
      .resize(1060, 1048, { fit: "contain", background: "#013F47" })
      .webp({ quality: 90 })
      .toFile(stotraWebpPath);
  }

  // 5. MANDALA 1024×1024
  const mandalaSvg = buildNumerologyMandalaSvg({
    number: post.number,
    ruling_planet: post.ruling_planet,
  });
  const mandalaSvgPath = path.join(outDir, `${post.slug}-mandala.svg`);
  const mandalaWebpPath = path.join(outDir, `${post.slug}-mandala.webp`);
  if (!dryRun) {
    fs.writeFileSync(mandalaSvgPath, mandalaSvg);
    await sharp(Buffer.from(mandalaSvg), { density: 144 })
      .resize(1024, 1024, { fit: "contain", background: "#F2EAD3" })
      .webp({ quality: 92 })
      .toFile(mandalaWebpPath);
  }

  // 6. GEMSTONE VIGNETTE 1024×768 (composite of velvet + gemstone PNG)
  const gemstoneSlugLookup = (post.image_manifest ?? []).find((m) =>
    /-(ruby|pearl|red-coral|emerald|yellow-sapphire|diamond|blue-sapphire|hessonite|cats-eye|opal)\.webp$/.test(m.filename),
  );
  if (gemstoneSlugLookup) {
    const m = gemstoneSlugLookup.filename.match(
      /-(ruby|pearl|red-coral|emerald|yellow-sapphire|diamond|blue-sapphire|hessonite|cats-eye|opal)\.webp$/,
    );
    const gemSlug = m ? m[1] : gemstone.slug;
    if (gemSlug) {
      const gemSrc = path.join(GEMSTONES_DIR, `${gemSlug}.webp`);
      if (fs.existsSync(gemSrc)) {
        const targetPath = path.join(outDir, gemstoneSlugLookup.filename);
        const targetSvgPath = targetPath.replace(/\.webp$/, ".svg");
        const velvetSvg = buildGemstoneVelvetSvg({
          gemstoneSlug: gemSlug,
          gemstoneName: gemstone.name,
        });
        if (!dryRun) {
          fs.writeFileSync(targetSvgPath, velvetSvg);
          // Render velvet background, then composite the real gemstone WebP centred.
          const bgBuf = await sharp(Buffer.from(velvetSvg), { density: 144 })
            .resize(1024, 768, { fit: "contain", background: "#000" })
            .png()
            .toBuffer();
          const gemBuf = await sharp(gemSrc)
            .resize(560, 560, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();
          await sharp(bgBuf)
            .composite([{ input: gemBuf, top: 80, left: 232 }])
            .webp({ quality: 92 })
            .toFile(targetPath);
        }
      }
    }
  }

  return { slug: post.slug, status: "ok", traits: traits.length, items: careerItems.length };
}

function buildGemstoneVelvetSvg(opts: {
  gemstoneSlug: string;
  gemstoneName: string;
}): string {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768"
     role="img" aria-label="${escape(opts.gemstoneName)} on a dark velvet background">
  <defs>
    <radialGradient id="velvet" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1a2530"/>
      <stop offset="65%" stop-color="#0a121a"/>
      <stop offset="100%" stop-color="#000"/>
    </radialGradient>
    <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B6420" stop-opacity="0"/>
      <stop offset="50%" stop-color="#D9B76A" stop-opacity="1"/>
      <stop offset="100%" stop-color="#8B6420" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="768" fill="url(#velvet)"/>
  <circle cx="512" cy="384" r="240" fill="#1f2b35" opacity="0.5"/>
  <text x="512" y="700" text-anchor="middle"
        font-family="Georgia, serif" font-size="32"
        fill="#FBF6E8" font-style="italic">${escape(opts.gemstoneName)}</text>
  <line x1="320" y1="724" x2="704" y2="724" stroke="url(#goldStroke)" stroke-width="1.4"/>
  <text x="512" y="746" text-anchor="middle"
        font-family="Georgia, serif" font-size="13"
        fill="#D9B76A" letter-spacing="2.6">JYOTISH RATNA · VASTUCART EDITORIAL</text>
</svg>
`;
}

(async () => {
  const paths = listPosts();
  const targets = slugArg
    ? paths.filter((p) => path.basename(p, ".json") === slugArg)
    : paths;
  if (targets.length === 0) {
    console.error("No matching numerology posts.");
    process.exit(1);
  }
  console.log(
    `Generating numerology cards for ${targets.length} post(s)${dryRun ? " [dry-run]" : ""}…`,
  );
  let ok = 0, skipped = 0, failed = 0;
  for (const p of targets) {
    try {
      const r = await processPost(p);
      if (r.status === "ok") {
        ok++;
        process.stdout.write(`. ${r.slug}\n`);
      } else {
        skipped++;
        process.stdout.write(`s ${r.slug} (${r.reason})\n`);
      }
    } catch (err) {
      failed++;
      console.error(`\n✗ ${path.basename(p)}:`, (err as Error).message);
    }
  }
  console.log(`\n  ok ${ok}   skipped ${skipped}   failed ${failed}`);
})();
