# Internal linking — VastuCart Blog

This document is the contract for every internal link on the blog.
**Read this before generating a new post or building a new component.**

The single source of truth for URL building is `lib/internal-links.ts`. Never
hardcode an internal URL. Always import a helper from that file. If you need a
new URL pattern, add the helper there first, then use it.

## Why internal linking matters

The VastuCart Blog is the editorial hub of a multi-subdomain network
(`vastucart.in`, `kundali.vastucart.in`, `store.vastucart.in`,
`panchang.vastucart.in`, `stotra.vastucart.in`, `horoscope.vastucart.in`,
`muhurta.vastucart.in`, `wedding.vastucart.in`, `tarot.vastucart.in`). Internal
links exist to:

1. Build topical authority for the blog (cluster pages → pillar pages).
2. Distribute link equity across the network (post → relevant subdomain tool).
3. Help Google understand entity relationships (Mesh Lagna ↔ Mangal ↔ Surya).
4. Reduce reader friction (next/previous house, related lagnas).
5. Avoid 404s (every internal link goes through the registry).

## URL contract

| Entity                       | URL pattern                                                       | Builder helper                |
|------------------------------|-------------------------------------------------------------------|-------------------------------|
| Homepage                     | `/`                                                               | hardcoded                     |
| Category landing             | `/{category}`                                                     | `categoryUrl()`               |
| Subcategory landing          | `/{category}/{subcategory}`                                       | `subcategoryUrl()`            |
| Post                         | `/{category}/{subcategory}/{slug}`                                | `postUrl()`                   |
| Planet-in-house post         | `/jyotish/graha-in-bhava/{planet}-{ordinal}-house-{lagna}-lagna`  | `planetInHouseUrl()`          |
| Lagna profile (pillar)       | `/jyotish/lagna-profiles/{lagna}-lagna-complete-guide`            | `lagnaProfileUrl()`           |
| Planet profile (pillar)      | `/jyotish/graha-states/{planet}-complete-guide`                   | `planetProfileUrl()`          |
| Nakshatra post               | `/jyotish/nakshatra/{slug}`                                       | `nakshatraUrl()`              |
| Gemstone (planet)            | `/gemstones/by-planet/{slug}`                                     | `gemstoneUrl()`               |
| Author page                  | `/authors/{slug}`                                                 | `authorUrl()`                 |

## Cluster linking — what every post must include

### Planet-in-house posts (`jyotish/graha-in-bhava/*`)

Every planet-in-house post must include the following internal links somewhere
in the body (typically the `internal-links` block, the `related-posts` block,
or inline within prose via the entity-resolver):

1. **Pillar — Lagna**: `lagnaProfileUrl(currentLagna)`. The lagna profile is
   the topical pillar for all 108 planet-in-house posts that share that lagna.
2. **Pillar — Planet**: `planetProfileUrl(currentPlanet)`. The planet profile
   is the topical pillar for all 144 posts featuring that planet.
3. **Adjacent houses (rashi chakra)**: `planetInHouseUrl(planet, house-1, lagna)`
   and `planetInHouseUrl(planet, house+1, lagna)`. Builds the
   horizontal cluster within a single lagna's chart.
4. **Adjacent lagna (zodiac wheel)**: `planetInHouseUrl(planet, house, nextLagna)`.
   Builds the cluster across the 12 lagna versions of the same placement.
5. **Author**: `authorUrl(post.author_id)`.
6. **Subdomain tools**: at least three of `kundali.vastucart.in`,
   `store.vastucart.in`, `panchang.vastucart.in`, `stotra.vastucart.in`,
   `muhurta.vastucart.in`, `horoscope.vastucart.in`, `wedding.vastucart.in`.

The helper `planetInHouseCluster(planet, house, lagna)` returns this set as
`ClusterLink[]` ready for use.

### Lagna profile posts (`jyotish/lagna-profiles/*`)

Every lagna profile must link to:

1. All 9 planet-in-1st-house posts for that lagna (the most important cluster
   to seed first).
2. All 12 lagna profiles in a horizontal navigation (so Mesh links to
   Vrishabha, Vrishabha to Mithuna, etc.).
3. The author page.
4. `kundali.vastucart.in`, `wedding.vastucart.in`, `horoscope.vastucart.in`.

### Nakshatra posts

Every nakshatra post must link to:

1. The lagna profile that contains the nakshatra's natural sign.
2. The planet profile of the nakshatra's lord (Ketu, Shukra, Surya, etc.).
3. Adjacent nakshatras in the zodiac order.
4. `kundali.vastucart.in`, `panchang.vastucart.in`.

### Other post types (tarot, numerology, vastu, gemstone, festival)

To be defined per template, but the same principle applies:

- Always link to the cluster pillar (the category landing or a designated
  pillar post within the category).
- Always link to adjacent items in the same series (e.g. Life Path 1 → Life
  Path 2, Major Arcana 0 → Major Arcana 1).
- Always include at least three subdomain tool links scoped by relevance.
- Always link to the author page.

## Anchor link rules

- Every reference to a known entity (lagna name, planet name, sanskrit house
  name, category, subcategory, gemstone, nakshatra) inside post prose, post
  hero tags, post hero meta, info-grid card values, or related-post titles
  must be a clickable internal link.
- Use `resolveEntityLink(label)` from `lib/internal-links.ts` to convert a
  text label into the canonical URL. If it returns `null`, the label is not a
  recognised entity and should not be linked.
- Anchor text should match the visible label exactly. Never write
  `Read more about Mesh` if the visible text is `Mesh Lagna`.

## Slug validation

- New posts must call `assertValidCategoryPair(category, subcategory)` in the
  seed script before being inserted into the DB. Build fails if the pair is
  unknown.
- The `lib/categories.ts` file is the only place where category and
  subcategory slugs may be defined. Adding a new subcategory requires editing
  that file plus `docs/INTERNAL_LINKING.md` if it changes the URL contract.
- The `lib/internal-links.ts` `PLANET_SLUGS` and `LAGNA_SLUGS` constants are
  the only valid values for those entity types. Use the `PlanetSlug` and
  `LagnaSlug` TypeScript types in any new code that refers to them.

## Anchor text and SEO rules

- Vary anchor text across posts pointing to the same target. Never use the
  same exact phrase as the only anchor text for a pillar page across multiple
  posts. Google penalises exact-match over-optimisation.
- Saturated phrases (e.g. "kundali", "free kundali", "Mesh lagna") should
  appear naturally in body prose, not only in CTA buttons.
- Subdomain tool links should always carry a contextual reason — *why* this
  reader should click — in the surrounding sentence. The link is not the
  pitch; the sentence is.
- Outbound links to vastucart subdomains do **not** carry `rel="nofollow"`.
  Outbound links to third parties (Wikipedia, Britannica, government sites)
  do not carry `rel="nofollow"` either, but third-party non-authoritative
  sites should be `rel="nofollow noopener"`.

## External link whitelist (locked)

Posts may include 1 to 2 external links per post, **only** to
domains in this whitelist. The validator hard-fails any external
URL outside this list — no competitor links, no fabricated
sources, no marketing affiliates.

| Domain               | Use for                                          | rel             |
|----------------------|--------------------------------------------------|-----------------|
| `en.wikipedia.org`   | entity definitions, classical texts, scholars    | `noopener`      |
| `vedabase.io`        | Sanskrit scripture references (free)             | `noopener`      |
| `wisdomlib.org`      | encyclopedic Vedic / Sanskrit definitions        | `noopener`      |
| `archive.org`        | primary classical text PDFs and historical docs  | `noopener`      |

### Anchor text rules for external links

- Anchor text MUST be the entity name. Examples that pass:
  - "[Brihat Parashara Hora Shastra](https://en.wikipedia.org/wiki/Brihat_Parashara_Hora_Shastra)"
  - "[Aditya Hridayam](https://vedabase.io/en/library/...)"
  - "[Surya Siddhanta](https://wisdomlib.org/...)"
- Anchor text that fails:
  - "click here", "read more", "this article", "source"
  - Generic exact-match keyword stuffing like "best vedic astrology guide"
- All external links MUST open in a new tab (`target="_blank"`)
  and carry `rel="noopener nofollow"`. The validator enforces both.

### How to insert in post content

External links go inside `prose` or `scannable-prose` `html` /
`subsections[].html`. Never in the `internal-links` block (that
block is for VastuCart network only). Never in CTAs.

The validator uses the whitelist regex to scan all `<a href="...">`
inside content blocks and reject any external host not in the list.
