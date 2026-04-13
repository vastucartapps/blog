#!/usr/bin/env tsx
// Parse raw XML sitemaps under data/sitemaps/*.raw.xml into
// data/sitemaps/index.json — a single JSON file with every URL
// from every partner subdomain, keyed by host.
//
// Usage:
//   npx tsx scripts/build-sitemap-cache.ts
//
// Run whenever partner sites update. The output index.json is the
// source of truth for the validator and the content generation
// helpers. Never fabricate a URL that isn't in this cache.

import fs from "node:fs";
import path from "node:path";

interface SitemapEntry {
  url: string;
  host: string;
  last_checked: string;
}

const SITEMAP_DIR = path.join(process.cwd(), "data", "sitemaps");
const OUTPUT = path.join(SITEMAP_DIR, "index.json");

function extractUrls(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const url = m[1].trim();
    if (url.startsWith("http")) out.push(url);
  }
  return out;
}

function main() {
  if (!fs.existsSync(SITEMAP_DIR)) {
    console.error(`${SITEMAP_DIR} not found`);
    process.exit(2);
  }
  const files = fs.readdirSync(SITEMAP_DIR).filter((f) => f.endsWith(".raw.xml"));
  const entries: SitemapEntry[] = [];
  const byHost: Record<string, number> = {};
  const now = new Date().toISOString();

  for (const f of files) {
    const host = f.replace(".raw.xml", "");
    const xml = fs.readFileSync(path.join(SITEMAP_DIR, f), "utf8");
    const urls = extractUrls(xml);
    byHost[host] = urls.length;
    for (const u of urls) {
      entries.push({ url: u, host, last_checked: now });
    }
  }

  const out = {
    generated_at: now,
    total: entries.length,
    by_host: byHost,
    entries,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUTPUT}`);
  console.log(`Total URLs: ${entries.length}`);
  for (const [h, n] of Object.entries(byHost)) {
    console.log(`  ${h}: ${n}`);
  }
}

main();
