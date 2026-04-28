#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// validate-post.ts — bit-level checklist enforcement.
//
// Usage:
//   npx tsx scripts/validate-post.ts content/jyotish/graha-in-bhava/sun-1st-house-aries-lagna.json
//   npx tsx scripts/validate-post.ts --all
//
// Returns 0 on pass (score >= 90), 1 on fail.
// Hard-fail conditions exit immediately with score 0.
//
// This is the publication gate. Nothing publishes without passing.
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";
import { HOMEPAGE_URLS } from "../lib/subdomain-tools";
import { buildPostSchema } from "../lib/schema-builder";
import type { ArticlePost } from "../lib/types";
import {
  urlExistsInCache,
  isCachedHost,
  VALID_GEMSTONE_SLUGS,
} from "../lib/sitemap-cache";

const BANNED_PHRASES = [
  "delve",
  "tapestry",
  "realm",
  "dive into",
  "unlock",
  "unleash",
  "it is important to note",
  "it is important to note that",
  "it is worth mentioning",
  "in this article we will",
  "in conclusion",
  "furthermore",
  "navigate the realm of",
  "embark on a journey",
  "let us explore",
  "at the end of the day",
  "tap into",
  "harness the power",
  "crucial",
  "ever-evolving landscape",
  "ever evolving landscape",
];

// Domains allowed in external links inside post HTML. Validator
// hard-fails any external href whose host is not in this list.
const EXTERNAL_LINK_WHITELIST = [
  "en.wikipedia.org",
  "vedabase.io",
  "wisdomlib.org",
  "archive.org",
];

// Hosts considered "internal" / network. External-link whitelist
// scan skips these.
const INTERNAL_HOSTS_PATTERN = /^https?:\/\/(?:www\.|blog\.)?vastucart\.(?:in|com)/i;
const SUBDOMAIN_HOSTS_PATTERN = /^https?:\/\/(?:[a-z]+)\.vastucart\.(?:in|com)/i;

// Required @type values that buildPostSchema() must emit for any
// post to count as fully scaffolded for SEO. The validator runs
// buildPostSchema() and asserts each of these appears at least once
// in the output. Conditional types (Recipe, Event, Course) are NOT
// required globally — they apply only to specific templates.
const REQUIRED_SCHEMA_TYPES = [
  "Article",
  "WebPage",
  "WebSite",
  "Organization",
  "BreadcrumbList",
  "FAQPage",
  "Person",
  "ProfilePage",
  "DefinedTermSet",
  "DefinedTerm",
  "Product",
  "Service",
  "SpeakableSpecification",
  "ImageObject",
  "VideoObject",
  "ItemList",
  "Dataset",
];

const WORD_TARGETS: Record<string, { prose: number; tolerance: number }> = {
  "planet-in-house":   { prose: 1800, tolerance: 0.25 },
  "lagna-profile":     { prose: 2200, tolerance: 0.25 },
  "nakshatra":         { prose: 1500, tolerance: 0.25 },
  "tarot-card":        { prose: 1100, tolerance: 0.25 },
  "numerology-number": { prose: 1300, tolerance: 0.25 },
  "vastu":             { prose: 1300, tolerance: 0.25 },
  "festival":          { prose: 1100, tolerance: 0.25 },
  "gemstone":          { prose: 1300, tolerance: 0.25 },
  "puja-vidhi":        { prose: 1300, tolerance: 0.25 },
  "rudraksha":         { prose: 1100, tolerance: 0.25 },
};

interface PostJSON {
  id: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  template: string;
  author_id: string;
  status: string;
  tags?: string[];
  meta?: Record<string, unknown>;
  hero?: Record<string, unknown>;
  schema?: Record<string, unknown>;
  content?: Array<Record<string, unknown>>;
  image_manifest?: Array<Record<string, unknown>>;
  keyword_brief?: Record<string, unknown>;
}

interface CheckResult {
  weight: number;
  score: number;
  issues: string[];
}

interface ValidationReport {
  slug: string;
  total: number;
  passed: boolean;
  hard_failures: string[];
  checks: Record<string, CheckResult>;
}

function plain(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function words(s: string): number {
  return plain(s).split(/\s+/).filter(Boolean).length;
}

function loadPost(file: string): PostJSON {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function validate(post: PostJSON, file: string): ValidationReport {
  const report: ValidationReport = {
    slug: post.slug,
    total: 0,
    passed: false,
    hard_failures: [],
    checks: {},
  };

  function check(
    name: string,
    weight: number,
    fn: (issues: string[]) => number
  ) {
    const issues: string[] = [];
    const score = fn(issues);
    report.checks[name] = { weight, score, issues };
    report.total += score;
  }

  function hardFail(reason: string) {
    report.hard_failures.push(reason);
  }

  // ── Phase 1: identity (5)
  check("identity", 5, (issues) => {
    let s = 5;
    if (post.id !== post.slug) {
      issues.push("id !== slug");
      s -= 1;
    }
    if (!post.template) {
      issues.push("missing template");
      hardFail("missing template");
      s = 0;
    }
    if (!post.author_id) {
      issues.push("missing author_id");
      hardFail("missing author_id");
      s = 0;
    }
    if (!post.status || post.status !== "ready") {
      issues.push(`status is "${post.status}" not "ready"`);
      s -= 2;
    }
    if (!post.tags || post.tags.length < 8 || post.tags.length > 12) {
      issues.push(`tags count ${post.tags?.length ?? 0}, want 8-12`);
      s -= 1;
    }
    // Focus keyword (or its first word) must appear in tags
    const focus = (post.meta?.focus_keyword as string | undefined) ?? "";
    if (focus && post.tags) {
      const firstWord = focus.split(/\s+/)[0].toLowerCase();
      const hasFocus = post.tags.some((t) => t.toLowerCase().includes(firstWord));
      if (!hasFocus) {
        issues.push(`focus keyword first word "${firstWord}" not in any tag`);
        s -= 1;
      }
    }
    return Math.max(0, s);
  });

  // ── Phase 2: keyword brief (10)
  check("keyword_brief", 10, (issues) => {
    let s = 10;
    const kb = post.keyword_brief as Record<string, unknown> | undefined;
    if (!kb) {
      issues.push("missing keyword_brief");
      hardFail("missing keyword_brief");
      return 0;
    }
    if (!kb.focus_keyword) {
      issues.push("missing focus_keyword");
      s -= 3;
    }
    const sec = kb.secondary_keywords as string[] | undefined;
    if (!sec || sec.length < 4 || sec.length > 6) {
      issues.push(`secondary_keywords ${sec?.length ?? 0}, want 4-6`);
      s -= 2;
    }
    const lsi = kb.lsi_terms as string[] | undefined;
    if (!lsi || lsi.length < 6 || lsi.length > 12) {
      issues.push(`lsi_terms ${lsi?.length ?? 0}, want 6-12`);
      s -= 2;
    }
    const seed = kb.seed_queries as string[] | undefined;
    if (!seed || seed.length < 25) {
      issues.push(`seed_queries ${seed?.length ?? 0}, want >=25`);
      s -= 1;
    }
    const questions = kb.questions as string[] | undefined;
    if (!questions || questions.length !== 5) {
      issues.push(`questions ${questions?.length ?? 0}, want exactly 5`);
      s -= 2;
    }
    return Math.max(0, s);
  });

  // ── Phase 4: image manifest (10)
  check("image_manifest", 10, (issues) => {
    let s = 10;
    if (!post.image_manifest || post.image_manifest.length === 0) {
      issues.push("missing image_manifest");
      hardFail("missing image_manifest");
      return 0;
    }
    // Templates that demand visual depth must have ≥3 images
    const needsThree = ["planet-in-house", "lagna-profile", "nakshatra", "gemstone", "festival"];
    if (needsThree.includes(post.template) && post.image_manifest.length < 3) {
      issues.push(`image_manifest has ${post.image_manifest.length} entries, ${post.template} needs ≥3`);
      hardFail(`image_manifest < 3 for ${post.template}`);
      s -= 4;
    }
    const filenames = new Set<string>();
    for (const img of post.image_manifest) {
      const m = img as Record<string, string | number | boolean>;
      const fname = m.filename as string;
      if (fname) {
        if (filenames.has(fname)) {
          issues.push(`duplicate image filename: ${fname}`);
          hardFail("duplicate image filename");
          s -= 3;
        }
        filenames.add(fname);
        if (!fname.includes(post.slug)) {
          issues.push(`image filename "${fname}" does not include post slug — SEO signal lost`);
          s -= 1;
        }
      }
    }
    for (const img of post.image_manifest) {
      const m = img as Record<string, string | number | boolean>;
      if (!m.filename) {
        issues.push("image missing filename");
        s -= 1;
      } else if (/-(\d+)\.(webp|png)$/.test(m.filename as string)) {
        issues.push(`numeric image filename: ${m.filename}`);
        hardFail("numeric image filename");
        s -= 5;
      }
      const alt = m.alt as string;
      if (!alt) {
        issues.push("image missing alt");
        hardFail("image missing alt");
        s -= 5;
      } else if (alt.length > 200 || alt.split(/\s+/).length > 15) {
        issues.push(`image alt too long: ${alt}`);
        s -= 1;
      } else if (alt === m.filename) {
        issues.push("image alt equals filename");
        hardFail("image alt equals filename");
        s -= 5;
      }
      if (!m.caption) {
        issues.push("image missing caption");
        s -= 1;
      }
      if (!m.width || !m.height) {
        issues.push("image missing width/height");
        s -= 1;
      }
      if (!m.generation_prompt) {
        issues.push("image missing generation_prompt");
        s -= 1;
      }
    }
    return Math.max(0, s);
  });

  // ── Phase 5: prose word count + voice + bans (15)
  check("prose", 15, (issues) => {
    let s = 15;
    let proseTotal = 0;
    const blocks = post.content ?? [];
    for (const block of blocks) {
      const b = block as {
        type: string;
        html?: string;
        text?: string;
        lead_html?: string;
        subsections?: { html: string }[];
      };
      if (b.type === "prose" && b.html) {
        proseTotal += words(b.html);
      } else if (b.type === "scannable-prose") {
        if (b.lead_html) proseTotal += words(b.lead_html);
        if (Array.isArray(b.subsections)) {
          for (const sub of b.subsections) {
            if (sub.html) proseTotal += words(sub.html);
          }
        }
      } else if (b.type === "pull-quote" && b.text) {
        proseTotal += words(b.text);
      }
    }
    const target = WORD_TARGETS[post.template];
    if (target) {
      const tol = target.tolerance;
      const lo = target.prose * (1 - tol);
      const hi = target.prose * (1 + tol);
      if (proseTotal < lo) {
        issues.push(`prose ${proseTotal} below target ${target.prose} (-${Math.round((1 - proseTotal / target.prose) * 100)}%)`);
        hardFail("prose under target");
        s -= 10;
      } else if (proseTotal > hi) {
        issues.push(`prose ${proseTotal} above target ${target.prose} (+${Math.round((proseTotal / target.prose - 1) * 100)}%)`);
        hardFail("prose over target");
        s -= 5;
      }
    }
    // Banned phrases + em dash + emoji across EVERY visible text
    // surface (prose body, pull-quote, image-figure caption + alt,
    // FAQ question + answer, gemstone disclaimer, info-grid items,
    // stotra translation). Captions and disclaimers leaked em dashes
    // when an earlier auto-generator injected them.
    function scanText(txt: string, location: string) {
      const lower = (txt ?? "").toLowerCase();
      if (lower.includes("—") || lower.includes("–")) {
        issues.push(`em dash found in ${location}`);
        hardFail(`em dash in ${location}`);
        s -= 5;
      }
      if (/[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}]/u.test(lower)) {
        issues.push(`emoji found in ${location}`);
        hardFail(`emoji in ${location}`);
        s -= 5;
      }
      for (const phrase of BANNED_PHRASES) {
        if (lower.includes(phrase)) {
          issues.push(`banned phrase in ${location}: "${phrase}"`);
          hardFail(`banned phrase: ${phrase}`);
          s -= 2;
        }
      }
    }
    function walkForText(node: unknown, location: string) {
      if (typeof node === "string") {
        scanText(node, location);
        return;
      }
      if (Array.isArray(node)) {
        node.forEach((v, i) => walkForText(v, `${location}[${i}]`));
        return;
      }
      if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
          // Skip URL fields, image filename slots, and identifiers
          // (Devanagari URLs and slugs sometimes carry hyphen-like glyphs).
          if (
            k === "url" ||
            k === "href" ||
            k === "src" ||
            k === "filename" ||
            k === "filename_og" ||
            k === "image_slug" ||
            k === "icon_variant" ||
            k === "tone" ||
            k === "icon" ||
            k === "negative_prompt" ||
            k === "generation_prompt"
          ) continue;
          walkForText(v, `${location}.${k}`);
        }
      }
    }
    walkForText(blocks, "content");
    return Math.max(0, s);
  });

  // ── Phase 6: structured (10)
  check("structured", 10, (issues) => {
    let s = 10;
    const blocks = post.content ?? [];

    // FAQ: 5 (or 6 for lagna), no duplicate questions, each ≥40 chars
    const faq = blocks.find(
      (b) => (b as { type: string }).type === "faq"
    ) as { items?: { q: string; a: string }[] } | undefined;
    if (!faq) {
      issues.push("missing FAQ block");
      hardFail("missing FAQ");
      s -= 5;
    } else if (!faq.items || (faq.items.length !== 5 && faq.items.length !== 6)) {
      issues.push(`FAQ count ${faq.items?.length ?? 0}, want 5 (or 6 for lagna)`);
      s -= 2;
    } else {
      const qSet = new Set<string>();
      for (const item of faq.items) {
        const q = item.q.trim().toLowerCase();
        if (qSet.has(q)) {
          issues.push(`duplicate FAQ question: "${item.q}"`);
          hardFail("duplicate FAQ question");
          s -= 2;
        }
        qSet.add(q);
        if ((item.a ?? "").split(/\s+/).length < 40) {
          issues.push(`FAQ answer too short for "${item.q}" (<40 words)`);
          s -= 1;
        }
      }
    }

    // Stat-strip: exactly 4 cells, each with label/value/sub
    const stat = blocks.find(
      (b) => (b as { type: string }).type === "stat-strip"
    ) as { cells?: { label?: string; value?: string; sub?: string }[] } | undefined;
    if (!stat || !stat.cells || stat.cells.length !== 4) {
      issues.push(`stat-strip cells ${stat?.cells?.length ?? 0}, want exactly 4`);
      s -= 2;
    } else {
      for (const c of stat.cells) {
        if (!c.label || !c.value) {
          issues.push("stat-strip cell missing label/value");
          s -= 1;
        }
      }
    }

    // Every prose block must have eyebrow + heading (style consistency)
    for (const b of blocks) {
      const block = b as { type: string; eyebrow?: string; heading?: string };
      if (block.type === "prose" && (!block.eyebrow || !block.heading)) {
        issues.push("prose block missing eyebrow or heading");
        s -= 1;
      }
    }

    return Math.max(0, s);
  });

  // ── Phase 7: schema (15) — runs buildPostSchema and validates
  // the rendered output, NOT a manually-written post.schema field.
  // The schema-builder is the single source of truth.
  check("schema_22", 15, (issues) => {
    let s = 15;
    let entities: Record<string, unknown>[] = [];
    try {
      entities = buildPostSchema(post as unknown as ArticlePost) as Record<string, unknown>[];
    } catch (e) {
      issues.push(`buildPostSchema threw: ${(e as Error).message}`);
      hardFail("buildPostSchema crash");
      return 0;
    }
    const presentTypes = new Set(entities.map((e) => e["@type"] as string));
    let missing = 0;
    for (const t of REQUIRED_SCHEMA_TYPES) {
      if (!presentTypes.has(t)) {
        missing += 1;
        issues.push(`missing schema @type: ${t}`);
      }
    }
    s -= Math.min(15, missing * 2);
    if (missing > 5) hardFail(`missing ${missing} schema entity types`);

    // No duplicate @id (Google rejects duplicates)
    const ids = new Map<string, number>();
    for (const e of entities) {
      const id = e["@id"] as string | undefined;
      if (id) ids.set(id, (ids.get(id) ?? 0) + 1);
    }
    for (const [id, n] of ids) {
      if (n > 1) {
        issues.push(`duplicate @id "${id}" (${n} times)`);
        hardFail(`duplicate @id ${id}`);
        s -= 3;
      }
    }

    // Every Product must qualify as a Product Snippet rich result.
    // We pick the snippet path (not the merchant listing path) which
    // requires brand + (aggregateRating | review). Setting `offers`
    // with `price` triggers Google's merchant listing parser which
    // demands SKU/shipping/return policy and produces non-critical
    // warnings — so we hard-fail any Product that has offers.price.
    for (const e of entities) {
      if (e["@type"] !== "Product") continue;
      const name = e.name as string;
      if (!e.aggregateRating && !e.review) {
        issues.push(`Product "${name}" missing aggregateRating + review (Product Snippet requirement)`);
        hardFail("Product missing aggregateRating");
        s -= 2;
      }
      if (e.offers) {
        const offers = e.offers as Record<string, unknown>;
        if (offers.price !== undefined) {
          issues.push(`Product "${name}" has offers.price — triggers merchant listing parser which complains about missing shipping/sku. Use aggregateRating instead.`);
          hardFail("Product offers.price set, use snippet not merchant listing");
          s -= 2;
        }
      }
      if (!e.brand) {
        issues.push(`Product "${name}" missing brand`);
        s -= 1;
      }
    }

    // ImageObject must have creator + name to silence Google warnings
    for (const e of entities) {
      if (e["@type"] !== "ImageObject") continue;
      if (!e.creator) {
        issues.push(`ImageObject ${e["@id"]} missing creator (Google warning)`);
        s -= 1;
      }
    }

    // FAQPage must have unique mainEntity questions
    const faqPages = entities.filter((e) => e["@type"] === "FAQPage");
    if (faqPages.length > 1) {
      issues.push(`${faqPages.length} FAQPage entities — Google requires exactly 1`);
      hardFail("multiple FAQPage entities");
      s -= 3;
    }
    return Math.max(0, s);
  });

  // ── Phase 8: internal linking quotas (10)
  check("internal_links", 10, (issues) => {
    let s = 10;
    const blocks = post.content ?? [];
    const il = blocks.find(
      (b) => (b as { type: string }).type === "internal-links"
    ) as { data?: { tools?: { url?: string; label?: string }[] } } | undefined;
    const tools = il?.data?.tools ?? [];
    const subdomainLinks = tools.length;
    if (subdomainLinks < 6) {
      issues.push(`subdomain links ${subdomainLinks}, want >=6`);
      hardFail("< 6 subdomain links");
      s -= 5;
    }
    let homepageDumps = 0;
    for (const t of tools) {
      if (!t.url || !t.url.startsWith("https://")) {
        issues.push(`subdomain tool URL not HTTPS: ${t.url}`);
        s -= 1;
      }
      if (!t.label) {
        issues.push("subdomain tool missing label");
        s -= 1;
      }
      if (t.url && HOMEPAGE_URLS.has(t.url.trim())) {
        homepageDumps += 1;
        issues.push(`HOMEPAGE DUMP: subdomain tool links to bare homepage ${t.url} — use a deep URL`);
      }
    }
    if (homepageDumps > 1) {
      hardFail(`${homepageDumps} homepage links in internal-links block (max 1 allowed)`);
      s -= 5;
    }

    // Sweep every block for homepage-dumping in CTAs and stotra/yantra/gemstone urls
    let cta_dumps = 0;
    function sweepUrl(url: unknown, where: string) {
      if (typeof url !== "string") return;
      if (HOMEPAGE_URLS.has(url.trim())) {
        cta_dumps += 1;
        issues.push(`HOMEPAGE DUMP at ${where}: ${url}`);
      }
    }
    for (const block of blocks) {
      const b = block as Record<string, unknown> & { type: string };
      if (b.type === "cta-inline" || b.type === "cta-band") {
        const data = b.data as Record<string, unknown> | undefined;
        if (data) {
          sweepUrl(data.button_url, `${b.type}.button_url`);
          const buttons = data.buttons as { url?: string }[] | undefined;
          if (buttons) for (const btn of buttons) sweepUrl(btn.url, `${b.type}.buttons[].url`);
        }
      } else if (b.type === "kundali-visual") {
        sweepUrl(b.cta_url, "kundali-visual.cta_url");
      } else if (b.type === "stotra") {
        const stotra = b.stotra as Record<string, unknown> | undefined;
        if (stotra) sweepUrl(stotra.url, "stotra.url");
      } else if (b.type === "yantra") {
        const yantra = b.yantra as Record<string, unknown> | undefined;
        if (yantra) sweepUrl(yantra.cta_url, "yantra.cta_url");
      } else if (b.type === "gemstone") {
        const cards = b.cards as { shop_url?: string }[] | undefined;
        if (cards) for (const c of cards) sweepUrl(c.shop_url, "gemstone.cards[].shop_url");
      } else if (b.type === "rudraksha") {
        sweepUrl((b as { cta_url?: unknown }).cta_url, "rudraksha.cta_url");
      }
    }
    if (cta_dumps > 0) {
      hardFail(`${cta_dumps} homepage URL(s) in CTA/stotra/yantra/gemstone blocks`);
      s -= 5;
    }

    // Sitemap cache verification — sweep every external URL in
    // the post content and hard-fail any URL to a cached host
    // that is NOT in the cache (meaning fabricated or 404).
    const allExternalUrls: { url: string; where: string }[] = [];
    function collectUrls(value: unknown, where: string) {
      if (typeof value === "string" && /^https?:\/\//.test(value)) {
        allExternalUrls.push({ url: value, where });
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => collectUrls(v, `${where}[${i}]`));
      } else if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) {
          collectUrls(v, `${where}.${k}`);
        }
      }
    }
    for (let i = 0; i < blocks.length; i++) {
      collectUrls(blocks[i], `content[${i}]`);
    }
    let missing404 = 0;
    const seen404 = new Set<string>();
    for (const { url } of allExternalUrls) {
      if (!isCachedHost(url)) continue;
      if (!urlExistsInCache(url)) {
        if (!seen404.has(url)) {
          seen404.add(url);
          missing404 += 1;
          issues.push(`NOT IN SITEMAP CACHE: ${url}`);
        }
      }
    }
    if (missing404 > 0) {
      hardFail(`${missing404} URL(s) not in sitemap cache (fabricated or 404)`);
      s -= 5;
    }

    // Gemstone image_slug validation — every image_slug in every
    // gemstone block must correspond to a real file in public/gemstones/.
    for (const b of blocks) {
      const block = b as { type: string; cards?: { name?: string; image_slug?: string }[] };
      if (block.type === "gemstone" && block.cards) {
        for (const card of block.cards) {
          if (card.image_slug && !VALID_GEMSTONE_SLUGS.has(card.image_slug)) {
            issues.push(`INVALID gemstone image_slug "${card.image_slug}" on card "${card.name}" (file doesn't exist in public/gemstones/)`);
            hardFail(`invalid gemstone image_slug: ${card.image_slug}`);
            s -= 3;
          }
        }
      }
    }
    const rel = blocks.find(
      (b) => (b as { type: string }).type === "related-posts"
    ) as { posts?: { icon_variant?: string; href?: string; title?: string }[] } | undefined;
    const relCount = rel?.posts?.length ?? 0;
    if (relCount < 3) {
      issues.push(`related-posts ${relCount}, want >=3`);
      s -= 3;
    }
    const VALID_RELATED_VARIANTS = new Set(["sun", "moon", "rose", "teal", "generic"]);
    for (const rp of rel?.posts ?? []) {
      if (rp.icon_variant && !VALID_RELATED_VARIANTS.has(rp.icon_variant)) {
        issues.push(`invalid related-post icon_variant "${rp.icon_variant}" — must be one of sun/moon/rose/teal/generic`);
        hardFail(`invalid related-post icon_variant: ${rp.icon_variant}`);
        s -= 3;
      }
      if (!rp.href) {
        issues.push("related-post missing href");
        s -= 1;
      }
      if (!rp.title) {
        issues.push("related-post missing title");
        s -= 1;
      }
    }
    // Author link is implicit via author block
    const auth = blocks.find(
      (b) => (b as { type: string }).type === "author"
    );
    if (!auth) {
      issues.push("missing author block (no link to author page)");
      hardFail("missing author block");
      s -= 3;
    }
    return Math.max(0, s);
  });

  // ── Phase 9: meta SEO (10)
  check("meta_seo", 10, (issues) => {
    let s = 10;
    const m = post.meta as Record<string, string> | undefined;
    if (!m) {
      issues.push("missing meta block");
      hardFail("missing meta");
      return 0;
    }
    if (!m.title || m.title.length > 60) {
      issues.push(`meta.title ${m.title?.length ?? 0} chars, want <=60`);
      hardFail("meta.title length");
      s -= 3;
    }
    // Rank Math sweet spot is 140-150. Hard-fail outside 100-160.
    // Soft deduction for outside the ideal range so legacy posts
    // pass while new posts are pushed to the ideal.
    if (!m.description || m.description.length < 100 || m.description.length > 160) {
      issues.push(
        `meta.description ${m.description?.length ?? 0} chars, must be within 100-160 (ideal 140-150)`
      );
      hardFail("meta.description length");
      s -= 3;
    } else if (m.description.length < 140 || m.description.length > 150) {
      issues.push(
        `meta.description ${m.description.length} chars, ideal 140-150 (Rank Math sweet spot)`
      );
      s -= 1;
    }
    if (!m.focus_keyword) {
      issues.push("missing focus_keyword");
      s -= 1;
    }
    // Focus keyword must appear at the front of meta.title
    // (within first 30 characters, case-insensitive).
    if (m.focus_keyword && m.title) {
      const titleHead = m.title.slice(0, 30).toLowerCase();
      if (!titleHead.includes(m.focus_keyword.toLowerCase().slice(0, 20))) {
        issues.push(
          `focus_keyword "${m.focus_keyword}" not in first 30 chars of meta.title`
        );
        hardFail("focus_keyword not at front of title");
        s -= 2;
      }
    }
    // Focus keyword must appear in meta.description, in first 100 chars
    if (m.focus_keyword && m.description) {
      const descHead = m.description.slice(0, 100).toLowerCase();
      if (!descHead.includes(m.focus_keyword.toLowerCase().slice(0, 15))) {
        issues.push(
          `focus_keyword "${m.focus_keyword}" not in first 100 chars of meta.description`
        );
        s -= 2;
      }
    }
    if (!m.canonical || !m.canonical.startsWith("https://")) {
      issues.push("canonical not HTTPS");
      hardFail("canonical not HTTPS");
      s -= 2;
    }
    if (!m.og_image) {
      issues.push("missing og_image");
      s -= 1;
    }
    return Math.max(0, s);
  });

  // ── Phase 9.5: thin-content guards (10) — uniqueness, vocabulary, density
  check("thin_content", 10, (issues) => {
    let s = 10;
    const blocks = post.content ?? [];
    const allText: string[] = [];
    for (const block of blocks) {
      const b = block as {
        type: string;
        html?: string;
        text?: string;
        lead_html?: string;
        subsections?: { html: string }[];
      };
      if (b.type === "prose" && b.html) allText.push(plain(b.html));
      else if (b.type === "scannable-prose") {
        if (b.lead_html) allText.push(plain(b.lead_html));
        if (Array.isArray(b.subsections)) {
          for (const sub of b.subsections) {
            if (sub.html) allText.push(plain(sub.html));
          }
        }
      } else if (b.type === "pull-quote" && b.text) allText.push(b.text);
    }
    const joined = allText.join(" ").toLowerCase();
    const tokens = joined.split(/\s+/).filter((w) => w.length > 2);
    const total = tokens.length;
    if (total === 0) {
      hardFail("no prose tokens");
      return 0;
    }

    // Unique-vocabulary ratio: must be >= 0.32 (lower means filler)
    const unique = new Set(tokens);
    const ratio = unique.size / total;
    if (ratio < 0.32) {
      issues.push(
        `unique vocabulary ratio ${(ratio * 100).toFixed(1)}% below 32% (filler/repetition detected)`
      );
      hardFail("vocabulary ratio under 32%");
      s -= 5;
    } else if (ratio < 0.38) {
      issues.push(`vocabulary ratio ${(ratio * 100).toFixed(1)}% thin, raise to 38%+`);
      s -= 2;
    }

    // Per-prose-block minimum: every prose block must contribute
    // at least 60 unique tokens not seen in earlier blocks (no
    // boilerplate paragraphs).
    const seen = new Set<string>();
    let blockIdx = 0;
    for (const text of allText) {
      blockIdx += 1;
      const blockTokens = text.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      let novelInBlock = 0;
      for (const t of blockTokens) {
        if (!seen.has(t)) {
          seen.add(t);
          novelInBlock += 1;
        }
      }
      if (blockTokens.length >= 80 && novelInBlock < 30) {
        issues.push(
          `prose block ${blockIdx}: only ${novelInBlock} novel tokens out of ${blockTokens.length} (boilerplate echo)`
        );
        s -= 2;
      }
    }

    // Sentence-level repetition: no two sentences may be identical
    const sentences = joined.split(/[.!?]/).map((sn) => sn.trim()).filter((sn) => sn.length > 20);
    const sentSet = new Map<string, number>();
    for (const sn of sentences) {
      sentSet.set(sn, (sentSet.get(sn) ?? 0) + 1);
    }
    let dupes = 0;
    for (const [sn, n] of sentSet) {
      if (n > 1) {
        dupes += n - 1;
        if (dupes <= 3) issues.push(`duplicate sentence: "${sn.slice(0, 60)}..."`);
      }
    }
    if (dupes > 0) {
      issues.push(`${dupes} duplicate sentence(s) total`);
      hardFail(`${dupes} duplicate sentences`);
      s -= 3;
    }

    // Programmatic-style placeholder leakage
    if (/\{\{|\}\}|\$\{|placeholder|todo:/i.test(joined)) {
      issues.push("template placeholder or TODO leaked into prose");
      hardFail("template placeholder leaked");
      s -= 5;
    }

    return Math.max(0, s);
  });

  // ── Phase 10: voice (5)
  check("voice", 5, (issues) => {
    let s = 5;
    // First sentence of first prose block must not start with "Sun in"
    // (encyclopedia tone) — must lead with the reader.
    const firstProse = (post.content ?? []).find(
      (b) => (b as { type: string }).type === "prose"
    ) as { html?: string } | undefined;
    if (firstProse?.html) {
      const firstSentence = plain(firstProse.html).split(/[.!?]/)[0];
      const lower = firstSentence.toLowerCase().trim();
      if (
        lower.startsWith("sun in") ||
        lower.startsWith("the sun") ||
        lower.startsWith("this is") ||
        lower.startsWith("in this article")
      ) {
        issues.push(
          `first sentence "${firstSentence}" reads encyclopedic, lead with the reader`
        );
        s -= 2;
      }
    }
    return Math.max(0, s);
  });

  // ── Phase 11: primary keyword in at least one H2 (3)
  check("kw_in_h2", 3, (issues) => {
    let s = 3;
    const m = post.meta as Record<string, string> | undefined;
    if (!m?.focus_keyword) return s;
    const fk = m.focus_keyword.toLowerCase();
    const headings: string[] = [];
    for (const block of post.content ?? []) {
      const b = block as {
        type: string;
        heading?: string;
        h3?: string;
      };
      if (
        (b.type === "prose" || b.type === "scannable-prose") &&
        typeof b.heading === "string"
      ) {
        headings.push(b.heading.toLowerCase());
      }
    }
    if (headings.length === 0) return s;
    const headFront = fk.split(/\s+/).slice(0, 3).join(" ");
    const found = headings.some((h) => h.includes(headFront));
    if (!found) {
      issues.push(
        `focus_keyword "${m.focus_keyword}" not present in any H2 (block heading)`
      );
      s -= 2;
    }
    return Math.max(0, s);
  });

  // ── Phase 12: external link whitelist (4)
  check("external_links", 4, (issues) => {
    let s = 4;
    const externals: string[] = [];
    const allowedHosts = new Set(EXTERNAL_LINK_WHITELIST);
    const blocks = post.content ?? [];
    const htmlChunks: string[] = [];
    for (const block of blocks) {
      const b = block as {
        type: string;
        html?: string;
        lead_html?: string;
        subsections?: { html: string }[];
      };
      if (b.html) htmlChunks.push(b.html);
      if (b.lead_html) htmlChunks.push(b.lead_html);
      if (Array.isArray(b.subsections)) {
        for (const sub of b.subsections) {
          if (sub.html) htmlChunks.push(sub.html);
        }
      }
    }
    const joined = htmlChunks.join(" ");
    const hrefRe = /href=["']([^"']+)["']/g;
    let m: RegExpExecArray | null;
    while ((m = hrefRe.exec(joined)) !== null) {
      const url = m[1];
      if (!/^https?:\/\//i.test(url)) continue;
      if (INTERNAL_HOSTS_PATTERN.test(url) || SUBDOMAIN_HOSTS_PATTERN.test(url)) {
        continue;
      }
      // External link found
      try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        externals.push(url);
        if (!allowedHosts.has(host)) {
          issues.push(
            `external host "${host}" not in whitelist: ${url}`
          );
          hardFail("external link not in whitelist");
          s -= 3;
        }
      } catch {
        issues.push(`malformed external URL: ${url}`);
        s -= 1;
      }
    }
    if (externals.length > 2) {
      issues.push(
        `${externals.length} external links, max 2 allowed`
      );
      s -= 1;
    }
    return Math.max(0, s);
  });

  // ── Phase 13: paragraph length + sentence-length burstiness (5)
  check("scannability", 5, (issues) => {
    let s = 5;
    const proseHtmls: string[] = [];
    for (const block of post.content ?? []) {
      const b = block as {
        type: string;
        html?: string;
        lead_html?: string;
        subsections?: { html: string }[];
      };
      if (b.type === "prose" && b.html) proseHtmls.push(b.html);
      if (b.type === "scannable-prose") {
        if (b.lead_html) proseHtmls.push(b.lead_html);
        if (Array.isArray(b.subsections)) {
          for (const sub of b.subsections) {
            if (sub.html) proseHtmls.push(sub.html);
          }
        }
      }
    }
    if (proseHtmls.length === 0) return s;
    // Count sentences per <p>
    const allParagraphs: string[] = [];
    for (const html of proseHtmls) {
      const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) ?? [];
      for (const p of pMatches) {
        const text = p.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (text.length > 0) allParagraphs.push(text);
      }
    }
    if (allParagraphs.length === 0) return s;
    const sentencesPerParagraph: number[] = [];
    let oversizedParagraph = false;
    for (const p of allParagraphs) {
      const sents = p.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
      sentencesPerParagraph.push(sents.length);
      if (sents.length > 5) oversizedParagraph = true;
    }
    const avgSents =
      sentencesPerParagraph.reduce((a, b) => a + b, 0) /
      sentencesPerParagraph.length;
    if (avgSents > 3.5) {
      issues.push(
        `avg ${avgSents.toFixed(1)} sentences/paragraph, want <=3.5 for scannability`
      );
      s -= 2;
    }
    if (oversizedParagraph) {
      issues.push(
        `at least one paragraph > 5 sentences (breaks scannability)`
      );
      s -= 1;
    }
    // Burstiness: sentence-length variance across all sentences
    const allSentenceLens: number[] = [];
    for (const p of allParagraphs) {
      const sents = p.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
      for (const sent of sents) {
        const wc = sent.split(/\s+/).filter(Boolean).length;
        if (wc >= 2) allSentenceLens.push(wc);
      }
    }
    if (allSentenceLens.length >= 20) {
      const mean =
        allSentenceLens.reduce((a, b) => a + b, 0) / allSentenceLens.length;
      const variance =
        allSentenceLens.reduce((a, b) => a + (b - mean) ** 2, 0) /
        allSentenceLens.length;
      const stddev = Math.sqrt(variance);
      if (stddev < 4) {
        issues.push(
          `sentence-length stddev ${stddev.toFixed(1)} below 4 (low burstiness, AI-detector risk)`
        );
        s -= 1;
      }
    }
    return Math.max(0, s);
  });

  // ── Phase 14: enterprise internal-link contract (5)
  //
  // The site auto-emits a pillar nav-strip and cross-category
  // bridges on every post via components/post/BlockRenderer. This
  // check enforces that the source data fields the auto-injection
  // depends on are present in the JSON, so EVERY post — every
  // category, every terminal — emits the same outbound link set.
  //
  // Rules (hard-fail any missing piece):
  //   1. category, subcategory, author_id must exist (other phases
  //      already cover this; we re-assert for clarity).
  //   2. The post must declare AT LEAST ONE taxonomy key the
  //      cross-category bridges can hang on:
  //        jyotish      → planet_id (graha-in-bhava posts must)
  //        numerology   → number + ruling_planet
  //        gemstones    → planet_id (by-planet posts must)
  //      Other categories (vastu/tarot/puja/festivals/rudraksha)
  //      are exempt — bridges fall back to pillar-only.
  check("enterprise_links", 5, (issues) => {
    let s = 5;
    if (!post.category || !post.subcategory) {
      issues.push("missing category/subcategory — pillar-strip cannot resolve");
      hardFail("missing category for pillar-strip");
      s -= 5;
      return s;
    }
    if (!post.author_id) {
      issues.push("missing author_id — author pillar link cannot resolve");
      hardFail("missing author_id");
      s -= 3;
    }
    const xtra = post as PostJSON & {
      planet_id?: string;
      ruling_planet?: string;
      number?: number;
    };
    if (post.category === "jyotish" && post.subcategory === "graha-in-bhava") {
      if (!xtra.planet_id) {
        issues.push("jyotish/graha-in-bhava post missing planet_id — cross-category bridges cannot emit");
        hardFail("missing planet_id for cross-link bridge");
        s -= 3;
      }
    }
    if (post.category === "numerology" && post.subcategory === "life-path") {
      if (!xtra.ruling_planet || !xtra.number) {
        issues.push("numerology/life-path post missing ruling_planet or number — cross-category bridges cannot emit");
        hardFail("missing ruling_planet/number for cross-link bridge");
        s -= 3;
      }
    }
    if (post.category === "gemstones" && post.subcategory === "by-planet") {
      if (!xtra.planet_id) {
        issues.push("gemstones/by-planet post missing planet_id — cross-category bridges cannot emit");
        hardFail("missing planet_id for cross-link bridge");
        s -= 3;
      }
    }
    return Math.max(0, s);
  });

  void file;
  report.passed = report.total >= 90 && report.hard_failures.length === 0;
  return report;
}

function printReport(r: ValidationReport): void {
  const status = r.passed ? "PASS" : "FAIL";
  const colour = r.passed ? "\x1b[32m" : "\x1b[31m";
  console.log(`${colour}[${status}]\x1b[0m ${r.slug} — score ${r.total}/100`);
  if (r.hard_failures.length > 0) {
    console.log(`  hard failures:`);
    for (const f of r.hard_failures) console.log(`    × ${f}`);
  }
  for (const [name, c] of Object.entries(r.checks)) {
    if (c.issues.length === 0) continue;
    console.log(`  ${name} (${c.score}/${c.weight}):`);
    for (const i of c.issues) console.log(`    - ${i}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("usage: validate-post.ts <file.json> [--all]");
    process.exit(2);
  }
  const files: string[] = [];
  if (args[0] === "--all") {
    walk(path.join(process.cwd(), "content"), files);
  } else {
    files.push(...args);
  }
  let allPassed = true;
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    if (!fs.existsSync(f)) {
      console.error(`not found: ${f}`);
      allPassed = false;
      continue;
    }
    const post = loadPost(f);
    const r = validate(post, f);
    printReport(r);
    if (!r.passed) allPassed = false;
  }
  process.exit(allPassed ? 0 : 1);
}

function walk(dir: string, out: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
}

main();
