# Post checklist — bit level, blocking gate

Run mentally before writing every post. Run programmatically via
`scripts/validate-post.ts` before saving. Score must be ≥ 90 / 100.
Anything below 90 fails the build.

This is the **only checklist**. There is no optional check. If a
line is unticked, the post does not publish.

---

## Phase 0 — Pre-flight read (mandatory every post)

- [ ] Read `CLAUDE.md` end to end.
- [ ] Read `docs/POST_STANDARD.md` end to end.
- [ ] Read `docs/INTERNAL_LINKING.md` end to end.
- [ ] Read `docs/KEYWORD_RESEARCH_SOP.md` end to end.
- [ ] Read `docs/IMAGE_SOP.md` end to end.
- [ ] Read `docs/SEMANTIC_SEO.md` end to end.
- [ ] Read `docs/SEO_TACTICS.md` end to end.
- [ ] Read `templates/{template}.md` for the post template.
- [ ] Read `content/PROGRESS.md` to confirm this slug is not done.
- [ ] Read `lib/categories.ts` to verify the category/subcategory pair.
- [ ] Read `lib/internal-links.ts` to confirm slug pattern.
- [ ] Read `lib/category-themes.ts` to confirm theme exists for this category.
- [ ] Read `lib/keyword-variations.ts` for Sanskrit term variants.

## Phase 1 — Topic resolve

- [ ] `category` slug exists in `lib/categories.ts`.
- [ ] `subcategory` slug exists under that category.
- [ ] `slug` matches the URL pattern in `INTERNAL_LINKING.md` for this template.
- [ ] `slug` is kebab-case, ASCII only, no spaces, no underscores.
- [ ] `slug` is not already in use under `content/{category}/{subcategory}/`.
- [ ] `template` value is one of the 9 supported template types.
- [ ] `author_id` exists in `lib/authors.ts`.

## Phase 2 — Keyword research (before writing prose)

- [ ] Generated ≥ 30 long-tail variant queries from the seed topic.
- [ ] Pulled lingual variations for every Sanskrit term in the post
  from `lib/keyword-variations.ts` (e.g. `surya / soorya / sun`,
  `mangal / mangala / mars`, `rahu / raahu`, `kundli / kundali`).
- [ ] Identified 5 content gap items (facts the top 5 SERP results miss).
- [ ] Identified 5 real "People also ask" questions for the topic.
  These become the FAQ block.
- [ ] Listed 8–12 LSI / topic-completion terms that must appear in
  body prose for topic completeness.
- [ ] Set `meta.focus_keyword` to one phrase (the head term).
- [ ] Set `meta.secondary_keywords` to 4–6 phrases including
  Romanised + English variants.
- [ ] Set `meta.lsi_keywords` to 6–10 LSI terms.
- [ ] Saved everything as `keyword_brief` inline in the post JSON.

## Phase 3 — Outline (no prose yet)

- [ ] Wrote one-line topic sentence per prose section. (No section
  shares a topic with another section.)
- [ ] Outlined every structured block: stat-strip cells, info-grid
  cards, effects bullets, dasha rows, gemstone/rudraksha/yantra/
  stotra references, FAQ questions.
- [ ] Outlined the internal links list to hit cluster quotas.
- [ ] Outlined the image manifest (slot, alt, caption, prompt).

## Phase 4 — Image manifest + prompts

- [ ] Image budget for this template (Section 3 of `POST_STANDARD.md`)
  matches the manifest count.
- [ ] Every image has a real `filename` (slug + descriptive suffix,
  kebab-case, never numeric `-1.webp`).
- [ ] Every image has an `alt` text 8–15 words, descriptive, focus
  keyword used at most once.
- [ ] Every image has a `caption` (1–2 editorial sentences).
- [ ] Every image has a `width` and `height`.
- [ ] Every image has a `generation_prompt` ready for the API.
- [ ] Every image has a `negative_prompt`.
- [ ] Hero image has `lazy: false`. All others `lazy: true`.
- [ ] Hero image has a separate `filename_og` for the 1200×630 OG variant.
- [ ] Every image gets an `ImageObject` schema entry under
  `post.schema.image_objects` with license + creditText.

## Phase 5 — Prose write

- [ ] Each prose section hits its target word count from
  `POST_STANDARD.md` Section 3 (±10%).
- [ ] Sanskrit terms italicised on first use with English gloss in
  parens. Plain text after first occurrence.
- [ ] Inline `<a href>` for every Sanskrit term first occurrence
  that resolves via `resolveEntityLink()`.
- [ ] No em dashes anywhere.
- [ ] No emoji anywhere.
- [ ] No banned AI filler phrases (see `POST_STANDARD.md` Section 3).
- [ ] First sentence leads with the reader, not the topic.
- [ ] Section headings are curiosity hooks, not labels.
- [ ] Each paragraph 60–90 words, one idea each.
- [ ] No paragraph repeats a fact from another paragraph.

## Phase 6 — Structured content

- [ ] Exactly 5 FAQs (6 for lagna profile).
- [ ] Each FAQ answer is one tight paragraph, ~80 words.
- [ ] Effects-grid has positive (≥6), negative (≥6), career (≥6) bullets.
- [ ] Dasha-table has ≥4 rows for jyotish posts.
- [ ] Stat-strip has exactly 4 cells.
- [ ] Info-grid has exactly 2 cards for planet-in-house.
- [ ] Gemstone block has primary + secondary + shop card (3 cards).
- [ ] Gemstone block has the disclaimer (always rendered).

## Phase 6b — GEO / AI-search (added 2026-05-29)

- [ ] One `tldr` block near the top (40-75 word self-contained answer).
- [ ] 2-4 `geo-answer` blocks; each answer 40-75 words, answer-first,
      independently liftable.
- [ ] FAQ has >=10 PAA-style questions; each answer opens <=40 words.
- [ ] Any authority claim cites a real source (classical text or a
      whitelisted domain). No fabricated stats/sources.
- [ ] One honest "when you do NOT need a paid consultation" line
      (DIY/threshold trust signal).
- [ ] `dateModified` bumped ONLY on a real edit — never faked recency.

## Phase 7 — Schema (22 entities)

- [ ] All 22 entities present (see `POST_STANDARD.md` Section 7).
- [ ] Article schema has `wordCount`, `timeRequired`, `inLanguage`.
- [ ] FAQPage has **>=10** Question/Answer pairs (raised 2026-05-29).
- [ ] BreadcrumbList has 4 levels.
- [ ] Person schema has `knowsAbout` array.
- [ ] Organization uses the canonical `@id` `https://vastucart.in/#org`.
- [ ] All 10 subdomains + 7 socials are in Organization `sameAs`.
- [ ] DefinedTerm entries for every major Sanskrit term.
- [ ] DefinedTermSet wraps all DefinedTerm entries.
- [ ] HowTo for the remedies section AND for either gemstone or vidhi.
- [ ] Product entries for gemstone, rudraksha, yantra (where applicable).
- [ ] Service entry for personal consultation.
- [ ] SpeakableSpecification with cssSelector targets.
- [ ] ImageObject ×N matching `image_manifest` length.
- [ ] VideoObject placeholder block (empty until video is added).
- [ ] ItemList for related-posts block.
- [ ] Table + Dataset for the dasha table (jyotish only).

## Phase 8 — Internal linking

- [ ] ≥6 internal links to other blog posts.
- [ ] ≥6 internal links to VastuCart subdomains.
- [ ] ≥1 link to author page.
- [ ] ≥1 link to category landing.
- [ ] ≥1 link to subcategory landing.
- [ ] Link to lagna pillar AND planet pillar (jyotish posts).
- [ ] Link to prev/next house version (jyotish planet-in-house posts).
- [ ] Link to next lagna version (jyotish planet-in-house posts).
- [ ] No exact-match anchor text used more than once across the
  same target across all posts in the database.
- [ ] Every internal URL built via `lib/internal-links.ts` helpers,
  zero hardcoded paths.

## Phase 9 — SEO meta

- [ ] `meta.title` ≤ 60 characters.
- [ ] `meta.title` starts with the focus keyword.
- [ ] `meta.title` ends with a benefit or curiosity hook.
- [ ] `meta.description` ≤ 155 characters.
- [ ] `meta.description` contains focus keyword in first 100 chars.
- [ ] `meta.description` contains an active verb.
- [ ] `meta.description` contains a soft CTA.
- [ ] `meta.og_title` distinct from `meta.title`, more emotional.
- [ ] `meta.og_description` distinct, conversational tone.
- [ ] `meta.canonical` is a full HTTPS URL.
- [ ] `meta.breadcrumb` has all 4 levels.
- [ ] `meta.keywords` field populated for legacy crawlers.

## Phase 10 — Voice + lint pass

- [ ] All banned words / phrases stripped (see Section 3 of POST_STANDARD).
- [ ] All em dashes stripped.
- [ ] All emoji stripped.
- [ ] All Sanskrit terms italicised on first use.
- [ ] No section under 120 words of real content.
- [ ] No paragraph that doesn't introduce a new fact.
- [ ] All anchor text varied across posts.
- [ ] First sentence reads like a sales copywriter wrote it,
  not an encyclopedia editor.

## Phase 11 — Save and validate

- [ ] Saved to `content/{category}/{subcategory}/{slug}.json`.
- [ ] `status` is `"ready"`.
- [ ] Updated `content/PROGRESS.md` with the slug, word count, date.
- [ ] Ran `scripts/validate-post.ts {slug}` — score ≥ 90.
- [ ] Ran `scripts/seo-audit.ts {slug}` — score ≥ 85.
- [ ] Ran `scripts/internal-link-graph.ts {slug}` — no broken links.

## Phase 12 — Build verify

- [ ] `next build` exits with zero errors.
- [ ] Headless Chrome screenshot of the post URL.
- [ ] Screenshot visually matches the prototype layout.
- [ ] Page loads in browser with all 22 schema entities visible
  in DevTools (or via Google Rich Results test).

---

## Score weights for `validate-post.ts`

| Section          | Weight |
|------------------|--------|
| Phase 1 (identity)| 5     |
| Phase 2 (keywords)| 10    |
| Phase 3 (outline) | 5     |
| Phase 4 (images)  | 10    |
| Phase 5 (prose)   | 20    |
| Phase 6 (structured)| 10  |
| Phase 7 (schema)  | 15    |
| Phase 8 (linking) | 10    |
| Phase 9 (meta)    | 10    |
| Phase 10 (voice)  | 5     |

Total 100. Pass threshold 90. Hard gate.

---

## What blocks publication immediately (cannot be overridden)

- Em dashes in any prose field.
- Emoji in any prose field.
- Any banned AI filler phrase.
- Word count > 15% over target.
- Word count > 15% under target.
- Missing any of the 22 schema entities.
- Missing FAQs.
- < 6 internal post links.
- < 6 subdomain links.
- No author link.
- No image manifest.
- Image filename uses numeric suffix (`-1.webp`).
- Image alt missing.
- Image alt > 15 words.
- Image alt = filename.
- `meta.title` > 60 characters.
- `meta.description` > 155 characters.
- Canonical URL not HTTPS.
- Anchor text exact-match repeated across posts.
- Slug doesn't match URL pattern.
- Category/subcategory pair invalid.
