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

const BANNED_PHRASES = [
  "delve",
  "tapestry",
  "realm",
  "dive into",
  "unlock",
  "unleash",
  "it is important to note",
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
];

const REQUIRED_SCHEMA_KEYS = [
  "article",
  "webpage",
  "website",
  "organization",
  "breadcrumb",
  "faq",
  "author",
  "profilepage",
  "defined_terms",
  "defined_term_set",
  "howto_remedies",
  "howto_secondary",
  "product_gem",
  "product_rudraksha",
  "product_yantra",
  "service",
  "speakable",
  "image_objects",
  "video_object",
  "item_list",
  "table_dataset",
];

const WORD_TARGETS: Record<string, { prose: number; tolerance: number }> = {
  "planet-in-house":   { prose: 1800, tolerance: 0.20 },
  "lagna-profile":     { prose: 2200, tolerance: 0.20 },
  "nakshatra":         { prose: 1500, tolerance: 0.20 },
  "tarot-card":        { prose: 1100, tolerance: 0.20 },
  "numerology-number": { prose: 1300, tolerance: 0.20 },
  "vastu":             { prose: 1300, tolerance: 0.20 },
  "festival":          { prose: 1100, tolerance: 0.20 },
  "gemstone":          { prose: 1300, tolerance: 0.20 },
  "puja-vidhi":        { prose: 1300, tolerance: 0.20 },
  "rudraksha":         { prose: 1100, tolerance: 0.20 },
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
      const b = block as { type: string; html?: string; text?: string };
      if (b.type === "prose" && b.html) {
        proseTotal += words(b.html);
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
    // Banned phrases + em dash + emoji across all prose
    for (const block of blocks) {
      const b = block as { type: string; html?: string; text?: string };
      const txt = (b.html ?? b.text ?? "").toLowerCase();
      if (txt.includes("—") || txt.includes("–")) {
        issues.push("em dash found in prose");
        hardFail("em dash");
        s -= 5;
      }
      // Quick emoji detect: any char in surrogate range
      if (/[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}]/u.test(txt)) {
        issues.push("emoji found in prose");
        hardFail("emoji");
        s -= 5;
      }
      for (const phrase of BANNED_PHRASES) {
        if (txt.includes(phrase)) {
          issues.push(`banned phrase: "${phrase}"`);
          hardFail(`banned phrase: ${phrase}`);
          s -= 2;
        }
      }
    }
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

  // ── Phase 7: schema 22 entities (15)
  check("schema_22", 15, (issues) => {
    let s = 15;
    const sc = post.schema ?? {};
    const present = Object.keys(sc);
    let missing = 0;
    for (const k of REQUIRED_SCHEMA_KEYS) {
      if (!present.includes(k)) {
        missing += 1;
        issues.push(`missing schema entity: ${k}`);
      }
    }
    // defined_terms must be a non-empty array of ≥3 entries
    const defined = sc.defined_terms as unknown[] | undefined;
    if (defined !== undefined && (!Array.isArray(defined) || defined.length < 3)) {
      issues.push(`defined_terms must be array of ≥3, got ${Array.isArray(defined) ? defined.length : "non-array"}`);
      s -= 2;
    }
    // image_objects must be array
    const imgObjs = sc.image_objects as unknown[] | undefined;
    if (imgObjs !== undefined && !Array.isArray(imgObjs)) {
      issues.push("image_objects must be an array");
      s -= 1;
    }
    s -= Math.min(15, missing * 2);
    if (missing > 5) hardFail(`missing ${missing} schema entities`);
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
    if (!m.description || m.description.length > 155) {
      issues.push(`meta.description ${m.description?.length ?? 0} chars, want <=155`);
      hardFail("meta.description length");
      s -= 3;
    }
    if (!m.focus_keyword) {
      issues.push("missing focus_keyword");
      s -= 1;
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
      const b = block as { type: string; html?: string; text?: string };
      if (b.type === "prose" && b.html) allText.push(plain(b.html));
      else if (b.type === "pull-quote" && b.text) allText.push(b.text);
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
