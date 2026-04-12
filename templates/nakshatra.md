# Template: Nakshatra Profile
**File:** templates/nakshatra.md  
**Used for:** All 27 nakshatras = 27 posts  
**Author:** Pt. Raghav Sharma  
**Min words:** 1800  
**Category:** jyotish/nakshatra

---

## Output File Location
/content/jyotish/nakshatra/{nakshatra-slug}-nakshatra.json

## Slug Format
{nakshatra-english-lower}-nakshatra
Example: ashwini-nakshatra

## Taxonomy Files to Read First
- /lib/taxonomy/nakshatras.json → find the nakshatra object
- /lib/taxonomy/planets.json → find the nakshatra lord
- /lib/taxonomy/signs.json → find the sign(s) this nakshatra spans
- /lib/taxonomy/deities.json → find the ruling deity
- /lib/taxonomy/padas.json → find the four padas and their navamsa
- /lib/taxonomy/gemstones.json → find nakshatra lord's gemstone
- /lib/taxonomy/authors.json → get Pt. Raghav Sharma

---

## JSON Output Structure

```json
{
  "id": "{slug}",
  "slug": "{slug}",
  "title": "{Nakshatra} Nakshatra — Complete Guide",
  "subtitle": "Personality, career, marriage and remedies 
               for natives born under {nakshatra.sanskrit}",
  "category": "jyotish",
  "subcategory": "nakshatra",
  "template": "nakshatra",
  "author_id": "pt-raghav-sharma",
  "reading_time_minutes": 9,
  "status": "ready",
  "tags": [],
  "meta": {
    "title": "{Nakshatra} Nakshatra — Traits, Career, Remedies",
    "description": "",
    "focus_keyword": "",
    "secondary_keywords": [],
    "lsi_keywords": [],
    "og_image": "/og/{slug}.png",
    "canonical": "https://blog.vastucart.in/jyotish/nakshatra/{slug}"
  },
  "schema": {},
  "content": {
    "stat_strip": {
      "nakshatra": { "label": "Nakshatra", "value": "", "sub": "", "icon": "" },
      "lord":      { "label": "Lord",      "value": "", "sub": "", "icon": "" },
      "deity":     { "label": "Deity",     "value": "", "sub": "", "icon": "" },
      "symbol":    { "label": "Symbol",    "value": "", "sub": "", "icon": "" }
    },
    "sections": {
      "introduction":          "",
      "symbol_and_deity":      "",
      "lord_and_quality":      "",
      "personality_traits":    "",
      "four_padas":            "",
      "career_profession":    "",
      "marriage_compatibility":"",
      "health_tendencies":     "",
      "dasha_activation":      "",
      "remedies":              ""
    },
    "pull_quote": "",
    "traits": {
      "strengths":  [],
      "weaknesses": [],
      "keywords":   []
    },
    "pada_table": [],
    "compatible_nakshatras": [],
    "incompatible_nakshatras": [],
    "gemstone": {},
    "yantra": {},
    "stotra": {},
    "faq": [],
    "internal_links": []
  }
}
```

---

## Section Writing Guide

### Introduction (200 words)
- Degrees span in the zodiac (state exactly)
- Which rashi (or rashis) this nakshatra falls in
- The core motivation this nakshatra carries
- What kind of soul is born here

### Symbol and Deity (180 words)
- The traditional symbol and its meaning
- The ruling deity from Vedic literature
- The shakti (power) and related mythology
- How the symbol shapes the native's destiny

### Lord and Quality (160 words)
- Planetary lord and what it contributes
- Gana (deva, manushya, rakshasa)
- Yoni (animal symbol) and sexual nature
- Guna, varna, tatva and their practical meaning

### Personality Traits (220 words)
- Physical appearance and body type
- Mental and emotional nature
- Decision-making style
- How this native handles conflict and loss

### The Four Padas (260 words)
- Each pada with its navamsa sign
- What changes from pada to pada in personality
- Which pada is strongest, which is challenging
- How to identify one's own pada from birth time

### Career and Profession (200 words)
- Six specific career fields suited to this nakshatra
- Why the symbol and deity point to these fields
- Best suited work environments
- Dasha period when career peaks

### Marriage Compatibility (200 words)
- Yoni compatibility and which yonis match
- Gana compatibility rules
- Nadi dosha considerations for this nakshatra
- Best and worst match nakshatras with reasons

### Health Tendencies (140 words)
- Body parts associated with this nakshatra
- Common vulnerabilities
- Ayurvedic dosha tendency
- One daily health practice

### Dasha Activation (140 words)
- Mahadasha of the nakshatra lord — what activates
- Antardasha combinations to watch
- Ages when results typically unfold

### Remedies (160 words)
- Nakshatra-specific mantra with transliteration
- Deity worship — simple daily form
- Charity specific to this nakshatra
- Ritual on the nakshatra's monthly return

---

## FAQ Requirements
Write exactly 5 FAQs, 80+ words each:
1. Is {Nakshatra} nakshatra good or bad
2. Career best suited for {Nakshatra} born
3. Marriage compatibility for {Nakshatra}
4. Which gemstone for {Nakshatra} natives
5. Famous personalities born in {Nakshatra}

---

## Internal Links to Inject
- kundali.vastucart.in → "Find your nakshatra free"
- horoscope.vastucart.in → "Today's nakshatra phal"
- panchang.vastucart.in → "Daily panchang and nakshatra"
- muhurta.vastucart.in → "Nakshatra muhurta"
- store.vastucart.in → "Buy nakshatra gemstone"
- stotra.vastucart.in → "{Deity} stotra"

---

## Quality Checklist
- [ ] Minimum 1800 words in sections combined
- [ ] No em dashes
- [ ] No AI filler phrases
- [ ] No emoji
- [ ] Sanskrit terms italicised with English on first use
- [ ] All 4 padas covered with navamsa
- [ ] 5 FAQs written
- [ ] Pull quote under 25 words
- [ ] Strengths: 6, weaknesses: 6, keywords: 8
- [ ] Compatible and incompatible nakshatras listed
- [ ] Internal links injected
- [ ] Status set to "ready"
- [ ] PROGRESS.md updated
