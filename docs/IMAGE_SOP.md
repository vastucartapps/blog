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

---

## 11. SVG-first authoring → WebP delivery pipeline

The generative image API is gated behind cost and quota. The
SVG-first pipeline gives every post real, on-disk, on-brand
images today, with zero API calls, while keeping the same WebP
delivery contract Google expects.

### Pipeline

1. **Author writes SVG inline** during post creation. SVG is text,
   so the author can hand-craft it from the templates below.
2. SVG saved at `public/posts/{slug}/{slug}-{suffix}.svg`.
3. **`scripts/svg-to-webp.ts`** runs (locally or in CI). Reads
   every `.svg` in `public/posts/`, rasterises via `sharp` at the
   target dimensions, writes the matching `.webp` next to it.
4. The post `image_manifest` references the `.webp` filename.
   The renderer uses `next/image` with explicit `width` and
   `height`. CLS = 0.
5. **`scripts/backfill-post-images.ts`** runs in a separate
   terminal for past posts. Walks `content/`, finds posts whose
   `image_manifest` files are missing, generates SVGs from the
   templates using the manifest's `style` + `slot` + planet/lagna
   metadata, runs the conversion.

### SVG templates by image type

Each template is a self-contained `<svg>` block. Substitute
`{slug}`, `{planet_glyph}`, `{sign_glyph}`, `{house_number}`,
`{primary_color}`, `{accent_color}` from the post JSON and the
brand palette.

#### 11.1 Hero illustration (1200×630)

A compositional hero with planet glyph + sign glyph + brand
gradient. Saved as `public/posts/{slug}/{slug}-hero.svg` →
converted to `{slug}-hero.webp`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"
     role="img" aria-label="{alt}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{primary_color}"/>
      <stop offset="100%" stop-color="#013F47"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.4" r="0.5">
      <stop offset="0%" stop-color="{accent_color}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="{accent_color}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="850" cy="280" r="220" fill="url(#glow)"/>
  <!-- planet glyph: large, top-right -->
  <text x="850" y="320" text-anchor="middle"
        font-family="serif" font-size="240"
        fill="{accent_color}" opacity="0.85">{planet_glyph}</text>
  <!-- sign glyph: small, bottom-right -->
  <text x="850" y="500" text-anchor="middle"
        font-family="serif" font-size="80"
        fill="#faf6ef" opacity="0.7">{sign_glyph}</text>
  <!-- house number watermark: bottom-left -->
  <text x="120" y="540" font-family="serif" font-size="180"
        fill="#faf6ef" opacity="0.08" font-weight="700">{house_number}</text>
  <!-- brand band: bottom strip -->
  <rect x="0" y="600" width="1200" height="30" fill="#013F47"/>
</svg>
```

Planet glyphs (Unicode astrological): ☉ Sun, ☽ Moon, ♂ Mars,
☿ Mercury, ♃ Jupiter, ♀ Venus, ♄ Saturn, ☊ Rahu, ☋ Ketu.

Sign glyphs: ♈ Mesha, ♉ Vrishabha, ♊ Mithuna, ♋ Karka, ♌ Simha,
♍ Kanya, ♎ Tula, ♏ Vrishchika, ♐ Dhanu, ♑ Makara, ♒ Kumbha,
♓ Meena.

Brand colour pairs per planet:
- Sun → primary `#e8840a`, accent `#FFD27A`
- Moon → primary `#338a95`, accent `#E0F4F7`
- Mars → primary `#c94444`, accent `#FFB7B7`
- Mercury → primary `#338a95`, accent `#9FE5C8`
- Jupiter → primary `#f4b942`, accent `#FFE9B0`
- Venus → primary `#e8840a`, accent `#FFE0EC`
- Saturn → primary `#013F47`, accent `#9DA8AC`
- Rahu → primary `#013F47`, accent `#7B6FB7`
- Ketu → primary `#338a95`, accent `#9DA8AC`

#### 11.2 Kundali chart diagram (1024×1024)

North Indian diamond chart with the placement house highlighted.
Saved as `{slug}-north-indian-kundali.svg`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"
     role="img" aria-label="{alt}">
  <rect width="1024" height="1024" fill="#faf6ef"/>
  <!-- outer square -->
  <rect x="62" y="62" width="900" height="900"
        fill="none" stroke="#013F47" stroke-width="3"/>
  <!-- diagonals -->
  <line x1="62" y1="62" x2="962" y2="962" stroke="#013F47" stroke-width="2"/>
  <line x1="962" y1="62" x2="62" y2="962" stroke="#013F47" stroke-width="2"/>
  <!-- mid cross -->
  <line x1="512" y1="62" x2="512" y2="962" stroke="#013F47" stroke-width="2" opacity="0"/>
  <line x1="62" y1="512" x2="962" y2="512" stroke="#013F47" stroke-width="2" opacity="0"/>
  <!-- inner diamond -->
  <polygon points="512,62 962,512 512,962 62,512"
           fill="none" stroke="#013F47" stroke-width="3"/>
  <!-- highlight target house with primary_color fill at 0.18 opacity -->
  <!-- (template substitutes the polygon for house N) -->
  <!-- planet glyph centred in highlighted house -->
  <text x="{glyph_x}" y="{glyph_y}" text-anchor="middle"
        font-family="serif" font-size="64"
        fill="{primary_color}">{planet_glyph}</text>
  <!-- house numbers in Devanagari around the chart -->
  <!-- ... -->
</svg>
```

A reusable helper `lib/svg/kundali.ts` produces the polygon for
each house number 1–12 so authors do not hand-code coordinates.

#### 11.3 Gemstone vignette (1024×768)

Stylised gemstone illustration. Reuses
`public/gemstones/{slug}.png` if available and that asset is
listed in `VALID_GEMSTONE_SLUGS`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768"
     role="img" aria-label="{alt}">
  <defs>
    <radialGradient id="velvet" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0%" stop-color="#1a2530"/>
      <stop offset="100%" stop-color="#000"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="768" fill="url(#velvet)"/>
  <image href="/gemstones/{gemstone_slug}.png"
         x="262" y="134" width="500" height="500"
         preserveAspectRatio="xMidYMid meet"/>
  <text x="512" y="700" text-anchor="middle"
        font-family="serif" font-size="36" fill="#faf6ef">
    {gemstone_name_sanskrit} ({gemstone_name_english})
  </text>
</svg>
```

#### 11.4 Stotra parchment (1024×768)

Sanskrit verse on parchment background.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768"
     role="img" aria-label="{alt}">
  <defs>
    <linearGradient id="parchment" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FBF5E2"/>
      <stop offset="100%" stop-color="#E8DDB7"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="768" fill="url(#parchment)"/>
  <rect x="40" y="40" width="944" height="688"
        fill="none" stroke="#c9a84c" stroke-width="6"/>
  <text x="512" y="200" text-anchor="middle"
        font-family="'Noto Sans Devanagari', serif"
        font-size="56" fill="#013F47">
    {stotra_devanagari_first_line}
  </text>
  <text x="512" y="280" text-anchor="middle"
        font-family="'Noto Sans Devanagari', serif"
        font-size="48" fill="#013F47">
    {stotra_devanagari_second_line}
  </text>
  <text x="512" y="500" text-anchor="middle"
        font-family="serif" font-style="italic"
        font-size="32" fill="#5a4a30">
    — {stotra_name}
  </text>
</svg>
```

### svg-to-webp.ts contract

```bash
# Convert every .svg in public/posts/ to .webp at the target
# dimensions read from the SVG viewBox.
npx tsx scripts/svg-to-webp.ts

# Convert a specific post directory
npx tsx scripts/svg-to-webp.ts --post sun-2nd-house-aries-lagna

# Force regenerate even if .webp newer than .svg
npx tsx scripts/svg-to-webp.ts --force
```

Output: WebP files at the matching path, lossless palette
optimisation, target size ≤ 200 KB for hero (1200×630), ≤ 100 KB
for in-body (1024×768 / 1024×1024).

### backfill-post-images.ts contract

For the parallel agent terminal:

```bash
# Walk content/, generate missing SVGs from templates, run
# conversion. Reports progress per post.
npx tsx scripts/backfill-post-images.ts

# Limit to a subset
npx tsx scripts/backfill-post-images.ts --category jyotish --subcategory graha-in-bhava
```

The script reads each post's `image_manifest`, identifies missing
files in `public/posts/{slug}/`, picks the right template based on
the `slot` field (`hero` → 11.1, `kundali` → 11.2, `gemstone` →
11.3, `stotra` → 11.4), substitutes the metadata, writes the SVG,
and runs the conversion. Idempotent.

### Aspect ratios (locked)

| Slot              | SVG viewBox | WebP output | Use                  |
|-------------------|-------------|-------------|----------------------|
| hero              | 1200×630    | 1200×630    | OG image, hero figure|
| kundali-chart     | 1024×1024   | 1024×1024   | square diagram       |
| in-body figure    | 1024×768    | 1024×768    | mid-article          |
| gemstone vignette | 1024×768    | 1024×768    | gemstone block       |
| stotra parchment  | 1024×768    | 1024×768    | stotra block         |

All SVGs include a `role="img"` and `aria-label` matching the
manifest `alt`. Accessibility-first.
