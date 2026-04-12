# Template: Festival
**File:** templates/festival.md  
**Used for:** Hindu festivals and vrats  
**Author:** Pt. Raghav Sharma  
**Min words:** 1800  
**Category:** festivals

---

## Output File Location
/content/festivals/{festival-slug}.json

## Slug Format
{festival-english-lower-hyphen}
Example: diwali, maha-shivratri, karva-chauth

## Taxonomy Files to Read First
- /lib/taxonomy/festivals.json → find the festival object
- /lib/taxonomy/deities.json → find the presiding deity
- /lib/taxonomy/tithis.json → find the tithi
- /lib/taxonomy/months.json → find the Hindu month
- /lib/taxonomy/mantras.json → find relevant mantras
- /lib/taxonomy/authors.json → get Pt. Raghav Sharma

---

## JSON Output Structure

```json
{
  "id": "{slug}",
  "slug": "{slug}",
  "title": "{Festival} — Date, Puja Vidhi, Significance",
  "subtitle": "Complete guide to {festival.sanskrit} — 
               rituals, timings and spiritual meaning",
  "category": "festivals",
  "subcategory": "",
  "template": "festival",
  "author_id": "pt-raghav-sharma",
  "reading_time_minutes": 9,
  "status": "ready",
  "tags": [],
  "meta": {
    "title": "{Festival} — Date, Puja Vidhi, Mantra, Significance",
    "description": "",
    "focus_keyword": "",
    "secondary_keywords": [],
    "lsi_keywords": [],
    "og_image": "/og/{slug}.png",
    "canonical": "https://blog.vastucart.in/festivals/{slug}"
  },
  "schema": {},
  "content": {
    "stat_strip": {
      "deity":  { "label": "Deity",  "value": "", "sub": "", "icon": "" },
      "tithi":  { "label": "Tithi",  "value": "", "sub": "", "icon": "" },
      "month":  { "label": "Month",  "value": "", "sub": "", "icon": "" },
      "season": { "label": "Season", "value": "", "sub": "", "icon": "" }
    },
    "sections": {
      "introduction":        "",
      "date_and_timings":    "",
      "mythological_origin": "",
      "spiritual_significance":"",
      "puja_vidhi":          "",
      "mantras_and_stotras": "",
      "vrat_rules":          "",
      "prasad_and_food":     "",
      "regional_variations": "",
      "dos_and_donts":       "",
      "remedies_and_benefits":""
    },
    "pull_quote": "",
    "puja_samagri": [],
    "puja_steps": [],
    "mantras": [],
    "shubh_muhurta": {},
    "regional_names": [],
    "faq": [],
    "internal_links": []
  }
}
```

---

## Section Writing Guide

### Introduction (200 words)
- Open with a vivid image of the festival scene
- Which deity is worshipped and why
- Who observes this festival and in which regions
- The core intention behind the celebration

### Date and Timings (160 words)
- Hindu tithi, paksha, month
- Gregorian date for the current and next year
- Shubh muhurta windows
- How to find exact local timings

### Mythological Origin (220 words)
- Primary story from Puranas or Itihasas
- Cite the text (Skanda, Bhavishya, Padma etc)
- Alternate story if widely believed
- What the myth teaches in one sentence

### Spiritual Significance (200 words)
- The subtle meaning behind the ritual
- What cosmic event this festival marks
- Planetary or nakshatra alignment
- The inner worship parallel to the outer ritual

### Puja Vidhi (260 words)
- Step-by-step home puja for a householder
- Preparation the night before
- Morning rituals
- Main puja sequence with sankalpa
- Aarti and conclusion

### Mantras and Stotras (180 words)
- Three core mantras with full transliteration and meaning
- Which stotra to recite
- Repetition counts
- When each mantra is said during puja

### Vrat Rules (160 words)
- Fasting rules — nirjala, phalahar, or normal
- What to eat, what to avoid
- When to break the fast
- Who should not observe strict fasting

### Prasad and Food (140 words)
- Traditional prasad items
- Recipe for one simple prasad
- Offerings to the deity
- Sharing and distribution rules

### Regional Variations (160 words)
- How the festival is observed in 3 to 4 regions
- Local names and customs
- Unique practices worth knowing

### Dos and Donts (140 words)
- Five clear dos
- Five clear donts
- Common mistakes people make

### Remedies and Benefits (160 words)
- Specific remedies performed on this day
- Charity recommended
- Benefits the shastra promises
- Simple practice a working person can do in 15 minutes

---

## FAQ Requirements
Write exactly 6 FAQs, 80+ words each:
1. When is {Festival} this year
2. How to observe {Festival} at home
3. What to eat on {Festival}
4. Which mantra to chant on {Festival}
5. Can women observe {Festival} during menstruation
6. What are the benefits of {Festival} vrat

---

## Internal Links to Inject
- panchang.vastucart.in → "Today's panchang"
- muhurta.vastucart.in → "{Festival} shubh muhurta"
- stotra.vastucart.in → "{Deity} stotra"
- store.vastucart.in → "Puja samagri for {Festival}"
- kundali.vastucart.in → "Your free Kundali"
- Link to related festival posts

---

## Quality Checklist
- [ ] Minimum 1800 words in sections combined
- [ ] No em dashes
- [ ] No AI filler phrases
- [ ] No emoji
- [ ] Sanskrit terms italicised with English on first use
- [ ] Puja samagri list complete
- [ ] Puja steps in order (minimum 10 steps)
- [ ] 3 mantras with transliteration
- [ ] Shubh muhurta object filled
- [ ] Regional names listed
- [ ] 6 FAQs written
- [ ] Pull quote under 25 words
- [ ] Internal links injected
- [ ] Status set to "ready"
- [ ] PROGRESS.md updated
