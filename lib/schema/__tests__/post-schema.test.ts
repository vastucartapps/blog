import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildPostSchema } from "../post";
import { personId } from "../constants";
import type { ArticlePost } from "../../types";

// Walk every published article JSON once; the checks below run on all of them,
// so a regression on any single page is caught, not just on a sample.
function* articleFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* articleFiles(full);
    else if (name.endsWith(".json") && full.split(/[\\/]/).length >= 4) yield full;
  }
}

function loadPosts(): ArticlePost[] {
  const posts: ArticlePost[] = [];
  for (const file of articleFiles(join(process.cwd(), "content"))) {
    try {
      const post = JSON.parse(readFileSync(file, "utf8")) as ArticlePost;
      if (post && typeof post.slug === "string" && Array.isArray(post.content)) posts.push(post);
    } catch {
      // not an article file (index, sitemap data, etc.)
    }
  }
  return posts;
}

const posts = loadPosts();

function typesOf(node: unknown, out = new Set<string>()): Set<string> {
  if (Array.isArray(node)) node.forEach((n) => typesOf(n, out));
  else if (node && typeof node === "object") {
    const t = (node as Record<string, unknown>)["@type"];
    if (typeof t === "string") out.add(t);
    else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && out.add(x));
    Object.values(node as Record<string, unknown>).forEach((v) => typesOf(v, out));
  }
  return out;
}

test("the content walk found the published articles", () => {
  assert.ok(posts.length > 100, `expected the full article set, found ${posts.length}`);
});

test("no article emits invented ratings or reviews", () => {
  const offenders: string[] = [];
  for (const post of posts) {
    const found = typesOf(buildPostSchema(post));
    for (const bad of ["AggregateRating", "Review", "Rating"]) {
      if (found.has(bad)) offenders.push(`${post.slug}: ${bad}`);
    }
  }
  assert.deepEqual(offenders.slice(0, 10), []);
});

test("informational articles do not claim to be selling Products", () => {
  const offenders = posts.filter((p) => typesOf(buildPostSchema(p)).has("Product")).map((p) => p.slug);
  assert.deepEqual(offenders.slice(0, 10), []);
});

test("the article, breadcrumb and FAQ nodes are still emitted", () => {
  const withFaq = posts.find((p) => p.content.some((b) => b.type === "faq"));
  assert.ok(withFaq, "need at least one article with an FAQ block");
  const found = typesOf(buildPostSchema(withFaq!));
  for (const keep of ["BlogPosting", "BreadcrumbList", "FAQPage", "WebPage"]) {
    assert.ok(found.has(keep), `${keep} must remain`);
  }
});

test("article pages do not emit a ProfilePage; that belongs to the author page", () => {
  const offenders = posts.filter((p) => typesOf(buildPostSchema(p)).has("ProfilePage")).map((p) => p.slug);
  assert.deepEqual(offenders.slice(0, 10), []);
});

test("the editorial desk byline is still emitted for the author", () => {
  const sample = posts.find((p) => p.author_id);
  assert.ok(sample);
  const ids = buildPostSchema(sample!).map((e) => e["@id"]);
  assert.ok(ids.includes(personId(sample!.author_id)), "author node must stay on the page");
});

test("articles do not publish a Dataset: a table on a post is not a downloadable dataset", () => {
  // The old node pointed its DataDownload at the article's own HTML page.
  const offenders: string[] = [];
  for (const post of posts) {
    const found = typesOf(buildPostSchema(post));
    for (const bad of ["Dataset", "DataDownload"]) if (found.has(bad)) offenders.push(`${post.slug}: ${bad}`);
  }
  assert.deepEqual(offenders.slice(0, 10), []);
});
