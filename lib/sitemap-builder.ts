// ─────────────────────────────────────────────────────────────────
// Sitemap builder.
//
// Builds the dynamic sitemap entries that `app/sitemap.ts` consumes.
// Splits by category, includes authors, festivals, news (recent),
// and image entries.
// ─────────────────────────────────────────────────────────────────

import type { MetadataRoute } from "next";
import { CATEGORIES } from "./categories";
import { AUTHORS } from "./authors";
import { getPublishedPosts } from "./content";
import { SITE_URL } from "./utils";

const NEWS_AGE_HOURS = 48;

export function buildSitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push({
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
  });

  // Category pages + pillar pages (one per category)
  for (const cat of CATEGORIES) {
    entries.push({
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    entries.push({
      url: `${SITE_URL}/${cat.slug}/complete-guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    });
    for (const sub of cat.subcategories) {
      entries.push({
        url: `${SITE_URL}/${cat.slug}/${sub.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
  }

  // Glossary — referenced by every post's DefinedTermSet
  entries.push({
    url: `${SITE_URL}/glossary`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  // Authors index + author profile pages
  entries.push({
    url: `${SITE_URL}/authors`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  });
  for (const slug of Object.keys(AUTHORS)) {
    entries.push({
      url: `${SITE_URL}/authors/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // E-E-A-T transparency pages (editorial standards, classical sources).
  // Low change frequency but high trust signal — every post links to both.
  entries.push(
    {
      url: `${SITE_URL}/editorial-standards`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/classical-sources`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    }
  );

  // Posts — pillar pages get higher priority and weekly refresh
  // so Google re-crawls them often. Pillars are the topical hubs:
  // lagna profiles, planet profiles, rashi profiles, nakshatra
  // hubs, gemstone-by-planet, and category/template pillars.
  const PILLAR_SUBCATEGORIES = new Set([
    "lagna-profiles",
    "graha-states",
    "rashi-profiles",
    "nakshatra",
    "yogas",
    "by-planet",         // gemstones-by-planet
    "life-path",         // numerology life-path hub
  ]);

  const posts = getPublishedPosts();
  for (const p of posts) {
    const updated = new Date(p.updated_at || p.published_at);
    const isFestival = p.category === "festivals";
    const isPillar = PILLAR_SUBCATEGORIES.has(p.subcategory);
    entries.push({
      url: `${SITE_URL}/${p.category}/${p.subcategory}/${p.slug}`,
      lastModified: updated,
      changeFrequency: isFestival ? "daily" : isPillar ? "weekly" : "monthly",
      priority: isPillar ? 0.95 : isFestival ? 0.9 : 0.8,
    });
  }

  return entries;
}

/**
 * Returns posts published within the last 48 hours, formatted for the
 * Google News sitemap. Used by /sitemap-news.xml route.
 */
export function buildNewsSitemap(): {
  url: string;
  publication_date: string;
  title: string;
  keywords: string;
}[] {
  const now = Date.now();
  return getPublishedPosts()
    .filter((p) => {
      const age = now - new Date(p.published_at).getTime();
      return age < NEWS_AGE_HOURS * 3600 * 1000;
    })
    .map((p) => ({
      url: `${SITE_URL}/${p.category}/${p.subcategory}/${p.slug}`,
      publication_date: p.published_at,
      title: p.title,
      keywords: p.tags.join(", "),
    }));
}

/**
 * Returns every image referenced across every post for the image sitemap.
 */
export function buildImageSitemap(): {
  page_url: string;
  image_url: string;
  caption: string;
  title: string;
}[] {
  const out: {
    page_url: string;
    image_url: string;
    caption: string;
    title: string;
  }[] = [];
  for (const p of getPublishedPosts()) {
    const manifest = (
      p as typeof p & {
        image_manifest?: { filename: string; alt: string; caption: string }[];
      }
    ).image_manifest;
    if (!manifest) continue;
    const pageUrl = `${SITE_URL}/${p.category}/${p.subcategory}/${p.slug}`;
    for (const img of manifest) {
      out.push({
        page_url: pageUrl,
        image_url: `${SITE_URL}/posts/${p.slug}/${img.filename}`,
        caption: img.caption,
        title: img.alt,
      });
    }
  }
  return out;
}
