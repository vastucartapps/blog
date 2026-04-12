#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// internal-link-graph.ts — orphan + dead link + anchor diversity.
//
// Walks every post under content/, builds the internal link graph,
// flags orphan pages and dead links, checks anchor text variation
// across the cluster.
//
// Usage:
//   npx tsx scripts/internal-link-graph.ts
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

interface PostJSON {
  slug: string;
  category: string;
  subcategory: string;
  content?: Array<{ type: string; data?: { tools?: unknown[] }; posts?: { href: string; title: string }[]; html?: string }>;
}

interface Link {
  from: string;
  to: string;
  anchor: string;
  type: "internal" | "subdomain" | "external";
}

const SUBDOMAIN_RE = /https:\/\/(kundali|store|panchang|stotra|horoscope|muhurta|wedding|tarot|vastucart)\.vastucart\.in/;
const INTERNAL_RE = /^\/[a-z0-9-]+\/[a-z0-9-]+(\/[a-z0-9-]+)?\/?$/;

function loadPosts(): { file: string; post: PostJSON }[] {
  const out: { file: string; post: PostJSON }[] = [];
  const root = path.join(process.cwd(), "content");
  const stack = [root];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (!fs.existsSync(cur)) continue;
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith(".json") && entry.name !== "PROGRESS.json") {
        try {
          const post = JSON.parse(fs.readFileSync(full, "utf8")) as PostJSON;
          out.push({ file: full, post });
        } catch {
          // skip malformed
        }
      }
    }
  }
  return out;
}

function extractLinks(post: PostJSON): Link[] {
  const links: Link[] = [];
  const fromSlug = `/${post.category}/${post.subcategory}/${post.slug}`;
  for (const block of post.content ?? []) {
    // related-posts
    if (block.type === "related-posts" && block.posts) {
      for (const p of block.posts) {
        const isExternal = /^https?:/.test(p.href);
        links.push({
          from: fromSlug,
          to: p.href,
          anchor: p.title,
          type: isExternal
            ? SUBDOMAIN_RE.test(p.href)
              ? "subdomain"
              : "external"
            : "internal",
        });
      }
    }
    // internal-links block
    if (block.type === "internal-links" && block.data?.tools) {
      for (const tool of block.data.tools as { url: string; label: string }[]) {
        links.push({
          from: fromSlug,
          to: tool.url,
          anchor: tool.label,
          type: SUBDOMAIN_RE.test(tool.url) ? "subdomain" : "external",
        });
      }
    }
    // prose <a href="...">
    if (block.type === "prose" && block.html) {
      const re = /<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(block.html)) !== null) {
        const href = m[1];
        const anchor = m[2];
        const isExternal = /^https?:/.test(href);
        links.push({
          from: fromSlug,
          to: href,
          anchor,
          type: isExternal
            ? SUBDOMAIN_RE.test(href)
              ? "subdomain"
              : "external"
            : "internal",
        });
      }
    }
  }
  return links;
}

function main() {
  const posts = loadPosts();
  const allSlugs = new Set(
    posts.map((p) => `/${p.post.category}/${p.post.subcategory}/${p.post.slug}`)
  );
  const allLinks: Link[] = [];
  for (const { post } of posts) {
    allLinks.push(...extractLinks(post));
  }

  const issues: string[] = [];

  // Orphans: pages with zero inbound internal links
  const inboundCount = new Map<string, number>();
  for (const slug of allSlugs) inboundCount.set(slug, 0);
  for (const link of allLinks) {
    if (link.type === "internal" && allSlugs.has(link.to)) {
      inboundCount.set(link.to, (inboundCount.get(link.to) ?? 0) + 1);
    }
  }
  for (const [slug, count] of inboundCount) {
    if (count === 0) {
      issues.push(`ORPHAN: ${slug} has zero inbound internal links`);
    }
  }

  // Dead internal links
  for (const link of allLinks) {
    if (link.type === "internal" && !allSlugs.has(link.to)) {
      // Allow links to category/subcategory landings (not in allSlugs but valid)
      if (!INTERNAL_RE.test(link.to)) {
        issues.push(`DEAD: ${link.from} → ${link.to}`);
      }
    }
  }

  // Anchor text exact-match overuse
  const anchorMap = new Map<string, Map<string, number>>();
  for (const link of allLinks) {
    if (!anchorMap.has(link.to)) anchorMap.set(link.to, new Map());
    const m = anchorMap.get(link.to)!;
    m.set(link.anchor, (m.get(link.anchor) ?? 0) + 1);
  }
  for (const [target, anchors] of anchorMap) {
    for (const [anchor, count] of anchors) {
      if (count > 3) {
        issues.push(
          `ANCHOR OVERUSE: "${anchor}" → ${target} used ${count} times, max 3`
        );
      }
    }
  }

  console.log(`Internal link graph audit:`);
  console.log(`  posts:    ${posts.length}`);
  console.log(`  links:    ${allLinks.length}`);
  console.log(`  internal: ${allLinks.filter((l) => l.type === "internal").length}`);
  console.log(`  subdomain: ${allLinks.filter((l) => l.type === "subdomain").length}`);
  console.log(`  external: ${allLinks.filter((l) => l.type === "external").length}`);
  console.log(`  issues:   ${issues.length}`);
  for (const i of issues) console.log(`  - ${i}`);

  process.exit(issues.length === 0 ? 0 : 1);
}

main();
