#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// svg-to-webp.ts — convert post SVGs to WebP using sharp.
//
// Usage:
//   npx tsx scripts/svg-to-webp.ts                   # all posts
//   npx tsx scripts/svg-to-webp.ts --post <slug>     # single post
//   npx tsx scripts/svg-to-webp.ts --force           # regenerate all
//
// Reads every .svg under public/posts/, rasterises at the size
// declared by the SVG viewBox, writes the matching .webp next to it.
// Idempotent — skips when the .webp is newer than the .svg.
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

interface ConvertOptions {
  postSlug?: string;
  force: boolean;
}

const POSTS_DIR = path.join(process.cwd(), "public", "posts");

async function readViewBox(svgPath: string): Promise<{ width: number; height: number }> {
  const xml = fs.readFileSync(svgPath, "utf-8");
  const m = xml.match(/viewBox=["']\s*0\s+0\s+(\d+)\s+(\d+)/i);
  if (m) {
    return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
  }
  // Fallback to width/height attrs
  const w = xml.match(/<svg[^>]*\swidth=["'](\d+)/i);
  const h = xml.match(/<svg[^>]*\sheight=["'](\d+)/i);
  return {
    width: w ? parseInt(w[1], 10) : 1200,
    height: h ? parseInt(h[1], 10) : 630,
  };
}

async function convertOne(svgPath: string, force: boolean): Promise<boolean> {
  const webpPath = svgPath.replace(/\.svg$/i, ".webp");
  if (!force && fs.existsSync(webpPath)) {
    const svgStat = fs.statSync(svgPath);
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtimeMs >= svgStat.mtimeMs) {
      return false;
    }
  }
  const { width, height } = await readViewBox(svgPath);
  const buffer = fs.readFileSync(svgPath);
  // Heroes (≥ 1200 wide) target ≤ 200 KB. In-body ≤ 100 KB.
  const isHero = width >= 1200;
  const quality = isHero ? 82 : 80;
  await sharp(buffer, { density: 144 })
    .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(webpPath);
  return true;
}

async function walkPostsDir(opts: ConvertOptions): Promise<void> {
  if (!fs.existsSync(POSTS_DIR)) {
    console.warn(`public/posts/ not found, nothing to convert`);
    return;
  }
  const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());
  let converted = 0;
  let skipped = 0;
  for (const dir of dirs) {
    if (opts.postSlug && dir.name !== opts.postSlug) continue;
    const full = path.join(POSTS_DIR, dir.name);
    const files = fs.readdirSync(full);
    for (const f of files) {
      if (!f.toLowerCase().endsWith(".svg")) continue;
      const svgPath = path.join(full, f);
      try {
        const did = await convertOne(svgPath, opts.force);
        if (did) {
          console.log(`  ✓ ${dir.name}/${f.replace(/\.svg$/i, ".webp")}`);
          converted++;
        } else {
          skipped++;
        }
      } catch (err) {
        console.error(
          `  × ${dir.name}/${f}: ${(err as Error).message}`
        );
      }
    }
  }
  console.log(`\nDone. ${converted} converted, ${skipped} skipped (up-to-date).`);
}

function parseArgs(): ConvertOptions {
  const args = process.argv.slice(2);
  const opts: ConvertOptions = { force: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--post" && args[i + 1]) {
      opts.postSlug = args[i + 1];
      i++;
    } else if (args[i] === "--force") {
      opts.force = true;
    }
  }
  return opts;
}

async function main() {
  const opts = parseArgs();
  console.log(`SVG → WebP conversion`);
  if (opts.postSlug) console.log(`  Scope: ${opts.postSlug}`);
  if (opts.force) console.log(`  Force regenerate: yes`);
  console.log("");
  await walkPostsDir(opts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
