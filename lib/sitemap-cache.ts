// ─────────────────────────────────────────────────────────────────
// Sitemap cache — reads data/sitemaps/index.json (built by
// scripts/build-sitemap-cache.ts from the live partner sitemaps).
//
// This is the AUTHORITATIVE source for "does this URL exist on a
// partner subdomain". The validator uses it to hard-fail any post
// that references a URL the partner site does not publish.
//
// NEVER fabricate URLs. Always look up from this cache.
// Regenerate the cache when partner sites update by running:
//   1. fetch each raw sitemap into data/sitemaps/{host}.raw.xml
//   2. npx tsx scripts/build-sitemap-cache.ts
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

interface CachedSitemap {
  generated_at: string;
  total: number;
  by_host: Record<string, number>;
  entries: { url: string; host: string; last_checked: string }[];
}

let cache: CachedSitemap | null = null;
let urlSet: Set<string> | null = null;

function load(): CachedSitemap {
  if (cache) return cache;
  const p = path.join(process.cwd(), "data", "sitemaps", "index.json");
  if (!fs.existsSync(p)) {
    return { generated_at: "", total: 0, by_host: {}, entries: [] };
  }
  cache = JSON.parse(fs.readFileSync(p, "utf8")) as CachedSitemap;
  urlSet = new Set(cache.entries.map((e) => e.url));
  return cache;
}

// store.vastucart.in is an alias for vastucart.com (the canonical
// store domain). Both serve the same paths. Normalise to the
// canonical form before cache lookup.
const HOST_ALIASES: Record<string, string> = {
  "store.vastucart.in": "vastucart.com",
};

function normaliseUrl(url: string): string {
  try {
    const u = new URL(url);
    if (HOST_ALIASES[u.host]) u.host = HOST_ALIASES[u.host];
    return `${u.protocol}//${u.host}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return url.replace(/[?#].*$/, "").replace(/\/$/, "");
  }
}

/**
 * Check whether a URL exists in any cached partner sitemap.
 * Returns true for URLs the cache has, false otherwise.
 * Returns true for blog.vastucart.in URLs (internal, always valid).
 * Returns true for homepage URLs (/ / /index).
 */
export function urlExistsInCache(url: string): boolean {
  load();
  if (!urlSet) return false;
  const clean = normaliseUrl(url);
  // Internal blog URLs are always considered valid
  if (clean.includes("blog.vastucart.in") || clean.startsWith("/")) return true;
  // Homepages are always valid (they always exist)
  if (/^https?:\/\/(www\.)?[^/]+\/?$/.test(clean)) return true;
  // Exact match
  if (urlSet.has(clean)) return true;
  if (urlSet.has(clean + "/")) return true;
  return false;
}

/**
 * Partner subdomains the cache covers. Posts that link to a
 * subdomain NOT in this list (panchang, horoscope, kundali) are
 * tolerated because we can't verify them — but the validator
 * still warns.
 */
export const CACHED_HOSTS = new Set([
  "stotra.vastucart.in",
  "store.vastucart.in",
  "muhurta.vastucart.in",
  "wedding.vastucart.in",
  "tarot.vastucart.in",
  "www.vastucart.in",
]);

/**
 * Uncovered partner subdomains (no working sitemap).
 * Posts linking to these should use the homepage URL only.
 */
export const UNCACHED_HOSTS = new Set([
  "panchang.vastucart.in",
  "horoscope.vastucart.in",
  "kundali.vastucart.in",
]);

export function isCachedHost(url: string): boolean {
  try {
    const host = new URL(url).host;
    return CACHED_HOSTS.has(host);
  } catch {
    return false;
  }
}

export function isUncachedHost(url: string): boolean {
  try {
    const host = new URL(url).host;
    return UNCACHED_HOSTS.has(host);
  } catch {
    return false;
  }
}

/**
 * Find URLs in the cache matching all given substring tokens
 * (AND match). Returns the best N matches by relevance score.
 * Example: findUrls(["stotra", "shani"], 5) returns the top 5
 * shani-related URLs on stotra.vastucart.in.
 */
export function findUrls(tokens: string[], limit = 10): string[] {
  load();
  if (!cache) return [];
  const lower = tokens.map((t) => t.toLowerCase());
  const hits: { url: string; score: number }[] = [];
  for (const e of cache.entries) {
    const u = e.url.toLowerCase();
    if (lower.every((t) => u.includes(t))) {
      hits.push({ url: e.url, score: lower.length });
    }
  }
  return hits.slice(0, limit).map((h) => h.url);
}

export function cacheStats(): { total: number; by_host: Record<string, number>; generated_at: string } {
  const c = load();
  return { total: c.total, by_host: c.by_host, generated_at: c.generated_at };
}

/**
 * Returns the valid gemstone image filenames that actually exist
 * in public/gemstones/. Used by the validator to hard-fail posts
 * that reference image slugs not in this list.
 *
 * Do not add a slug here without first placing the corresponding
 * .webp file under public/gemstones/.
 */
export const VALID_GEMSTONE_SLUGS = new Set([
  "blue-sapphire",
  "cats-eye",
  "diamond",
  "emerald",
  "hessonite",
  "opal",
  "pearl",
  "red-coral",
  "ruby",
  "yellow-sapphire",
]);
