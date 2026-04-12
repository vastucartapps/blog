# Image SOP — VastuCart Blog

Locked image rules for every post. The platform supports them today
via `<ImageFigure>` placeholders. When the generative image API is
configured, `scripts/generate-images.ts` walks every post and fills
the placeholders without touching the post JSON.

---

## 1. Image budget per post template

| Template          | Hero | Intro figure | Mid figure | Component image | Total |
|-------------------|------|--------------|------------|-----------------|-------|
| planet-in-house   | 1    | 1            | 1 optional | 0               | 3 + 1 |
| lagna-profile     | 1    | 1            | 1          | 1 (kundali svg) | 4     |
| nakshatra         | 1    | 1            | 1          | 1 (nakshatra symbol) | 4 |
| tarot-card        | 1    | 1            | 0          | 1 (card art)    | 3     |
| numerology-number | 1    | 1            | 1          | 0               | 3     |
| vastu             | 1    | 1            | 1          | 0               | 3     |
| festival          | 1    | 1            | 1          | 1 (deity portrait) | 4  |
| gemstone          | 1    | 1            | 0          | 1 (real stone photo, already in `public/gemstones/`) | 3 |
| puja-vidhi        | 1    | 1            | 1          | 0               | 3     |
| rudraksha         | 1    | 1            | 0          | 1 (rudraksha SVG generated) | 3 |

## 2. Image manifest — required JSON shape per image

```json
{
  "slot": "hero",
  "filename": "sun-1st-house-aries-lagna-rising-sun-over-temple.webp",
  "filename_og": "sun-1st-house-aries-lagna-og.png",
  "alt": "Rising sun over an ancient temple at dawn, exalted Surya in Mesh lagna",
  "caption": "Surya at his exact exaltation degree of ten in Aries, the throne of the soul.",
  "width": 1200,
  "height": 900,
  "format": "webp",
  "lazy": false,
  "credit": "VastuCart",
  "style": "editorial illustration",
  "generation_prompt": "Editorial illustration, soft golden hour lighting, ancient Indian temple silhouette in foreground, large rising sun behind it, deep teal sky transitioning to saffron and gold, subtle Vedic geometric patterns in the corners, no text, no watermark, brand palette deep teal #013F47 saffron #e8840a gold #c9a84c, painterly style, 4k, high detail",
  "negative_prompt": "text, watermark, photorealistic faces, modern objects, western iconography, low quality, blurry, distorted, signature, logo",
  "schema_entry": {
    "@type": "ImageObject",
    "@id": "https://blog.vastucart.in/posts/sun-1st-house-aries-lagna/sun-1st-house-aries-lagna-rising-sun-over-temple.webp",
    "contentUrl": "https://blog.vastucart.in/posts/sun-1st-house-aries-lagna/sun-1st-house-aries-lagna-rising-sun-over-temple.webp",
    "width": 1200,
    "height": 900,
    "caption": "Surya at his exact exaltation degree of ten in Aries, the throne of the soul.",
    "license": "https://vastucart.in/license",
    "acquireLicensePage": "https://vastucart.in/license#acquire",
    "creditText": "VastuCart",
    "copyrightNotice": "© VastuCart"
  }
}
```

## 3. Locked rules — every image, every post, no exception

1. **Filename = slug + descriptive suffix.** `sun-1st-house-aries-lagna-rising-sun-over-temple.webp`. Never numeric (`-1.webp`, `-img2.webp`). The filename is itself an SEO signal.
2. **Alt text 8–15 words**, descriptive, contains the focus keyword once at most. **Never the filename**, never "Image of X", never empty.
3. **Caption is editorial**, 1–2 sentences, the way a real magazine writes captions. Not "Image showing Surya" but "Surya at his exact exaltation degree of ten in Aries, the throne of the soul."
4. **WebP for body images**, PNG only for the hero OG variant (Facebook prefers PNG for OG).
5. **`width` and `height` attributes always set** for CLS = 0.
6. **`loading="lazy"`** for everything except the hero. Hero gets `priority` via next/image.
7. **Every image gets an `ImageObject` schema entry** under `post.schema.image_objects`.
8. **`creditText: "VastuCart"`**, **`license: "https://vastucart.in/license"`**, **`copyrightNotice: "© VastuCart"`** on every entry. Required for Google Image Search license filter eligibility.
9. **Image manifest is part of the post JSON.** SOP and file are linked.
10. **`generation_prompt` is generated when prose is generated.** Prompts ship with the post. The image API never receives an ad-hoc prompt at runtime.
11. **Every prompt uses the brand palette** as a literal directive: `deep teal #013F47, saffron #e8840a, gold #c9a84c, cream #faf6ef`. The negative prompt forbids: `text, watermark, modern objects, western iconography, photorealistic faces, signature, logo`.
12. **Style families** (pick one per image based on slot):
    - `editorial illustration` — hero, intro, mid figures
    - `diagram` — yantra, kundali, vastu compass when generated
    - `photograph` — gemstone shots
    - `deity portrait` — festival posts, single deity reference

## 4. Filename naming convention — SEO signal

```
{slug}-{descriptive-suffix}.webp
```

- `slug` = the post slug
- `descriptive-suffix` = 2–5 kebab-case words describing the image
- No numeric suffixes
- ASCII only
- Max 80 characters total

Examples:
- `sun-1st-house-aries-lagna-rising-sun-over-temple.webp`
- `sun-1st-house-aries-lagna-vimshottari-dasha-wheel.webp`
- `diwali-puja-vidhi-lakshmi-on-lotus.webp`
- `the-fool-tarot-card-young-traveller-cliff-edge.webp`
- `life-path-number-1-golden-numeral-mandala.webp`
- `north-direction-vastu-shastra-kuber-bowl.webp`

## 5. Generation prompt template

Every prompt follows this structure:

```
[Style family]
[Subject — drawn from the post topic and the image slot context]
[Composition — wide hero / square mid / tall figure / portrait / horizontal banner]
[Lighting — golden hour / dawn / dusk / candlelit / overcast]
[Mood — devotional / authoritative / contemplative / celebratory]
[Brand palette — deep teal #013F47, saffron #e8840a, gold #c9a84c, cream #faf6ef]
[Negative — text, watermark, modern objects, western iconography, photorealistic faces, signature, logo]
[Quality — 4k, painterly, high detail]
```

The negative is identical for every image. The style + subject + composition + mood are derived from the slot and the post topic.

## 6. Placeholder rendering (today)

Until the API is wired, `<ImageFigure>` checks if `public/posts/{slug}/{filename}` exists.

- **Exists** → render `<figure>` with `<next/image>` + `<figcaption>`.
- **Does not exist** → render a styled placeholder card at the exact `width × height` with the alt text as a label and a small "Image generating" badge in the corner. Layout does not shift when the real image lands.

This means **every post can publish before the API is wired**. The image quality improves silently as soon as `scripts/generate-images.ts` runs.

## 7. Image generation script (`scripts/generate-images.ts`)

Walks every post under `content/`. For each entry in each post's `image_manifest`, checks if the file exists. If not, calls the configured image API with `generation_prompt` + `negative_prompt`, saves the result to `public/posts/{slug}/{filename}`, and continues.

Idempotent — running it twice does nothing for already-generated images.

## 8. Image sitemap

`/sitemap-images.xml` is generated from every `image_manifest` across every post. Updated on every build. Submitted to Google Search Console alongside the main sitemap.

## 9. License + EXIF

Every generated image carries:
- `creditText: "VastuCart"`
- `license: "https://vastucart.in/license"`
- `copyrightNotice: "© VastuCart"`

These appear in the schema entry AND in the IPTC metadata of the file when the API supports it. Google Image Search uses these for the **Licensable image badge** which doubles click-through.

## 10. SEO score impact per image

| Item | Impact |
|---|---|
| Filename uses descriptive suffix | High — Google reads filenames |
| Alt text descriptive + focus keyword once | High |
| Width/height attrs | High — CLS, Core Web Vitals |
| WebP format | Medium — page speed |
| ImageObject schema | High — Google Image Search rich results |
| License + creditText | Medium — Licensable badge |
| Caption | Medium — semantic context |
| Lazy loading | High — page speed |
| Image sitemap entry | High — discovery |

A post that ships without proper image SEO leaves ~30% of its potential image search traffic on the table. Locked.
