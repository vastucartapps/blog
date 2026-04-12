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
Author persona: Pt. Raghav Sharma
- 22 years Parashari Jyotish practice, Varanasi
- Warm, direct, practitioner speaking to a student
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

## SOP REFERENCE FILES

- `docs/POST_STANDARD.md` — JSON shape, content order, voice, 22 schema
- `docs/POST_CHECKLIST.md` — bit-level pre-flight 12-phase checklist
- `docs/IMAGE_SOP.md` — image manifest, filename, alt, dimensions
- `docs/SEO_TACTICS.md` — 16 + Q-Z tactics, all locked
- `docs/SEMANTIC_SEO.md` — entity-first writing, topical depth
- `docs/KEYWORD_RESEARCH_SOP.md` — keyword brief generation phases
- `docs/THIN_CONTENT_RULES.md` — uniqueness gates, duplication audit
- `docs/INTERNAL_LINKING.md` — URL contract + cluster rules

## INTERNAL LINKING LAW

- Every reference to a known entity (lagna, planet, sanskrit house
  name, category, subcategory, gemstone, nakshatra) inside hero tags,
  hero meta, prose, info-grid values, or related-post titles must
  resolve to a hyperlink via `resolveEntityLink()` from
  `lib/internal-links.ts`.
- Cluster pillar pages: the lagna profile is the pillar for all 108
  planet-in-house posts in that lagna. The planet profile is the
  pillar for all 144 posts featuring that planet. Each post links to
  both pillars.
- Adjacent linking: every planet-in-house post links to the previous
  and next house version (same planet, same lagna) and to the next
  lagna version (same planet, same house).
- Author cluster: every post links to its author page; the author
  page lists every post by that author.

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
