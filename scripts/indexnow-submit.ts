#!/usr/bin/env tsx
/**
 * Submit every published post URL + pillar + home + feeds to IndexNow.
 *
 * Requires INDEXNOW_KEY env var. Run after every publish:
 *
 *   INDEXNOW_KEY=<uuid> npx tsx scripts/indexnow-submit.ts
 *
 * Bing, Yandex, Naver, and Seznam receive the ping and re-crawl.
 */

import { getPublishedPosts } from "../lib/content";
import { CATEGORIES } from "../lib/categories";
import { SITE_URL } from "../lib/utils";
import { submitToIndexNow, getIndexNowKey } from "../lib/indexnow";

async function main() {
  if (!getIndexNowKey()) {
    console.error("INDEXNOW_KEY environment variable is not set.");
    process.exit(1);
  }

  const urls = new Set<string>();
  urls.add(`${SITE_URL}/`);
  urls.add(`${SITE_URL}/authors`);
  urls.add(`${SITE_URL}/glossary`);
  urls.add(`${SITE_URL}/editorial-standards`);
  urls.add(`${SITE_URL}/classical-sources`);

  for (const cat of CATEGORIES) {
    urls.add(`${SITE_URL}/${cat.slug}`);
    urls.add(`${SITE_URL}/${cat.slug}/complete-guide`);
    for (const sub of cat.subcategories) {
      urls.add(`${SITE_URL}/${cat.slug}/${sub.slug}`);
    }
  }

  for (const p of getPublishedPosts()) {
    urls.add(`${SITE_URL}/${p.category}/${p.subcategory}/${p.slug}`);
  }

  const list = Array.from(urls);
  console.log(`Submitting ${list.length} URLs to IndexNow...`);

  const result = await submitToIndexNow(list);
  if (result.ok) {
    console.log(`\u2713 IndexNow accepted the batch (status ${result.status}).`);
    process.exit(0);
  } else {
    console.error(
      `\u2717 IndexNow rejected: status ${result.status ?? "n/a"}, ${result.error ?? ""}`
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
