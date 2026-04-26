#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// migrate-author.ts
//
// Migrates every post under content/ from the
// `pt-raghav-sharma` named-practitioner persona to the
// organisational byline:
//
//   author_id    → "vastucart-editorial"
//   reviewer_id  → "vastucart-jyotish-review-panel"
//
// Also rewrites the visible author block + hero meta strip and
// strips fabricated specifics ("22 years of practice", "400+
// articles") from any author-related fields. Idempotent — running
// twice produces no diff after the first pass.
//
// Usage:
//   npx tsx scripts/migrate-author.ts                 # dry run, prints diff
//   npx tsx scripts/migrate-author.ts --apply         # write changes
//   npx tsx scripts/migrate-author.ts --apply --slug sun-1st-house-aries-lagna
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

interface MigrateOptions {
  apply: boolean;
  slug?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

const NEW_AUTHOR_ID = "vastucart-editorial";
const NEW_REVIEWER_ID = "vastucart-jyotish-review-panel";
const NEW_AUTHOR_NAME = "VastuCart Editorial";
const NEW_REVIEWER_NAME = "VastuCart Jyotish Review Panel";

const NEW_AUTHOR_BLOCK = {
  type: "author",
  author: {
    author_id: NEW_AUTHOR_ID,
    title_line: "Editorial Desk, Blog by VastuCart",
    bio:
      "VastuCart Editorial is the in-house desk that researches, writes, and edits long-form articles on Vedic astrology, Vastu, numerology, tarot, gemstones, and rudraksha. Every Jyotish article is reviewed by the VastuCart Jyotish Review Panel before publication.",
    badges: [
      { label: "VastuCart", tone: "teal" },
      { label: "Editorial desk", tone: "saff" },
      { label: "Reviewed by Jyotish Panel", tone: "rose" },
    ],
    meta: [
      { icon: "calendar", text: "Updated April 2026" },
      { icon: "star", text: "VastuCart Jyotish Review Panel" },
      { icon: "clock", text: "Continuously edited" },
    ],
  },
};

function walk(dir: string, cb: (file: string) => void): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

interface PostJson {
  slug: string;
  author_id?: string;
  reviewer_id?: string;
  hero?: { meta?: { icon: string; value: string }[]; description?: string };
  content?: ({ type: string; [k: string]: unknown })[];
  meta?: Record<string, unknown>;
  [k: string]: unknown;
}

function migratePost(post: PostJson): { changed: boolean; post: PostJson } {
  let changed = false;

  // 1. Author + reviewer ids
  if (post.author_id !== NEW_AUTHOR_ID) {
    post.author_id = NEW_AUTHOR_ID;
    changed = true;
  }
  if (post.reviewer_id !== NEW_REVIEWER_ID) {
    post.reviewer_id = NEW_REVIEWER_ID;
    changed = true;
  }

  // 2. Hero meta strip — replace named-practitioner items
  if (post.hero?.meta) {
    const newMeta: { icon: string; value: string }[] = [];
    let hasReader = false;
    let hasReviewed = false;
    let hasUser = false;
    let hasUpdated = false;
    for (const item of post.hero.meta) {
      const v = item.value ?? "";
      if (item.icon === "user") {
        if (!hasUser) {
          newMeta.push({ icon: "user", value: NEW_AUTHOR_NAME });
          hasUser = true;
          changed = true;
        }
      } else if (item.icon === "check-circle") {
        if (!hasReviewed) {
          newMeta.push({
            icon: "check-circle",
            value: `Reviewed by ${NEW_REVIEWER_NAME}`,
          });
          hasReviewed = true;
          changed = true;
        }
      } else if (item.icon === "clock") {
        newMeta.push(item);
        hasReader = true;
      } else if (item.icon === "calendar") {
        newMeta.push(item);
        hasUpdated = true;
      } else if (
        v.toLowerCase().includes("pt. raghav") ||
        v.toLowerCase().includes("pandit raghav") ||
        v.toLowerCase().includes("raghav sharma")
      ) {
        // Drop the named practitioner item entirely
        changed = true;
      } else {
        newMeta.push(item);
      }
    }
    if (!hasUser) newMeta.push({ icon: "user", value: NEW_AUTHOR_NAME });
    if (!hasReviewed)
      newMeta.push({
        icon: "check-circle",
        value: `Reviewed by ${NEW_REVIEWER_NAME}`,
      });
    if (JSON.stringify(post.hero.meta) !== JSON.stringify(newMeta)) {
      post.hero.meta = newMeta;
      changed = true;
    }
  }

  // 3. Hero description — strip practitioner name reference
  if (post.hero?.description) {
    const desc = post.hero.description;
    const cleaned = desc
      .replace(/by Pt\.?\s*Raghav Sharma/gi, "by VastuCart Editorial")
      .replace(/practitioner Pt\.?\s*Raghav Sharma/gi, "the VastuCart Jyotish Review Panel")
      .replace(/Pt\.?\s*Raghav Sharma/gi, "VastuCart Editorial");
    if (cleaned !== desc) {
      post.hero.description = cleaned;
      changed = true;
    }
  }

  // 3a. Tags array — strip practitioner name tag
  if (Array.isArray((post as { tags?: string[] }).tags)) {
    const tags = (post as { tags: string[] }).tags;
    const next = tags.filter(
      (t) =>
        !/Pt\.?\s*Raghav Sharma|Pandit Raghav Sharma/i.test(t) &&
        t.toLowerCase() !== "pt raghav sharma"
    );
    if (next.length !== tags.length) {
      (post as { tags: string[] }).tags = next;
      changed = true;
    }
  }

  // 3b. Meta + subtitle scrub for practitioner name
  const scrubMeta = (s: string): string =>
    s
      .replace(/read by Pt\.?\s*Raghav Sharma/gi, "by VastuCart Editorial")
      .replace(/by Pt\.?\s*Raghav Sharma/gi, "by VastuCart Editorial")
      .replace(/Pt\.?\s*Raghav Sharma/g, "VastuCart Editorial")
      .replace(/Pandit Raghav Sharma/g, "VastuCart Editorial");
  const m = post.meta as Record<string, string> | undefined;
  if (m) {
    for (const k of [
      "title",
      "description",
      "og_title",
      "og_description",
    ]) {
      if (typeof m[k] === "string") {
        const next = scrubMeta(m[k]);
        if (next !== m[k]) {
          m[k] = next;
          changed = true;
        }
      }
    }
  }
  if (typeof (post as { subtitle?: string }).subtitle === "string") {
    const next = scrubMeta((post as { subtitle: string }).subtitle);
    if (next !== (post as { subtitle: string }).subtitle) {
      (post as { subtitle: string }).subtitle = next;
      changed = true;
    }
  }

  // 4. Author content block — replace whole block with the
  // standard VastuCart Editorial block.
  if (Array.isArray(post.content)) {
    for (let i = 0; i < post.content.length; i++) {
      const block = post.content[i] as { type: string };
      if (block.type === "author") {
        const fingerprint = JSON.stringify(post.content[i]);
        post.content[i] = JSON.parse(JSON.stringify(NEW_AUTHOR_BLOCK));
        if (JSON.stringify(post.content[i]) !== fingerprint) {
          changed = true;
        }
      }
    }

    // Also scrub stray "Pt. Raghav Sharma" / "22 years" mentions
    // inside prose, scannable-prose, faq, pull-quote html/text and
    // every other string value in the block (sub-fields, ctas, etc).
    const scrub = (s: string): string =>
      s
        .replace(/with Pt\.?\s*Raghav Sharma/gi, "with VastuCart Editorial")
        .replace(/by Pt\.?\s*Raghav Sharma/gi, "by VastuCart Editorial")
        .replace(/Pt\.?\s*Raghav Sharma/g, "VastuCart Editorial")
        .replace(/Pandit Raghav Sharma/g, "VastuCart Editorial")
        .replace(/over twenty[ -]two years/gi, "decades of")
        .replace(/22 years/g, "decades of")
        .replace(/over 22 years/g, "decades of")
        .replace(/twenty[ -]two years of practice/gi, "decades of practice")
        .replace(/400\+? articles/gi, "many articles")
        .replace(/four hundred in-?depth articles/gi, "many in-depth articles")
        .replace(/Varanasi-based practicing Jyotishi/gi, "VastuCart Jyotish Review Panel");

    // Deep recursive scrub for nested fields (sub, label, title, etc.)
    const deepScrub = (val: unknown): unknown => {
      if (typeof val === "string") {
        const next = scrub(val);
        if (next !== val) changed = true;
        return next;
      }
      if (Array.isArray(val)) {
        return val.map(deepScrub);
      }
      if (val && typeof val === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
          out[k] = deepScrub(v);
        }
        return out;
      }
      return val;
    };
    for (let i = 0; i < post.content.length; i++) {
      post.content[i] = deepScrub(post.content[i]) as typeof post.content[number];
    }

    for (const block of post.content) {
      const b = block as {
        type: string;
        html?: string;
        text?: string;
        items?: { q?: string; a?: string }[];
        author?: Record<string, unknown>;
        lead_html?: string;
        subsections?: { html: string }[];
      };
      if (typeof b.html === "string") {
        const next = scrub(b.html);
        if (next !== b.html) {
          b.html = next;
          changed = true;
        }
      }
      if (typeof b.text === "string") {
        const next = scrub(b.text);
        if (next !== b.text) {
          b.text = next;
          changed = true;
        }
      }
      if (typeof b.lead_html === "string") {
        const next = scrub(b.lead_html);
        if (next !== b.lead_html) {
          b.lead_html = next;
          changed = true;
        }
      }
      if (Array.isArray(b.subsections)) {
        for (const sub of b.subsections) {
          if (typeof sub.html === "string") {
            const next = scrub(sub.html);
            if (next !== sub.html) {
              sub.html = next;
              changed = true;
            }
          }
        }
      }
      if (Array.isArray(b.items)) {
        for (const it of b.items) {
          if (typeof it.q === "string") {
            const next = scrub(it.q);
            if (next !== it.q) {
              it.q = next;
              changed = true;
            }
          }
          if (typeof it.a === "string") {
            const next = scrub(it.a);
            if (next !== it.a) {
              it.a = next;
              changed = true;
            }
          }
        }
      }
    }
  }

  // 5. Top-level deep scrub — schema, image_manifest, hero, etc.
  // Catches stale practitioner refs in fields outside content[].
  const scrubAll = (val: unknown): unknown => {
    if (typeof val === "string") {
      const next = val
        .replace(/with Pt\.?\s*Raghav Sharma/gi, "with VastuCart Editorial")
        .replace(/by Pt\.?\s*Raghav Sharma/gi, "by VastuCart Editorial")
        .replace(/Pt\.?\s*Raghav Sharma/g, "VastuCart Editorial")
        .replace(/Pandit Raghav Sharma/g, "VastuCart Editorial")
        .replace(/\/authors\/pt-raghav-sharma/g, "/authors/vastucart-editorial")
        .replace(/over twenty[ -]two years/gi, "decades of")
        .replace(/22 years/g, "decades of")
        .replace(/over 22 years/g, "decades of")
        .replace(/twenty[ -]two years of practice/gi, "decades of practice")
        .replace(/400\+? articles/gi, "many articles")
        .replace(/four hundred in-?depth articles/gi, "many in-depth articles")
        .replace(
          /Varanasi-based practicing Jyotishi/gi,
          "VastuCart Jyotish Review Panel"
        );
      if (next !== val) changed = true;
      return next;
    }
    if (Array.isArray(val)) return val.map(scrubAll);
    if (val && typeof val === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        out[k] = scrubAll(v);
      }
      return out;
    }
    return val;
  };
  for (const key of ["schema", "image_manifest", "hero", "subtitle", "tags", "meta"]) {
    if ((post as Record<string, unknown>)[key] !== undefined) {
      (post as Record<string, unknown>)[key] = scrubAll(
        (post as Record<string, unknown>)[key]
      );
    }
  }

  return { changed, post };
}

function parseArgs(): MigrateOptions {
  const args = process.argv.slice(2);
  const opts: MigrateOptions = { apply: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--apply") opts.apply = true;
    else if (args[i] === "--slug" && args[i + 1]) {
      opts.slug = args[i + 1];
      i++;
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs();
  const files: string[] = [];
  walk(CONTENT_DIR, (f) => {
    if (f.endsWith(".json")) files.push(f);
  });

  let migrated = 0;
  let unchanged = 0;
  for (const file of files) {
    let raw: PostJson;
    try {
      raw = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      continue;
    }
    if (opts.slug && raw.slug !== opts.slug) continue;
    const { changed, post } = migratePost(raw);
    if (changed) {
      migrated++;
      if (opts.apply) {
        fs.writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
      }
      console.log(`  ${opts.apply ? "✓" : "~"} ${path.basename(file)}`);
    } else {
      unchanged++;
    }
  }
  console.log(
    `\n${migrated} ${opts.apply ? "migrated" : "would migrate"}, ${unchanged} unchanged.`
  );
  if (!opts.apply && migrated > 0) {
    console.log(`\nRun with --apply to write changes.`);
  }
}

main();
