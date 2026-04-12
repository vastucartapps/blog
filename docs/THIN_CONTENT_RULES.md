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

---

## What is allowed to repeat

Some elements MUST repeat across posts and are exempt from the
duplication audit:

- Author bio (the same `Pt. Raghav Sharma` paragraph)
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
