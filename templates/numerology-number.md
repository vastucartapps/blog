# Template: Numerology Number
**File:** templates/numerology-number.md  
**Used for:** Life Path numbers 1 through 9 = 9 posts  
**Author:** Pt. Raghav Sharma  
**Min words:** 1700  
**Category:** numerology/life-path

---

## Output File Location
/content/numerology/life-path/life-path-{number}.json

## Slug Format
life-path-{number}
Example: life-path-1, life-path-7

## Taxonomy Files to Read First
- /lib/taxonomy/numerology-numbers.json → find the number object
- /lib/taxonomy/planets.json → find the number's ruling planet
- /lib/taxonomy/gemstones.json → find the planet's gemstone
- /lib/taxonomy/colours.json → find the number's lucky colours
- /lib/taxonomy/authors.json → get Pt. Raghav Sharma

---

## JSON Output Structure

```json
{
  "id": "{slug}",
  "slug": "{slug}",
  "title": "Life Path Number {N} — Meaning and Guide",
  "subtitle": "Personality, career, love and remedies 
               for Life Path {N} natives",
  "category": "numerology",
  "subcategory": "life-path",
  "template": "numerology-number",
  "author_id": "pt-raghav-sharma",
  "reading_time_minutes": 8,
  "status": "ready",
  "tags": [],
  "meta": {
    "title": "Life Path {N} — Personality, Career, Love",
    "description": "",
    "focus_keyword": "",
    "secondary_keywords": [],
    "lsi_keywords": [],
    "og_image": "/og/{slug}.png",
    "canonical": "https://blog.vastucart.in/numerology/life-path/{slug}"
  },
  "schema": {},
  "content": {
    "stat_strip": {
      "number": { "label": "Number", "value": "", "sub": "", "icon": "" },
      "planet": { "label": "Planet", "value": "", "sub": "", "icon": "" },
      "day":    { "label": "Day",    "value": "", "sub": "", "icon": "" },
      "colour": { "label": "Colour", "value": "", "sub": "", "icon": "" }
    },
    "sections": {
      "introduction":         "",
      "how_to_calculate":     "",
      "core_personality":     "",
      "strengths":            "",
      "weaknesses":           "",
      "career_and_work":      "",
      "love_and_relationships":"",
      "money_and_wealth":     "",
      "health":               "",
      "compatibility":        "",
      "lucky_elements":       "",
      "remedies":             ""
    },
    "pull_quote": "",
    "traits": {
      "strengths":  [],
      "weaknesses": [],
      "keywords":   []
    },
    "lucky": {
      "numbers":  [],
      "colours":  [],
      "days":     [],
      "gemstone": ""
    },
    "compatibility_table": [],
    "faq": [],
    "internal_links": []
  }
}
```

---

## Section Writing Guide

### Introduction (200 words)
- Open with the archetype this number represents
- The ruling planet and why it governs this number
- Who this person is in one vivid paragraph
- What life asks of this native

### How to Calculate (140 words)
- Step-by-step with a worked example
- Reducing to a single digit
- Handling master numbers 11, 22, 33
- Difference between life path, destiny and soul urge

### Core Personality (200 words)
- The inner driver
- How this native thinks and decides
- Public face vs private self
- What misunderstands this number most often

### Strengths (140 words)
- Six specific strengths, each with a one-line example
- How these show up in daily life
- Which strength is most reliable under pressure

### Weaknesses (140 words)
- Six specific shadow traits
- How they sabotage the native
- Early warning signs
- Practical counterweights

### Career and Work (200 words)
- Six career fields that suit this number
- Work environments that drain vs energise
- Leadership style
- When career typically peaks (age range)

### Love and Relationships (200 words)
- How this native loves and is loved
- What they need from a partner
- Common relationship patterns
- Deal-breakers

### Money and Wealth (160 words)
- Earning pattern — steady, cyclical, entrepreneurial
- Spending habits and blind spots
- Best wealth-building strategy
- When to save vs invest

### Health (120 words)
- Body parts ruled by the planet
- Common vulnerabilities
- Ayurvedic dosha tendency
- One daily habit that protects health

### Compatibility (180 words)
- Best matches with reasons
- Neutral matches
- Challenging matches and how to work with them
- Friendship vs marriage compatibility differences

### Lucky Elements (120 words)
- Lucky numbers, dates, days
- Lucky colours and why
- Lucky direction
- Lucky gemstone

### Remedies (140 words)
- Daily mantra of the ruling planet
- Fasting day
- Charity specific to the planet
- One habit to cultivate, one to drop

---

## FAQ Requirements
Write exactly 5 FAQs, 80+ words each:
1. Is Life Path {N} lucky
2. Best career for Life Path {N}
3. Life Path {N} compatibility
4. Which gemstone for Life Path {N}
5. Famous people with Life Path {N}

---

## Internal Links to Inject
- vastucart.in → "Free numerology calculator"
- kundali.vastucart.in → "Get your Kundali"
- horoscope.vastucart.in → "Daily horoscope"
- store.vastucart.in → "Buy {planet gemstone}"
- stotra.vastucart.in → "{Planet} stotra"
- Link to all 9 other life path posts

---

## Quality Checklist
- [ ] Minimum 1700 words in sections combined
- [ ] No em dashes
- [ ] No AI filler phrases
- [ ] No emoji
- [ ] Worked calculation example included
- [ ] Strengths: 6, weaknesses: 6, keywords: 8
- [ ] Compatibility table for all 9 numbers
- [ ] 5 FAQs written
- [ ] Pull quote under 25 words
- [ ] Internal links injected
- [ ] Status set to "ready"
- [ ] PROGRESS.md updated
