# SEO tactics — VastuCart Blog

The 16 tactics that compress time-to-rank for every post. Each
tactic is enforced by either the platform code, the post checklist,
or the publish script. None are optional.

---

## A. Topical authority via cluster front-loading

**Why**: Google ranks new pages on a domain that already has
authority on the topic. Front-loading 144 Jyotish posts in 60 days
gives the domain Jyotish authority before competitors notice.

**Order of generation** (locked):

1. **Jyotish — Phase 1** (target 60 days):
   - 12 lagna profiles (the pillar pages)
   - 12 rashi profiles
   - 9 planet profiles (the planet pillar pages)
   - 9 planets × 12 lagnas in 1st house = 108 cluster posts
   - 27 nakshatra posts
2. **Festivals** — 12 dynamic festival posts (Diwali, Holi, Navratri, Ganesh Chaturthi, Raksha Bandhan, Krishna Janmashtami, Maha Shivratri, Karva Chauth, Dhanteras, Bhai Dooj, Vasant Panchami, Makar Sankranti)
3. **Gemstones** — 9 by-planet posts
4. **Rudraksha** — 14 by-mukhi posts
5. **Numerology** — 9 life path posts + 9 destiny number posts
6. **Tarot** — 22 major arcana, then 56 minor arcana over time
7. **Puja Vidhi** — Vastu Puja, Ganesh Puja, Lakshmi Puja, Diwali Puja, Saraswati Puja, Hanuman Puja, Durga Puja, Shiva Puja, then graha pujas
8. **Vastu** — 8 directions, then rooms, then remedies
9. **Jyotish — Phase 2**: 9 planets × 12 lagnas × 11 remaining houses = 1188 deep cluster posts

## B. Internal linking density

Every post links to ≥6 other blog posts and ≥6 subdomains. Pillars
get the most inbound links. Cluster pages link upward to pillars and
sideways to siblings. Enforced by `validate-post.ts` and
`internal-link-graph.ts`.

## C. Schema saturation — 22 entities per post

Plain HTML competitors emit at most 3-5 schema types. We emit 22.
Eligible for FAQPage rich result, HowTo rich result, BreadcrumbList
rich result, Article rich result, Image rich result, plus the
licensable badge. Each rich result type doubles CTR independently.

## D. DefinedTerm + DefinedTermSet — entity disambiguation

Every Sanskrit term gets a `DefinedTerm` schema entry. The umbrella
`DefinedTermSet` is the "VastuCart Jyotish glossary". Google
Knowledge Graph absorbs these. Over 6 months, the blog becomes the
canonical source for "Pratham Bhava", "Mesh Lagna", "Surya
Mahadasha", "Aditya Hridayam".

## E. IndexNow + GSC sitemap ping on publish

`scripts/post-publish.ts` pings:
- Google Search Console URL inspection API
- Bing IndexNow API (covers Bing, Yandex, Seznam, Naver)
- Direct ping to `https://www.google.com/ping?sitemap=...`

Result: pages crawled within hours instead of days.

## F. Image SEO — descriptive filename + alt + license

Locked in `IMAGE_SOP.md`. Every image is eligible for Google Image
Search rich results AND the Licensable badge. Image search has 5×
less competition than web search for astrology terms.

## G. SpeakableSpecification — voice search

Every post emits Speakable spec with cssSelector targets pointing
to the intro and pull quote. Google Assistant reads them out loud
for voice queries. Voice search competition for Vedic astrology is
near zero.

## H. EEAT signals — author Person schema

Every post has a real author with:
- Real photo (when generated)
- `Person` schema with `knowsAbout` array, `alumniOf`, `birthPlace`
- Lineage citation (Varanasi tradition, Parashari Jyotish)
- 22+ years of experience credential
- Same author across many posts (consistency)

YMYL-adjacent content (astrology is borderline) gets a major boost
from strong author signals.

## I. FAQ as long-tail query targets

Every FAQ question is itself a real Google search query. The 5 FAQ
slots are filled from "People also ask" mining (phase 2 of keyword
research). Each FAQ ranks independently of the main keyword.

## J. dateModified freshness signal

Festival posts revalidate every 24h. `dateModified` updates on every
revalidate. Google interprets fresh `dateModified` as fresh content.
Festival posts get a "Top stories" boost on the festival eve every
year, automatically.

Cluster posts revalidate quarterly. `dateModified` is bumped on
every revalidate.

## K. Anchor text variation

Never use the same exact phrase as the only anchor text for a pillar
page across multiple posts. `validate-post.ts` walks the link graph
and flags exact-match overuse.

## L. Multi-subdomain backlink moat

Cross-subdomain links count as backlinks for SEO. Every post links
to ≥6 subdomain tools. Eventually `kundali.vastucart.in` and
`panchang.vastucart.in` link back from their tool result pages,
creating a closed-loop link graph that competitors cannot replicate.

## M. H2-as-long-tail strategy

Every H2 in a post is itself a long-tail query, not an editorial
title. The post ranks for the head term via `meta.title`, but each
H2 gives one more ranking surface for one more long-tail. A 9-section
post = 9 long-tail ranking opportunities.

## N. No-padding content depth

Word count is not the goal. Answer completeness is. Our 22-entity
schema + structured blocks + LSI list + FAQ list + internal link
quotas guarantee answer completeness for the topic.

## O. CTR-optimised meta titles

Every meta title combines focus keyword + benefit + curiosity hook.
CTR is a confirmed Google ranking signal. Higher CTR pulls a page
up the SERP regardless of position.

## P. Google Discover-ready metadata

Festival posts and time-sensitive cluster posts emit:
- High-quality featured image (1200×630 minimum)
- `news_keywords` meta tag (where applicable)
- `og:image` with proper aspect ratio
- `articlePublished` and `dateModified` in schema
- Speakable spec
- Author Person schema with credentials

Festival posts hit Google Discover within 24h of publish, every year
on festival eve.

---

## Day-one ranking realism

| Query type                                  | Day-one rank target  |
|---------------------------------------------|----------------------|
| Ultra long-tail (5+ word phrase)            | Page 1               |
| FAQ rich result for exact question          | Position 0           |
| Voice search via Speakable                  | Top 3 voice answers  |
| Image search with descriptive alt + filename| Page 1 image results |
| Long-tail (4 word phrase)                   | Page 1 within 2 weeks|
| Mid-tail (3 word phrase)                    | Page 1 within 3 months |
| Head term (1-2 word phrase)                 | Page 1 within 6-12 months |

The strategy is to win the long-tail and voice and image searches
on day one, then watch the head terms rise as the cluster matures.

---

## Compounding moat

After 60 days of cluster front-loading we have:

- 144 Jyotish posts
- ~12 festival posts ranking for current year
- 1500+ internal post links forming a dense graph
- 1500+ schema entities forming a topical entity cluster
- 144 unique long-tail H2 queries each ranking independently
- 720 FAQ questions each ranking independently for "People also ask"
- 1500+ image search results (every image ranks separately)
- 9 author profile pages building EEAT
- 8 category landing pages, 50+ subcategory landing pages
- All 10 subdomains cross-linked

**Total long-tail ranking surface: ~3000 phrases on day 60.**

No single competitor can match this without 6-12 months of paid SEO
work. The moat compounds because every new post adds to every
existing pillar's link equity.

---

## Domination tactics Q-Z — LOCKED

All tactics below are committed. Each one has a thin-content
guard so we never publish boilerplate.

### Q. Programmatic long-tail clusters (LOCKED, with uniqueness gate)

Auto-scaffold the planet-in-house cluster (9 planets × 12 lagnas ×
12 houses = 1296 posts) from a single template + a per-combo data
table. Each scaffolded post is REQUIRED to contain:

- A unique opening hook (100+ words) referencing the specific
  planet's specific dignity in that specific lagna's specific
  house — generated, not templated.
- A unique data row in the kundali-visual block (planet
  position degrees, nakshatra lord, dispositor) drawn from
  actual classical references for that combo.
- A unique remedy specific to that planet + house combination,
  with the mantra, gemstone, day, and direction varying.
- A unique case anecdote in the practitioner-voice block.

The thin-content gate enforces this:

- `scripts/validate-post.ts` — `thin_content` check requires
  unique-vocabulary ratio ≥ 32%, no duplicate sentences, no
  template placeholders, ≥30 novel tokens per prose block.
- `scripts/duplicate-content-audit.ts` — cross-post 5-gram
  Jaccard overlap < 40% between any pair. Run before publish.

Post does not publish if either gate fails. Programmatic ≠ thin.

### R. Topical Map / pillar-spoke (LOCKED)

Every cluster post links UP to two pillars (lagna profile + planet
profile). Every pillar links DOWN to every cluster member. This
distributes link equity bidirectionally and signals topical
authority to Google. Pillars get sitemap priority 0.95 and weekly
changefreq via `lib/sitemap-builder.ts`.

### S. FAQ position-0 stacking (LOCKED)

Every post has 5 (or 6 for lagna) FAQs phrased as exact "People
also ask" queries. FAQPage schema is emitted by
`lib/schema-builder.ts`. Validator enforces 5 or 6 FAQs.

### T. Bilingual Hindi (DEFERRED to phase 2)

Schema-builder is ready to emit `inLanguage` per locale and
`hreflang` alternate links once Hindi posts exist. Devanagari
posts ship under `/hi/...` after the English cluster lands.

### U. Reddit + Quora seed answers (MANUAL)

Manual task per pillar. Not automated. Add to publishing
checklist.

### V. Pinterest pin per image (LOCKED)

Every entry in `image_manifest` becomes a Pinterest pin via the
`buildImageSitemap()` feed. Pin title = image alt, pin URL =
post canonical. Pinterest crawls the image sitemap, no API push
required.

### W. Calculators — REUSE EXISTING (LOCKED, no rebuild)

Calculators ALREADY exist as the FREE public tools on
`www.vastucart.in/tools/...`. The blog NEVER rebuilds them.
`kundali.vastucart.in` is the **PREMIUM kundali app** (login-gated)
and is NOT the free calculator hub.

Posts pull tools from `lib/subdomain-tools.ts` via
`relevantTools(post)` and emit them in the internal-links block.

Verified canonical calculator URLs (single source of truth):

- `https://www.vastucart.in/tools/kundli` — Free Kundali generator
- `https://www.vastucart.in/tools/lagna` — Lagna calculator
- `https://www.vastucart.in/tools/marriage-matching` — Guna milan
- `https://www.vastucart.in/tools/life-path-number` — Numerology
- `https://www.vastucart.in/tools/room-advisor` — Vastu room
- `https://www.vastucart.in/tools` — 33-tool hub
- `https://kundali.vastucart.in/` — Premium Kundali app (paid)

Every post links to ≥6 deep tools and ≥0 homepages. The validator
hard-fails homepage dumping under LINK RELEVANCE LAW (Y2 below).

### Y2. Link relevance law (LOCKED, hard-enforced)

Every link in a post must point to the most specific deep URL that
exists. NO homepage dumping. The validator's `internal_links` check
sweeps every CTA, internal-link, stotra, yantra, gemstone, and
rudraksha block and hard-fails on any link in `HOMEPAGE_URLS`.

Verified deep URL inventory by topic:

| Topic | Deep URL |
|---|---|
| Surya stotras (60) | https://stotra.vastucart.in/deity/surya |
| Aditya Hridayam | https://stotra.vastucart.in/stotra/aditya-hridayam |
| Aditya Kavacham | https://stotra.vastucart.in/stotra/aditya-kavacham |
| Aditya Stotram | https://stotra.vastucart.in/stotra/aditya-stotram |
| Dwadash Aditya | https://stotra.vastucart.in/stotra/dwadash-aditya-stotram |
| Stotra hub | https://stotra.vastucart.in/deity |
| Personal consultation | https://store.vastucart.in/consultations |
| Rudraksha malas | https://store.vastucart.in/category/prayer-beads-rosary-by-vastucart |
| Yantras | https://store.vastucart.in/category/yantras-for-vastu-prosperity-protection |
| Puja samagri | https://store.vastucart.in/category/pujan-havan-samagri |
| Hindu idols | https://store.vastucart.in/category/hindu-god-idols-murti-statues |
| Mesh daily horoscope | https://horoscope.vastucart.in/aries/daily |
| (and 11 other rashis the same way) | |
| Marriage muhurta | https://muhurta.vastucart.in/marriage-muhurta |
| Griha pravesh | https://muhurta.vastucart.in/griha-pravesh-muhurta |
| Vehicle purchase | https://muhurta.vastucart.in/vehicle-purchase-muhurta |
| Business start | https://muhurta.vastucart.in/business-muhurta |
| Education start | https://muhurta.vastucart.in/education-muhurta |
| Mundan | https://muhurta.vastucart.in/mundan-muhurta |

When a topic doesn't have a deep URL on the source subdomain, the
post must NOT link there. Examples: panchang, wedding, tarot
homepages are blocked from the validator's HOMEPAGE_URLS set right
now because their deep URLs are not yet exposed publicly. As soon
as those subdomains expose deep paths, add their roots to
HOMEPAGE_URLS so the validator catches future drift.

### X. YouTube Shorts reuse (DEFERRED)

Each post → 30-second YouTube Short generated from the intro +
top FAQ. Description links back. Deferred until after first 60
posts ship. VideoObject schema slot is already wired.

### Y. Rich-result schema variants (LOCKED)

Conditional schema emission per template (in `schema-builder.ts`):

- **Recipe** — every `puja-vidhi` template post emits Recipe
  schema (samagri-list → recipeIngredient, puja-vidhi steps →
  recipeInstructions). Qualifies for Recipe rich result.
- **Event** — every `festival` post with a resolved date emits
  Event schema. Appears in Google date-picker carousels.
- **Course** — every `gemstone` post with a wearing-ritual
  block emits Course schema. Qualifies for Course rich result.

### Z. Knowledge Graph entity unity (LOCKED)

Organization `sameAs` array now includes Wikidata + Wikipedia
entries for Hindu astrology and Vastu shastra:

```
https://www.wikidata.org/wiki/Q201930  (Hindu astrology)
https://en.wikipedia.org/wiki/Hindu_astrology
https://www.wikidata.org/wiki/Q200878  (Vastu shastra)
https://en.wikipedia.org/wiki/Vastu_shastra
```

Plus YouTube and LinkedIn channels. Author `sameAs` already
references the per-author social graph in `lib/authors.ts`.
This makes VastuCart eligible for Knowledge Graph cards on
brand searches.

---

## What the validator enforces

`scripts/validate-post.ts` runs before any post is marked ready.
Plus `scripts/duplicate-content-audit.ts` runs across the whole
content tree before bulk publish. Both gates must pass.

### Per-post checklist (validate-post.ts)

| Phase | Check | Weight |
|---|---|---|
| 1 | identity (id/slug/template/author/tags) | 5 |
| 2 | keyword brief (focus, secondary, lsi, seed, questions) | 10 |
| 4 | image manifest (filenames, alt, caption, prompts) | 10 |
| 5 | prose (word target, banned phrases, em-dash, emoji) | 15 |
| 6 | structured (FAQ count, stat-strip 4 cells) | 10 |
| 7 | 22 schema entities present | 15 |
| 8 | internal linking quotas (≥6 subdomain, ≥3 related, author) | 10 |
| 9 | meta SEO (title ≤60, desc ≤155, canonical HTTPS) | 10 |
| **9.5** | **thin content (vocab ratio, novel tokens, dupes, placeholders)** | **10** |
| 10 | voice (no encyclopedic openings) | 5 |

Total 100. Pass threshold 90. Score < 90 = post does not publish.

### Cross-post checklist (duplicate-content-audit.ts)

- 5-gram Jaccard overlap < 40% between every post pair.
- Run via `npx tsx scripts/duplicate-content-audit.ts`.
- Returns 0 on pass, 1 on fail. Wired into the publish gate.

### Hard fails (immediate disqualification)

Any of these flags the post as "do not publish" regardless of
the score total:

- em dash or en dash in any prose block
- emoji anywhere in content
- any banned phrase from the BANNED_PHRASES list
- vocabulary ratio < 32% (filler/repetition detected)
- duplicate sentences in same post
- template placeholder leaked (`{{...}}`, `${...}`, `TODO:`)
- numeric image filename (`-1.webp`)
- image alt missing or equals filename
- < 6 subdomain links
- meta.title > 60 chars or meta.description > 155 chars
- canonical not HTTPS
- > 5 missing schema entities
- prose under or over word target by tolerance
