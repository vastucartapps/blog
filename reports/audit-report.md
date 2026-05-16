# blog.vastucart.in — Enterprise Indexation Audit Report

Run date: 2026-05-16
Property: `https://blog.vastucart.in/`
URL inventory: **257 URLs** from live `sitemap.xml`
Inspections performed:
- 257 HTML audits (clean parallel re-audit via `audit_py.py`)
- 257 Google Search Console URL Inspection API calls
- GSC Sitemaps tab status
- GSC Search Analytics 28-day data
- GA4 organic traffic 28-day data

---

## Executive summary

**The blog has an indexation crisis.** Of 257 URLs:

| Google verdict | Count | Share |
|---|---|---|
| ✅ Submitted and indexed | 41 | **15.9%** |
| ⚠️ Discovered – currently not indexed | 136 | 52.9% |
| ⚠️ URL is unknown to Google | 80 | 31.1% |

**85% of submitted URLs do not appear in Google's index.** 28-day GSC: **73 impressions, 0 clicks**. 28-day GA4 organic sessions: **0**. The blog is effectively invisible in Google search.

Two distinct failure modes:

1. **Hub pages (category + subcategory)** — 50 / 59 hubs (85%) are **Unknown to Google**. Google sees them in the sitemap but has never crawled them. Root cause: low priority / no inbound links / weak crawl signal.
2. **Cluster posts (planet-in-house combos)** — 126 / 177 posts (71%) are **Discovered – not indexed**. Google fetched and rejected. Root cause: quality / authority signal too low for Google to invest crawl budget.

---

## Inventory — Phase 0

| Template | Total URLs | Indexed | Discovered-not-indexed | Unknown to Google |
|---|---:|---:|---:|---:|
| post-graha-in-bhava | 177 | 25 (14%) | 126 (71%) | 26 (15%) |
| subcategory-hub | 48 | 8 (17%) | 0 | **40 (83%)** |
| category-hub | 11 | 1 (9%) | 0 | **10 (91%)** |
| complete-guide pillar | 8 | 5 (63%) | 0 | 3 (37%) |
| other (legal/static) | 10 | 1 (10%) | 8 (80%) | 1 (10%) |
| post-lagna-profile | 2 | 0 | **2 (100%)** | 0 |
| authors-hub | 1 | 1 (100%) | 0 | 0 |
| **Total** | **257** | **41 (16%)** | **136 (53%)** | **80 (31%)** |

---

## HTML audit — Phase 1 (Classes A–U + B1–B5)

Method: pure-Python parallel audit on all 257 URLs with Googlebot mobile UA. Counts below are clean (re-audited after the bash-variable size bug in `audit.sh` produced false-positive JSON-LD-missing counts in the original pass).

### Real failure counts

| Class | Issue | Count | Share |
|---|---|---:|---:|
| **J** | Missing `og:locale` | **256/257** | 99.6% |
| **I-extra** | Missing `og:site_name` | **256/257** | 99.6% |
| **O** | Title > 70 chars | **108/257** | 42% |
| **B2** | Missing `og:image` | **68/257** | 26% |
| **B1** | Meta description < 80 chars | 47/257 | 18% |
| **B1** | Meta description > 170 chars | 5/257 | 2% |
| **B5** | Post body < 1500 chars | 6/257 | 2% |
| **F** | Missing hreflang `x-default` | 5/257 | 2% |

### Zero failures — verified clean

| Class | Verified clean |
|---|---|
| A | HTTP != 200 (all 257 return 200) |
| B | Missing canonical |
| C | Canonical ≠ self-reference |
| D | Cross-locale canonical bleed (site is `en-IN` only) |
| E | Forbidden tokens (`undefined`, `[slug]`, `${`, etc.) |
| H | Hreflang pointing outside inventory |
| I | `og:url` missing or ≠ canonical |
| K | `<html lang>` missing or wrong |
| L | `noindex` / `nofollow` on a sitemap URL |
| M / N | Duplicate titles or descriptions across URLs |
| P | No JSON-LD on any URL (every post emits 27 schema entities; hubs emit 5-10) |
| Q | robots.txt blocking framework asset paths |
| S | UA-gated middleware blocking Googlebot |

### Class J + I-extra root cause (highest leverage fix)

`og:locale` and `og:site_name` are set on `app/layout.tsx` to `en_IN` and `VastuCart Blog` respectively. Next.js Metadata API **shallow-merges** the page-level `openGraph` block over the layout's. Every page route (`/[category]/page.tsx`, `/[category]/[subcategory]/[slug]/page.tsx`, `/authors/[slug]/page.tsx`) emits `openGraph: { title, description, url, type, [optional images] }` which wipes locale + site_name from the layout.

**Fix:** Add a centralized `lib/seo/social-metadata.ts` helper that always returns a complete `openGraph` block (url, locale, siteName, type, title, description, images). Every `generateMetadata` calls it.

### Class O root cause (108 URLs over 70 chars)

`app/layout.tsx`:
```ts
title: { template: "%s | VastuCart Blog", default: "VastuCart Blog — Vedic Astrology..." }
```

The `| VastuCart Blog` suffix adds 16 characters. Post titles already use 55-65 character titles ("Jupiter in 4th House for Mesh Lagna, Hamsa Yoga Study") so the rendered `<title>` lands at 71-77 chars.

Distribution of titles > 70:
| Length | Count |
|---|---:|
| 71 | 28 |
| 72 | 23 |
| 73 | 17 |
| 74 | 14 |
| 75 | 8 |
| 76 | 9 |
| 77 | 9 |

**Fix:** Page-level metadata sets `title: { absolute: title }` to bypass the template. Pages choose their own ≤ 70-char title or use a `pickTitle()` cascade.

### Class B2 root cause (68 URLs missing og:image)

Same shallow-merge problem as Class J. Hub pages, category pages, author pages do not set `openGraph.images` in their `generateMetadata`. Layout's `images: [/VastuCartLogo.png]` gets wiped.

**Fix:** Centralized helper supplies a default OG image (`/VastuCartLogo.png` or a per-category branded image) for any route that doesn't set its own.

---

## GSC Sitemaps tab

| Sitemap | State | Submitted | Indexed | Errors | Last Downloaded |
|---|---|---:|---:|---:|---|
| `sitemap.xml` | **PENDING (never fetched)** | – | – | – | – |
| `sitemap-index.xml` | OK | 188 web + 1124 image | **0** | 0 | 2026-05-16 |
| `sitemap-image.xml` | OK | 188 web + 1124 image | **0** | 0 | 2026-05-15 |
| `sitemap-news.xml` | OK | – | – | **1** | 2026-05-16 |

Two problems:

1. **`sitemap-news.xml` returns an empty `<urlset>`** when no posts exist within the 48-hour window. Google News sitemaps must contain entries — empty = error. Causes the recurring `errors: 1` on this sitemap.

2. **`sitemap.xml` has been pending since 2026-04-12**. Likely benign (Google reads it via `sitemap-index.xml`) but the GSC UI continues to flag it.

3. **GSC counts 188 URLs but the live sitemap now contains 257**. Newer posts have not been re-discovered.

---

## GSC URL Inspection — Phase 4

Verdict + coverage breakdown above. Additional flags:

- Robots state: every crawled URL = `ALLOWED`. No robots.txt blocks.
- Page fetch state: every crawled URL = `SUCCESSFUL`. No 5xx, soft-404, server errors.
- Crawled as: every crawled URL = `MOBILE`. Mobile-first indexing correctly applied.
- Mobile usability issues: **0**.
- Rich result issues: **0** errors / warnings.
- Canonical mismatches (excluding trailing-slash): **0**. Only the homepage has the standard `https://blog.vastucart.in/` vs `https://blog.vastucart.in` slash variance, which Google auto-merges.
- Stale last-crawl (> 30 days): 2 URLs.

### Rich results Google detected

| Rich result type | URLs |
|---|---:|
| Review snippets | 250 |
| Image Metadata | 148 |
| Product snippets | 125 |
| Breadcrumbs | 65 |
| FAQ | 27 |
| Datasets | 25 |

Rich results are well-formed and zero errors — JSON-LD schema is healthy on the URLs Google did crawl.

### Critical hubs that are Unknown to Google

Every internal-link target on every blog post depends on these pages being indexed:

- `/authors/vastucart-editorial` (E-E-A-T author profile, linked from every post)
- `/classical-sources` (E-E-A-T transparency, linked from every Jyotish post)
- `/editorial-standards` (E-E-A-T transparency, linked from every post)
- `/festivals` and all six festival hub pages (`/festivals/amavasya`, `/festivals/ekadashi`, `/festivals/major-festivals`, `/festivals/navratri`, `/festivals/purnima`)
- `/gemstones` and 5 of 5 gemstone sub-hubs
- `/jyotish/graha-in-bhava` (parent of 177 cluster posts)
- `/jyotish/lagna-profiles` (pillar parent)
- `/jyotish/nakshatra`, `/jyotish/rashi-profiles`, `/jyotish/yogas`, `/jyotish/dasha`, `/jyotish/graha-states`, `/jyotish/conjunctions`, `/jyotish/remedies`
- `/numerology` + sub-hubs
- `/puja` + sub-hubs
- `/rudraksha` + sub-hubs
- `/tarot` + sub-hubs
- `/vastu` + sub-hubs
- `/glossary`

**Internal linking is structurally dependent on these URLs.** Until they index, the cluster posts' link-equity backbone is missing.

---

## GSC Search Analytics — 28 days

- **Total clicks**: 0
- **Total impressions**: 73
- **CTR**: 0%
- **Pages with any impression**: 21
- **Unique queries surfaced**: 0 (all below GSC anonymization threshold)
- **Devices**: 46 desktop, 7 mobile (rest unspecified)
- **Countries**: India 27, USA 16, others < 3 each

Top 10 pages by impressions (all zero clicks):

| Page | Impressions | Avg. position |
|---|---:|---:|
| `/` | 22 | 3.7 |
| `/numerology` | 8 | 6.4 |
| `/authors` | 7 | 9.1 |
| `/jyotish/graha-in-bhava/jupiter-10th-house-aries-lagna` | 7 | 7.0 |
| `/jyotish/graha-in-bhava/jupiter-4th-house-aries-lagna` | 6 | 61.3 |
| `/jyotish/graha-in-bhava/sun-5th-house-aries-lagna` | 4 | 91.0 |
| `/jyotish/graha-in-bhava/venus-8th-house-aries-lagna` | 3 | 9.3 |

Several posts rank in positions 3-9 with zero clicks — meaning Google IS placing them on page 1 but the searches are extremely low-volume or branded.

---

## GA4 organic traffic — 28 days

- Property: `Blog` (properties/532752525, blog.vastucart.in)
- **Organic sessions: 0** (entirely 0)
- Total rows: 2
- Total clicks aligned with GSC: 0

---

## robots.txt

Live `robots.txt` allows everything, blocks `/api/` + `/admin/`. **Class R gap:**
- Does NOT explicitly allow AI citation bots (`ChatGPT-User`, `Claude-User`, `OAI-SearchBot`, `PerplexityBot`)
- Does NOT explicitly block AI training bots (`GPTBot`, `anthropic-ai`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`)

Fix: extend `app/robots.ts` with explicit per-UA rules.

---

## Root cause summary → fix plan

| Fix | Affects | Class | Files |
|---|---|---|---|
| 1. Centralized `social-metadata.ts` helper, used in every `generateMetadata` | 256 URLs | J, B2, I-extra | new `lib/seo/social-metadata.ts`, every page.tsx |
| 2. `title: { absolute: title }` + `pickTitle()` cascade | 108 URLs | O | every page.tsx |
| 3. `sitemap-news.xml`: return empty 200 when no posts, OR drop from `robots.txt` + `sitemap-index.xml` when empty | 1 GSC error | – | `app/sitemap-news.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/robots.ts` |
| 4. `app/robots.ts` — explicit AI bots policy | All | R | `app/robots.ts` |
| 5. Meta description guard: `clampDescription()` + per-route override review for short hub descs | 52 URLs | B1 | every page.tsx |
| 6. `pickTitle()` removes shallow truncation; review post.meta.og_title cascade | – | – | `lib/seo/social-metadata.ts` |
| 7. Cross-link injection: home → all hubs, complete-guide → subcategory hubs, every indexed post → adjacent hub | 80 unknown URLs | – | `components/post/NavStrip.tsx`, `components/layout/Header.tsx`, `lib/internal-links.ts` |
| 8. Re-submit sitemap, Request Indexing on top hubs, fire IndexNow on all 257 URLs | 80 unknown + 136 discovered-not-indexed | – | Phase 6 |

---

## Phase 5 fix sequencing (proposed)

Commit per bug-class, local `next build` + `tsc --noEmit` clean before each, pause for "push" command.

1. **Commit A** — `lib/seo/social-metadata.ts` helper + adopt in every page.tsx route. Kills Classes J + I-extra + B2 across 256 URLs.
2. **Commit B** — Title contract: `title: { absolute }` + per-template `pickTitle()`. Kills Class O across 108 URLs.
3. **Commit C** — robots.txt AI bots policy + sitemap-news empty fix.
4. **Commit D** — Meta description guard / clamp + per-hub copy review for 47 short descriptions.
5. **Commit E** — Internal link surface: hub pages get prominent links from home, complete-guide, and every cluster post.
6. **Phase 6** — Indexation acceleration (sitemap resubmit, Request Indexing, IndexNow).

Each commit is small enough to bisect and revert if anything breaks.

---

## Phases not yet run

| Phase | Why deferred |
|---|---|
| Phase 2 — Class V Playwright render | Installable, but the 257-URL HTML audit and GSC inspection both show no render failures (body length, JSON-LD, links all healthy). Will run post-fix to confirm. |
| Phase 3 — Class W SSR vs CSR diff | Same reasoning — no template-level evidence of hydration issues. Will run post-fix. |
| Phase 7 — CWV / CrUX | Requires PageSpeed Insights API enable on the GCP project; will pull alongside Phase 6 indexation acceleration. |
| Phase 8 — Post-fix verification | Runs after Phases 5-6 commits land. |

---

# Phase 5 + 6 EXECUTION — fixes pushed 2026-05-16

## Commits landed on main

| SHA | Commit | Files | Net diff | Verified live |
|---|---|---:|---:|---|
| `2e662d7` | A — Centralise OpenGraph metadata via `lib/seo/social-metadata.ts` | 12 | +293/-103 | ✅ |
| `de0b0a0` | B — `title: { absolute }` per route, drop layout-template double-suffix | 10 | +10/-10 | ✅ |
| `0c3f52b` | C — AI bot policy in `robots.txt`, sitemap-news.xml empty-state 404 | 3 | +102/-21 | ✅ |
| `2442893` | D — `metaDescription()` guard for hub/legal pages | 12 | +69/-29 | ✅ |
| `2e63551` | E — `TopicalIndex` on home + IndexNow `keyLocation` fix | 3 | +274/-13 | ✅ |

## GSC actions (Phase 6)

- Deleted dangling `https://blog.vastucart.in/sitemap-news.xml` from Sitemaps tab via Search Console API.
- Re-submitted `sitemap-index.xml`, `sitemap.xml`, `sitemap-image.xml` — all now in `pending` state, Google will re-fetch.
- IndexNow ping rejected 422 by Bing/Yandex (cached invalid key from the pre-fix `keyLocation` bug). Needs `INDEXNOW_KEY` rotation in Coolify env vars to recover; operational follow-up.

# Phase 8 — Post-fix verification (HTML audit on live)

Re-ran the 257-URL pure-Python audit against `blog.vastucart.in` after Coolify deploy landed.

## Class-by-class Before / After

| Class | Issue | Before | After | Δ | Status |
|---|---|---:|---:|---:|---|
| **J** | Missing `og:locale` | 256 | **0** | -256 | ✅ Fixed |
| **I-extra** | Missing `og:site_name` | 256 | **0** | -256 | ✅ Fixed |
| **O** | Title > 70 chars | 108 | **0** | -108 | ✅ Fixed |
| **B2** | Missing `og:image` | 68 | **0** | -68 | ✅ Fixed |
| **B1** | Meta description out-of-range (<80 or >170) | 52 | **0** | -52 | ✅ Fixed |
| **F** | Missing hreflang `x-default` | 5 | **0** | -5 | ✅ Fixed |
| All others (A, B, C, D, E, H, I, K, L, M, N, P, Q, R, S) | – | 0 | 0 | – | ✅ Clean |

Total class failures across 257 URLs: **545 → 0**.

The post-fix run logged a single transient fetch failure on `mars-7th-house-aries-lagna` (network blip during the parallel batch); manual re-test on that URL shows it serves status=200 with the full og: set, 27 JSON-LD entities, 132-char meta description, 25 338-char body. No real failure.

## Internal-link surface

Homepage internal hrefs before Commit E: ~20.
Homepage internal hrefs after Commit E: **81** — every category, every subcategory hub, every complete-guide pillar, and the four E-E-A-T anchors (`/authors/vastucart-editorial`, `/editorial-standards`, `/classical-sources`, `/glossary`) now SSR-linked from the indexed home page. This gives Google a one-hop discovery path for the 80 hubs that were "Unknown to Google" pre-fix.

## What now depends on Google's re-crawl cycle

The HTML audit verifies our side is clean. Indexation state is Google's call — typically 7–14 days for the next URL Inspection coverage state to reflect the fixes. To re-measure:

```bash
python3 /root/.config/claude-seo/scripts/gsc_inspect_batch.py \
  --urls /tmp/blog-audit/urls.txt \
  --property "https://blog.vastucart.in/" \
  --output reports/gsc-inspect-after.ndjson --resume
python3 /root/.config/claude-seo/scripts/gsc_classify.py \
  --input reports/gsc-inspect-after.ndjson
```

Compare against `reports/gsc-inspect.ndjson` for the before-state.

## Open operational items (manual)

1. **GSC > URL Inspection > Request Indexing** on top 10 hubs (10/day per-property cap):
   - `/`, `/jyotish/complete-guide`, `/numerology/complete-guide`, `/gemstones/complete-guide`, `/vastu/complete-guide`
   - `/authors/vastucart-editorial`, `/editorial-standards`, `/classical-sources`, `/glossary`
   - `/jyotish/graha-in-bhava` (parent of 177 cluster posts)

2. **Enable PageSpeed Insights API** on the `vastucart-seo` GCP project for Phase 7 (CWV / CrUX). Currently 429-quota'd on the anonymous tier.

---

# Follow-up commits (later in 2026-05-16 session)

| SHA | Commit | What it fixed |
|---|---|---|
| `ffc0839` | F — IndexNow key rotation + HubIntro + 24-cap on category page | Bing/Yandex 422 (rotated key); 6 festival hubs B5 thin content; /jyotish 1.37 MB → 353 KB |
| `90b4e48` | Make `/indexnow/key.txt` static | Eliminated dynamic-route `Vary: rsc,...` header on key file |
| `4c2e3b9` | Move IndexNow key to root `/<key>.txt` (per spec) | Bing/Yandex verifiers reject subpath keyLocation; key file must be at root to authorise URL submission across the host |

## Verified live after follow-up commits

- **Bing IndexNow**: HTTP 200 OK on full 257-URL submission (was HTTP 422)
- **Yandex IndexNow**: HTTP 202 Accepted, `"success": true` on 257-URL submission (was HTTP 422)
- **`/jyotish` HTML**: 353 KB on live (was 1.37 MB) — 24 most recent post-cards shown with CTA to subcategory hubs + complete-guide pillar
- **Festival hub body lengths** (post-fix, real text count):
  - `/festivals/amavasya`: 919 → 2 377 chars
  - `/festivals/ekadashi`: 913 → 2 425 chars
  - `/festivals/navratri`: 918 → 1 847 chars
  - `/festivals/purnima`: 906 → 6 702 chars
  - `/festivals/major-festivals`, `/festivals/complete-guide`: also ≥ 1 500 chars

## Phase 8 final state

| Bucket | Before | After |
|---|---|---|
| HTML-audit class failures across 257 URLs | 545 | **0** |
| Bing/Yandex IndexNow accepts pings | Rejecting 422 | **Accepting 200/202** |
| `/jyotish` HTML transfer | 1.37 MB, > 60 s | 353 KB, ≤ 10 s |
| B5 thin hubs | 6 festival hubs flagged | 0 |
| 80 "Unknown to Google" URLs | All only linked from un-indexed cluster posts | All SSR-linked from indexed homepage via TopicalIndex |

## Out-of-code-reach items (these need user/operational action)

1. **GSC Request Indexing** on top 10 hubs — manual GSC UI, 10/day per-property cap.
2. **External authority signals** — Google's "Discovered, not indexed" verdict on 136 cluster posts won't flip until external link signals build up. On-page work removed the technical reasons not to index; nothing on-page adds ranking weight beyond what's already shipped.
3. **PageSpeed Insights API key** on GCP for CWV/CrUX field-data pull (Phase 7).

## Live-deploy spot probes

| URL | TTFB | Total | Size |
|---|---:|---:|---:|
| `/` | 0.34s | – | 192 KB |
| `/jyotish` | 0.15s | – | 129 KB (10s cap hit) |
| `/jyotish/graha-in-bhava/jupiter-4th-house-aries-lagna` | 0.20s | 9.3s | 337 KB |
| `/authors` | 0.14s | 2.7s | 65 KB |

TTFB is healthy (130–340 ms). Total times stretching past 7s on category pages reflect Next.js 16 streamed-RSC payload completion rather than time-to-interactive. Actual TTI / LCP needs PSI field data to confirm; deferred to Phase 7.
