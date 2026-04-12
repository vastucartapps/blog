#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// generate-images.ts — fills image_manifest placeholders.
//
// Walks every post under content/. For each entry in each post's
// image_manifest, checks if public/posts/{slug}/{filename} exists.
// If not, calls the configured generative image API with the
// `generation_prompt` + `negative_prompt`, saves the result, and
// continues.
//
// Idempotent: running twice does nothing for already-generated files.
//
// Configure via .env.local:
//   IMAGE_API_URL=https://...
//   IMAGE_API_KEY=...
//
// Until the API is configured, the script logs what it WOULD generate.
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

const API_URL = process.env.IMAGE_API_URL ?? "";
const API_KEY = process.env.IMAGE_API_KEY ?? "";
const POSTS_ROOT = path.join(process.cwd(), "content");
const PUBLIC_ROOT = path.join(process.cwd(), "public", "posts");

interface ManifestEntry {
  filename: string;
  filename_og?: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  generation_prompt: string;
  negative_prompt: string;
  style?: string;
  format?: "webp" | "png";
}

interface PostShape {
  slug: string;
  image_manifest?: ManifestEntry[];
}

function walkPosts(): { file: string; post: PostShape }[] {
  const out: { file: string; post: PostShape }[] = [];
  const stack = [POSTS_ROOT];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (!fs.existsSync(cur)) continue;
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith(".json")) {
        try {
          const post = JSON.parse(fs.readFileSync(full, "utf8")) as PostShape;
          if (post.slug && post.image_manifest) {
            out.push({ file: full, post });
          }
        } catch {
          // skip malformed
        }
      }
    }
  }
  return out;
}

async function callImageApi(
  prompt: string,
  negative: string,
  width: number,
  height: number
): Promise<Buffer> {
  if (!API_URL || !API_KEY) {
    throw new Error("IMAGE_API_URL and IMAGE_API_KEY not configured");
  }
  // TODO: replace with the real provider's request shape when given
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      negative_prompt: negative,
      width,
      height,
      format: "webp",
    }),
  });
  if (!res.ok) {
    throw new Error(`Image API error: ${res.status} ${await res.text()}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function ensureDir(p: string): void {
  fs.mkdirSync(p, { recursive: true });
}

async function main() {
  const posts = walkPosts();
  const dryRun = !API_URL || !API_KEY;

  if (dryRun) {
    console.log("DRY RUN: IMAGE_API_URL / IMAGE_API_KEY not set. Will only log what would generate.\n");
  }

  let total = 0;
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const { post } of posts) {
    const dir = path.join(PUBLIC_ROOT, post.slug);
    ensureDir(dir);
    for (const img of post.image_manifest!) {
      total += 1;
      const filePath = path.join(dir, img.filename);
      if (fs.existsSync(filePath)) {
        skipped += 1;
        continue;
      }
      console.log(`[${post.slug}] ${img.filename}`);
      console.log(`  prompt: ${img.generation_prompt.slice(0, 100)}...`);
      if (dryRun) {
        console.log(`  -> would write ${filePath}`);
        continue;
      }
      try {
        const buf = await callImageApi(
          img.generation_prompt,
          img.negative_prompt,
          img.width,
          img.height
        );
        fs.writeFileSync(filePath, buf);
        generated += 1;
        console.log(`  -> saved ${img.filename} (${buf.length} bytes)`);
      } catch (err) {
        failed += 1;
        console.error(`  -> failed: ${(err as Error).message}`);
      }
    }
  }

  console.log(`\nDone. total=${total} generated=${generated} skipped=${skipped} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
