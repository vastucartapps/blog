#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// post-publish.ts — pings IndexNow + Google + sitemap on publish.
//
// Usage:
//   npx tsx scripts/post-publish.ts content/jyotish/.../slug.json
//   npx tsx scripts/post-publish.ts --all
//
// Pings:
//   - IndexNow API (Bing, Yandex, Seznam, Naver)
//   - Google sitemap ping
//   - Google Search Console URL inspection (when API key configured)
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.vastucart.in";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "";

interface PostShape {
  slug: string;
  category: string;
  subcategory: string;
  status: string;
}

function postsToPing(args: string[]): PostShape[] {
  const out: PostShape[] = [];
  if (args[0] === "--all") {
    walk(path.join(process.cwd(), "content"), out);
  } else {
    for (const a of args) {
      if (a.endsWith(".json") && fs.existsSync(a)) {
        out.push(JSON.parse(fs.readFileSync(a, "utf8")));
      }
    }
  }
  return out.filter((p) => p.status === "ready" || p.status === "published");
}

function walk(dir: string, out: PostShape[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith(".json")) {
      try {
        out.push(JSON.parse(fs.readFileSync(full, "utf8")));
      } catch {
        // skip malformed
      }
    }
  }
}

async function pingIndexNow(urls: string[]) {
  if (!INDEXNOW_KEY) {
    console.log("IndexNow: skipped (INDEXNOW_KEY not set)");
    return;
  }
  const host = new URL(SITE_URL).host;
  try {
    const res = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    console.log(`IndexNow: ${res.status} for ${urls.length} URLs`);
  } catch (err) {
    console.error(`IndexNow failed: ${(err as Error).message}`);
  }
}

async function pingGoogleSitemap() {
  try {
    const res = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`
    );
    console.log(`Google sitemap ping: ${res.status}`);
  } catch (err) {
    console.error(`Google sitemap ping failed: ${(err as Error).message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("usage: post-publish.ts <file.json> [--all]");
    process.exit(2);
  }
  const posts = postsToPing(args);
  if (posts.length === 0) {
    console.log("no eligible posts to ping");
    return;
  }
  const urls = posts.map((p) => `${SITE_URL}/${p.category}/${p.subcategory}/${p.slug}`);
  console.log(`pinging ${urls.length} URL(s)...`);
  await pingIndexNow(urls);
  await pingGoogleSitemap();
  console.log("done");
}

main();
