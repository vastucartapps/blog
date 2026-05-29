# Content Forge — Core (Plan 1 of 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deterministic, testable foundation of the autonomous post pipeline — a forge ledger (resume), a master-backlog diff, a single programmatic "is this post commit-worthy?" gate around the existing validators, and an image-QA module — exposed via one CLI (`forge-check`).

**Architecture:** New `lib/forge/` module of small, single-responsibility units. The gate **shells out** to the existing `scripts/validate-post.ts` and `scripts/duplicate-content-audit.ts` (treated as black boxes by exit code, so the trusted gates are never weakened or duplicated). Image QA uses `sharp` (already a dependency) to verify real on-disk dimensions and file existence. The orchestrator + agents (Plan 2) will call `forge-check` / these functions; nothing here depends on Plan 2.

**Tech Stack:** TypeScript, `tsx` (v4.22), Node 24 built-in test runner (`node:test` + `node:assert`, run via `npx tsx --test`), `sharp`, `node:child_process`.

**Note on git:** `docs/` is gitignored (project `.gitignore` LAW), so this plan file is local-only and is NOT committed. All code under `lib/forge/` and `scripts/` IS tracked — commit those per task as shown.

---

## File Structure

- `lib/forge/types.ts` — shared types (PostSpec, Ledger, GateVerdict, ImageQaResult). No runtime logic.
- `lib/forge/ledger.ts` — load/save/update the resume ledger (`reports/forge-ledger.json`), atomic writes.
- `lib/forge/backlog.ts` — diff candidate post-specs against what already exists `ready` on disk.
- `lib/forge/gates.ts` — run validate-post + duplicate-audit via an injectable runner; return a `GateVerdict`.
- `lib/forge/image-qa.ts` — per-image existence / format / alt / size / real-dimension checks.
- `scripts/duplicate-content-audit.ts` — MODIFY: add `--against <file>` single-post mode.
- `scripts/forge-check.ts` — CLI that runs gates + image QA for one post and updates the ledger.
- `lib/forge/__tests__/*.test.ts` — unit tests per module.

Run all tests: `npx tsx --test "lib/forge/__tests__/*.test.ts"`

---

## Task 1: Shared types

**Files:**
- Create: `lib/forge/types.ts`

- [ ] **Step 1: Write the types**

```typescript
// lib/forge/types.ts
// Shared contracts for the Content Forge pipeline. Substrate-agnostic:
// the same types are reused by the Plan 2 orchestrator and a future
// headless (SDK) build.

export type ForgeStatus = "pending" | "in-progress" | "passed" | "quarantined";

export interface PostSpec {
  slug: string;
  category: string;
  subcategory: string;
  template: string;
  planet_id?: string;
  house_number?: number;
  lagna_id?: string;
}

export interface LedgerEntry {
  slug: string;
  status: ForgeStatus;
  attempts: number;
  last_failures: string[];
  updated_at: string; // ISO 8601
}

export interface Ledger {
  version: 1;
  entries: Record<string, LedgerEntry>; // keyed by slug
}

export interface GateResult {
  name: string;        // "validate-post" | "duplicate-content"
  passed: boolean;
  details: string[];   // failure lines (empty when passed)
}

export interface GateVerdict {
  slug: string;
  passed: boolean;     // logical AND of all results
  results: GateResult[];
}

export interface ImageQaIssue {
  file: string;
  problem: string;
}

export interface ImageQaResult {
  passed: boolean;
  issues: ImageQaIssue[];
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/forge/types.ts
git commit -m "feat(forge): shared pipeline types"
```

---

## Task 2: Ledger (resume state)

**Files:**
- Create: `lib/forge/ledger.ts`
- Test: `lib/forge/__tests__/ledger.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/forge/__tests__/ledger.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadLedger, saveLedger, upsertEntry, pendingSlugs } from "../ledger";

function tmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "forge-led-"));
}

test("loadLedger returns empty ledger when file missing", () => {
  const l = loadLedger(path.join(tmpDir(), "missing.json"));
  assert.equal(l.version, 1);
  assert.deepEqual(l.entries, {});
});

test("saveLedger then loadLedger round-trips and is atomic", () => {
  const f = path.join(tmpDir(), "ledger.json");
  let l = loadLedger(f);
  l = upsertEntry(l, "a-slug", { status: "passed", attempts: 2 }, "2026-05-29T00:00:00.000Z");
  saveLedger(l, f);
  assert.ok(!fs.existsSync(`${f}.tmp`), "tmp file removed after atomic rename");
  const back = loadLedger(f);
  assert.equal(back.entries["a-slug"].status, "passed");
  assert.equal(back.entries["a-slug"].attempts, 2);
  assert.equal(back.entries["a-slug"].updated_at, "2026-05-29T00:00:00.000Z");
});

test("upsertEntry merges over previous entry", () => {
  let l = { version: 1 as const, entries: {} };
  l = upsertEntry(l, "s", { status: "pending", attempts: 1 }, "t1");
  l = upsertEntry(l, "s", { attempts: 2, last_failures: ["x"] }, "t2");
  assert.equal(l.entries["s"].status, "pending");
  assert.equal(l.entries["s"].attempts, 2);
  assert.deepEqual(l.entries["s"].last_failures, ["x"]);
  assert.equal(l.entries["s"].updated_at, "t2");
});

test("pendingSlugs excludes only passed", () => {
  let l = { version: 1 as const, entries: {} };
  l = upsertEntry(l, "done", { status: "passed" }, "t");
  l = upsertEntry(l, "todo", { status: "quarantined" }, "t");
  assert.deepEqual(pendingSlugs(l, ["done", "todo", "new"]), ["todo", "new"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test lib/forge/__tests__/ledger.test.ts`
Expected: FAIL — cannot find module `../ledger`.

- [ ] **Step 3: Write the implementation**

```typescript
// lib/forge/ledger.ts
import fs from "node:fs";
import path from "node:path";
import type { Ledger, LedgerEntry, ForgeStatus } from "./types";

export const DEFAULT_LEDGER_PATH = path.join(process.cwd(), "reports", "forge-ledger.json");

export function loadLedger(file: string = DEFAULT_LEDGER_PATH): Ledger {
  if (!fs.existsSync(file)) return { version: 1, entries: {} };
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (data && data.version === 1 && data.entries) return data as Ledger;
  } catch {
    // corrupt ledger — fall through to empty rather than crash the run
  }
  return { version: 1, entries: {} };
}

export function saveLedger(ledger: Ledger, file: string = DEFAULT_LEDGER_PATH): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(ledger, null, 2));
  fs.renameSync(tmp, file); // atomic on same filesystem; survives mid-write kill
}

export function upsertEntry(
  ledger: Ledger,
  slug: string,
  patch: Partial<Omit<LedgerEntry, "slug">>,
  nowIso: string,
): Ledger {
  const prev: LedgerEntry =
    ledger.entries[slug] ?? { slug, status: "pending" as ForgeStatus, attempts: 0, last_failures: [], updated_at: nowIso };
  ledger.entries[slug] = { ...prev, ...patch, slug, updated_at: nowIso };
  return ledger;
}

export function pendingSlugs(ledger: Ledger, allSlugs: string[]): string[] {
  return allSlugs.filter((s) => ledger.entries[s]?.status !== "passed");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test lib/forge/__tests__/ledger.test.ts`
Expected: PASS — 4 tests, 0 fail.

- [ ] **Step 5: Commit**

```bash
git add lib/forge/ledger.ts lib/forge/__tests__/ledger.test.ts
git commit -m "feat(forge): resume ledger with atomic writes"
```

---

## Task 3: Backlog diff

**Files:**
- Create: `lib/forge/backlog.ts`
- Test: `lib/forge/__tests__/backlog.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/forge/__tests__/backlog.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isDone, remainingFromCandidates } from "../backlog";
import type { PostSpec } from "../types";

function seedContent(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "forge-content-"));
  const sub = path.join(dir, "jyotish", "graha-in-bhava");
  fs.mkdirSync(sub, { recursive: true });
  fs.writeFileSync(path.join(sub, "ready-post.json"), JSON.stringify({ slug: "ready-post", status: "ready" }));
  fs.writeFileSync(path.join(sub, "draft-post.json"), JSON.stringify({ slug: "draft-post", status: "draft" }));
  return dir;
}

const spec = (slug: string): PostSpec => ({ slug, category: "jyotish", subcategory: "graha-in-bhava", template: "planet-in-house" });

test("isDone is true only for an existing ready post", () => {
  const dir = seedContent();
  assert.equal(isDone(spec("ready-post"), { contentDir: dir }), true);
  assert.equal(isDone(spec("draft-post"), { contentDir: dir }), false);
  assert.equal(isDone(spec("missing-post"), { contentDir: dir }), false);
});

test("remainingFromCandidates returns drafts + missing, not ready", () => {
  const dir = seedContent();
  const candidates = [spec("ready-post"), spec("draft-post"), spec("missing-post")];
  const remaining = remainingFromCandidates(candidates, { contentDir: dir }).map((s) => s.slug);
  assert.deepEqual(remaining, ["draft-post", "missing-post"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test lib/forge/__tests__/backlog.test.ts`
Expected: FAIL — cannot find module `../backlog`.

- [ ] **Step 3: Write the implementation**

```typescript
// lib/forge/backlog.ts
import fs from "node:fs";
import path from "node:path";
import type { PostSpec } from "./types";

export interface RemainingOpts {
  contentDir?: string;       // default: <cwd>/content
  requireReady?: boolean;    // default: true — a post counts as done only if status === "ready"
}

function postFilePath(contentDir: string, spec: PostSpec): string {
  return path.join(contentDir, spec.category, spec.subcategory, `${spec.slug}.json`);
}

export function isDone(spec: PostSpec, opts: RemainingOpts = {}): boolean {
  const contentDir = opts.contentDir ?? path.join(process.cwd(), "content");
  const f = postFilePath(contentDir, spec);
  if (!fs.existsSync(f)) return false;
  if (opts.requireReady === false) return true;
  try {
    const post = JSON.parse(fs.readFileSync(f, "utf8"));
    return post.status === "ready";
  } catch {
    return false;
  }
}

export function remainingFromCandidates(candidates: PostSpec[], opts: RemainingOpts = {}): PostSpec[] {
  return candidates.filter((c) => !isDone(c, opts));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test lib/forge/__tests__/backlog.test.ts`
Expected: PASS — 2 tests, 0 fail.

- [ ] **Step 5: Commit**

```bash
git add lib/forge/backlog.ts lib/forge/__tests__/backlog.test.ts
git commit -m "feat(forge): master-backlog diff against on-disk ready posts"
```

---

## Task 4: Single-post mode for the duplicate-content audit

**Files:**
- Modify: `scripts/duplicate-content-audit.ts` (the `main()` function near line 85-136)

This adds `--against <file>`: compare ONE post (the one being gated, already written to `content/`) against every other post, and exit 1 only if THAT post overlaps a peer above threshold. The full-corpus mode is unchanged.

- [ ] **Step 1: Replace the `main()` function**

Replace the entire `main()` function (currently lines ~85-136) with:

```typescript
function main() {
  const args = process.argv.slice(2);
  let threshold = DEFAULT_THRESHOLD;
  let against: string | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--threshold") threshold = parseFloat(args[i + 1]);
    else if (args[i] === "--against") against = args[i + 1];
  }

  const files: string[] = [];
  walk(path.join(process.cwd(), "content"), files);

  const posts: PostInfo[] = [];
  for (const f of files) {
    try {
      const post = JSON.parse(fs.readFileSync(f, "utf8"));
      if (!post.slug) continue;
      const text = extractProse(post);
      if (text.split(/\s+/).length < 100) continue;
      posts.push({
        file: path.resolve(f),
        slug: post.slug,
        template: post.template ?? "",
        ngrams: ngrams(text, NGRAM_SIZE),
      });
    } catch {
      // skip malformed
    }
  }

  if (against) {
    const target = path.resolve(against);
    const me = posts.find((p) => p.file === target);
    if (!me) {
      console.error(`--against: ${against} not found among loaded posts (needs >=100 words of prose and a slug).`);
      process.exit(2);
    }
    const violations: { a: string; b: string; overlap: number }[] = [];
    for (const other of posts) {
      if (other.file === me.file) continue;
      const o = jaccard(me.ngrams, other.ngrams);
      if (o >= threshold) violations.push({ a: me.slug, b: other.slug, overlap: o });
    }
    violations.sort((a, b) => b.overlap - a.overlap);
    if (violations.length === 0) {
      console.log(`\x1b[32m[PASS]\x1b[0m ${me.slug}: no peer above ${threshold}.`);
      process.exit(0);
    }
    console.log(`\x1b[31m[FAIL]\x1b[0m ${me.slug} overlaps ${violations.length} peer(s) above ${threshold}:`);
    for (const v of violations) console.log(`  ${(v.overlap * 100).toFixed(1)}%  ${v.a}  ↔  ${v.b}`);
    process.exit(1);
  }

  console.log(`Loaded ${posts.length} posts. Comparing ${(posts.length * (posts.length - 1)) / 2} pairs at threshold ${threshold}.\n`);

  const violations: { a: string; b: string; overlap: number }[] = [];
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const o = jaccard(posts[i].ngrams, posts[j].ngrams);
      if (o >= threshold) violations.push({ a: posts[i].slug, b: posts[j].slug, overlap: o });
    }
  }

  violations.sort((a, b) => b.overlap - a.overlap);
  if (violations.length === 0) {
    console.log("\x1b[32m[PASS]\x1b[0m No duplicate-content pairs above threshold.");
    process.exit(0);
  }

  console.log(`\x1b[31m[FAIL]\x1b[0m ${violations.length} pair(s) above ${threshold}:`);
  for (const v of violations) {
    console.log(`  ${(v.overlap * 100).toFixed(1)}%  ${v.a}  ↔  ${v.b}`);
  }
  process.exit(1);
}
```

- [ ] **Step 2: Verify full-corpus mode still passes (regression)**

Run: `npx tsx scripts/duplicate-content-audit.ts`
Expected: `[PASS] No duplicate-content pairs above threshold.` (exit 0) — same as before the change.

- [ ] **Step 3: Verify single-post mode on a real post**

Run: `npx tsx scripts/duplicate-content-audit.ts --against content/jyotish/graha-in-bhava/guru-7th-house-pisces-lagna.json`
Expected: `[PASS] guru-7th-house-pisces-lagna: no peer above 0.4.` (exit 0).

- [ ] **Step 4: Commit**

```bash
git add scripts/duplicate-content-audit.ts
git commit -m "feat(forge): add --against single-post mode to duplicate-content audit"
```

---

## Task 5: Gate wrapper

**Files:**
- Create: `lib/forge/gates.ts`
- Test: `lib/forge/__tests__/gates.test.ts`

- [ ] **Step 1: Write the failing test (uses an injected fake runner — fast, no spawning)**

```typescript
// lib/forge/__tests__/gates.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { runGates, type ScriptRunner } from "../gates";

test("verdict passes when both gates exit 0", () => {
  const fake: ScriptRunner = () => ({ code: 0, out: "[PASS]" });
  const v = runGates("content/x/y/some-slug.json", fake);
  assert.equal(v.slug, "some-slug");
  assert.equal(v.passed, true);
  assert.equal(v.results.length, 2);
  assert.ok(v.results.every((r) => r.passed));
});

test("verdict fails and captures details when validate-post exits 1", () => {
  const fake: ScriptRunner = (script) =>
    script.includes("validate-post")
      ? { code: 1, out: "prose (10/15):\n    - prose over target\n    - banned phrase: delve" }
      : { code: 0, out: "[PASS]" };
  const v = runGates("content/x/y/bad-slug.json", fake);
  assert.equal(v.passed, false);
  const vp = v.results.find((r) => r.name === "validate-post")!;
  assert.equal(vp.passed, false);
  assert.ok(vp.details.some((d) => d.includes("prose over target")));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test lib/forge/__tests__/gates.test.ts`
Expected: FAIL — cannot find module `../gates`.

- [ ] **Step 3: Write the implementation**

```typescript
// lib/forge/gates.ts
import { spawnSync } from "node:child_process";
import path from "node:path";
import type { GateResult, GateVerdict } from "./types";

export type ScriptRunner = (script: string, args: string[]) => { code: number; out: string };

const defaultRunner: ScriptRunner = (script, args) => {
  const res = spawnSync("npx", ["tsx", script, ...args], { cwd: process.cwd(), encoding: "utf8" });
  return { code: res.status ?? 1, out: `${res.stdout ?? ""}${res.stderr ?? ""}` };
};

// Pull human-readable failure lines out of a validator's stdout.
function extractIssues(out: string): string[] {
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- ") || l.includes("↔"))
    .slice(0, 25);
}

export function runGates(postPath: string, run: ScriptRunner = defaultRunner): GateVerdict {
  const results: GateResult[] = [];

  const vp = run("scripts/validate-post.ts", [postPath]);
  results.push({ name: "validate-post", passed: vp.code === 0, details: vp.code === 0 ? [] : extractIssues(vp.out) });

  const dup = run("scripts/duplicate-content-audit.ts", ["--against", postPath]);
  results.push({ name: "duplicate-content", passed: dup.code === 0, details: dup.code === 0 ? [] : extractIssues(dup.out) });

  const slug = path.basename(postPath, ".json");
  return { slug, passed: results.every((r) => r.passed), results };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test lib/forge/__tests__/gates.test.ts`
Expected: PASS — 2 tests, 0 fail.

- [ ] **Step 5: Integration check against the real validators**

Run: `npx tsx -e "import('./lib/forge/gates.ts').then(async m => { const v = m.runGates('content/jyotish/graha-in-bhava/guru-7th-house-pisces-lagna.json'); console.log(JSON.stringify(v.results.map(r=>[r.name,r.passed]))); process.exit(v.passed?0:1); })"`
Expected: `[["validate-post",true],["duplicate-content",true]]`, exit 0.

- [ ] **Step 6: Commit**

```bash
git add lib/forge/gates.ts lib/forge/__tests__/gates.test.ts
git commit -m "feat(forge): programmatic gate wrapper over the trusted validators"
```

---

## Task 6: Image QA

**Files:**
- Create: `lib/forge/image-qa.ts`
- Test: `lib/forge/__tests__/image-qa.test.ts`

Deterministic checks per `image-figure` block: file exists on disk (no 404), `.webp`, descriptive alt (present, not equal to filename), file size <= 200KB, and the real pixel dimensions (read with `sharp`) match the declared `width`/`height` (CLS correctness). Visual *relevance* of photographic images is NOT done here — that is a Plan 2 adversarial image agent; SVG-derived cards are relevant by construction.

- [ ] **Step 1: Write the failing test (uses the real reference post + its real on-disk webp)**

```typescript
// lib/forge/__tests__/image-qa.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkImages } from "../image-qa";

// The career-infographic webp really exists on disk at 1200x800.
const GOOD_BLOCK = {
  type: "image-figure",
  filename: "guru-7th-house-pisces-lagna-career-infographic.webp",
  width: 1200,
  height: 800,
  alt: "Jupiter in 7th house career fits infographic for Meena Lagna natives",
};
// This webp is referenced by the post but NOT on disk — must be flagged.
const MISSING_BLOCK = {
  type: "image-figure",
  filename: "guru-7th-house-pisces-lagna-north-indian-kundali.webp",
  width: 1024,
  height: 1024,
  alt: "North Indian kundali chart highlighting Jupiter in the seventh house",
};

test("passes for an existing webp with correct declared dimensions", async () => {
  const post = { slug: "guru-7th-house-pisces-lagna", content: [GOOD_BLOCK] };
  const r = await checkImages(post);
  assert.equal(r.passed, true, JSON.stringify(r.issues));
});

test("flags a referenced image that does not exist on disk", async () => {
  const post = { slug: "guru-7th-house-pisces-lagna", content: [MISSING_BLOCK] };
  const r = await checkImages(post);
  assert.equal(r.passed, false);
  assert.ok(r.issues.some((i) => i.problem.includes("missing")));
});

test("flags alt that equals the filename", async () => {
  const post = {
    slug: "guru-7th-house-pisces-lagna",
    content: [{ ...GOOD_BLOCK, alt: GOOD_BLOCK.filename }],
  };
  const r = await checkImages(post);
  assert.equal(r.passed, false);
  assert.ok(r.issues.some((i) => i.problem.includes("alt")));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test lib/forge/__tests__/image-qa.test.ts`
Expected: FAIL — cannot find module `../image-qa`.

- [ ] **Step 3: Write the implementation**

```typescript
// lib/forge/image-qa.ts
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import type { ImageQaIssue, ImageQaResult } from "./types";

const MAX_BYTES = 200 * 1024;

interface ImageFigureLike {
  type: string;
  filename?: string;
  width?: number;
  height?: number;
  alt?: string;
}
interface PostLike {
  slug: string;
  content?: ImageFigureLike[];
}

export async function checkImages(post: PostLike, opts: { publicDir?: string } = {}): Promise<ImageQaResult> {
  const publicDir = opts.publicDir ?? path.join(process.cwd(), "public");
  const issues: ImageQaIssue[] = [];
  const blocks = post.content ?? [];

  for (const b of blocks) {
    if (b.type !== "image-figure" || !b.filename) continue;
    const rel = `posts/${post.slug}/${b.filename}`;
    const abs = path.join(publicDir, "posts", post.slug, b.filename);

    if (!b.filename.endsWith(".webp")) issues.push({ file: rel, problem: "not .webp" });
    if (!b.alt || !b.alt.trim()) issues.push({ file: rel, problem: "missing alt text" });
    else if (b.alt.trim().toLowerCase() === b.filename.toLowerCase()) issues.push({ file: rel, problem: "alt equals filename (not descriptive)" });

    if (!fs.existsSync(abs)) {
      issues.push({ file: rel, problem: "file missing on disk (would 404)" });
      continue;
    }

    const bytes = fs.statSync(abs).size;
    if (bytes > MAX_BYTES) issues.push({ file: rel, problem: `file too large ${Math.round(bytes / 1024)}KB > 200KB` });

    try {
      const meta = await sharp(abs).metadata();
      if (b.width && meta.width !== b.width) issues.push({ file: rel, problem: `width ${meta.width} != declared ${b.width} (CLS risk)` });
      if (b.height && meta.height !== b.height) issues.push({ file: rel, problem: `height ${meta.height} != declared ${b.height} (CLS risk)` });
    } catch (e) {
      issues.push({ file: rel, problem: `unreadable image: ${(e as Error).message}` });
    }
  }

  return { passed: issues.length === 0, issues };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx --test lib/forge/__tests__/image-qa.test.ts`
Expected: PASS — 3 tests, 0 fail. (If the "passes" test fails on a dimension mismatch, the declared width/height in the test must match the real file; read it with `npx tsx -e "import('sharp').then(s=>s.default('public/posts/guru-7th-house-pisces-lagna/guru-7th-house-pisces-lagna-career-infographic.webp').metadata().then(m=>console.log(m.width,m.height)))"` and update GOOD_BLOCK.)

- [ ] **Step 5: Commit**

```bash
git add lib/forge/image-qa.ts lib/forge/__tests__/image-qa.test.ts
git commit -m "feat(forge): deterministic image QA (existence, dims, size, alt)"
```

---

## Task 7: `forge-check` CLI

**Files:**
- Create: `scripts/forge-check.ts`

Ties gates + image QA together for ONE post and records the result in the ledger. This is the single entry point Plan 2's orchestrator calls per post before deciding to commit.

- [ ] **Step 1: Write the implementation**

```typescript
#!/usr/bin/env tsx
// scripts/forge-check.ts
// Run every commit gate for ONE post and update the forge ledger.
// Exit 0 => commit-worthy. Exit 1 => not (failures printed + recorded).
import fs from "node:fs";
import path from "node:path";
import { runGates } from "../lib/forge/gates";
import { checkImages } from "../lib/forge/image-qa";
import { loadLedger, saveLedger, upsertEntry } from "../lib/forge/ledger";

async function main() {
  const postPath = process.argv[2];
  if (!postPath) {
    console.error("usage: forge-check.ts <post.json>");
    process.exit(2);
  }
  const post = JSON.parse(fs.readFileSync(postPath, "utf8"));
  const slug: string = post.slug ?? path.basename(postPath, ".json");

  const verdict = runGates(postPath);
  const img = await checkImages(post);
  const allPassed = verdict.passed && img.passed;

  const failures = [
    ...verdict.results.filter((r) => !r.passed).flatMap((r) => r.details.map((d) => `${r.name}: ${d}`)),
    ...img.issues.map((i) => `image-qa: ${i.file} — ${i.problem}`),
  ];

  const nowIso = new Date().toISOString();
  let ledger = loadLedger();
  const prevAttempts = ledger.entries[slug]?.attempts ?? 0;
  ledger = upsertEntry(
    ledger,
    slug,
    { status: allPassed ? "passed" : "pending", attempts: prevAttempts + 1, last_failures: failures },
    nowIso,
  );
  saveLedger(ledger);

  if (allPassed) {
    console.log(`[FORGE PASS] ${slug}`);
    process.exit(0);
  }
  console.log(`[FORGE FAIL] ${slug}`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

main();
```

- [ ] **Step 2: Smoke test — it must FAIL guru-7th on the two missing images**

Run: `npx tsx scripts/forge-check.ts content/jyotish/graha-in-bhava/guru-7th-house-pisces-lagna.json`
Expected: `[FORGE FAIL]` with two `image-qa: ... file missing on disk (would 404)` lines (the kundali + yellow-sapphire webps). Exit 1. Confirm `reports/forge-ledger.json` now has a `guru-7th-house-pisces-lagna` entry with `status: "pending"` and those failures recorded. This proves the gate catches compromised media before commit.

- [ ] **Step 3: Add convenience npm scripts**

In `package.json` `scripts`, add:

```json
    "test:forge": "tsx --test \"lib/forge/__tests__/*.test.ts\"",
    "forge:check": "tsx scripts/forge-check.ts"
```

- [ ] **Step 4: Run the full forge test suite**

Run: `npm run test:forge`
Expected: all tests across ledger, backlog, gates, image-qa PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/forge-check.ts package.json
git commit -m "feat(forge): forge-check CLI (gates + image QA + ledger)"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- §2 zero-tolerance commit gate → Tasks 5 (gates) + 6 (image QA) + 7 (forge-check aggregates; exit code = commit-worthy).
- §3 substrate-agnostic contracts → Task 1 types; pure functions, no Workflow dependency.
- §5a mechanical gates → Task 5 (shells the real validators) + Task 4 (single-post dup mode).
- §5b image QA (existence, dims, size, alt) → Task 6. Relevance of photos is explicitly deferred to Plan 2 (adversarial image agent) — noted, not silently dropped.
- §6 persistence/resume → Task 2 ledger (atomic) + `pendingSlugs`; Task 7 records every check.
- §7 master backlog diff → Task 3 `remainingFromCandidates`. (Per-category slug *enumeration* belongs with the planner in Plan 2 — boundary noted.)
- §5c/§5d adversarial verifiers + quality judge, §4 stage prompts, orchestration loop, auto-commit to main, domain-spanning advance → **Plan 2** (out of scope here, by design).

**Placeholder scan:** none — every code step has complete code; every run step has an exact command + expected output.

**Type consistency:** `Ledger`/`LedgerEntry`/`ForgeStatus` (Task 1) used identically in Tasks 2 & 7. `GateResult`/`GateVerdict` (Task 1) match `gates.ts` (Task 5) and its consumption in Task 7. `ImageQaIssue`/`ImageQaResult` (Task 1) match `image-qa.ts` (Task 6) and Task 7. `ScriptRunner` defined in Task 5, used in its own test. `remainingFromCandidates`/`isDone` names consistent across Task 3 and its test.

**Known limitations (carry to Plan 2):** the duplicate-content audit's `extractProse` ignores `tldr`/`geo-answer` text; acceptable now (those blocks are short + distinct) but Plan 2 may extend it. `new Date()` is used in `forge-check.ts` and `ledger` callers — fine in plain Node scripts; the Workflow orchestrator in Plan 2 must pass timestamps in instead (Date is restricted inside Workflow scripts).
