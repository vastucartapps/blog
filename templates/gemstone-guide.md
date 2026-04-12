# Template: Gemstone Guide
**File:** templates/gemstone-guide.md  
**Used for:** 9 Navratna gemstones = 9 posts  
**Author:** Pt. Raghav Sharma  
**Min words:** 1800  
**Category:** remedies/gemstones

---

## Output File Location
/content/remedies/gemstones/{stone-slug}-gemstone-guide.json

## Slug Format
{stone-english-lower-hyphen}-gemstone-guide
Example: ruby-gemstone-guide, yellow-sapphire-gemstone-guide

## Taxonomy Files to Read First
- /lib/taxonomy/gemstones.json → find the gemstone object
- /lib/taxonomy/planets.json → find the ruling planet
- /lib/taxonomy/metals.json → find the setting metal
- /lib/taxonomy/mantras.json → find energising mantra
- /lib/taxonomy/authors.json → get Pt. Raghav Sharma

---

## JSON Output Structure

```json
{
  "id": "{slug}",
  "slug": "{slug}",
  "title": "{Gemstone} — Complete Vedic Guide",
  "subtitle": "Benefits, who should wear it, how to wear, 
               and authenticity checks for {sanskrit name}",
  "category": "remedies",
  "subcategory": "gemstones",
  "template": "gemstone-guide",
  "author_id": "pt-raghav-sharma",
  "reading_time_minutes": 9,
  "status": "ready",
  "tags": [],
  "meta": {
    "title": "{Gemstone} Benefits, Who Should Wear, How to Wear",
    "description": "",
    "focus_keyword": "",
    "secondary_keywords": [],
    "lsi_keywords": [],
    "og_image": "/og/{slug}.png",
    "canonical": "https://blog.vastucart.in/remedies/gemstones/{slug}"
  },
  "schema": {},
  "content": {
    "stat_strip": {
      "stone":  { "label": "Stone",  "value": "", "sub": "", "icon": "" },
      "planet": { "label": "Planet", "value": "", "sub": "", "icon": "" },
      "finger": { "label": "Finger", "value": "", "sub": "", "icon": "" },
      "day":    { "label": "Day",    "value": "", "sub": "", "icon": "" }
    },
    "sections": {
      "introduction":         "",
      "planetary_connection": "",
      "benefits":             "",
      "who_should_wear":      "",
      "who_should_avoid":     "",
      "how_to_wear":          "",
      "energising_ritual":    "",
      "authenticity_check":   "",
      "caratage_and_price":   "",
      "care_and_cleaning":    "",
      "substitutes":          "",
      "disclaimer":           ""
    },
    "pull_quote": "",
    "benefits_list": [],
    "wear_rules": {
      "finger":    "",
      "hand":      "",
      "metal":     "",
      "day":       "",
      "time":      "",
      "min_carat": ""
    },
    "substitutes_list": [],
    "faq": [],
    "internal_links": [],
    "disclaimer_flag": true
  }
}
```

---

## Section Writing Guide

### Introduction (200 words)
- Open with an image of the stone in natural form
- Its Sanskrit name and common regional names
- Which tradition prescribes it (Parashari, Jaimini, Western)
- Core promise of the stone in one sentence

### Planetary Connection (180 words)
- Which planet this stone channels and why
- The karakatvas this stone amplifies
- House placements that benefit from this stone
- When NOT to wear it even if the planet is weak

### Benefits (240 words)
- Ten specific benefits, grouped into: career, health, 
  relationships, wealth, spiritual
- Each benefit: one sentence specific, not generic
- Reference classical texts where appropriate

### Who Should Wear (180 words)
- Lagnas for which this stone is a yogakaraka or functional benefic
- Dashas when this stone should be activated
- Specific chart conditions that indicate wearing
- Signs the stone is working

### Who Should Avoid (160 words)
- Lagnas for which this stone is a functional malefic
- Dasha conditions that warn against wearing
- Medical contraindications (skin, allergies)
- Signs the stone is NOT suiting

### How to Wear (180 words)
- Finger and hand (with reasons from classical texts)
- Setting metal
- Minimum carat weight for real effect
- Should touch the skin — yes/no
- Day and hour of first wearing

### Energising Ritual (160 words)
- Pre-wear cleansing steps
- Placement on the altar
- Mantra with full transliteration and repetition count
- Simple puja a householder can perform

### Authenticity Check (160 words)
- What to look for in natural vs synthetic
- Common treatments (heating, filling, glass-filled)
- Lab certification — which labs to trust
- Red flags that signal a fake

### Caratage and Price (120 words)
- Price range by origin and quality
- Which origin is considered finest
- How to avoid overpaying
- When to choose a smaller natural over a larger treated

### Care and Cleaning (100 words)
- Daily care
- Weekly cleansing
- What damages the stone
- When to remove it

### Substitutes (120 words)
- Three affordable substitutes
- When a substitute is acceptable vs not
- Differences in effect

### Disclaimer (100 words)
- Gemstone remedies are traditional, not medical advice
- Consultation with a qualified Jyotishi is essential
- Not a substitute for medical treatment
- Individual results vary

---

## FAQ Requirements
Write exactly 6 FAQs, 80+ words each:
1. Who should wear {gemstone}
2. How long does {gemstone} take to show results
3. Side effects of {gemstone}
4. Real vs fake {gemstone} — how to tell
5. Price of a genuine {gemstone}
6. Can I wear {gemstone} without consulting an astrologer

---

## Internal Links to Inject
- store.vastucart.in → "Buy certified {gemstone}"
- kundali.vastucart.in → "Check if {gemstone} suits you"
- horoscope.vastucart.in → "Today's horoscope"
- stotra.vastucart.in → "{Planet} stotra"
- Link to the relevant planet-in-house posts

---

## Quality Checklist
- [ ] Minimum 1800 words in sections combined
- [ ] No em dashes
- [ ] No AI filler phrases
- [ ] No emoji
- [ ] disclaimer_flag set to true
- [ ] Explicit disclaimer section written
- [ ] 10 benefits listed
- [ ] Wear rules all filled
- [ ] 3 substitutes listed
- [ ] 6 FAQs written
- [ ] Pull quote under 25 words
- [ ] Internal links injected
- [ ] Status set to "ready"
- [ ] PROGRESS.md updated
