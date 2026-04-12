# Template: Lagna Profile
**File:** templates/lagna-profile.md  
**Used for:** All 12 lagnas = 12 posts  
**Author:** Pt. Raghav Sharma  
**Min words:** 2000  
**Category:** jyotish/lagna

---

## Output File Location
/content/jyotish/lagna/{lagna-slug}-lagna.json

## Slug Format
{lagna-english-lower}-lagna
Example: aries-lagna

## Taxonomy Files to Read First
- /lib/taxonomy/signs.json → find the lagna object
- /lib/taxonomy/planets.json → find the lagna lord
- /lib/taxonomy/houses.json → map house lords from this lagna
- /lib/taxonomy/nakshatras.json → find nakshatras spanning this sign
- /lib/taxonomy/gemstones.json → find lagna lord's gemstone
- /lib/taxonomy/rudraksha.json → find lagna lord's mukhi
- /lib/taxonomy/authors.json → get Pt. Raghav Sharma

---

## JSON Output Structure

```json
{
  "id": "{slug}",
  "slug": "{slug}",
  "title": "{Lagna} Lagna — Complete Vedic Profile",
  "subtitle": "Personality, career, health and remedies 
               for {lagna.sanskrit} ascendant natives",
  "category": "jyotish",
  "subcategory": "lagna",
  "template": "lagna-profile",
  "author_id": "pt-raghav-sharma",
  "reading_time_minutes": 10,
  "status": "ready",
  "tags": [],
  "meta": {
    "title": "{Lagna} Lagna — Personality, Career, Remedies",
    "description": "",
    "focus_keyword": "",
    "secondary_keywords": [],
    "lsi_keywords": [],
    "og_image": "/og/{slug}.png",
    "canonical": "https://blog.vastucart.in/jyotish/lagna/{slug}"
  },
  "schema": {},
  "content": {
    "stat_strip": {
      "lagna":    { "label": "Lagna",    "value": "", "sub": "", "icon": "" },
      "lord":     { "label": "Lord",     "value": "", "sub": "", "icon": "" },
      "element":  { "label": "Element",  "value": "", "sub": "", "icon": "" },
      "modality": { "label": "Modality", "value": "", "sub": "", "icon": "" }
    },
    "sections": {
      "introduction":           "",
      "lagna_lord_and_strength":"",
      "personality_appearance": "",
      "house_lords_overview":   "",
      "career_wealth":          "",
      "health_constitution":    "",
      "marriage_family":        "",
      "favourable_periods":     "",
      "remedies_lifestyle":     ""
    },
    "pull_quote": "",
    "traits": {
      "strengths":  [],
      "weaknesses": [],
      "keywords":   []
    },
    "house_lord_table": [],
    "compatible_lagnas": [],
    "gemstone": {},
    "rudraksha": [],
    "yantra": {},
    "stotra": {},
    "faq": [],
    "internal_links": []
  }
}
```

---

## Section Writing Guide

### Introduction (220 words)
- Open with a vivid image of the {Lagna} native walking into a room
- State the ruling element, modality (chara/sthira/dvisvabhava) and lord
- What distinguishes this lagna from its neighbours in the zodiac
- End with the core life theme this ascendant carries

### Lagna Lord and Strength (180 words)
- Natural strengths and weaknesses of the lagna lord
- Which houses this lord rules from this lagna (often two)
- Exaltation, debilitation, own sign, moolatrikona of the lord
- How the lord's placement shapes the entire chart

### Personality and Appearance (220 words)
- Physical build, face, eyes, hair, bearing — specific to this lagna
- Temperament in childhood, teens and adulthood
- Default emotional response under stress
- How strangers describe this native in one sentence

### House Lords Overview (250 words)
- Walk through house lords 1 through 12 for this lagna
- Name each functional benefic and functional malefic
- Yogakaraka planet (if any) and why it matters
- Raja yoga and dhana yoga combinations typical for this lagna

### Career and Wealth (220 words)
- 10th lord from this lagna and its natural professions
- 2nd and 11th lords — income and gains
- Six specific career fields this lagna excels in
- Wealth-building pattern: early, middle or late life

### Health and Constitution (180 words)
- Body parts ruled by the lagna sign
- Ayurvedic dosha tendency
- Common health vulnerabilities
- Daily habits that protect this constitution

### Marriage and Family (220 words)
- 7th lord and the nature of spouse
- Power balance expected in marriage
- Children (5th lord) and parental relationships
- Most compatible lagnas for long-term partnership

### Favourable Periods (180 words)
- Mahadashas that activate peak results
- Key antardasha combinations to watch
- Transit triggers that open opportunities
- Ages when life shifts typically occur

### Remedies and Lifestyle (180 words)
- Daily mantra for the lagna lord with transliteration
- Fasting day and food guidance
- Charity specific to this lagna
- One lifestyle adjustment that compounds over years

---

## FAQ Requirements
Write exactly 6 FAQs. Each must be:
- A real question people search on Google
- Specific to this lagna only
- Answer minimum 80 words
- No repetition of prose content

FAQ topics to cover:
1. Is {Lagna} lagna considered lucky
2. Best career for {Lagna} ascendant
3. Which gemstone to wear for {Lagna} lagna
4. Marriage compatibility for {Lagna} natives
5. Common health issues for {Lagna} lagna
6. Which dasha is best for {Lagna} ascendant

---

## Internal Links to Inject
- kundali.vastucart.in → "Generate your free Kundali"
- horoscope.vastucart.in → "{Lagna} daily horoscope"
- panchang.vastucart.in → "Today's panchang"
- muhurta.vastucart.in → "Muhurta for {Lagna} natives"
- store.vastucart.in → "Buy {lagna-lord gemstone}"
- stotra.vastucart.in → "Complete {lagna-lord} stotra"
- Link to at least 4 planet-in-house posts for this lagna

---

## Quality Checklist
- [ ] Minimum 2000 words in sections combined
- [ ] No em dashes anywhere
- [ ] No AI filler phrases
- [ ] No emoji
- [ ] Sanskrit terms italicised with English on first use
- [ ] House lord table has all 12 rows
- [ ] 6 FAQs written
- [ ] Pull quote under 25 words
- [ ] Strengths: 6, weaknesses: 6, keywords: 8
- [ ] Compatible lagnas listed with reasons
- [ ] Internal links injected
- [ ] Gemstone has disclaimer flag: true
- [ ] Status set to "ready"
- [ ] PROGRESS.md updated
