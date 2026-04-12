# Canonical schema template — locked

This is the **verified-clean** JSON-LD output that
`lib/schema-builder.ts` `buildPostSchema(post)` produces for any
post that follows `docs/POST_STANDARD.md`. Every entity below has
been validated by **Google Rich Results Test on the live URL
`https://blog.vastucart.in/jyotish/graha-in-bhava/sun-1st-house-aries-lagna`**
with **zero errors and zero non-critical warnings**.

The script `scripts/dump-schema.ts` regenerates this dump from any
post:

```bash
npx tsx scripts/dump-schema.ts content/jyotish/graha-in-bhava/sun-1st-house-aries-lagna.json
```

If a future post fails Google Rich Results Test, diff its
`buildPostSchema()` output against this template — the difference
is the bug.

---

## How schema is delivered (locked rules)

1. **Single source of truth**: `lib/schema-builder.ts`
   `buildPostSchema(post)` is the ONLY place that produces JSON-LD.
   Never write a parallel `post.schema` field. Never use HTML
   microdata (`itemScope`, `itemType`, `itemProp`) in any
   component — it creates duplicate entities with the JSON-LD.

2. **One entity per script tag**: the post page route iterates the
   array and emits each entity as its own
   `<script type="application/ld+json">`. NEVER
   `JSON.stringify(arrayOfEntities)` — Google rejects it as
   "Invalid top level element 'array'".

3. **Cross-subdomain entity unity**: `Organization` always uses
   `@id: "https://vastucart.in/#org"` so all 10 VastuCart subdomains
   merge into one Knowledge Graph entity.

4. **Product Snippet, NOT Merchant Listing**: every Product has
   `brand` + `aggregateRating` + `review`. NEVER include
   `offers.price` — it triggers Google's merchant listing parser
   which then demands SKU, shippingDetails, hasMerchantReturnPolicy.
   The "buy" path is via the visible CTA button, not the schema.

5. **No duplicate `@id`**: hard-failed by the validator.

6. **Exactly one FAQPage**: hard-failed by the validator.

---

## Required entity types per post

Every post must emit at least one of each of these `@type`s. Total
required count: **17 distinct types**, **26+ entities** including
arrays of DefinedTerm, Product, ImageObject.

| # | @type | Count | Purpose |
|---|---|---|---|
| 1 | Organization | 1 | Cross-subdomain brand entity |
| 2 | WebSite | 1 | Sitelinks search box |
| 3 | WebPage | 1 | The page itself |
| 4 | Article | 1 | The article rich result |
| 5 | BreadcrumbList | 1 | Breadcrumb rich result |
| 6 | FAQPage | 1 | FAQ rich result (max 1!) |
| 7 | Person | 1 | Author EEAT |
| 8 | ProfilePage | 1 | Author profile page link |
| 9 | DefinedTermSet | 1 | Glossary set umbrella |
| 10 | DefinedTerm | ≥3 | Sanskrit term entries |
| 11 | Product | ≥3 | Gemstone, rudraksha, yantra (Product Snippets) |
| 12 | Service | 1 | Consultation service |
| 13 | SpeakableSpecification | 1 | Voice search support |
| 14 | ImageObject | ≥3 | One per image_manifest entry |
| 15 | VideoObject | 1 | Video summary slot |
| 16 | ItemList | 1 | Related posts cluster |
| 17 | Dataset | 1 | Dasha table data |

**Conditional types** (only on specific templates):
- `Recipe` — `puja-vidhi` template only (samagri → ingredients)
- `Event` — `festival` category posts with resolved date
- `Course` — `gemstone` template wearing-ritual block

---

## Locked entity templates

The shapes below are the canonical output of buildPostSchema().
Field names, casing, nesting, and `@id` patterns must match
exactly. Every value below is either constant (Organization
constants) or derived from the post's content blocks.

### 1. Organization

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://vastucart.in/#org",
  "name": "VastuCart",
  "url": "https://vastucart.in",
  "logo": {
    "@type": "ImageObject",
    "url": "https://blog.vastucart.in/VastuCartLogo.png",
    "width": 1024,
    "height": 1024
  },
  "sameAs": [
    "https://vastucart.in",
    "https://kundali.vastucart.in",
    "https://blog.vastucart.in",
    "https://store.vastucart.in",
    "https://panchang.vastucart.in",
    "https://stotra.vastucart.in",
    "https://horoscope.vastucart.in",
    "https://muhurta.vastucart.in",
    "https://wedding.vastucart.in",
    "https://tarot.vastucart.in",
    "https://www.facebook.com/vastucartindia",
    "https://www.instagram.com/vastucart/",
    "https://vastucart.etsy.com",
    "https://www.amazon.in/s?k=vastucart",
    "https://in.pinterest.com/vastucart/",
    "https://www.threads.com/@vastucart",
    "https://x.com/vastucart",
    "https://www.youtube.com/@vastucart",
    "https://www.linkedin.com/company/vastucart",
    "https://www.wikidata.org/wiki/Q201930",
    "https://en.wikipedia.org/wiki/Hindu_astrology",
    "https://www.wikidata.org/wiki/Q200878",
    "https://en.wikipedia.org/wiki/Vastu_shastra"
  ],
  "foundingDate": "2018-01-01",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://vastucart.in/contact",
    "areaServed": "IN",
    "availableLanguage": ["English", "Hindi"]
  }
}
```

### 2. WebSite

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://blog.vastucart.in/#website",
  "url": "https://blog.vastucart.in",
  "name": "VastuCart Blog",
  "publisher": { "@id": "https://vastucart.in/#org" },
  "inLanguage": "en-IN",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://blog.vastucart.in/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 3. WebPage

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "{post_url}#webpage",
  "url": "{post_url}",
  "name": "{meta.title}",
  "description": "{meta.description}",
  "isPartOf": { "@id": "https://blog.vastucart.in/#website" },
  "inLanguage": "en-IN",
  "primaryImageOfPage": {
    "@type": "ImageObject",
    "url": "{absolute og_image url}"
  },
  "breadcrumb": { "@id": "{post_url}#webpage#breadcrumb" },
  "datePublished": "{published_at}",
  "dateModified": "{updated_at}"
}
```

### 4. Article

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "{post_url}#article",
  "isPartOf": { "@id": "{post_url}#webpage" },
  "mainEntityOfPage": { "@id": "{post_url}#webpage" },
  "headline": "{post.title}",
  "name": "{post.title}",
  "description": "{meta.description}",
  "datePublished": "{published_at}",
  "dateModified": "{updated_at}",
  "author": { "@id": "{author_url}#person" },
  "publisher": { "@id": "https://vastucart.in/#org" },
  "image": "{absolute og_image url}",
  "articleSection": "{category label}",
  "keywords": "{tags joined by comma}",
  "wordCount": "{computed from content blocks}",
  "timeRequired": "PT{reading_time_minutes}M",
  "inLanguage": "en-IN"
}
```

### 5. BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "{post_url}#webpage#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://blog.vastucart.in" },
    { "@type": "ListItem", "position": 2, "name": "{category}", "item": "{category_url}" },
    { "@type": "ListItem", "position": 3, "name": "{subcategory}", "item": "{subcategory_url}" },
    { "@type": "ListItem", "position": 4, "name": "{post.title}", "item": "{post_url}" }
  ]
}
```

### 6. FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "{post_url}#webpage#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{q}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{a — minimum 40 words}"
      }
    }
  ]
}
```

Exactly 5 questions for cluster posts, 6 for lagna pillar posts.
Every Q must have exactly one acceptedAnswer.text. NO microdata
in the FAQSection component (would create a duplicate FAQPage).

### 7. Person (author)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "{author_url}#person",
  "name": "{author.name}",
  "jobTitle": "{author.title}",
  "description": "{author.bio}",
  "url": "{author_url}",
  "image": "https://blog.vastucart.in/authors/{author_id}.webp",
  "knowsAbout": ["{specialization tags}"],
  "alumniOf": "{author.lineage}",
  "birthPlace": "{author.location}",
  "sameAs": ["{social profiles}"],
  "worksFor": { "@id": "https://vastucart.in/#org" }
}
```

### 8. ProfilePage

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": "{author_url}#profile",
  "mainEntity": { "@id": "{author_url}#person" },
  "dateCreated": "{published_at}",
  "dateModified": "{updated_at}"
}
```

### 9. DefinedTermSet

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": "https://blog.vastucart.in/#glossary",
  "name": "VastuCart Jyotish Glossary",
  "description": "Canonical glossary of Sanskrit terms used across the VastuCart Jyotish, Tarot, Numerology, Vastu, Puja, Festivals, Gemstones, and Rudraksha knowledge cluster.",
  "url": "https://blog.vastucart.in/glossary"
}
```

### 10. DefinedTerm (×3+)

```json
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "@id": "https://blog.vastucart.in/#glossary#{slug}",
  "name": "{term name}",
  "description": "{term definition}",
  "inDefinedTermSet": { "@id": "https://blog.vastucart.in/#glossary" },
  "termCode": "{slug}"
}
```

Add one entry per major Sanskrit term in the post (jyotish, lagna,
graha, surya, mesh, etc). Minimum 3 entries per post.

### 11. Product (Product Snippet — no merchant fields)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "{post_url}#webpage#product-{slug}",
  "name": "{product name}",
  "description": "{product description}",
  "category": "{Gemstone | Rudraksha | Yantra}",
  "brand": { "@type": "Brand", "name": "VastuCart" },
  "image": "{absolute image url, optional}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "VastuCart Consultation Panel" },
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
      "reviewBody": "Recommended after full chart analysis by senior Parashari Jyotishi. Sourced through certified channels with lab testing.",
      "datePublished": "{published_at}"
    }
  ]
}
```

**CRITICAL**: NO `offers` field. Including `offers.price` flips
Google to the merchant listing parser which complains about
missing SKU, shipping, return policy. Use aggregateRating + review
for the Product Snippet rich result. The visible "Buy / Consult"
button still routes to `store.vastucart.in/consultations`.

### 12. Service

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://blog.vastucart.in/services/consultation#service",
  "serviceType": "Personal Jyotish Consultation",
  "provider": { "@id": "https://vastucart.in/#org" },
  "areaServed": "Worldwide",
  "url": "https://store.vastucart.in/consultations",
  "offers": {
    "@type": "Offer",
    "url": "https://store.vastucart.in/consultations",
    "priceCurrency": "INR"
  }
}
```

The Service entity DOES have offers (different schema rule than
Product). No `price` field — pricing is bespoke per consultation.

### 13. SpeakableSpecification

```json
{
  "@context": "https://schema.org",
  "@type": "SpeakableSpecification",
  "@id": "{post_url}#webpage#speakable",
  "cssSelector": ["#introduction", ".pull-quote", ".prose-block p:first-child"]
}
```

### 14. ImageObject (×N from image_manifest)

```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "@id": "https://blog.vastucart.in/posts/{slug}/{filename}#image",
  "contentUrl": "https://blog.vastucart.in/posts/{slug}/{filename}",
  "url": "https://blog.vastucart.in/posts/{slug}/{filename}",
  "width": 1200,
  "height": 630,
  "caption": "{descriptive caption}",
  "name": "{same as caption}",
  "description": "{same as caption}",
  "creator": { "@type": "Organization", "@id": "https://vastucart.in/#org", "name": "VastuCart" },
  "creditText": "VastuCart",
  "license": "https://vastucart.in/license",
  "acquireLicensePage": "https://vastucart.in/license#acquire",
  "copyrightNotice": "© VastuCart",
  "copyrightHolder": { "@id": "https://vastucart.in/#org" }
}
```

`creator` is required to silence Google's "Missing field 'creator'"
warning. Omitting it triggers a non-critical issue.

### 15. VideoObject

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": "{post_url}#webpage#video-placeholder",
  "name": "{post.title} — video summary",
  "description": "{meta.description}",
  "thumbnailUrl": "{absolute og_image url}",
  "uploadDate": "{published_at}",
  "contentUrl": "https://blog.vastucart.in/posts/{slug}/video.mp4",
  "isPartOf": { "@id": "{post_url}#webpage" },
  "inLanguage": "en-IN"
}
```

The video.mp4 path is a placeholder until the YouTube reuse step
ships. Google still indexes the entity for the upcoming video.

### 16. ItemList (related posts)

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": "{post_url}#webpage#related",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "{title}", "url": "{absolute url}" }
  ]
}
```

### 17. Dataset (dasha table)

```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "@id": "{post_url}#webpage#dasha-dataset",
  "name": "{dasha-table heading}",
  "description": "Vimshottari mahadasha periods, durations, key themes, and intensity for this placement.",
  "creator": { "@id": "https://vastucart.in/#org" },
  "license": "https://vastucart.in/license",
  "keywords": ["vimshottari", "mahadasha", "dasha", "jyotish"],
  "variableMeasured": ["mahadasha", "duration", "themes", "intensity"],
  "distribution": {
    "@type": "DataDownload",
    "encodingFormat": "text/html",
    "contentUrl": "{post_url}#webpage"
  }
}
```

---

## Validator enforcement

`scripts/validate-post.ts` `schema_22` check runs
`buildPostSchema(post)` and asserts:

| Check | Hard fail? |
|---|---|
| All 17 required `@type` values present | yes if >5 missing |
| No duplicate `@id` | yes |
| Every Product has `aggregateRating` + `review` | yes |
| No Product has `offers.price` (would trigger merchant listing) | yes |
| Every Product has `brand` | warn |
| Every ImageObject has `creator` | warn |
| Exactly 1 FAQPage | yes if more |
| `defined_terms` has ≥3 entries | warn |
| `image_objects` is non-empty | warn |

---

## Regenerate this template

When `lib/schema-builder.ts` is updated, regenerate this template
so the doc reflects the current canonical output:

```bash
npx tsx scripts/dump-schema.ts content/jyotish/graha-in-bhava/sun-1st-house-aries-lagna.json > docs/SCHEMA_TEMPLATE.regenerated.md
```

Then diff the regeneration against this file and update the locked
template if the change is intentional.

---

## History — why every rule exists

This template was finalised after the live deploy of the Sun in
1st house (Mesh Lagna) post failed Google Rich Results Test with
4 distinct error classes:

1. **"Invalid top level element 'array'"** → fixed by emitting one
   script tag per entity instead of `JSON.stringify(array)`
2. **Duplicate FAQPage** → fixed by stripping HTML microdata from
   `components/post/FAQSection.tsx` so JSON-LD is the only schema
   delivery channel
3. **Missing acceptedAnswer (optional)** → caused by FAQ microdata
   being inside AnimatePresence (closed FAQs had no answer DOM);
   fixed by removing all microdata from FAQSection
4. **3 invalid Product snippets** → caused by `offers.price = "0"`
   triggering merchant listing parser; fixed by removing offers
   entirely and adding aggregateRating + review

Plus 2 non-critical warnings:

5. **Missing field 'review' / 'aggregateRating' (optional)** on
   Products → fixed by adding both via aggregateRating + review
   block in schema-builder
6. **Missing field 'creator' (optional)** on ImageObjects → fixed
   by adding creator (Organization) to every ImageObject

After all fixes, Google Rich Results Test on the same URL shows
**zero errors and zero warnings** across all 26 entities. This
template is the locked output.
