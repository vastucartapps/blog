# Post standard — VastuCart Blog

This is the locked contract every blog post must satisfy. Read it
before generating any post. Read it before reviewing a generated post.
Read it before changing any component that touches a post.

The platform components in `components/post/` enforce the visual.
This document enforces the content, structure, schema, voice, image,
and SEO contract.

If a post violates any rule below, `scripts/validate-post.ts` blocks
publication. This is not a guideline. It is a hard gate.

---

## 1. File location and identity

Save under:

```
content/{category}/{subcategory}/{slug}.json
```

- `category` and `subcategory` slugs must already exist in
  `lib/categories.ts`. Validated at write time by
  `assertValidCategoryPair(category, subcategory)`.
- `slug` must follow the URL pattern in `docs/INTERNAL_LINKING.md`
  for the post template.
- Filenames are kebab-case, ASCII only, no spaces, no underscores.

## 2. Required JSON shape

```json
{
  "id": "string, equals slug",
  "slug": "string, kebab-case",
  "title": "Plain text, no HTML",
  "title_hindi": "Optional Hindi title in Devanagari",
  "subtitle": "One sentence, plain text",
  "category": "matches lib/categories.ts category slug",
  "subcategory": "matches lib/categories.ts subcategory slug",
  "template": "planet-in-house | lagna-profile | nakshatra | tarot-card | numerology-number | gemstone | festival | puja-vidhi | rudraksha",
  "author_id": "matches lib/authors.ts key",
  "reading_time_minutes": 9,
  "status": "ready",
  "published_at": "ISO 8601",
  "updated_at": "ISO 8601",
  "tags": ["8 to 12 specific tags"],
  "keyword_brief": { ... see KEYWORD_RESEARCH_SOP.md ... },
  "meta": { ... see Section 5 ... },
  "hero": { ... see Section 6 ... },
  "image_manifest": [ ... see IMAGE_SOP.md ... ],
  "schema": { ... 22 entities, see Section 7 ... },
  "content": [ ... ContentBlock array ... ]
}
```

## 3. Word count contract — no padding allowed

| Template          | Pure prose | Structured | Total | Reading time | Image budget |
|-------------------|------------|------------|-------|--------------|--------------|
| planet-in-house   | 1400       | 600        | 2000  | 9–10 min     | 3 mandatory + 1 optional |
| lagna-profile     | 1600       | 700        | 2300  | 11 min       | 4 mandatory |
| nakshatra         | 1300       | 500        | 1800  | 8–9 min      | 3 mandatory |
| tarot-card        |  950       | 500        | 1450  | 7 min        | 3 incl. card art |
| numerology-number | 1100       | 500        | 1600  | 8 min        | 3 mandatory |
| vastu             | 1100       | 600        | 1700  | 8 min        | 3 mandatory |
| festival          |  900       | 700        | 1600  | 8 min        | 4 mandatory |
| gemstone          | 1100       | 600        | 1700  | 8 min        | 3 incl. real stone photo |
| puja-vidhi        | 1100       | 700        | 1800  | 9 min        | 3 mandatory |
| rudraksha         |  900       | 500        | 1400  | 7 min        | 3 mandatory |

**No-padding rules** — enforced by lint:

1. Never repeat a fact across two sections.
2. Never write a transitional paragraph that just sets up the next
   heading. The heading IS the transition.
3. Never write any of the banned AI filler phrases:
   `delve`, `tapestry`, `realm`, `dive into`, `unlock`, `unleash`,
   `it is important to note`, `it is worth mentioning`,
   `in this article we will`, `in conclusion`, `furthermore`,
   `navigate the realm of`, `embark on a journey`, `let us explore`,
   `at the end of the day`, `tap into`, `harness the power`.
4. Cut any section with less than 120 words of real content.
5. Delete any paragraph that does not introduce a new fact.
6. FAQ answers are one tight paragraph (~80 words), never two.
7. **Em dashes are banned.** Use comma or full stop.
8. Emoji are banned.
9. Sanskrit terms are italicised on first use, with English gloss in
   parens. After the first occurrence, use plain text.

## 4. `tags` field

8 to 12 tags, every tag is a real entity or a real long-tail query
fragment. Tags become hero tag chips. Tags whose label resolves via
`resolveEntityLink()` automatically render as internal links — that
is the bridge between tags and clusters.

## 5. `meta` block

- `meta.title` ≤ 60 characters. Focus keyword first, brand last.
  Curiosity hook or benefit always present.
- `meta.description` ≤ 155 characters. Focus keyword inside the
  first 100 characters. Active verb. Soft call-to-action. Written
  for click-through, not for keyword stuffing.
- `meta.focus_keyword` — exactly one phrase the post targets.
- `meta.secondary_keywords` — 4 to 6 supporting phrases including
  Romanised + English variants from `lib/keyword-variations.ts`.
- `meta.lsi_keywords` — 6 to 10 LSI / topic-completion terms.
- `meta.og_title` — distinct from `meta.title`, written for social
  share, more emotional, less literal.
- `meta.og_description` — distinct from `meta.description`,
  conversational tone.
- `meta.og_image` — `/posts/{slug}/{slug}-og.png`, 1200×630, ≤ 200 KB.
- `meta.canonical` — full HTTPS URL via `absoluteUrl()`.
- `meta.robots` — `"index, follow, max-image-preview:large, max-snippet:-1"`.
- `meta.hreflang` — `[{lang: "en-IN", url: ...}]` minimum.
- `meta.breadcrumb` — array of `{name, url}` from Home → Category →
  Subcategory → Post.
- `meta.keywords` — 4 to 6 keywords for legacy meta tag (ignored by
  Google but still consumed by Bing and others).

## 6. `hero` block

```json
{
  "badge_label": "VEDIC ASTROLOGY, DEEP STUDY",
  "title_html": "Sun in the 1st house<br><em>Mesh Lagna</em> (Aries Ascendant)",
  "description": "One sentence, ≤ 200 characters",
  "meta": [
    { "icon": "clock",         "value": "9 min read" },
    { "icon": "check-circle",  "value": "Expert verified" },
    { "icon": "user",          "value": "Pt. Raghav Sharma" },
    { "icon": "calendar",      "value": "Updated April 2026" }
  ],
  "tags": [
    { "label": "Surya",         "tone": "teal" },
    { "label": "Pratham Bhava", "tone": "teal" },
    { "label": "Mesh Lagna",    "tone": "teal" }
  ]
}
```

`<em>` inside `title_html` becomes the saffron italic phrase.
`tags` whose label is a known entity become internal links.
`meta` items whose value contains an author name become links to
that author's profile page.

## 7. Schema — 22 entities every post must emit

| #  | @type                   | Notes                                                               |
|----|-------------------------|---------------------------------------------------------------------|
| 1  | Article                 | headline, description, datePublished, dateModified, author, publisher, mainEntityOfPage, image, articleSection, keywords, wordCount, timeRequired, inLanguage |
| 2  | WebPage                 | distinct from Article, with `mainEntityOfPage`, `primaryImageOfPage`, `breadcrumb`, `inLanguage`, `isPartOf` |
| 3  | WebSite                 | with `SearchAction` (sitelinks searchbox)                           |
| 4  | Organization            | logo, sameAs (10 subdomains + 7 socials), contactPoint, founder     |
| 5  | BreadcrumbList          | 4 levels                                                            |
| 6  | FAQPage                 | 5 Q&A pairs as Question / acceptedAnswer Answer                    |
| 7  | Person (author)         | name, jobTitle, knowsAbout, sameAs, alumniOf, birthPlace            |
| 8  | ProfilePage             | wraps the Person                                                    |
| 9–11| DefinedTerm ×3+        | one per major Sanskrit term                                         |
| 12 | DefinedTermSet          | umbrella set "VastuCart Jyotish glossary"                           |
| 13 | HowTo (remedies)        | step list                                                           |
| 14 | HowTo (gemstone or vidhi)| second HowTo per post                                              |
| 15 | Product (gemstone)      | name, brand, offers, image, description                             |
| 16 | Product (rudraksha or yantra)| same shape                                                     |
| 17 | Service (consultation)  | offers, areaServed                                                  |
| 18 | SpeakableSpecification  | cssSelector targets (intro, pull quote)                             |
| 19 | ImageObject ×N          | one per image in `image_manifest`, with license + creditText        |
| 20 | VideoObject placeholder | empty until video is added later                                    |
| 21 | ItemList (related posts)| structured list of 3 cluster links                                  |
| 22 | Table + Dataset         | for the dasha table or any tabular data                             |

`lib/schema-builder.ts` exposes `buildPostSchema(post)` which
returns the entity array. **`buildPostSchema()` is the SINGLE
SOURCE OF TRUTH for all JSON-LD on a post page.** Posts MUST NOT
contain a `post.schema` field that gets rendered separately —
that pattern caused duplicate FAQPage and array-top-level errors
in Google Rich Results Test on the first deployed post (Sun in
1st house, Mesh Lagna).

### Schema rendering rules (locked, hard-enforced)

1. **Each entity gets its own `<script type="application/ld+json">`
   tag.** Never `JSON.stringify(arrayOfEntities)` — Google rejects
   that with "Invalid top level element 'array'".
2. **No HTML microdata for schema.** Components must NOT use
   `itemScope`, `itemType`, `itemProp` — those are picked up by
   Google as parallel entities and produce duplicates with the
   JSON-LD output. JSON-LD is the only schema delivery mechanism.
3. **Every Product MUST be a Product Snippet, not a Merchant
   Listing.** That means: `brand` + `aggregateRating` + `review`,
   and NO `offers.price`. Setting `offers.price` triggers Google's
   merchant listing parser which then flags missing SKU, shipping,
   return policy, etc. The descriptive Products on this blog are
   not directly buyable here — the store is on a different
   subdomain, and the "buy" path is via consultation. Use
   `aggregateRating` (synthesised from VastuCart consultation
   reviews) + a single representative `review` instead.
4. **No duplicate `@id` values across the entity array.** The
   validator's `schema_22` check hard-fails if any `@id` appears
   more than once. Use `${pageId}#product-${slug}`-style unique
   IDs for every Product, ImageObject, etc.
5. **At most one FAQPage per post.** The validator hard-fails on
   multiple FAQPage entities.

The Organization shares a single `@id` across all 10 subdomains:
`https://vastucart.in/#org`. Cross-subdomain entity authority.

### Validator enforcement (`scripts/validate-post.ts`)

The `schema_22` check now runs `buildPostSchema(post)` and asserts
on the OUTPUT, not on a `post.schema` JSON field:

- All required `@type` values present (Article, WebPage, WebSite,
  Organization, BreadcrumbList, FAQPage, Person, ProfilePage,
  DefinedTermSet, DefinedTerm, Product, Service,
  SpeakableSpecification, ImageObject, VideoObject, ItemList,
  Dataset).
- No duplicate `@id` (hard-fail).
- Every Product has `offers` (hard-fail).
- Exactly 1 FAQPage (hard-fail on more).

If the post needs entity types that the schema-builder doesn't
synthesize from content blocks (e.g., a HowTo for a planet-in-house
post that has no puja-vidhi block), add the corresponding content
block — never write a parallel `post.schema` field.

## 8. Internal linking quotas (enforced by lint)

Every post must include:

- ≥ 6 internal links to other blog posts (cluster pillar lagna,
  cluster pillar planet, prev/next house, next lagna, related
  categories)
- ≥ 6 internal links to VastuCart subdomains (kundali, store,
  panchang, stotra, muhurta, horoscope, wedding, tarot, vastucart.in)
- ≥ 1 link to author page
- ≥ 1 link to category landing
- ≥ 1 link to subcategory landing
- Hero tags + meta items resolve via `resolveEntityLink()` for
  known entities

## 9. ContentBlock order per template

### planet-in-house
stat-strip → prose intro → pull-quote → image-figure (intro hero) →
info-grid → divider:accent → prose personality → effects-grid →
prose career → cta-inline → divider:accent → kundali-visual →
divider:accent → prose health → dasha-table → image-figure (mid) →
divider:accent → prose dasha → prose marriage → prose remedies →
gemstone → divider:accent → rudraksha → cta-inline →
divider:accent → yantra → divider:accent → stotra → divider:accent →
internal-links → cta-band → divider:accent → faq →
divider:accent → author → divider:accent → related-posts

### lagna-profile
stat-strip → prose intro → pull-quote → image-figure (intro) →
info-grid (lagna lord + element profile) → divider:accent →
prose personality → effects-grid → prose career →
divider:accent → kundali-visual → image-figure (mid) →
divider:accent → prose health → prose marriage →
divider:accent → dasha-table → prose remedies →
gemstone → rudraksha → divider:accent → internal-links →
cta-band → faq → author → related-posts

### tarot-card
stat-strip → tarot-card-visual → prose card-meaning → pull-quote →
info-grid → divider:accent → effects-grid → image-figure →
spread-positions → divider:accent → cta-band → internal-links →
faq → author → related-posts

### numerology-number
stat-strip → numerology-display → prose meaning → pull-quote →
info-grid → divider:accent → effects-grid → compatibility-grid →
image-figure → divider:accent → cta-band → internal-links →
faq → author → related-posts

### vastu
stat-strip → prose overview → pull-quote → vastu-compass →
info-grid → divider:accent → effects-grid → image-figure →
cta-inline (vastucart.in tools) → divider:accent → cta-band →
internal-links → faq → author → related-posts

### festival
stat-strip (DYNAMIC from panchang) → prose significance →
pull-quote → image-figure (festival hero) → muhurta-timeline →
divider:accent → puja-vidhi → samagri-list → divider:accent →
prose mantra → cta-inline (muhurta tool) → cta-band →
internal-links → faq → author → related-posts

### gemstone
stat-strip → prose overview → pull-quote → info-grid →
divider:accent → effects-grid → wearing-ritual →
contra-indications → gemstone (with disclaimer) → image-figure →
divider:accent → cta-band → internal-links → faq → author →
related-posts

### puja-vidhi
stat-strip → prose significance → pull-quote → image-figure →
info-grid → divider:accent → puja-vidhi → samagri-list →
divider:accent → stotra (first verse only, links to stotra site) →
cta-inline (store) → cta-band → internal-links → faq → author →
related-posts

### rudraksha
stat-strip → prose overview → pull-quote → info-grid →
divider:accent → effects-grid → rudraksha → image-figure →
wearing-ritual → divider:accent → cta-band → internal-links →
faq → author → related-posts

## 10. Image budget per template

See Section 3 (Word count contract). Image rules live in
`docs/IMAGE_SOP.md`.

Every image is referenced by its slot in `image_manifest` and the
file path is `/posts/{slug}/{slug}-{descriptive-suffix}.webp`.
Until the image API is wired, `<ImageFigure>` renders a styled
placeholder at the correct dimensions. The post publishes either
way.

## 11. Voice rules — sales copywriter, not encyclopedist

1. Lead with the reader, not the topic. First sentence speaks to
   their experience, not to the academic concept.
2. Concrete > abstract. Specific names, specific ages, specific
   body parts, specific street outcomes. Not "leadership qualities"
   but "teachers remember your name in school".
3. Active voice everywhere.
4. One idea per paragraph, ~60-90 words.
5. Section headings are curiosity hooks, not labels. "Where command
   meets institution" not "Career section".
6. Click-worthy meta titles: focus keyword first, benefit + curiosity
   hook second.
7. Sales-grade meta descriptions: focus keyword in first 100 chars,
   benefit, soft CTA, written for the click.
8. Conversational, not academic. The reader is a curious adult, not
   a graduate student.

## 12. Pre-flight checklist (read before every post)

See `docs/POST_CHECKLIST.md`. The checklist is run by
`scripts/validate-post.ts` programmatically and must pass before any
post can be marked `status: "ready"`.

## 13. Generation procedure

The 12-phase SOP lives in `docs/POST_CHECKLIST.md`.

Phase order is:
0. Pre-flight read (CLAUDE.md, this doc, INTERNAL_LINKING.md, KEYWORD_RESEARCH_SOP.md, IMAGE_SOP.md, SEMANTIC_SEO.md, the template, PROGRESS.md)
1. Topic resolve
2. Outline (no prose)
3. Image manifest + generation prompts
4. Prose write
5. Structured content
6. JSON-LD 22 entities via schema-builder
7. Internal-link pass
8. SEO meta
9. Voice + lint pass
10. JSON write
11. Validate (validate-post.ts must return score ≥ 90)
12. Build verify (next build clean)
