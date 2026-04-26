# Thin content rules

The blog publishes 1296 planet-in-house posts plus hundreds of
gemstone, rudraksha, festival, puja, vastu, and tarot posts. The
risk with that volume is thin content — boilerplate paragraphs
copied across posts with only the planet name swapped. Google
treats this as the same page and the entire cluster gets
demoted.

These rules prevent that. Every gate is enforced by the validator
or the duplication audit script. Posts that fail do not publish.

---

## Rule 1 — Unique vocabulary ratio ≥ 32%

`unique_words / total_words` for the prose body must be at least
0.32. Below that, the post is filler. Above 0.38 is healthy.

Enforced in `scripts/validate-post.ts` `thin_content` check.

## Rule 2 — Per-block novelty ≥ 30 tokens

Every prose block (each `<h2>` section) must contribute at least
30 tokens that did not appear in any earlier prose block of the
same post. Catches the case where a writer pastes the same
paragraph under multiple H2s.

## Rule 3 — Zero duplicate sentences

No two sentences (≥20 chars) inside a single post may be
identical. Enforced as a hard-fail.

## Rule 4 — Cross-post 5-gram overlap < 40%

`scripts/duplicate-content-audit.ts` walks every post pair and
computes Jaccard similarity over 5-grams. Any pair above 0.40
is flagged.

This is the gate that catches the programmatic-template trap:
9 planets × 12 lagnas × 12 houses = 1296 posts. If any 5
sentences repeat across posts, every pair lights up.

How to pass: every post must have:

- A unique opening hook (100+ words specific to the combo).
- A unique remedy specific to the planet+house+lagna combo.
- A unique case anecdote in the practitioner-voice block.
- Unique data values in the kundali-visual block.

## Rule 5 — No template placeholder leakage

`{{...}}`, `${...}`, `TODO:`, the literal word "placeholder" —
none may appear in any prose block. Hard fail.

## Rule 6 — Programmatic posts must declare uniqueness

Every programmatic post must include a `uniqueness_hash` field
in its JSON containing the SHA-256 of the unique opening hook.
The validator checks no two posts share the same hash.

(This is a future check — to be added when programmatic
generation is wired.)

## Rule 7 — Paragraph length ≤ 3 sentences (scannability)

Every paragraph in `prose` and `scannable-prose` blocks must be
3 sentences or fewer. The validator measures sentences-per-paragraph
across the post and hard-fails on average > 3.5 or any single
paragraph > 5 sentences.

Why: long paragraphs read like AI on Surfer / Originality / GPTZero
and lose Rank Math scannability score points. They also collapse
the eye-flow pattern Google rewards on mobile.

## Rule 8 — Sentence-length burstiness ≥ minimum variance

Sentence-length variance is measured across each `prose` /
`scannable-prose` block. If the standard deviation of word counts
across sentences in a block is below 4 words, the block reads
like AI and is flagged.

How to pass: mix short punchy sentences (2 to 5 words) with
longer nuanced ones (15 to 25 words). The natural human cadence
swings between short and long.

Banned cadence pattern: every sentence between 14 and 18 words.
That signature flags as AI on every common detector.

## Rule 9 — 8th-9th grade English reading level

The English narrative (excluding italicised Sanskrit terms +
their parenthetical glosses) must read at a Flesch-Kincaid grade
of 8.0 to 9.5. Higher is too dense. Lower loses topical
authority.

Sanskrit terms italicised on first use plus their immediate
English gloss in parens count as the gloss only, e.g.
`*trikona (auspicious dharmic angle)*` is measured as the four
English words "auspicious dharmic angle" plus the Sanskrit
treated as a proper noun. Repeat occurrences of the Sanskrit
term (no italics, no gloss) count as a single token.

The validator uses a Flesch-Kincaid-style approximation
(syllable estimation via vowel-cluster counting). Hard-fail
on grade > 11 or < 6.

## Rule 10 — High burstiness + topical depth simultaneously

The combination of Rules 7, 8, 9 is the anti-AI signature.
Pass all three and the post reads as human-authored across
every common detector. Fail any one and the cluster risks
demotion.

---

## What is allowed to repeat

Some elements MUST repeat across posts and are exempt from the
duplication audit:

- Author bio (the same `VastuCart Editorial` paragraph)
- Reviewer block (`VastuCart Jyotish Review Panel`)
- Internal-links block (same tools listed across posts)
- Footer disclaimer
- Stat-strip labels (the cells repeat, only the values change)
- Schema boilerplate

The duplication audit only scans `prose`, `pull-quote`, and
`faq.a` blocks. Author and footer blocks are skipped.

---

## Why this matters

Programmatic content is not the problem. Boilerplate
programmatic content is. Pinterest, Reddit, Yelp, IMDb all
publish billions of programmatic pages and rank because every
page has unique data + unique commentary on that data. We
follow the same model.

The validator + audit script make it impossible to publish
the boilerplate version by accident.
