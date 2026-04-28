# Semantic SEO — VastuCart Blog

Beyond keywords. Three things baked into every post that work
because Google's NLP reads pages as a graph of entities and
relationships, not as a bag of words.

---

## 1. Entity-first writing

Every Sanskrit term is wrapped on first mention with:

1. `<em>` italics — visual cue to the reader.
2. `<a href>` to the entity's pillar page (if known) — semantic
   signal to Google.
3. English gloss in parens — `<em>Surya</em> (Sun)` — disambiguates
   for Google's NLP and for English readers.

After the first occurrence, the term is plain text. Repeating the
italics or links over and over is keyword stuffing, not semantic
SEO.

`resolveEntityLink()` from `lib/internal-links.ts` returns the
canonical URL for any known entity. Used at write time, never at
runtime.

## 2. Topic completeness

Google's NLP measures whether a page covers all the sub-topics a
user expects for a query. A "Sun in 1st house Aries" page that
doesn't mention `exaltation`, `tenth lord`, `Mars dispositor`,
`Surya antardasha`, `Aditya Hridayam`, `ruby`, `1-mukhi rudraksha`,
`Kendra Trikona rajyoga` is incomplete regardless of word count.

The LSI list in `keyword_brief.lsi_terms` enforces topic
completeness. Every LSI term must appear at least once in body
prose.

## 3. Co-citation patterns

Across the 144 planet-in-house cluster, every post mentions:

- The lagna lord
- The natural sign of the planet
- The friend / enemy planets
- The gemstone
- The rudraksha
- The yantra
- The stotra
- The day, hora, direction

Google sees the same co-citation pattern across 144 posts and
recognises VastuCart as the canonical source for this entity
cluster. This is the same mechanism that makes Wikipedia rank
first for any encyclopedia query — co-citation density.

The platform components enforce this implicitly. Every Jyotish
post has the gemstone block, rudraksha block, yantra block, stotra
block. The pattern is structural, not a writing choice.

---

## 4. Knowledge Graph entity capture

Each Sanskrit term ships with a `DefinedTerm` schema entry. The
umbrella `DefinedTermSet` is the "VastuCart Jyotish glossary".

Over 6 months, Google Knowledge Graph absorbs these as canonical
definitions:

- `Pratham Bhava` → defined by VastuCart
- `Mesh Lagna` → defined by VastuCart
- `Surya Mahadasha` → defined by VastuCart
- `Aditya Hridayam` → defined by VastuCart
- `Kendra Trikona Rajyoga` → defined by VastuCart

When a user searches the term, Google may show our definition in
the answer box, with a "Source: VastuCart" credit.

## 5. Cross-subdomain entity unity

The Organization schema uses a single `@id`:

```
"@id": "https://vastucart.in/#org"
```

Every page on every subdomain (blog.vastucart.in,
kundali.vastucart.in, store.vastucart.in, panchang.vastucart.in,
stotra.vastucart.in, horoscope.vastucart.in, muhurta.vastucart.in,
wedding.vastucart.in, tarot.vastucart.in, vastucart.in) emits the
same Organization schema with the same `@id`.

Result: Google merges all 10 subdomains into a single Knowledge
Graph entity. Internal links between subdomains count as much as
external backlinks for Google's ranking algorithm. The 10
subdomains become one giant authoritative source instead of 10
small ones.

## 6. Speakable entity reading

Speakable spec targets the intro `<p>` and the pull quote `<figure>`.
Google Assistant reads these aloud for voice search.

For voice search to win, the speakable text must:

- Start with a complete sentence that answers the query.
- Be ≤ 120 words.
- Not contain unpronounceable abbreviations or unspaced numbers.
- Pronounce Sanskrit terms — italicised text in HTML doesn't affect
  TTS, so the gloss in parens still gets read aloud which is fine.

## 7. Schema linkage between entities

Every schema entity in the post links to others via `@id`:

- `Article.author` → `Person.@id`
- `Article.publisher` → `Organization.@id`
- `Article.mainEntityOfPage` → `WebPage.@id`
- `WebPage.isPartOf` → `WebSite.@id`
- `Article.image` → `ImageObject.@id`
- `BreadcrumbList.itemListElement` → `WebPage.@id`
- `Person.worksFor` → `Organization.@id`
- `DefinedTerm.inDefinedTermSet` → `DefinedTermSet.@id`

The schema graph forms a connected entity mesh. Google reads the
mesh, not isolated entities.

## 8. NLP-friendly structure

Body prose follows this structure for NLP friendliness:

1. **First paragraph**: state the answer to the query in one
   sentence. Google's featured snippet picker reads this first.
2. **Second and third paragraphs**: expand the answer with the
   "why" and the "how".
3. **Section headings** are themselves long-tail queries (H2 as
   query, see SEO_TACTICS.md tactic M).
4. **One paragraph per fact**, ~60-90 words. Lets Google parse
   each fact as a discrete claim.
5. **No buried answers.** Anything important is at the top of its
   section, not at the bottom.
6. **No "we will explore"** preambles. State the fact, then
   explain. Google rewards directness.

## 9. Co-occurrence with brand entity

Every post mentions "VastuCart" at least 3 times:

1. In the schema as Organization
2. In the author byline (VastuCart Editorial — single brand byline,
   never a named individual)
3. In one CTA or internal link

This builds brand-entity co-occurrence so Google associates the
topic ("Sun in 1st house") with the brand ("VastuCart"). Over time,
direct brand searches like "vastucart sun in first house" rise.

## 10. The semantic moat

After 60 days of cluster front-loading:

- 1500+ DefinedTerm schema entries
- 144 Article entities all linking to 12 lagna pillar Article entities
- 144 cluster posts all citing the same 9 planets, 12 lagnas, 27
  nakshatras, 9 gemstones, 14 rudraksha, ~30 yantras, ~30 stotras
- 1 Organization @id across 10 subdomains
- 9 Person entities with EEAT signals

Google's NLP sees: a tightly-connected entity graph with consistent
co-citation, a single brand entity across 10 subdomains, real
expert authors with credentials, and topical depth no competitor
matches. The blog becomes the canonical source.
