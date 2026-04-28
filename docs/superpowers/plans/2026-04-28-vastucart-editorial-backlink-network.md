# VastuCart Editorial Backlink Network — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **For the human (you):** This plan is split into 5 phases that span multiple sessions. Each phase ends with a clear ship point. Resume anywhere — the **Resumption Protocol** at the bottom tells any new terminal session how to pick up.

**Goal:** Lock down "VastuCart Editorial" as the sole author entity, build a snippet syndication pipeline that turns each blog post into platform-ready content for Medium / Substack / Tumblr / LinkedIn / Blogger / Pinterest, set up those brand accounts, and run a weekly syndication cadence that drives high-quality backlinks to blog.vastucart.in.

**Architecture:** Author refactor first (kills E-E-A-T risk and the migrate-author drift), then a deterministic snippet-builder library + CLI under `lib/snippet-builder/` and `scripts/build-snippet.ts` that reads a post JSON and emits `out/snippets/{slug}/{platform}.{ext}` files. Platform accounts are created manually but documented in `docs/SYNDICATION_RUNBOOK.md` with their canonical URLs added to `lib/schema/constants.ts` `ORG_SAME_AS`. Syndication itself stays manual paste-in for now (no platform APIs) — we automate file generation, not posting.

**Tech Stack:** TypeScript, Next.js 15, tsx, Node fs (no new runtime deps for snippet builder — keep it boring). Vitest if not already in repo, otherwise the existing test runner.

---

## Phase 0 — Audit current state

**Goal of phase:** Know exactly what Raghav references survive in the codebase and content, decide which are real bugs vs. acceptable drift.

**Files:**
- Read-only audit pass — no edits in this phase

- [x] **Step 0.1: Run the existing dry-run migration to see what's still dirty**

```bash
cd /root/projects/blog
npx tsx scripts/migrate-author.ts | tee /tmp/migrate-dry.txt
wc -l /tmp/migrate-dry.txt
```

Expected: a list of post JSON files that *would* change. If output is "0 would migrate", content is already clean — Raghav drift is only in `lib/authors.ts` and `lib/schema/person.ts`. If output shows files, content needs `--apply`.

- [x] **Step 0.2: Find every code-side Raghav reference**

```bash
grep -rln -E "pt-raghav-sharma|Pt\.\s*Raghav|Pandit Raghav|Varanasi|22 years" \
  --include='*.ts' --include='*.tsx' --include='*.json' --include='*.md' \
  lib/ app/ components/ scripts/ content/ docs/ CLAUDE.md \
  | tee /tmp/raghav-refs.txt
```

Expected: a finite list. Group mentally into 4 buckets:
1. **Author registry** (`lib/authors.ts`) — definitive, must remove
2. **Schema builder** (`lib/schema/person.ts`) — must remove the Raghav branch
3. **CLAUDE.md** — voice section is stale, must rewrite
4. **Content JSONs / templates / pages** — should already be migrated; if any survive, they're the migrate-script's blind spots

- [x] **Step 0.3: Confirm `vastucart-jyotish-review-panel` is dangling**

```bash
grep -rln "vastucart-jyotish-review-panel" lib/ app/ components/ scripts/ content/ \
  | tee /tmp/review-panel-refs.txt
```

Expected: it's set as `reviewer_id` on every migrated post, but `lib/authors.ts` has no registry entry for it. That's the gap. Phase 1 creates it.

- [x] **Step 0.4: Snapshot current author-related test status (if any)**

```bash
npm test -- --testPathPattern='author|schema' 2>&1 | tail -40 || true
```

Expected: either passes or no tests match. Either way, log the baseline so Phase 1 knows what it's preserving.

- [x] **Step 0.5: Decide & record**

Append to this plan, under the **Phase 0 Findings** section at the bottom of this doc, three bullets:
- Number of content files needing `--apply`
- Number of stale code refs (lib/app/components/scripts)
- Whether `vastucart-jyotish-review-panel` is dangling (yes/no)

Stop here. Review with user before Phase 1. **No commit yet.**

---

## Phase 1 — Author entity lockdown (code + schema)

**Goal of phase:** Single canonical author entity (`vastucart-editorial`) plus a single canonical reviewer entity (`vastucart-jyotish-review-panel`). Zero `Person` schema for any individual. Zero "Pt. Raghav" / "Varanasi" / "22 years" anywhere. CLAUDE.md voice section rewritten for brand voice.

**Files:**
- Modify: `lib/authors.ts`
- Modify: `lib/schema/person.ts`
- Modify: `lib/types.ts` (only if `Author` shape needs `entity_type` field — see Step 1.3)
- Modify: `CLAUDE.md` (Voice section)
- Modify: `docs/POST_STANDARD.md` (any author / persona references)
- Run: `scripts/migrate-author.ts --apply` (only if Phase 0 found dirty content)
- Test: `tests/lib/authors.test.ts` (create) and `tests/lib/schema/person.test.ts` (create)

- [ ] **Step 1.1: Write the failing tests for `lib/authors.ts`**

Create `tests/lib/authors.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { AUTHORS, getAuthor, resolveAuthor, DEFAULT_AUTHOR_ID } from "@/lib/authors";

describe("authors registry", () => {
  it("only contains brand entities, no fake person", () => {
    const ids = Object.keys(AUTHORS);
    expect(ids).toContain("vastucart-editorial");
    expect(ids).toContain("vastucart-jyotish-review-panel");
    expect(ids).not.toContain("pt-raghav-sharma");
    expect(ids.length).toBe(2);
  });

  it("default author is the editorial desk", () => {
    expect(DEFAULT_AUTHOR_ID).toBe("vastucart-editorial");
  });

  it("resolveAuthor falls back to editorial for unknown ids", () => {
    expect(resolveAuthor("nonexistent").id).toBe("vastucart-editorial");
    expect(resolveAuthor(undefined).id).toBe("vastucart-editorial");
  });

  it("editorial entity has no fabricated practitioner credentials", () => {
    const ed = getAuthor("vastucart-editorial")!;
    expect(ed.bio.toLowerCase()).not.toMatch(/\d+\s*years/);
    expect(ed.bio.toLowerCase()).not.toMatch(/raghav|pandit|varanasi/);
  });

  it("review panel entity is registered with team-style metadata", () => {
    const panel = getAuthor("vastucart-jyotish-review-panel")!;
    expect(panel.name).toMatch(/Jyotish Review Panel/i);
    expect(panel.bio).toBeDefined();
  });
});
```

- [ ] **Step 1.2: Run the tests to confirm they fail**

```bash
npx vitest run tests/lib/authors.test.ts
```

Expected: 5 failures (Raghav still in registry, panel not registered).

- [ ] **Step 1.3: Refactor `lib/authors.ts` — remove Raghav, add Review Panel**

Replace the entire file content with:

```typescript
import type { Author } from "./types";

// ─────────────────────────────────────────────────────────────────
// Author registry — brand entities only. NEVER add a fake
// individual practitioner here. The blog's E-E-A-T strategy is
// brand-honest editorial bylines + a named review panel.
//
//   vastucart-editorial             → byline on every post
//   vastucart-jyotish-review-panel  → reviewer on Jyotish posts
//
// If you need to credit an individual, put a "Reviewed by Name,
// title" line inside the article body — do NOT introduce a new
// Person entity here, and do NOT emit a Person schema for them.
// ─────────────────────────────────────────────────────────────────

export const AUTHORS: Record<string, Author> = {
  "vastucart-editorial": {
    id: "vastucart-editorial",
    name: "VastuCart Editorial",
    title: "Editorial Desk, Blog by VastuCart",
    initials: "VE",
    avatar_url: "/VastuCartLogo.png",
    avatar_gradient: "from-teal to-dark",
    bio:
      "The in-house editorial team at VastuCart. We research, write, and edit long-form articles on Vedic astrology, numerology, Vastu Shastra, tarot, stotras, festivals, puja vidhi, gemstones, and rudraksha. Every Jyotish article is reviewed by the VastuCart Jyotish Review Panel before publication.",
    specialization: [
      "Vedic Astrology",
      "Jyotish",
      "Numerology",
      "Vastu Shastra",
      "Tarot",
      "Hindu Festivals",
      "Puja Vidhi",
      "Stotras",
      "Gemstones",
      "Rudraksha",
    ],
    categories: [
      "jyotish",
      "numerology",
      "tarot",
      "vastu",
      "puja",
      "festivals",
      "gemstones",
      "rudraksha",
    ],
    experience_years: 6,
    location: "Jhunjhunu, Rajasthan, India",
    lineage: "Collaborative editorial desk",
    article_count: 0,
    schema_same_as: [
      // Populated in Phase 3 as accounts are created.
      // Order: LinkedIn, Facebook, Instagram, X, Medium, Substack, Tumblr, Pinterest, Blogger, YouTube
      "https://www.linkedin.com/company/vastucart",
      "https://www.facebook.com/vastucartindia",
      "https://www.instagram.com/vastucart/",
      "https://x.com/vastucart",
    ],
  },
  "vastucart-jyotish-review-panel": {
    id: "vastucart-jyotish-review-panel",
    name: "VastuCart Jyotish Review Panel",
    title: "Editorial review panel for Jyotish content",
    initials: "JP",
    avatar_url: "/VastuCartLogo.png",
    avatar_gradient: "from-saffron to-gold",
    bio:
      "The VastuCart Jyotish Review Panel is the in-house editorial review board for Jyotish content. The panel verifies graha placements, dasha calculations, yoga interpretations, and remedial recommendations before any Jyotish article ships.",
    specialization: [
      "Vedic Astrology",
      "Jyotish",
      "Parasari Jyotish",
      "Vimshottari Dasha",
      "Yogas",
      "Doshas",
      "Remedial astrology",
    ],
    categories: ["jyotish", "gemstones", "rudraksha"],
    experience_years: 6,
    location: "Jhunjhunu, Rajasthan, India",
    lineage: "Editorial review board",
    article_count: 0,
    schema_same_as: [
      "https://www.linkedin.com/company/vastucart",
      "https://x.com/vastucart",
    ],
  },
};

export function getAuthor(id: string): Author | undefined {
  return AUTHORS[id];
}

export const DEFAULT_AUTHOR_ID = "vastucart-editorial";

export function resolveAuthor(id: string | undefined): Author {
  if (id && AUTHORS[id]) return AUTHORS[id];
  return AUTHORS[DEFAULT_AUTHOR_ID];
}
```

- [ ] **Step 1.4: Run tests, confirm pass**

```bash
npx vitest run tests/lib/authors.test.ts
```

Expected: 5/5 pass.

- [ ] **Step 1.5: Write failing tests for `lib/schema/person.ts`**

Create `tests/lib/schema/person.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildPersonSchema, buildAllPersonSchemas } from "@/lib/schema/person";

describe("buildPersonSchema", () => {
  it("returns null for the deleted Raghav slug", () => {
    expect(buildPersonSchema("pt-raghav-sharma")).toBeNull();
  });

  it("emits an Organization-style schema for the editorial desk, NOT Person", () => {
    const ed = buildPersonSchema("vastucart-editorial")!;
    expect(ed["@type"]).toBe("Organization");
    expect(ed).not.toHaveProperty("honorificPrefix");
    expect(ed).not.toHaveProperty("hasCredential");
    expect(ed).not.toHaveProperty("alumniOf");
  });

  it("emits an Organization-style schema for the review panel", () => {
    const panel = buildPersonSchema("vastucart-jyotish-review-panel")!;
    expect(panel["@type"]).toBe("Organization");
  });

  it("buildAllPersonSchemas returns exactly the two brand entities", () => {
    const all = buildAllPersonSchemas();
    expect(all.length).toBe(2);
    expect(all.every((e) => e["@type"] === "Organization")).toBe(true);
  });
});
```

- [ ] **Step 1.6: Run tests, confirm they fail**

```bash
npx vitest run tests/lib/schema/person.test.ts
```

Expected: 4 failures (current schema emits `Person` and has Raghav-specific fields).

- [ ] **Step 1.7: Refactor `lib/schema/person.ts` — emit Organization, drop the Raghav branch**

Replace `buildPersonSchema` with:

```typescript
export function buildPersonSchema(authorSlug: string): SchemaEntity | null {
  const author = AUTHORS[authorSlug];
  if (!author) return null;

  // Brand entities — NEVER emit @type Person here. Fake-person Person
  // schema is an E-E-A-T spam signal. Both authors are sub-organizations
  // of VastuCart, modeled as @type Organization with parentOrganization.
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": personId(authorSlug),
    name: author.name,
    description: author.bio,
    image: authorImageUrl(author),
    url: authorPageUrl(authorSlug),
    parentOrganization: ORG_REF,
    knowsAbout: author.specialization,
    sameAs: author.schema_same_as,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jhunjhunu",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
  };
}
```

Keep `buildAllPersonSchemas` unchanged — it iterates `AUTHORS`, which now has only the two brand entities.

Note: the function name stays `buildPersonSchema` for backward compatibility, but it now emits `Organization`. Rename in a follow-up commit if grep shows it's not load-bearing.

- [ ] **Step 1.8: Run schema tests, confirm pass**

```bash
npx vitest run tests/lib/schema/person.test.ts
```

Expected: 4/4 pass.

- [ ] **Step 1.9: If Phase 0 found dirty content, run the migrate script with --apply**

```bash
npx tsx scripts/migrate-author.ts --apply | tee /tmp/migrate-apply.txt
```

Skip if Phase 0 Step 0.1 already showed "0 would migrate".

- [ ] **Step 1.10: Build the project to confirm no TypeScript breaks**

```bash
npx tsc --noEmit
```

Expected: zero errors. If `lib/types.ts` `Author` interface had `honorificPrefix` etc. — they're harmless extras and should compile.

- [ ] **Step 1.11: Run the full test suite**

```bash
npm test 2>&1 | tail -40
```

Expected: all green. Investigate any failures rooted in the author refactor.

- [ ] **Step 1.12: Sanity-check rendered schema for one post**

```bash
npx tsx scripts/dump-schema.ts content/jyotish/graha-in-bhava/sun-1st-house-aries-lagna.json | head -120
```

Expected output shows: `Author` reference points to `vastucart-editorial`, no `Person` entity for any individual, no `honorificPrefix`, no Varanasi address.

- [ ] **Step 1.13: Update CLAUDE.md "Voice — Every Post" section**

Find the block in `CLAUDE.md`:

```
## Voice — Every Post
Author persona: Pt. Raghav Sharma
- 22 years Parashari Jyotish practice, Varanasi
...
```

Replace with:

```
## Voice — Every Post
Byline: VastuCart Editorial. Jyotish posts are additionally credited
"Reviewed by VastuCart Jyotish Review Panel".

Voice rules (independent of byline):
- Warm, direct, practitioner-to-student register
- Specific knowledge over generic statements
- Each section flows naturally into the next
- Minimum 1800 words prose per planet-in-house post
- NEVER fabricate individual practitioner credentials, ages, or
  cities. NEVER reintroduce "Pt. Raghav Sharma", "Varanasi", or
  "22 years of practice" — these were scrapped 2026-04-28 as
  E-E-A-T spam risks.
```

- [ ] **Step 1.14: Update `docs/POST_STANDARD.md` if it has author/byline rules**

```bash
grep -n -E "Raghav|Pandit|Varanasi|persona" docs/POST_STANDARD.md || echo "clean"
```

If the grep returns hits, edit them inline to use VastuCart Editorial / Review Panel language. If "clean", skip.

- [ ] **Step 1.15: Commit Phase 1**

```bash
git add lib/authors.ts lib/schema/person.ts CLAUDE.md docs/POST_STANDARD.md \
  tests/lib/authors.test.ts tests/lib/schema/person.test.ts content/
git status
git commit -m "$(cat <<'EOF'
refactor(author): drop fake Pt. Raghav persona, lock to VastuCart Editorial

Removes the pt-raghav-sharma named-practitioner entity from the author
registry and the corresponding Person schema branch. Author entity is
now @type Organization (parentOrganization VastuCart) for both the
editorial desk and the Jyotish review panel — fake-person schema is an
E-E-A-T spam signal. CLAUDE.md voice section rewritten to forbid
reintroducing the persona.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

**Phase 1 ship point.** Commit, then stop. Check schema in Google Rich Results Test on a deployed post before Phase 2.

---

## Phase 2 — Snippet builder (TDD)

**Goal of phase:** A CLI script that takes a post slug and emits 6 platform-ready files in `out/snippets/{slug}/`. Pure functions, no network calls, no platform APIs.

**Files:**
- Create: `lib/snippet-builder/index.ts` (public API: `buildSnippets(post)`)
- Create: `lib/snippet-builder/types.ts` (`SnippetBundle`, `PlatformSnippet`)
- Create: `lib/snippet-builder/extract.ts` (excerpt, pull-quote, hero-image, tags)
- Create: `lib/snippet-builder/format-medium.ts`
- Create: `lib/snippet-builder/format-substack.ts`
- Create: `lib/snippet-builder/format-tumblr.ts`
- Create: `lib/snippet-builder/format-linkedin.ts`
- Create: `lib/snippet-builder/format-blogger.ts`
- Create: `lib/snippet-builder/format-pinterest.ts`
- Create: `scripts/build-snippet.ts` (CLI entry)
- Create: `tests/lib/snippet-builder/extract.test.ts`
- Create: `tests/lib/snippet-builder/format-medium.test.ts`
- Create: one fixture: `tests/fixtures/posts/sun-1st-house-aries-lagna.fixture.json` (copy of real post, frozen)

- [ ] **Step 2.1: Define the SnippetBundle types**

Create `lib/snippet-builder/types.ts`:

```typescript
export interface PlatformSnippet {
  platform: "medium" | "substack" | "tumblr" | "linkedin" | "blogger" | "pinterest";
  filename: string;       // e.g. "medium.md"
  contentType: "markdown" | "html" | "json";
  body: string;           // file body
}

export interface SnippetBundle {
  slug: string;
  canonicalUrl: string;   // full URL on blog.vastucart.in
  title: string;
  excerpt: string;        // 200-400 word teaser
  pullQuote: string;      // single strong sentence
  heroImage: string;      // /og/{slug}.png as a full URL
  category: string;
  tags: string[];
  relatedUrls: string[];  // 3-5 internal blog URLs
  toolUrls: string[];     // 2-3 deep VastuCart tool URLs
  outputs: PlatformSnippet[];
}
```

- [ ] **Step 2.2: Write failing tests for `extract.ts`**

Create `tests/fixtures/posts/sun-1st-house-aries-lagna.fixture.json` by copying the real post:

```bash
mkdir -p tests/fixtures/posts
cp content/jyotish/graha-in-bhava/sun-1st-house-aries-lagna.json \
   tests/fixtures/posts/sun-1st-house-aries-lagna.fixture.json
```

Create `tests/lib/snippet-builder/extract.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  extractExcerpt,
  extractPullQuote,
  extractHeroImage,
  extractRelatedUrls,
  extractToolUrls,
} from "@/lib/snippet-builder/extract";

const post = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../../fixtures/posts/sun-1st-house-aries-lagna.fixture.json"),
    "utf-8"
  )
);

describe("extractExcerpt", () => {
  it("returns 200-400 words of plain text from the lead", () => {
    const ex = extractExcerpt(post);
    const wc = ex.split(/\s+/).filter(Boolean).length;
    expect(wc).toBeGreaterThanOrEqual(200);
    expect(wc).toBeLessThanOrEqual(400);
    expect(ex).not.toMatch(/<[^>]+>/);  // no HTML
  });

  it("ends mid-thought to create a click-out moment", () => {
    const ex = extractExcerpt(post);
    expect(ex).toMatch(/\.\.\.|…$|\.$/);
  });
});

describe("extractPullQuote", () => {
  it("returns one sentence between 60 and 200 chars", () => {
    const q = extractPullQuote(post);
    expect(q.length).toBeGreaterThanOrEqual(60);
    expect(q.length).toBeLessThanOrEqual(200);
    expect(q.split(/[.!?]/).filter((s) => s.trim()).length).toBe(1);
  });
});

describe("extractHeroImage", () => {
  it("returns the OG image as an absolute URL", () => {
    const img = extractHeroImage(post);
    expect(img).toBe("https://blog.vastucart.in/og/sun-1st-house-aries-lagna.png");
  });
});

describe("extractRelatedUrls", () => {
  it("returns 3-5 absolute blog URLs", () => {
    const urls = extractRelatedUrls(post);
    expect(urls.length).toBeGreaterThanOrEqual(3);
    expect(urls.length).toBeLessThanOrEqual(5);
    expect(urls.every((u) => u.startsWith("https://blog.vastucart.in/"))).toBe(true);
  });
});

describe("extractToolUrls", () => {
  it("returns 2-3 deep VastuCart tool URLs (not homepages)", () => {
    const urls = extractToolUrls(post);
    expect(urls.length).toBeGreaterThanOrEqual(2);
    expect(urls.length).toBeLessThanOrEqual(3);
    for (const u of urls) {
      expect(u).toMatch(/vastucart\.(in|com)/);
      const path = new URL(u).pathname;
      expect(path).not.toBe("/");      // no homepage dumping
    }
  });
});
```

- [ ] **Step 2.3: Run extract tests, confirm 5 failures**

```bash
npx vitest run tests/lib/snippet-builder/extract.test.ts
```

Expected: all 5 fail with "module not found".

- [ ] **Step 2.4: Implement `lib/snippet-builder/extract.ts`**

```typescript
import { stripHtml } from "../utils";
import { relevantTools } from "../subdomain-tools";

const SITE = "https://blog.vastucart.in";

export function extractExcerpt(post: any): string {
  const lead =
    post.content?.find((b: any) => b.type === "lead-prose")?.html ??
    post.content?.find((b: any) => b.type === "prose")?.html ??
    "";
  const plain = stripHtml(lead).replace(/\s+/g, " ").trim();
  const words = plain.split(" ");
  const target = Math.min(380, Math.max(220, Math.floor(words.length * 0.25)));
  const slice = words.slice(0, target).join(" ");
  return slice.endsWith(".") ? slice + ".." : slice + "...";
}

export function extractPullQuote(post: any): string {
  const pq = post.content?.find((b: any) => b.type === "pull-quote");
  if (pq?.text) return pq.text.trim();
  // Fallback: first sentence of lead between 60 and 200 chars.
  const lead = stripHtml(
    post.content?.find((b: any) => b.type === "lead-prose")?.html ?? ""
  );
  const sents = lead.split(/(?<=[.!?])\s+/).map((s: string) => s.trim());
  return (
    sents.find((s: string) => s.length >= 60 && s.length <= 200) ??
    sents[0]?.slice(0, 200) ??
    ""
  );
}

export function extractHeroImage(post: any): string {
  return `${SITE}/og/${post.slug}.png`;
}

export function extractRelatedUrls(post: any): string[] {
  const block = post.content?.find((b: any) => b.type === "internal-links");
  const urls: string[] = (block?.links ?? [])
    .map((l: any) => l.href)
    .filter((u: string) => typeof u === "string" && u.includes("blog.vastucart.in"));
  return urls.slice(0, 5);
}

export function extractToolUrls(post: any): string[] {
  const tools = relevantTools(post) ?? [];
  return tools.slice(0, 3).map((t: any) => t.url);
}
```

> If `stripHtml` doesn't exist in `lib/utils`, add a minimal one: `export const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");` Confirm with `grep "export.*stripHtml" lib/utils.ts` first.

- [ ] **Step 2.5: Run extract tests, confirm pass**

```bash
npx vitest run tests/lib/snippet-builder/extract.test.ts
```

Expected: 5/5 pass. If `extractRelatedUrls` returns 0, the fixture post may use a different `internal-links` shape — print one and patch the extractor to match.

- [ ] **Step 2.6: Write failing test for `format-medium.ts`**

Create `tests/lib/snippet-builder/format-medium.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { formatMedium } from "@/lib/snippet-builder/format-medium";

const bundle = {
  slug: "sun-1st-house-aries-lagna",
  canonicalUrl: "https://blog.vastucart.in/jyotish/sun-1st-house-aries-lagna",
  title: "Sun in 1st House for Mesha Lagna",
  excerpt: "When the Sun sits in your 1st house...",
  pullQuote: "The 1st house Sun makes you the medicine and the wound.",
  heroImage: "https://blog.vastucart.in/og/sun-1st-house-aries-lagna.png",
  category: "jyotish",
  tags: ["jyotish", "surya", "mesha-lagna"],
  relatedUrls: [
    "https://blog.vastucart.in/jyotish/mesh-lagna-complete-guide",
    "https://blog.vastucart.in/jyotish/sun-2nd-house-aries-lagna",
    "https://blog.vastucart.in/jyotish/mars-1st-house-aries-lagna",
  ],
  toolUrls: ["https://www.vastucart.in/tools/kundali"],
};

describe("formatMedium", () => {
  it("emits Markdown with canonical link at top", () => {
    const md = formatMedium(bundle as any);
    expect(md).toMatch(/^# /m);
    expect(md).toContain("This article was originally published on");
    expect(md).toContain(bundle.canonicalUrl);
    expect(md).toContain("Read the full guide");
    expect(md).not.toMatch(/<script/);
  });

  it("includes hero image as Markdown image", () => {
    const md = formatMedium(bundle as any);
    expect(md).toContain(`![${bundle.title}](${bundle.heroImage})`);
  });

  it("ends with related-reading section", () => {
    const md = formatMedium(bundle as any);
    expect(md).toMatch(/Related reading/i);
    for (const u of bundle.relatedUrls) {
      expect(md).toContain(u);
    }
  });
});
```

- [ ] **Step 2.7: Run test, confirm fail**

```bash
npx vitest run tests/lib/snippet-builder/format-medium.test.ts
```

Expected: 3 failures.

- [ ] **Step 2.8: Implement `lib/snippet-builder/format-medium.ts`**

```typescript
import type { SnippetBundle } from "./types";

export function formatMedium(b: SnippetBundle): string {
  return [
    `# ${b.title}`,
    ``,
    `*This article was originally published on [blog.vastucart.in](${b.canonicalUrl}). Cross-posted with canonical pointing back to the original.*`,
    ``,
    `![${b.title}](${b.heroImage})`,
    ``,
    b.excerpt,
    ``,
    `> ${b.pullQuote}`,
    ``,
    `[**Read the full guide on blog.vastucart.in →**](${b.canonicalUrl})`,
    ``,
    `---`,
    ``,
    `### Related reading`,
    ``,
    ...b.relatedUrls.map((u) => `- [${urlToTitle(u)}](${u})`),
    ``,
    `### Free tools`,
    ``,
    ...b.toolUrls.map((u) => `- [${urlToTitle(u)}](${u})`),
    ``,
    `*Tags: ${b.tags.join(", ")}*`,
  ].join("\n");
}

function urlToTitle(url: string): string {
  return new URL(url).pathname
    .replace(/^\/|\/$/g, "")
    .split("/")
    .pop()!
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
```

- [ ] **Step 2.9: Run test, confirm pass**

```bash
npx vitest run tests/lib/snippet-builder/format-medium.test.ts
```

Expected: 3/3 pass.

- [ ] **Step 2.10: Implement the remaining 5 formatters (one step each)**

Create each file with a sibling test using the same `bundle` fixture from Step 2.6. Each formatter has a focused job:

- **`format-substack.ts`** — HTML email-friendly: hero image, excerpt with `<p>`, pull-quote `<blockquote>`, big call-out button styled as `<a>`, related list, tags. Test: contains canonical href, contains `<blockquote>`, no `<script>`.
- **`format-tumblr.ts`** — short visual format: hero image, 100-150 word teaser only, pull quote, single CTA link. Test: word count of plain-text body ≤180, exactly one canonical link.
- **`format-linkedin.ts`** — Markdown for LinkedIn Article. Slightly longer than Medium teaser (300-500 words), professional tone framing, ends with CTA + 5 hashtags. Test: starts with `# `, contains 5 hashtag tokens at end, contains canonical URL.
- **`format-blogger.ts`** — full HTML page body (Blogger accepts HTML). Same shape as Substack but no email constraints. Test: valid HTML structure (open+close tags balanced for `p`, `h1`, `blockquote`).
- **`format-pinterest.ts`** — JSON array of 3-5 pin objects: `{ image, title, description, link, board }`. Each pin description is 200-500 chars, link is canonical, board is the category. Test: parses as JSON, length 3-5, each pin has all required fields, each link === canonical.

For each formatter:
1. Write the failing test referencing the `bundle` fixture
2. Run `npx vitest run tests/lib/snippet-builder/format-{name}.test.ts` — confirm fail
3. Implement the formatter
4. Run again — confirm pass

- [ ] **Step 2.11: Implement `lib/snippet-builder/index.ts` orchestrator**

```typescript
import {
  extractExcerpt,
  extractPullQuote,
  extractHeroImage,
  extractRelatedUrls,
  extractToolUrls,
} from "./extract";
import { formatMedium } from "./format-medium";
import { formatSubstack } from "./format-substack";
import { formatTumblr } from "./format-tumblr";
import { formatLinkedin } from "./format-linkedin";
import { formatBlogger } from "./format-blogger";
import { formatPinterest } from "./format-pinterest";
import type { SnippetBundle, PlatformSnippet } from "./types";

const SITE = "https://blog.vastucart.in";

export function buildSnippets(post: any): SnippetBundle {
  const bundle: Omit<SnippetBundle, "outputs"> = {
    slug: post.slug,
    canonicalUrl: `${SITE}${post.path ?? `/${post.category}/${post.slug}`}`,
    title: post.meta?.title ?? post.hero?.h1 ?? post.title ?? post.slug,
    excerpt: extractExcerpt(post),
    pullQuote: extractPullQuote(post),
    heroImage: extractHeroImage(post),
    category: post.category,
    tags: post.tags ?? [],
    relatedUrls: extractRelatedUrls(post),
    toolUrls: extractToolUrls(post),
  };

  const outputs: PlatformSnippet[] = [
    { platform: "medium",    filename: "medium.md",       contentType: "markdown", body: formatMedium(bundle as SnippetBundle) },
    { platform: "substack",  filename: "substack.html",   contentType: "html",     body: formatSubstack(bundle as SnippetBundle) },
    { platform: "tumblr",    filename: "tumblr.html",     contentType: "html",     body: formatTumblr(bundle as SnippetBundle) },
    { platform: "linkedin",  filename: "linkedin.md",     contentType: "markdown", body: formatLinkedin(bundle as SnippetBundle) },
    { platform: "blogger",   filename: "blogger.html",    contentType: "html",     body: formatBlogger(bundle as SnippetBundle) },
    { platform: "pinterest", filename: "pinterest.json",  contentType: "json",     body: formatPinterest(bundle as SnippetBundle) },
  ];

  return { ...bundle, outputs };
}

export type { SnippetBundle, PlatformSnippet };
```

- [ ] **Step 2.12: Implement `scripts/build-snippet.ts` CLI**

```typescript
#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { buildSnippets } from "../lib/snippet-builder";

function findPost(slug: string): string {
  const root = path.join(process.cwd(), "content");
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) stack.push(full);
      else if (e.name === `${slug}.json`) return full;
    }
  }
  throw new Error(`Post not found for slug: ${slug}`);
}

function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npx tsx scripts/build-snippet.ts <post-slug>");
    process.exit(1);
  }
  const file = findPost(slug);
  const post = JSON.parse(fs.readFileSync(file, "utf-8"));
  const bundle = buildSnippets(post);
  const outDir = path.join(process.cwd(), "out", "snippets", slug);
  fs.mkdirSync(outDir, { recursive: true });
  for (const out of bundle.outputs) {
    fs.writeFileSync(path.join(outDir, out.filename), out.body);
  }
  fs.writeFileSync(path.join(outDir, "_bundle.json"), JSON.stringify(bundle, null, 2));
  console.log(`Wrote ${bundle.outputs.length} snippets to ${outDir}`);
}

main();
```

- [ ] **Step 2.13: Run the CLI on the fixture post end-to-end**

```bash
npx tsx scripts/build-snippet.ts sun-1st-house-aries-lagna
ls -la out/snippets/sun-1st-house-aries-lagna/
```

Expected: 6 platform files + `_bundle.json`. Open each one, eyeball quality. Don't move on if any output looks broken.

- [ ] **Step 2.14: Add `out/` to .gitignore if not already there**

```bash
grep -E "^out/" .gitignore || echo "out/" >> .gitignore
```

- [ ] **Step 2.15: Commit Phase 2**

```bash
git add lib/snippet-builder scripts/build-snippet.ts \
  tests/lib/snippet-builder tests/fixtures/posts \
  .gitignore
git commit -m "$(cat <<'EOF'
feat(snippets): TDD snippet builder for Medium/Substack/Tumblr/LinkedIn/Blogger/Pinterest

Adds lib/snippet-builder with pure-function extractors and per-platform
formatters. CLI at scripts/build-snippet.ts emits 6 platform-ready
files into out/snippets/{slug}/ for manual paste-in syndication.
No platform APIs; no posting; deterministic and testable.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

**Phase 2 ship point.** Snippet builder is now reusable. Stop, eyeball outputs on 2-3 different posts before Phase 3.

---

## Phase 3 — Platform account setup (manual, documented)

**Goal of phase:** Six brand-owned syndication channels exist and their canonical URLs live in `lib/schema/constants.ts` `ORG_SAME_AS`. This is mostly clicking and writing, not coding.

**Files:**
- Create: `docs/SYNDICATION_RUNBOOK.md` (account setup + ongoing cadence)
- Modify: `lib/schema/constants.ts` (`ORG_SAME_AS` array)
- Modify: `lib/authors.ts` (`schema_same_as` for both authors)

- [ ] **Step 3.1: Create the runbook scaffold**

Write `docs/SYNDICATION_RUNBOOK.md` with sections for each platform (Medium, Substack, Tumblr, LinkedIn, Blogger, Pinterest, YouTube-future). For each: account URL, login email, recovery email, profile photo source (`/VastuCartLogo.png`), bio template, banner image source (if needed), canonical link rules.

Content of the bio template (paste into every platform's "About" field, lightly edited per platform's tone limits):

```
VastuCart Editorial — long-form, citation-grade guides on Vedic
astrology, Vastu Shastra, numerology, tarot, gemstones, rudraksha,
festivals, and puja vidhi. Every Jyotish article is reviewed by the
VastuCart Jyotish Review Panel. Read the full library at
blog.vastucart.in.
```

- [ ] **Step 3.2: Create Medium publication**

Manual steps:
1. Sign in to medium.com with `sleeprightofficial@gmail.com`
2. Create publication: name "VastuCart Editorial", URL slug `vastucart-editorial` (canonical handle if available)
3. Set logo to `/VastuCartLogo.png` (export 1200x1200 from public/)
4. Bio: paste template from Step 3.1
5. Connect Twitter/Facebook accounts under publication settings
6. Record canonical URL: `https://medium.com/vastucart-editorial` → save in runbook

- [ ] **Step 3.3: Create Substack**

1. Sign up at substack.com with the same email
2. Newsletter name: "VastuCart Editorial"
3. URL: `vastucart.substack.com` if available, else `vastucart-editorial.substack.com`
4. Set logo, bio, welcome email
5. Record URL in runbook

- [ ] **Step 3.4: Create Tumblr blog**

1. tumblr.com sign-up
2. Blog name: `vastucart`
3. URL: `vastucart.tumblr.com`
4. Theme: minimal default, custom logo header
5. Record URL in runbook

- [ ] **Step 3.5: Create Blogger blog**

1. blogger.com sign-up (Google account)
2. Blog title: "VastuCart Editorial"
3. URL: `vastucart-editorial.blogspot.com`
4. Pick a clean template
5. Record URL in runbook

- [ ] **Step 3.6: Confirm LinkedIn Company Page is in Articles mode**

LinkedIn Company Page already exists. Just confirm:
1. Page admin can publish Articles (not only feed posts)
2. Banner + description match runbook bio
3. Record URL in runbook

- [ ] **Step 3.7: Set up Pinterest business profile**

1. business.pinterest.com sign-up
2. Profile name: "VastuCart"
3. Bio: short version of template
4. Verify domain: blog.vastucart.in (paste meta tag into root layout — defer to a separate task if it requires a deploy)
5. Create boards, one per category: Jyotish, Vastu, Numerology, Tarot, Gemstones, Rudraksha, Puja, Festivals
6. Record profile URL in runbook

- [ ] **Step 3.8: Add all canonical URLs to schema**

Open `lib/schema/constants.ts`, find `ORG_SAME_AS`, and add the new URLs. Should look like:

```typescript
export const ORG_SAME_AS = [
  "https://www.linkedin.com/company/vastucart",
  "https://www.facebook.com/vastucartindia",
  "https://www.instagram.com/vastucart/",
  "https://x.com/vastucart",
  "https://medium.com/vastucart-editorial",
  "https://vastucart.substack.com",
  "https://vastucart.tumblr.com",
  "https://vastucart-editorial.blogspot.com",
  "https://www.pinterest.com/vastucart",
  // YouTube added in a later phase
];
```

Then mirror the same URLs into both `AUTHORS["vastucart-editorial"].schema_same_as` and `AUTHORS["vastucart-jyotish-review-panel"].schema_same_as` in `lib/authors.ts`.

- [ ] **Step 3.9: Verify build still passes**

```bash
npx tsc --noEmit && npm test 2>&1 | tail -20
```

Expected: green.

- [ ] **Step 3.10: Commit Phase 3**

```bash
git add docs/SYNDICATION_RUNBOOK.md lib/schema/constants.ts lib/authors.ts
git commit -m "$(cat <<'EOF'
feat(schema): add syndication channel sameAs URLs and runbook

Brand-owned Medium publication, Substack, Tumblr, Blogger, Pinterest,
and LinkedIn Company Page now appear in ORG_SAME_AS so Google can
consolidate the VastuCart entity graph. Runbook documents the
account setup, ongoing cadence, and canonical-link rules.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

**Phase 3 ship point.** Six platform accounts exist, schema knows them, runbook documents them. Stop, deploy, verify Google sees the updated `sameAs`.

---

## Phase 4 — Pilot syndication (one real post, end-to-end)

**Goal of phase:** Ship one real post through the entire pipeline. Find the friction. Fix it before scaling.

**Files:**
- Create: `data/syndication-log.json` (per-post syndication tracker)
- Create: `scripts/log-syndication.ts` (helper to update the log)

- [ ] **Step 4.1: Pick the pilot post**

Best candidate: an evergreen Jyotish post with strong visuals already drawn, e.g. `sun-1st-house-aries-lagna`. Confirm `out/snippets/sun-1st-house-aries-lagna/` files look clean from Phase 2.

- [ ] **Step 4.2: Initialize the syndication log**

Create `data/syndication-log.json`:

```json
{
  "version": 1,
  "posts": []
}
```

- [ ] **Step 4.3: Implement `scripts/log-syndication.ts`**

Simple CLI: `npx tsx scripts/log-syndication.ts <slug> <platform> <url>` appends a record `{ slug, platform, url, posted_at }` to `data/syndication-log.json`. Idempotent on slug+platform pair. ~40 lines.

- [ ] **Step 4.4: Manually publish to Medium**

1. Open `out/snippets/sun-1st-house-aries-lagna/medium.md`
2. In Medium, "Stories → Import a story" — paste the canonical URL (this auto-sets canonical pointing back, which is the entire point)
3. Reformat the auto-imported draft to match `medium.md` (or just publish the auto-imported draft if it's clean enough)
4. Submit to the VastuCart Editorial publication
5. Publish
6. Run: `npx tsx scripts/log-syndication.ts sun-1st-house-aries-lagna medium <published-url>`

- [ ] **Step 4.5: Manually publish to Substack**

1. New post → paste `substack.html` body
2. Set the "Read the full guide" CTA to canonical URL
3. Publish
4. Log it: `npx tsx scripts/log-syndication.ts sun-1st-house-aries-lagna substack <url>`

- [ ] **Step 4.6: Manually publish to Tumblr**

1. New text post → paste `tumblr.html`
2. Tags: from snippet bundle
3. Publish, log

- [ ] **Step 4.7: Manually publish to LinkedIn Article**

1. From Company Page admin → Write article
2. Paste `linkedin.md`
3. Header image: hero image from snippet
4. Publish, log

- [ ] **Step 4.8: Manually publish to Blogger**

1. New post (HTML mode) → paste `blogger.html`
2. Labels: tags from snippet
3. Publish, log

- [ ] **Step 4.9: Schedule Pinterest pins**

1. Open `pinterest.json` from snippet bundle
2. For each pin: upload image, paste title + description, link to canonical, save to category board
3. Log all 3-5 pin URLs

- [ ] **Step 4.10: Verify all 6+ canonicals point back**

```bash
for url in $(jq -r '.posts[] | select(.slug=="sun-1st-house-aries-lagna") | .url' data/syndication-log.json); do
  echo "--- $url ---"
  curl -sL "$url" | grep -E '<link rel="canonical"|<link href="https://blog.vastucart.in' | head -3
done
```

Expected: each platform's HTML contains a canonical pointing to `blog.vastucart.in/...`. Medium's import sets this automatically; the others rely on you including the canonical link inside the body — Google still picks up the body link as a strong signal even without `rel=canonical`.

- [ ] **Step 4.11: Commit Phase 4**

```bash
git add data/syndication-log.json scripts/log-syndication.ts
git commit -m "$(cat <<'EOF'
feat(syndication): pilot one post end-to-end + add syndication log

Adds data/syndication-log.json and a tiny CLI to record where every
post has been syndicated. Pilot run on sun-1st-house-aries-lagna
seeds the log and validates the snippet builder against real
platform editors.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

**Phase 4 ship point.** One post lives on 6+ external sites pointing back to blog.vastucart.in. Stop and wait 7 days. Check Google Search Console → Links report for the new external referrers.

---

## Phase 5 — Operational rhythm

**Goal of phase:** A weekly cadence that ships syndication on autopilot.

**Files:**
- Modify: `docs/SYNDICATION_RUNBOOK.md` (add cadence section)
- Optional: `scripts/audit-syndication.ts` (gap report)

- [ ] **Step 5.1: Document the weekly cadence in the runbook**

Add this section to `docs/SYNDICATION_RUNBOOK.md`:

```
## Weekly cadence

Every Monday:
1. Look at last week's published posts in /content/. List the slugs.
2. For each slug:
   - npx tsx scripts/build-snippet.ts <slug>
   - Review out/snippets/<slug>/medium.md and out/snippets/<slug>/linkedin.md
3. Tuesday: publish to Medium + LinkedIn (highest-DA, highest-effort)
4. Wednesday: publish to Substack newsletter (batch the week's posts in one issue)
5. Thursday: publish to Tumblr + Blogger (low-effort, high-volume)
6. Friday: schedule Pinterest pins (5 per post, spaced through next week)
7. Log every URL via scripts/log-syndication.ts

Skip a platform without guilt if it doesn't fit the post.
```

- [ ] **Step 5.2: Build the gap auditor**

Create `scripts/audit-syndication.ts`: walks `content/`, cross-references `data/syndication-log.json`, prints a table of `slug × platform` showing which combinations are missing. ~50 lines. Output:

```
                                    medium  substack  tumblr  linkedin  blogger  pinterest
sun-1st-house-aries-lagna              ✓        ✓       ✓         ✓         ✓        ✓
mars-1st-house-aries-lagna             ✓        ·       ·         ·         ·        ·
...
```

Run weekly to spot gaps.

- [ ] **Step 5.3: Set up KPIs to watch**

Add to runbook:

```
## KPIs (review monthly)

- Google Search Console → External links → verify each platform shows up
- GSC → Performance → impressions and clicks for blog.vastucart.in (90-day trend)
- Each Medium post: claps + reads + read ratio (Medium dashboard)
- Each Substack post: open rate + click rate (Substack dashboard)
- Pinterest: monthly viewers + saves per board
- One number to actually optimize: organic clicks to blog.vastucart.in. Everything else is supporting evidence.
```

- [ ] **Step 5.4: Commit Phase 5**

```bash
git add docs/SYNDICATION_RUNBOOK.md scripts/audit-syndication.ts
git commit -m "$(cat <<'EOF'
docs(syndication): weekly cadence + gap auditor

Locks in the operational rhythm: build snippets Mon, ship to Medium
+ LinkedIn Tue, Substack digest Wed, Tumblr + Blogger Thu, Pinterest
schedule Fri. audit-syndication.ts prints the slug×platform coverage
table to surface gaps.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

**Phase 5 ship point.** This is now a process, not a project. Run it weekly and let it compound for 90 days before judging results.

---

## Phase 0 Findings (run 2026-04-28)

- [x] Step 0.1 — dry-run migration: **131 of 135 content files dirty**, 0 already clean (the migration was never `--apply`'d).
- [x] Step 0.2 — code-side Raghav refs in 22 files. Real fixes needed:
  - `lib/authors.ts` (registry entry pt-raghav-sharma)
  - `lib/schema/person.ts` (Raghav branch with honorificPrefix/credentials/Varanasi address)
  - `lib/schema/constants.ts` (likely a personId mapping for Raghav)
  - `lib/categories.ts` (likely an author assignment)
  - `app/(blog)/[category]/page.tsx`, `app/(blog)/[category]/[subcategory]/page.tsx`, `app/(blog)/[category]/complete-guide/page.tsx`
  - `app/authors/page.tsx` (the byline bio page)
  - `app/editorial-standards/page.tsx`
  - `app/feed.json/route.ts`
  - `app/layout.tsx` (line 24 — root metadata or JSON-LD)
  - `components/layout/Footer.tsx` (line 16 — footer link)
  - 4 content JSONs (mesh-lagna, sun-1st, mars-1st, mars-8th — the migration script's blind spots)
  - Docs: `POST_STANDARD.md`, `SEO_TACTICS.md`, `SEMANTIC_SEO.md`
  - `CLAUDE.md` (Voice section)
- [x] Step 0.3 — `vastucart-jyotish-review-panel` is **NOT dangling**. Discovered `lib/schema/reviewer.ts` already registers it as an `Organization` with `parentOrganization: VastuCart`. The architecture is cleaner than originally planned: AUTHORS = byline only, REVIEWER_ORGS = separate parallel registry. **Phase 1 must NOT add the review panel to AUTHORS** — it would duplicate the entity.
- [x] Step 0.4 — **no test runner is installed.** `package.json` has only `dev`/`build`/`start`/`lint` scripts and no vitest/jest in devDependencies. Plan assumed vitest. Two adaptations possible (see Plan Adjustments below).

## Plan Adjustments after Phase 0

These edits should be made to the plan before Phase 1 starts. Do them in the next session as a quick patch step (not committed work — just plan-doc edits).

1. **Phase 1 Step 1.3** — drop the `vastucart-jyotish-review-panel` block from the AUTHORS registry rewrite. AUTHORS only contains `vastucart-editorial`. The review panel stays in `lib/schema/reviewer.ts` where it already lives.
2. **Phase 1 Step 1.5** — schema test for `buildPersonSchema` should expect ONE entity from `buildAllPersonSchemas()` (just the editorial desk), not two.
3. **Phase 1** — add steps for the app-layer files surfaced above. Each file needs one targeted edit replacing Raghav metadata with VastuCart Editorial + (where it's a Jyotish surface) a reviewer line crediting the panel. Specifically:
   - `lib/categories.ts` — change any `author_id: "pt-raghav-sharma"` to `"vastucart-editorial"`
   - `lib/schema/constants.ts` — remove pt-raghav-sharma from any personId map
   - `app/(blog)/[category]/*.tsx` — confirm they read author from registry; if so, the registry change covers it. If they hardcode "Pt. Raghav", patch inline.
   - `app/authors/page.tsx` — drop pt-raghav-sharma route/card
   - `app/editorial-standards/page.tsx` — replace the practitioner credentials section with editorial-desk + review-panel framing
   - `app/feed.json/route.ts` — fix author field
   - `app/layout.tsx:24` — fix metadata JSON-LD
   - `components/layout/Footer.tsx:16` — drop the "Pt. Raghav Sharma" link
   - 4 content JSONs — patch by re-running `migrate-author.ts --apply` (covers them)
   - 3 docs files — manual edit
4. **Phase 1 Step 1.1, 1.5, 2.x test steps** — pick a test runner. Recommendation: add **Vitest** (5-line install, idiomatic with Next 15 + React 19). Add to plan a new Step 1.0:

```bash
npm install --save-dev vitest @vitest/ui @vitejs/plugin-react jsdom
```

Plus a `vitest.config.ts` referencing the existing `tsconfig.json` paths, and a `"test": "vitest"` script in `package.json`. If you'd rather skip TDD and just run `tsc --noEmit` + a manual CLI smoke test, all `npx vitest` commands in the plan get replaced with manual verification — viable but loses the regression net for snippet builder.

---

## Resumption Protocol

When you start a new terminal session and want to continue this plan:

1. Open this file: `docs/superpowers/plans/2026-04-28-vastucart-editorial-backlink-network.md`
2. Find the first unchecked `- [ ]` step. That's where you resume.
3. Tell me: "continue plan at Phase X Step Y" — I'll load this file and we pick up.
4. After every step, check the box: `- [x]`. Save the file. Commit only at "Phase X ship point" markers.
5. If a step's expected output doesn't match reality, STOP and discuss before adapting. The plan is a hypothesis; the codebase is truth.

---

## Out of Scope (for this plan, on purpose)

These are real ideas — they're just not part of *this* plan to keep it shippable:

- Platform APIs for auto-posting (Medium API, Substack API). Manual paste-in is fine for the first 90 days; automate only if the manual cadence becomes the bottleneck.
- YouTube channel + Shorts pipeline. Real lever, but video is a separate skill stack — own plan when you're ready.
- Free embeddable kundali / panchang widgets for third-party sites with attribution backlinks. Highest long-term link value but requires its own design + infra plan.
- Outreach to adjacent niche sites (yoga, meditation, wedding planners) for editorial guest posts under the VastuCart Editorial byline.
- Indian-language syndication (Hindi, Marathi, Tamil) — separate translation pipeline.
- Fiverr / paid backlink services. Don't.
