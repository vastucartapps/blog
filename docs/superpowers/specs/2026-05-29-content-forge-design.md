# VastuCart Content Forge — Design Spec

- **Date:** 2026-05-29
- **Status:** Approved (design); pending implementation plan
- **Author:** VastuCart Editorial / Claude Code session
- **Related:** `CLAUDE.md`, `docs/POST_STANDARD.md`, `docs/INTERNAL_LINKING.md`,
  `docs/THIN_CONTENT_RULES.md`, `docs/KEYWORD_RESEARCH_SOP.md`,
  `scripts/validate-post.ts`, `scripts/duplicate-content-audit.ts`,
  `lib/schema/*`, memory `project_geo_sop_decisions`,
  `project_keyword_data_constraint`.

## 1. Goal

An autonomous, multi-agent pipeline that produces rank-worthy, AI-citable,
GEO-ready, schema-complete blog posts at cluster scale with **consistent,
"wow"-grade quality** — committing to `main` only when a post clears every
quality gate, and never losing progress if the terminal dies.

## 2. Principles (non-negotiable)

1. **Autonomous.** Runs a queue of post-specs to completion. No human gate.
   Stops only when: the operator asks, the queue/cluster is complete, or the
   terminal closes.
2. **Zero-tolerance commit.** A post reaches `status: ready` and is committed
   to `main` ONLY when it passes every gate in section 5. On failure it loops
   back to the Writer with the critique attached, up to **3 attempts**, then
   is **quarantined** (`status: draft`, logged) — substandard work never
   commits. No block, sentence, or image may be compromised.
3. **Resumable.** Every passed post is written to disk and recorded in the
   forge ledger the moment it passes. An abrupt close loses nothing; a
   re-invoke resumes the queue exactly where it stopped.

## 3. Substrate

Built on the Claude Code **Workflow** orchestrator (decision: option A).
Designed **substrate-agnostic**: each stage is a typed input→output contract
whose logic lives in prompt templates + the existing TS validators, NOT in the
Workflow harness. A future headless build (option B, Anthropic SDK, cron-able)
reuses the identical stage prompts and validators; only the orchestration shell
changes. **Option B is a deferred TODO**, not in scope here.

## 4. Pipeline stages (contracts)

Per-post stages are pipelined (an item can be in QA while the next is being
written). The cluster planner runs once per batch.

1. **Cluster planner** (per batch) →
   - In: cluster id (e.g. `meena-lagna`), existing post inventory.
   - Does: WebSearch + `seo-cluster` skill + planet×house×lagna entity graph
     to build a hub-and-spoke topic map and internal-link matrix; emits the
     ordered list of post-specs to write (skipping any already `ready`).
   - Out: `BatchPlan { posts: PostSpec[], linkMatrix }`.
2. **Keyword-wheel** (per post) →
   - In: `PostSpec`.
   - Does: calls `getKeywordData()` (adapter — today: free WebSearch +
     People-Also-Ask / related-search harvest + model knowledge +
     `lib/keyword-variations.ts`; later: DataForSEO/GSC). Estimates are
     labeled as estimates, never as measured data.
   - Out: `keyword_brief { focus, secondary[4-6], lsi/tertiary[6-12],
     paa_questions[], entities[] }` (matches existing validated shape).
3. **Writer** (per post) →
   - In: `keyword_brief`, POST_STANDARD, GEO block rules, voice rules,
     entity map, link matrix slice.
   - Does: drafts full `content[]` in template order — `tldr`, >=3
     `geo-answer`, prose, FAQ >=10, all category blocks — citing real
     classical sources, never fabricating. en-IN, brand byline, plural voice.
   - Out: draft `ArticlePost`.
4. **Schema/entity** (per post) →
   - In: draft post.
   - Does: runs `buildPostSchema`; guarantees the 18-22 entities build clean;
     verifies entity precision (DefinedTerms, sameAs) and that the
     auto-injection data fields (`category`, `subcategory`, `author_id`,
     `planet_id`, etc.) are present.
   - Out: schema-checked post.
5. **QA spine + commit** — section 5.

## 5. Zero-tolerance QA spine

A post must clear all four layers, or it loops (max 3, then quarantine):

### 5a. Mechanical gates (objective, already built)
- `validate-post.ts`: zero hard-fails; score within target.
- `duplicate-content-audit.ts`: 5-gram Jaccard < 0.40 vs every other post.
- Schema: `buildPostSchema` clean, no duplicate `@id`, exactly one FAQPage.
- GEO checklist: `tldr` present, >=3 `geo-answer`, FAQ >=10, speakable
  selectors, no banned phrase / em-dash / emoji.

### 5b. Image QA (relevance + SEO-ready, all perspectives)
Every image referenced by the post must pass:
- **Existence:** every responsive variant referenced actually exists on disk
  (no 404), correct path `/posts/{slug}/...` and `/og/{slug}.png`.
- **Relevance:** the image visually depicts what its `alt` + `caption` claim.
  Deterministic SVG cards (hero, infographic, kundali) are generated from post
  data so are relevant by construction; any photographic/generated body image
  is visually verified (open it, do not trust the filename).
- **SEO-ready:** descriptive keyworded `alt`; width/height set (CLS); WebP
  (with PNG fallback for hero/OG); file size within budget (OG <=200KB, body
  <=max width); slug-based filename; `ImageObject` schema entry with creator.
- Featured/OG image present at 1200x630 for `og:image` + Twitter.
A failure here is treated exactly like a text failure: rewrite/regen, never
commit compromised media.

### 5c. Adversarial verifiers (2-3 independent skeptics)
Each agent *tries to fail* the post on a distinct lens and returns
pass/fail + reasons:
- **Factual:** jyotish correctness vs classical rules (lordships, dignities,
  yogas, dasha logic) and internal consistency across the post.
- **GEO/citability:** is every `tldr`/`geo-answer`/FAQ answer self-contained
  and liftable? Would an AI engine quote it cleanly?
- **Wow vs generic:** is this distinctive, specific, and satisfying, or
  template filler?
Majority fail → back to Writer with critique.

### 5d. Quality judge
Scores rank-worthiness, AI-citability, reader satisfaction, and originality
against a rubric. Below bar → rewrite with the rubric gaps named.

### 5e. Commit
On all-green: write `status: ready`, write files, update ledger +
`PROGRESS.md`, then **git commit to `main`** (per post or small sub-batch)
with a descriptive message. Quarantined posts stay `draft` and are listed in
a `needs-attention` report; they are never committed.

## 6. Persistence & resumability

- **Forge ledger** `reports/forge-ledger.json`: for each post-spec —
  `{ slug, status: pending|in-progress|passed|quarantined, attempts,
  last_failures[], updated_at }`.
- Passed posts written to `content/**` immediately (durable).
- Resume = Workflow run journal (`resumeFromRunId`) + ledger: completed posts
  are skipped/cached; only `pending`/`in-progress` re-run. Kill the terminal
  mid-batch, re-invoke, it continues.
- `PROGRESS.md` updated as the human-readable mirror after each commit.

## 7. Run / stop semantics — domain-spanning

The pipeline does not stop at one cluster. It works a **master backlog** that
covers the entire domain space, advancing cluster by cluster: when one
cluster's queue empties, the cluster planner selects the next cluster from the
master order and continues, until the whole domain is written.

- **Master backlog** is derived from the locked generation order in
  `content/PROGRESS.md` plus the per-subcategory `target_post_count` in
  `lib/categories.ts` (8 categories: jyotish, numerology, tarot, vastu, puja,
  festivals, gemstones, rudraksha — and within jyotish: all lagna clusters of
  graha-in-bhava, then graha-states, conjunctions, rashi/lagna profiles,
  nakshatra, dasha, yogas, remedies). The planner diffs targets against what
  already exists on disk to compute what remains.
- The forge ledger tracks the master backlog across clusters, so progress and
  resume work at domain scale, not just within one cluster.
- **Halts only on:** explicit operator stop, the entire domain being complete,
  or terminal close. On terminal close, resume restores state (current cluster
  + position) with no lost work and continues into subsequent clusters.

## 8. First proving run, then open throttle

Start with the remaining **Meena (Pisces) lagna** graha-in-bhava cluster — the
standard is fresh and four reference posts (guru-7th, mangal-7th, mangal-10th,
shukra-7th) anchor voice and quality. The operator eyeballs the first handful;
once satisfied, the throttle opens and the pipeline proceeds autonomously
through the rest of that cluster and then every subsequent cluster in the
master backlog per section 7, until the domain is covered or the operator
stops it.

## 9. Out of scope / future

- **Option B (headless SDK pipeline, cron-able):** deferred TODO; reuses these
  exact stage contracts + validators.
- **Paid keyword data (DataForSEO/GSC):** plugs into `getKeywordData()` when
  pages index and traffic appears; no pipeline rework.
- **Generative body-image API:** if `IMAGE_API_KEY` is unset, image stage
  relies on deterministic SVG/WebP cards already generated by the repo scripts;
  photographic body images are added only when the API is configured.

## 10. Risks

- **Model-estimated keywords** can mislead without real data — mitigated by
  free WebSearch SERP/PAA harvesting and honest labeling.
- **Hallucinated jyotish facts** — mitigated by the adversarial factual
  verifier + classical-source citation requirement + no-fabrication law.
- **Cross-post duplication at scale** — mitigated by the duplicate-content
  gate running vs the full corpus before commit.
- **Token cost** of adversarial loops — bounded by the 3-attempt cap and
  pipelined fan-out.
- **Auto-commit to `main`** — accepted by operator; safety rests entirely on
  the gates, so the gates must never be weakened silently.
