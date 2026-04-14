import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import type { ArticlePost, PostStatus } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

const VISIBLE_STATUSES = new Set<PostStatus | string>([
  "ready", "READY",
  "published", "PUBLISHED",
  "scheduled", "SCHEDULED",
  "GENERATED",
]);

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "PROGRESS.md") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

function readPost(file: string): ArticlePost | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as ArticlePost;
  } catch {
    return null;
  }
}

export const getAllPosts = cache((): ArticlePost[] =>
  walk(CONTENT_DIR)
    .map(readPost)
    .filter((p): p is ArticlePost => p !== null)
    .sort((a, b) => {
      const at = new Date(a.published_at || 0).getTime();
      const bt = new Date(b.published_at || 0).getTime();
      return bt - at;
    })
);

export const getPublishedPosts = cache((): ArticlePost[] =>
  getAllPosts().filter((p) => VISIBLE_STATUSES.has(p.status))
);

export const getPostsByCategory = cache((category: string): ArticlePost[] =>
  getPublishedPosts().filter((p) => p.category === category)
);

export const getPostsBySubcategory = cache(
  (category: string, subcategory: string): ArticlePost[] =>
    getPublishedPosts().filter(
      (p) => p.category === category && p.subcategory === subcategory
    )
);

export const getPostBySlug = cache(
  (slug: string): ArticlePost | null =>
    getPublishedPosts().find((p) => p.slug === slug) ?? null
);

export function countPostsByCategory(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of getPublishedPosts()) {
    out[p.category] = (out[p.category] ?? 0) + 1;
  }
  return out;
}

// Live count of published posts keyed by subcategory slug. Scoped
// to a single category so the same subcategory slug used under two
// categories (if ever added) does not collide.
export function countPostsBySubcategory(category: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of getPostsByCategory(category)) {
    if (p.subcategory) out[p.subcategory] = (out[p.subcategory] ?? 0) + 1;
  }
  return out;
}
