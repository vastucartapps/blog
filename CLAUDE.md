# VastuCart Blog — Claude Code Master Reference

## Project Identity
- Site: blog.vastucart.in
- Stack: Next.js 15, PostgreSQL/Prisma, Tailwind CSS, Framer Motion
- Content lives in: /content/{category}/{slug}.json
- Platform code lives in: /app, /components, /lib, /scripts

## Brand Rules — NON-NEGOTIABLE
- Colors: always CSS variables, never hardcoded hex
- Fonts: Playfair Display (headings), Inter (body), Lora (verse/quotes)
- Diamond pattern: class="diamond-bg" on all dark sections
- NO emoji anywhere in post content or UI
- NO em dashes anywhere — use commas or full stops
- NO AI filler phrases (never use: "it is worth noting", 
  "it is important to understand", "delve", "tapestry", 
  "realm", "dive into", "in conclusion", "furthermore")
- SVG icons only, never emoji as icons
- Sanskrit terms: italicised on first use with English in parentheses

## Voice — Every Post

Byline (STRICT, locked 2026-04-28): every post is signed
**VastuCart Editorial**. Jyotish posts are additionally credited
**Reviewed by VastuCart Jyotish Review Panel**.

NEVER reintroduce a named individual practitioner (real or fake) as
the author. NEVER use "Pt. Raghav Sharma", "Varanasi", or
"22 years of practice" — these were scrapped as E-E-A-T spam risks.
The strict rule and rationale live in
`memory/feedback_author_entity.md` and `lib/authors.ts`.

Voice rules (independent of byline):
- Warm, direct, practitioner-to-student register
- Plural voice ("we", "our practice", "our panel"). NEVER first-person
  singular ("I", "my consultations"). Singular voice + brand byline
  reads as undisclosed ghost-writing
- Specific knowledge, not generic statements
- Each section flows naturally into the next
- Minimum 1800 words prose per planet-in-house post

## Asset Paths (actual files in public/)
- Logo: /VastuCartLogo.png
- Zodiac icons: /zodiac-icons/{sign-slug}.webp
  mesha, vrishabha, mithuna, karka, simha, kanya,
  tula, vrishchika, dhanu, makara, kumbha, meena
- Nakshatras: /nakshatras/{number}-{name-slug}.webp
- Gemstones: /gemstones/{stone-slug}.png
  ruby, pearl, coral, emerald, yellow-sapphire,
  diamond, blue-sapphire, hessonite, cats-eye

## VastuCart Network (inject as internal links)
- kundali.vastucart.in — Free Kundali generator
- horoscope.vastucart.in — Rashi horoscopes  
- panchang.vastucart.in — Daily panchang
- muhurta.vastucart.in — Muhurta calculator
- tarot.vastucart.in — Tarot readings
- stotra.vastucart.in — Stotras and mantras
- store.vastucart.in — Gemstones and rudraksha shop
- vastucart.in — 33 free Vastu + astrology tools
- wedding.vastucart.in — Wedding muhurta

## Content Progress Tracking
Always read /content/PROGRESS.md before generating any post.
Always update /content/PROGRESS.md after generating posts.
Never regenerate a post that is already listed as DONE.

## Session Workflow
1. Read this file (CLAUDE.md)
2. Read /content/PROGRESS.md
3. Read the relevant template from /templates/
4. Read the relevant taxonomy JSON files from /lib/taxonomy/
5. Generate content
6. Save to correct /content/ path
7. Update /content/PROGRESS.md

## POST STANDARD — Read before generating any post

The post visual + content + schema contract is locked in two files:
- `docs/POST_STANDARD.md` — JSON shape, content block order, schema
  entities required, voice rules, internal linking quotas.
- `docs/INTERNAL_LINKING.md` — URL contract, cluster linking rules,
  anchor text rules, slug validation.

Every new post must:
1. Match the JSON shape in `docs/POST_STANDARD.md`. The shape never
   changes per post. The visual is automatic.
2. Hit every internal linking quota in `docs/INTERNAL_LINKING.md`.
3. Use `lib/internal-links.ts` helpers for URLs. Never hardcode.
4. Emit all 18 JSON-LD schema entities listed in
   `docs/POST_STANDARD.md` (Article, FAQPage, BreadcrumbList, Person,
   Organization, WebPage, WebSite, ProfilePage, Thing, 3+ DefinedTerm,
   2 HowTo, 3 Product, Service, SpeakableSpecification, ImageObject).
5. Reference real assets (gemstone PNGs in `public/gemstones/`,
   zodiac webp in `public/zodiac-icons/`, nakshatra webp in
   `public/nakshatras/`, OG image at `public/og/{slug}.png`).
6. Include exactly the content block order from
   `docs/POST_STANDARD.md` for the post template.

## CALCULATOR LAW — never rebuild, always link

Calculators (kundli, lagna, marriage matching, life-path-number,
room-advisor, etc.) already exist as the FREE tools on
`https://www.vastucart.in/tools/...`. The blog NEVER rebuilds them.

`kundali.vastucart.in` is the **PREMIUM** kundali app (login-gated
dashboard), not the free generator. NEVER swap them. NEVER link to
`kundali.vastucart.in/lagna-calculator` or similar invented paths.

Posts pull tools from `lib/subdomain-tools.ts` via `relevantTools(post)`
and emit them in the internal-links block. The canonical URL map for
every tool lives in `lib/subdomain-tools.ts` and in
`memory/project_subdomain_url_map.md`.

## SITEMAP CACHE LAW — never fabricate URLs

Every partner-subdomain URL used in any post MUST exist in
`data/sitemaps/index.json` (generated by
`scripts/build-sitemap-cache.ts` from raw sitemap XML). Never
guess a URL. Never use a URL pattern "because it should work".
The validator hard-fails any post with a URL pointing at a
cached host (stotra, store, muhurta, wedding, tarot, www) that
is not present in the cache.

**Workflow when picking a URL:**

1. Decide which partner subdomain is the topic match
2. Run `grep '<topic>' data/sitemaps/index.json` OR use
   `findUrls(["stotra", "mangal"], 10)` from
   `lib/sitemap-cache.ts` to list matches
3. Pick the most relevant URL from the list
4. NEVER type a URL you have not verified in the cache

**Cache hosts** (verified, URL lookup enforced):
`stotra.vastucart.in`, `store.vastucart.in`/`vastucart.com`
(aliased), `muhurta.vastucart.in`, `wedding.vastucart.in`,
`tarot.vastucart.in`, `www.vastucart.in`.

**Uncached hosts** (no working sitemap, homepage only):
`panchang.vastucart.in`, `horoscope.vastucart.in`,
`kundali.vastucart.in`. Posts may only link to these as
`https://host.vastucart.in/` or `https://host.vastucart.in/aries/daily`
if previously verified manually.

**Regenerate the cache** when partner sites update:
```bash
# 1. Re-download raw sitemaps
for h in stotra store muhurta wedding tarot www; do
  curl -sk "https://${h}.vastucart.in/sitemap.xml" \
    > data/sitemaps/${h}.raw.xml
done
# 2. Rebuild index
npx tsx scripts/build-sitemap-cache.ts
```

## GEMSTONE IMAGE LAW — slug must map to real file

Every `image_slug` in every gemstone card must correspond to an
existing file in `public/gemstones/`. The validator reads the
list `VALID_GEMSTONE_SLUGS` from `lib/sitemap-cache.ts` and
hard-fails any post with an unknown slug.

**Valid slugs** (as of now):
`blue-sapphire`, `cats-eye`, `diamond`, `emerald`, `hessonite`,
`opal`, `pearl`, `red-coral`, `ruby`, `yellow-sapphire`.

For secondary "alternative" gemstones (amethyst, moonstone,
garnet, topaz, etc.) that do not have their own files, use the
closest valid primary slug (e.g. amethyst → blue-sapphire,
moonstone → pearl, red-garnet → red-coral). NEVER invent a
new slug.

To add a new gemstone: drop the `.webp` file into
`public/gemstones/`, add the slug to `VALID_GEMSTONE_SLUGS` in
`lib/sitemap-cache.ts`, and regenerate the cache.

## LINK RELEVANCE LAW — no homepage dumping

Every link in a post must be the most specific deep URL that exists
for that topic. A Surya post links to:

- `https://stotra.vastucart.in/deity/surya` (NOT `stotra.vastucart.in/`)
- `https://stotra.vastucart.in/stotra/aditya-hridayam`
- `https://store.vastucart.in/consultations` (NOT `store.vastucart.in/`)
- `https://store.vastucart.in/category/prayer-beads-rosary-by-vastucart`
  (NOT `store.vastucart.in/`)
- `https://store.vastucart.in/category/yantras-for-vastu-prosperity-protection`
- `https://horoscope.vastucart.in/aries/daily` (for Mesh natives)

The validator hard-fails any post that contains:

- More than 1 homepage URL in its `internal-links` block
- ANY homepage URL in a CTA block, kundali-visual cta_url,
  stotra.url, yantra.cta_url, gemstone.shop_url, or rudraksha.cta_url

Hard-coded set in `lib/subdomain-tools.ts` `HOMEPAGE_URLS`. To
discover deep URLs, fetch the live sitemap of the target subdomain
or check `memory/project_subdomain_url_map.md`. Never invent paths.

## SCHEMA LAW — single source of truth, no duplicates

`lib/schema-builder.ts` `buildPostSchema(post)` is the ONLY source
for JSON-LD on a post page. The post page route emits each entity
as its own `<script type="application/ld+json">` tag.

Hard rules (validator-enforced):

1. NEVER add a `post.schema` field that gets rendered separately —
   that pattern produced duplicate FAQPage + "Invalid top level
   element 'array'" errors in Google Rich Results Test.
2. NEVER use HTML microdata (`itemScope`, `itemType`, `itemProp`)
   in any component — Google parses it as a parallel entity and
   creates duplicates with the JSON-LD.
3. Every `Product` MUST have `aggregateRating` + `review` and a
   `brand`. NEVER include `offers.price` — that triggers Google's
   merchant listing parser which then complains about missing SKU,
   shipping, return policy, etc. We pick the **Product Snippet**
   rich result path (descriptive product, not buyable from this
   domain). The visible "Buy / Consult" button still routes to
   `store.vastucart.in/consultations` — that's the customer path,
   not the schema path.
4. No duplicate `@id` across the entity array — validator hard-fail.
5. Exactly one `FAQPage` per post — validator hard-fail on more.
6. Each `<script type="application/ld+json">` contains exactly ONE
   object — never `JSON.stringify(array)`.

When a post needs an entity type the schema-builder doesn't
synthesize, ADD a content block that the schema-builder reads
(e.g., add a `puja-vidhi` or `wearing-ritual` block to get HowTo,
not a hand-written `howto_remedies` schema field).

**Locked schema template**: `docs/SCHEMA_TEMPLATE.md` is the
canonical reference. It contains the verified-clean output of
`buildPostSchema()` for every entity type — zero errors and zero
non-critical warnings on Google Rich Results Test. Diff any
broken post against this template to find the bug. Regenerate
with `npx tsx scripts/dump-schema.ts <post.json>`.

## THIN CONTENT LAW

Programmatic ≠ thin. Every post — including the 1296 planet-in-house
combos — must pass:

- `scripts/validate-post.ts` thin_content check (vocab ratio ≥ 32%,
  ≥30 novel tokens per block, no duplicate sentences, no template
  placeholders).
- `scripts/duplicate-content-audit.ts` (5-gram Jaccard overlap < 40%
  between every post pair).

Both gates must pass before bulk publish. Rules in
`docs/THIN_CONTENT_RULES.md`.

## GEO / AI-SEARCH LAW (added 2026-05-29)

Google now answers many queries with AI-synthesized summaries and
LLMs cite sources directly. Posts must be **liftable and citable by a
machine reader** while reading as a confident human expert. Concretely:

- Every post carries a **`tldr`** block (self-contained 40-75 word
  direct answer, class `.tldr`) near the top, and **3-5+ `geo-answer`**
  blocks (question-style H2 + 40-75 word liftable answer, class
  `.geo-answer`). Answer FIRST, then context. Defined in `lib/types.ts`;
  rendered by `TldrBlock.tsx` / `GeoAnswer.tsx`. `tldr`/`geo-answer`
  are exempt from the prose ceiling (liftable answer surfaces).
- **FAQ floor is >=10** PAA-style questions (was 5/6); more is better
  when each is distinct and earns its place. Each answer opens with a
  <=40-word sentence. Reference build (4 Meena posts, 2026-05-29):
  4 geo-answers + 13 FAQ each.
- **SpeakableSpecification** targets `.tldr`, `.geo-answer`, `.faq-answer`.
- **Outbound authority links** are allowed ONLY to the validator's
  `EXTERNAL_LINK_WHITELIST` (Wikipedia, vedabase.io, wisdomlib.org,
  archive.org). For this niche, "authority" = classical Sanskrit
  sources. NEVER fabricate a statistic, study, or source.
- `robots.txt` allows all AI **citation** bots, blocks all **training**
  bots (`app/robots.ts`). Do not change without operator sign-off.
- `/llms.txt` (`app/llms.txt/route.ts`) is generated from published
  posts and must stay current.
- Rationale + the full additive decision log: `memory/project_geo_sop_decisions.md`
  and `templates/BLOG_ARTICLE_SOP.md`. The SOP is additive — never let
  it override a locked rule (byline, schema law, no-em-dash, en-IN).

## SOP REFERENCE FILES

- `docs/POST_STANDARD.md` — JSON shape, content order, voice, 22 schema
- `docs/POST_CHECKLIST.md` — bit-level pre-flight 12-phase checklist
- `docs/IMAGE_SOP.md` — image manifest, filename, alt, dimensions
- `docs/SEO_TACTICS.md` — 16 + Q-Z tactics, all locked
- `docs/SEMANTIC_SEO.md` — entity-first writing, topical depth
- `docs/KEYWORD_RESEARCH_SOP.md` — keyword brief generation phases
- `docs/THIN_CONTENT_RULES.md` — uniqueness gates, duplication audit
- `docs/INTERNAL_LINKING.md` — URL contract + cluster rules

## INTERNAL LINKING LAW — automatic, every post, every terminal

The blog runs an **enterprise auto-injection mechanism** so every
post gives and receives links automatically, regardless of which
terminal authored it, which category it belongs to, or which day
it was created. Authors do NOT manually wire pillar/category/author
links into post.json — the render layer guarantees them.

**Layers (all four are automatic):**

1. **Pillar nav-strip** (`lib/internal-links.ts` `pillarStripLinks()`,
   rendered by `components/post/NavStrip.tsx`). Auto-injected by
   `BlockRenderer` immediately above the related-posts block on
   every post. Always emits four links: subcategory hub, category
   landing, category complete-guide pillar, author profile.

2. **Cross-category bridges** (`crossCategoryBridgeCandidates()`).
   Driven by the post's `planet_id`, `ruling_planet`, or `number`
   field. Numerology Life Path 1 bridges to Jyotish Surya pillar +
   Ruby gemstone listing. Jyotish planet posts bridge to the matching
   Numerology life path + gemstone. Bridges are validated against
   `getPostBySlug()` before render — broken targets degrade silently.

3. **Auto prose linking** (`lib/auto-prose-linker.ts`
   `autoLinkProseHtml()`). Server-side post-processor that walks
   every prose / scannable-prose / pull-quote block and wraps the
   FIRST occurrence of every recognised taxonomy entity (planet
   names, lagna names, sanskrit house names) in an `<a>` tag.
   Subsequent occurrences stay plain text so prose doesn't sea-of-blue.

4. **Hero tag fallback** (`PostHero.tsx` + `tagUrl()`). Every hero
   tag chip is clickable: known entities resolve via
   `resolveEntityLink()`; unknown labels fall through to the
   `/tag/{slug}` listing page (`app/tag/[slug]/page.tsx`).

**The validator enforces the data fields** the auto-injection
depends on (see `scripts/validate-post.ts` `enterprise_links` check,
weight 5). Hard-fails any post that lacks:

- `category`, `subcategory`, `author_id` (universal)
- `planet_id` for jyotish/graha-in-bhava
- `ruling_planet` + `number` for numerology/life-path
- `planet_id` for gemstones/by-planet

**Why this exists:** parallel terminals create posts on different
days. Without code-level enforcement, link consistency drifts. The
auto-injection means every post — at the moment it renders — emits
the same standard outbound link surface.

**Subdomain network linking** stays explicit (per-post
`internal-links` block, ≥6 tools, validated against the sitemap
cache). The auto-mechanism handles ONLY blog-internal links.

**Cluster fundamentals (still required in JSON):**
- Cluster pillar pages: lagna profile is pillar for 108 planet-in-house
  posts; planet profile is pillar for 144 planet posts. Both
  referenced from each post.
- Adjacent linking: every planet-in-house post links to prev/next
  house and next lagna version in `related-posts`.
- Author cluster: post → author page → all posts by author.

## IMAGE STANDARD (SEO)

- Featured image: `/og/{slug}.png`, 1200×630, ≤200 KB. Used as
  `og:image` and Twitter card.
- In-body images: `/posts/{slug}/{name}.webp`, max 800px wide, lazy
  loaded via `next/image`.
- Generative API workflow: when generative image API is configured,
  every post auto-generates a featured image and 2 to 4 in-body
  illustrations during generation. Files saved to
  `public/posts/{slug}/`. Cropped + compressed before save.
- Every image gets:
  - Real `alt` attribute (descriptive, not filename).
  - `ImageObject` schema entry under `post.schema.image_objects`.
  - Width and height attributes for CLS prevention.
  - WebP format with PNG fallback for hero images.
- Every image filename uses the post slug + a descriptive suffix:
  `sun-1st-house-aries-lagna-hero.webp`,
  `sun-1st-house-aries-lagna-kundali-chart.webp`, etc. Filenames are
  themselves SEO signals.

## PER-CATEGORY COLOR SYSTEM

Same layout, different visual energy per category. Defined as
`color_var` on each category in `lib/categories.ts`. Components
look up the accent palette via the category color name.
Current category color slots:
- Jyotish: saffron (warm authority)
- Numerology: teal (analytical)
- Tarot: rose (intuitive)
- Vastu: gold (architectural)
- Puja: saffron (devotional)
- Festivals: rose (celebratory)
- Gemstones: teal (precious)
- Rudraksha: gold (sacred)

User will provide refined color tokens per category. The slots are
already wired through `lib/categories.ts`.

## CATEGORY SYSTEM — 8 categories only

The blog has exactly 8 categories. No more, no fewer. They are:
`jyotish`, `numerology`, `tarot`, `vastu`, `puja`, `festivals`,
`gemstones`, `rudraksha`.

**Stotra is NOT a category.** Stotras live on `stotra.vastucart.in`.
The blog has a `StotraSection` *component* that appears inside Jyotish
posts and links out to `stotra.vastucart.in`. That is the only place
stotras appear on the blog.

Chalisas and kavachas are also stotra-domain content. They live on
`stotra.vastucart.in`, not on the blog.

## THEME SYSTEM

Every category has a theme defined in `lib/category-themes.ts`. Use
`getTheme(category)` to read it. Themes change colour and accent only
— layout is frozen across all categories. Components that accept a
`category` prop and apply the theme:

- `PostHero` — heroBg, glow, badge, h1 em, tags
- `CategoryHero` — heroBg, glow, badge, icon medallion, count colour
- `StatStrip` — stat label colour
- `Divider` (gem="accent") — gem colour
- `BlockRenderer` (passes category through to per-category sections)

Never hardcode a hex value in a component. Always read from theme or
from a CSS variable.

## FESTIVAL POSTS — DYNAMIC, NEVER HARDCODED YEAR

Festival JSONs use `dynamic: true` and `festival_key`. The festival
route `/festivals/[slug]` calls `lib/festival-resolver.ts` at render
time and revalidates every 24 hours (`revalidate = 86400`). Year is
read from the panchang API on every revalidation.

- **Canonical URL**: `/festivals/{slug}`. Never `/festivals/{slug}-2025`.
- **Page title**: built dynamically as `${name} ${year} — Date,
  Muhurta, Puja Vidhi`.
- **Stat strip**: festival, current year, current tithi, current
  muhurta — all from the resolver, none hardcoded.

Source of truth: `lib/festival-resolver.ts`,
`lib/panchang-client.ts`, `app/(blog)/festivals/[slug]/page.tsx`.

## .gitignore LAW

These directories are local-only. They are NOT pushed to the remote:

- `public/` brand assets, logos, gemstone PNGs, zodiac webp,
  nakshatra images, og/, posts/, reference/, the design reference HTML
- `content/` generated post JSON files
- `docs/` internal SOPs and standards
- `.cache/` panchang and image cache
- `.claude/` Claude Code session data

These rules are in `.gitignore`. Never remove them. Never suggest
committing these folders.

## PER-CATEGORY UNIQUE SECTIONS

Each category gets its own block library on top of the shared base.
Defined in `lib/types.ts` `ContentBlock` union. Components in
`components/post/`. The base layout (hero → stat strip → prose →
pull quote → info grid → effects → kundali/dasha/etc → faq → author
→ related → footer) is identical across categories. Only the
in-between blocks change per category:

| Category   | Unique blocks                                                               |
|-----------|-----------------------------------------------------------------------------|
| jyotish   | `kundali-visual`, `dasha-table`, `gemstone`, `rudraksha`, `yantra`, `stotra` |
| tarot     | `tarot-card-visual`, `spread-positions`                                     |
| numerology| `numerology-display`, `compatibility-grid`                                  |
| vastu     | `vastu-compass`                                                             |
| puja      | `puja-vidhi`, `samagri-list`                                                |
| festivals | `muhurta-timeline`, `puja-vidhi`, `samagri-list`                            |
| gemstones | `wearing-ritual`, `contra-indications`, `gemstone`                          |
| rudraksha | `rudraksha`                                                                 |

When generating a post, pick the unique blocks for that category from
the table above plus the base blocks. Never invent a new block type.

## CONTRAST LAW — Read before writing any component

Dark background = ONLY `--text-on-dark-*` variables for text (Tailwind
classes `text-on-dark`, `text-on-dark-body`, `text-on-dark-muted`,
`text-on-dark-faint`).

Light background = ONLY `--text-on-light-*` variables for text (Tailwind
classes `text-ink`, `text-ink-body`, `text-ink-muted`, `text-ink-faint`).

Never mix them. Never use `--dark` or `--teal` as a text colour on dark
backgrounds. Never create a button, badge, link or card without an explicit
readable text colour.

Full rules live in `styles/contrast-rules.md`. Check that file before
writing any new component. This rule exists because the entire UI had
invisible text due to dark-on-dark colour usage. Never again.
