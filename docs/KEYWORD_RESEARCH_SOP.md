# Keyword research SOP — VastuCart Blog

Locked procedure run **before** prose is written. Output is a
`keyword_brief` block saved inline in the post JSON. The prose
write phase reads from the brief; it never invents keywords on the
fly.

---

## Phase 2.1 — Seed query expansion

Take the post topic. Generate ≥30 long-tail variants:

- 5 plain English variants ("Sun in 1st house Aries", "Sun in 1st
  house for Aries ascendant", "exalted Sun Aries", "Sun in lagna
  Aries", "Surya in 1st house Aries lagna")
- 5 Sanskrit-Romanised variants ("Surya pratham bhava mesh lagna",
  "Soorya pratham bhava", "Surya in lagna mesha", "Surya 1st house
  mesha rashi", "Surya graha in pratham sthan")
- 5 Hinglish variants ("surya 1st ghar mein mesh lagna", "surya
  pehle bhav me", "mesh lagna mein surya", "surya pratham bhav fal",
  "1st house ka surya mesh lagna")
- 5 question variants ("Is Sun in 1st house good for Aries lagna",
  "What does Sun in 1st house mean for Aries", "How does Sun in 1st
  house affect marriage for Aries", "Best career for Sun in 1st
  house Aries", "When does Sun in 1st house give results")
- 5 problem variants ("Sun in 1st house ego problems", "Sun in 1st
  house health issues", "Sun in 1st house father issues", "Sun in
  1st house marriage delay", "Sun in 1st house authority
  conflicts")
- 5 commercial variants ("Best ruby for Sun in 1st house Aries",
  "Sun in 1st house remedies online", "Aditya Hridayam for Sun in
  1st house", "Surya yantra for Aries lagna", "Jyotish consultation
  for Sun in 1st house")

Save all 30+ variants under `keyword_brief.seed_queries`.

## Phase 2.2 — Lingual variation pass

Pull every Sanskrit term in the post from
`lib/keyword-variations.ts`. The registry holds:

- Sanskrit (Devanagari)
- Sanskrit (Romanised IAST)
- Sanskrit (Hindi-style Romanised — what users actually type)
- Hindi (Devanagari)
- English equivalent

Examples:

```ts
{
  canonical: "surya",
  devanagari: "सूर्य",
  iast: "sūrya",
  hindi_romanised: ["surya", "soorya", "soorja", "sury"],
  hindi_devanagari: "सूर्य",
  english: ["sun", "sol", "sooraj"],
  related: ["aditya", "ravi", "bhanu", "arka", "savita"],
}
```

Variations every Romanised speaker types:

| Canonical | Variants users actually search                           |
|-----------|----------------------------------------------------------|
| surya     | surya, soorya, soorja, sury, sun, sooraj, ravi, aditya   |
| chandra   | chandra, chandrama, chandr, moon, chand                  |
| mangal    | mangal, mangala, mangla, mars, kuja, angarak             |
| budha     | budha, budh, budhh, mercury, soumya                      |
| guru      | guru, brihaspati, jupiter, brhaspati, vyas               |
| shukra    | shukra, shukr, sukra, venus, bhrigu                      |
| shani     | shani, shanee, shaneeshwar, saturn, shanaischara         |
| rahu      | rahu, raahu, north node, dragon's head                   |
| ketu      | ketu, kethu, keth, south node, dragon's tail             |
| mesh      | mesh, mesha, mesham, aries, ram                          |
| vrishabha | vrishabha, vrishabh, vrushabh, taurus, bull              |
| mithuna   | mithuna, mithun, gemini, twins                           |
| karka     | karka, karkat, karkata, cancer                           |
| simha     | simha, sinha, sinh, leo, lion                            |
| kanya     | kanya, kanyaa, virgo, virgin                             |
| tula      | tula, tulaa, libra, scales                               |
| vrishchika| vrishchika, vrischika, vrushchik, scorpio                |
| dhanu     | dhanu, dhanus, sagittarius, archer                       |
| makara    | makara, makar, capricorn                                 |
| kumbha    | kumbha, kumbh, aquarius                                  |
| meena     | meena, meen, pisces, fish                                |
| kundali   | kundali, kundli, kundla, janma kundali, birth chart      |
| dasha     | dasha, dasa, dosa, mahadasa, mahadasha, period           |
| vidhi     | vidhi, vidhee, procedure, method                         |
| kaal      | kaal, kal, kalam, time, period                           |
| puja      | puja, pooja, pujaa, worship                              |
| havan     | havan, hawan, homam, fire ritual                         |
| muhurta   | muhurta, muhurt, mahurat, auspicious time                |
| panchang  | panchang, panchanga, panchaang, almanac                  |
| nakshatra | nakshatra, nakshatr, nakshtr, lunar mansion              |
| graha     | graha, grah, planet                                      |
| bhava     | bhava, bhav, house                                       |
| stotra    | stotra, stotram, stotr, hymn                             |

Save the variations relevant to this post under
`keyword_brief.lingual_variations`.

## Phase 2.3 — Content gap audit

For each seed query, identify:

- What facts the top 5 SERP results leave out
- What questions they don't answer
- What schemas they don't have
- What images they're missing
- What internal links they don't have

Write 5 concrete gap items under `keyword_brief.content_gaps`.

The post must address all 5 gaps. This is what makes it the best
answer on the page, not the longest.

## Phase 2.4 — Question mining

Pull 5 real "People also ask" patterns. Use the canonical formats:

1. **Is X good?** ("Is Sun in 1st house good for Aries lagna?")
2. **Best Y for Z?** ("What is the best career for Sun in 1st house
   Aries lagna?")
3. **How to W?** ("How to wear ruby for Sun in 1st house Aries
   lagna?")
4. **When does V?** ("When does Sun in 1st house give best results
   in dasha?")
5. **Why does U?** ("Why does Sun in 1st house cause ego problems?")

These become the 5 FAQ slots. The phrasing must match what users
actually type, not what an editor would write.

Save under `keyword_brief.questions`.

## Phase 2.5 — LSI extraction

Identify 8–12 LSI / topic-completeness terms. These must appear at
least once in body prose.

Example for Sun in 1st house Aries:
- exaltation degree
- shadbala
- tenth lord
- seventh house aspect
- lagna lord Mangal
- Surya antardasha
- atmakaraka
- digbali
- kendra trikona rajyoga
- Aditya Hridayam
- ruby manikya
- 1-mukhi rudraksha

Save under `keyword_brief.lsi_terms`.

## Phase 2.6 — Keyword density target

| Keyword type        | Body density target |
|---------------------|---------------------|
| Focus keyword       | 0.8–1.5%            |
| Each secondary key  | 0.3–0.6%            |
| Each LSI term       | ≥1 occurrence       |

Density too low = topic looks weak.
Density too high = keyword stuffing penalty.

`scripts/seo-audit.ts` measures actual density per post and flags
both extremes.

## Phase 2.7 — Title + description hook

Title formula:

```
{focus keyword}, {benefit or curiosity hook}
```

Examples:
- "Sun in the 1st House for Aries Lagna, the Exalted Throne of the Soul"
- "Diwali 2026, the Pradosh Kaal Window That Decides the Year"
- "Ek Mukhi Rudraksha, the Bead That Removes Ego at the Root"

Description formula:

```
{focus keyword in first 100 chars} {benefit} {soft CTA}
```

Examples:
- "Surya at his exact exaltation degree turns Aries lagna into a born leader. The full Jyotish breakdown of personality, career, marriage, and the dasha years that decide everything. Read the placement that produces commanders."

Save title + description under `meta.title` + `meta.description`.

---

## `keyword_brief` shape inside the post JSON

```json
{
  "keyword_brief": {
    "focus_keyword": "sun in 1st house aries lagna",
    "secondary_keywords": [
      "surya pratham bhava mesh lagna",
      "exalted sun aries ascendant",
      "uchha surya mesh lagna",
      "sun in lagna for aries native",
      "surya 1st house effects"
    ],
    "seed_queries": [ "...30+ variants..." ],
    "lingual_variations": {
      "surya": ["surya", "soorya", "sun", "ravi", "aditya"],
      "mesh": ["mesh", "mesha", "aries", "ram"]
    },
    "content_gaps": [
      "Top 5 results don't mention digbali for Sun",
      "Top 5 results don't link to Surya antardasha timing",
      "Top 5 results don't show the tenth lord interaction",
      "Top 5 results don't have a kundali visual for the placement",
      "Top 5 results don't have FAQ schema"
    ],
    "questions": [
      "Is Sun in the 1st house good for Aries lagna?",
      "What is the best career for Sun in 1st house Aries lagna?",
      "How to wear ruby for Sun in 1st house Aries lagna?",
      "When does Sun in 1st house give best results in dasha?",
      "Does Sun in 1st house cause ego or relationship problems?"
    ],
    "lsi_terms": [
      "exaltation degree", "shadbala", "tenth lord",
      "seventh house aspect", "lagna lord Mangal",
      "Surya antardasha", "atmakaraka", "digbali",
      "kendra trikona rajyoga", "Aditya Hridayam",
      "ruby manikya", "1-mukhi rudraksha"
    ],
    "density_targets": {
      "focus_min": 0.008,
      "focus_max": 0.015,
      "secondary_min": 0.003,
      "secondary_max": 0.006
    }
  }
}
```

`scripts/research-post.ts` (TODO) will eventually automate this
phase against an SERP API + autosuggest API. Until then, the brief
is built manually as part of post generation.

## How the prose pass uses the brief

1. Each section gets a list of keywords it must use (drawn from
   focus + secondary + LSI).
2. The prose writer (Claude generating the post) reads the brief
   and writes naturally — keywords appear because the topic
   requires them, not because they're forced.
3. After the prose is written, `seo-audit.ts` measures actual
   density. If a keyword is missing or stuffed, the post fails the
   gate.
