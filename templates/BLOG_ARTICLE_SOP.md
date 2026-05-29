# PORTABLE BLOG-ARTICLE WRITING SOP — hand-off module (2026-05-29)

> **HOW TO USE THIS (read first, to the receiving Claude Code terminal):**
>
> This is a **complementary, additive** module extracted from a sister project's SOP. **Do NOT replace, overwrite, or restructure your project's existing SOP, conventions, components, or tokens.** Treat everything below as a *candidate set*. For each item:
> 1. Check whether your project already covers it (same or stronger). If yes → **skip it, keep yours.** No duplication, no overlap.
> 2. If it is genuinely **absent** from your project → adopt it, adapting names/paths/tokens to your codebase.
> 3. If it **conflicts** with something your project already does → **STOP and ASK the operator** which wins. Do not silently merge or assume.
>
> **Ask before any critical or irreversible decision** (changing the article template structure, schema strategy, word-count floor, image pipeline, or anything that touches more than the file in front of you). State the options + your recommendation, then wait. Do not assume.
>
> This module is about **article QUALITY for the current Google/AI-search era** (AI Overviews, AI Mode, ChatGPT/Perplexity/Gemini answers). It is niche-agnostic — swap the example domain (water-damage/bedbug) for yours.

---

## 0. THE ONE-LINE THESIS

SEO = "rank in the list." **GEO** = "be the sentence the AI quotes." Google is shifting from blue links to AI-synthesized answers; a growing share of queries are answered with **zero clicks**. So every article must be built to be **liftable and citable by a machine reader**, while still reading as a confident human expert. Optimize both; when they conflict, **structure for the machine reader** and ask the operator if the trade-off is non-trivial.

---

## 1. NON-NEGOTIABLE ARTICLE SPEC

- **Length:** ≥ 2000 words as a **coverage floor**, never via padding. A dense 1,500-word piece beats a padded 3,000. If a sentence adds no new fact/example/action → delete it.
- **100% original**, passes plagiarism check vs the current top-3 SERP results for the primary keyword.
- **Absolute factual accuracy.** No internal contradictions across the site's pages.
- **US English only** (or your market's locale — confirm with operator). Build should fail on stray en-GB/IN/AU spellings if you have a gate.

## 2. ANTI-AI-DETECTION (humanization) — still applies in the AI era

- **Burstiness:** mix punchy 3–5 word sentences with long 30+ word multi-clause ones. Avg ~14 words, std-dev ≥ 6. Uniform sentence length is the #1 AI tell.
- **Banned-phrase list:** maintain an `ai-tells` list (e.g. "Whether you're X, Y, or Z", "In today's fast-paced world", "It's important to note", "When it comes to", em-dash-itis, "elevate", "delve", "robust", "seamless"). Hard-fail → rewrite. **Zero emoji in body content. No exclamation marks.**
- **Conversational authority:** active voice, confident, slightly opinionated. Natural transitions ("Here's the thing," "Look at the data").
- **Voice layer (mandatory):** before drafting, load per-niche voice files — `voice.md` (persona), `humor.md` (calibrated per niche; emergency/legal/medical = low), `stats.md` (real numbers only), `stories.md` (one local archetype max), `opinions.md` (one strong opinion max). Inject persona first, then write.
- **The "don't hire us for X" moment:** somewhere in each article, honestly tell the reader when they DON'T need the paid service (DIY threshold). Biggest trust signal; also a strong human tell.

## 3. THE 7 GEO MECHANICS (this is the "recent Google upgrade" core — adopt any you don't already have)

1. **Passage-level answer blocks (highest leverage).** Under **every question-style H2**, the FIRST paragraph is a **self-contained 40–75-word direct answer** that makes sense lifted out of context. Lead with the answer, THEN elaborate. Tag it with a consistent class (we use `className="geo-answer"`) so it's greppable + styleable. LLMs extract passages, not pages.
   - ❌ "There are several things to consider when…" (buries it)
   - ✅ "Mold can begin within 24–48 hours of saturation per EPA guidance. Visible growth lags 3–10 days. Extract and dry inside 48 hours and most material is restorable; past it, more shifts to tear-out." (liftable, complete, specific)
2. **Cited, real statistics.** ≥ 2 specific data points per article, each attributed to a **real, nameable authority** (EPA, IICRC, a named university study, .gov). **NEVER fabricate a statistic or source.** Can't attribute it → don't state it as a stat.
3. **Information density over length** (see floor above).
4. **Structured formatting for machine extraction.** ≥ 1 comparison **table** OR ordered **step-list** per article. Plus a `keyFacts` sidebar and `HowTo` schema where the topic is procedural. Tables/steps/definition-lists are what LLMs slice into summaries.
5. **Entity + schema precision** (see §5).
6. **Conversational long-tail intent.** Question-style H2s phrased exactly as a worried person speaks; a "what to do right now" section for emergency niches.
7. **llms.txt + AI-crawler access.** Ship `/llms.txt`; ensure `robots.txt` ALLOWS citation/retrieval bots (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended). Keep llms.txt current as articles ship.

## 4. AEO (answer-engine / voice / featured-snippet)

- **TL;DR / direct answer** as the first paragraph of the article (snippet bait), tagged `.tldr`.
- **FAQ block: ≥ 10 long-tail, PAA-sourced questions** (this supersedes any older "5–7" guidance). Each answer opens with a ≤ 40-word snippet-style sentence, then up to 2–3 more. Phrase questions exactly as people ask them.
- **`speakable` schema** targeting `h1`, `.tldr`, `.geo-answer`, `.faq-answer` for voice assistants.

## 5. SCHEMA SET (every article — adopt any you're missing)

`Article` + `author` (Person) + `publisher` (Organization) · `BreadcrumbList` · `FAQPage` · `speakable` · `ImageObject` per body image · `HowTo` when procedural · and on the home/pillar page a definitional **"What is X?"** answer block for the niche's core entity. Service-area businesses: `LocalBusiness`/`Service` with precise `areaServed` + `geo` + `sameAs`; **omit `priceRange`** if you force phone-for-pricing. Validate in a build gate. **`dateModified` bumps ONLY on real edits** (honest freshness — never auto-fake recency).

## 6. INTERNAL LINK MESH (per article)

- Exactly **4 in-body internal links**, **relative paths only** (critical for subdomain → EMD migration without rewrites). Vary anchor text (mix exact + partial match). Destinations: 1 → cluster/service page · 1 → related support post · 1 → sister-niche/locality when relevant · 1 → pillar/home.
- **2–3 inline CTA buttons** in the body (styled buttons, not plain links; sales copy; phone pulled from a single source-of-truth config, never hardcoded).
- 1–2 **outbound** links to high-authority sources (.gov/.edu/Wikipedia/industry body), `rel="noopener nofollow" target="_blank"`. **Never link competitors.**
- Every cluster page carries a `RelatedLinks`/related-posts block; no orphan pages.

## 7. IMAGE DISCIPLINE (per article)

- **1 hero + 4–6 body images.** Each body image tied semantically to the H2 it sits under — **no generic stock**, and **verify each image actually depicts what the caption says before shipping** (a "moisture meter" query can return a glucose meter; "sump pump" can return a race-car pit lane — open the image, don't trust the filename).
- Responsive variants (AVIF + WebP + JPG at hero/thumb widths) via one shared `<ResponsiveImage>`; **every referenced variant must exist** or it 404s.
- Geo-tag images (EXIF GPS + IPTC/XMP location) to match the `ImageObject` schema — three-layer location-consistency signal.
- Descriptive, keyworded `alt` text on every image.

## 8. PAGE FURNITURE

Table of contents (anchor-linked H2s) · TL;DR first paragraph · author byline (Person schema) · honest "last updated" · keyFacts sidebar · FAQ accordion · closing CTA band.

## 9. NO-FABRICATION GUARDRAIL (read twice)

Never invent: certifications, license numbers, association memberships (BBB/NESDCA/IICRC numbers), specific years-in-business, review counts/ratings, response-time guarantees ("we'll be there in 15 minutes"), or "our own crew/trucks" if the model is a referral/connector. If the operator hasn't verified it, **don't claim it** — use a neutral, true alternative and **ask the operator** if you're unsure whether a claim is substantiated.

## 10. SUGGESTED MASTER PROMPT (compose into your `/blog` skill — adapt, don't blindly paste)

```
You are an elite, human-level SEO+GEO content strategist and subject-matter
expert. Write a comprehensive, rank-worthy, AI-citable article of ≥2000 words
(coverage floor, no padding) on:
  TOPIC / PRIMARY KEYWORD / LOCATION / NICHE: [fill from project config]

1. HUMANIZE: burstiness (avg ~14 words, std-dev ≥6); banned-phrase list; active
   voice; load voice/humor/stats/stories/opinions files; one "don't hire us for X".
2. GEO: every question-H2 opens with a 40–75-word self-contained .geo-answer
   passage; ≥2 real attributed stats; ≥1 table or step-list; dense, zero filler.
3. AEO: .tldr first paragraph; ≥10 PAA FAQ, each answer ≤40-word lead; speakable.
4. SEO: primary + ~5 secondary + ~8 tertiary keywords woven naturally (no
   stuffing); H2 = intent statement not label; never skip heading levels.
5. LINKS: exactly 4 relative-path internal links (cluster/support/sister/pillar);
   2–3 inline CTA buttons (phone from source-of-truth); 1–2 .gov/.edu outbound.
6. SCHEMA: Article+author+publisher, FAQPage, speakable, ImageObject/body image,
   BreadcrumbList, HowTo if procedural. dateModified only on real edits.
7. IMAGES: 1 hero + 4–6 body, each matched to its H2 and visually verified.
8. NEVER fabricate stats, sources, credentials, or guarantees.
Begin the ≥2000-word article now.
```

---

### REMINDER TO THE RECEIVING TERMINAL
Adopt **only what your project lacks**. Keep your own templates, tokens, and components. On any conflict or critical/irreversible choice, **ask the operator with options + a recommendation — never assume.** When done, list exactly which items you adopted and which you skipped (because the project already had them), so the operator can audit the diff.
