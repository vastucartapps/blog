# Template: Planet in House
**File:** templates/planet-in-house.md  
**Used for:** All 9 planets × 12 houses × 12 lagnas = 1,296 posts  
**Author:** Pt. Raghav Sharma  
**Min words:** 1800  
**Category:** jyotish/graha-in-bhava

---

## Output File Location
/content/jyotish/graha-in-bhava/{planet-slug}-{house-number}th-bhava-{lagna-slug}-lagna.json

## Slug Format
{planet-english-lower}-{ordinal}-house-{lagna-english-lower}-lagna
Example: sun-1st-house-aries-lagna

## Taxonomy Files to Read First
- /lib/taxonomy/planets.json → find the planet object
- /lib/taxonomy/houses.json → find the house object  
- /lib/taxonomy/signs.json → find the lagna object
- /lib/taxonomy/gemstones.json → find planet's gemstone
- /lib/taxonomy/rudraksha.json → find planet's mukhi
- /lib/taxonomy/yantras.json → find planet's yantra
- /lib/taxonomy/stotras.json → find planet's stotra
- /lib/taxonomy/authors.json → get Pt. Raghav Sharma

---

## JSON Output Structure

```json
{
  "id": "{slug}",
  "slug": "{slug}",
  "title": "{Planet} in the {Nth} house — {Lagna} Lagna",
  "subtitle": "A complete Jyotish study of {planet.sanskrit} 
               in {house.sanskrit} for {lagna.sanskrit} natives",
  "category": "jyotish",
  "subcategory": "graha-in-bhava",
  "template": "planet-in-house",
  "author_id": "pt-raghav-sharma",
  "reading_time_minutes": 9,
  "status": "ready",
  "tags": [],
  "meta": {
    "title": "{Planet} in {Nth} House {Lagna} Lagna — Effects",
    "description": "",
    "focus_keyword": "",
    "secondary_keywords": [],
    "lsi_keywords": [],
    "og_image": "/og/{slug}.png",
    "canonical": "https://blog.vastucart.in/jyotish/graha-in-bhava/{slug}"
  },
  "schema": {},
  "content": {
    "stat_strip": {
      "planet": { "label": "Planet", "value": "", "sub": "", "icon": "" },
      "house":  { "label": "Bhava",  "value": "", "sub": "", "icon": "" },
      "lagna":  { "label": "Lagna",  "value": "", "sub": "", "icon": "" },
      "strength":{ "label": "Strength","value": "","sub": "", "icon": "" }
    },
    "sections": {
      "introduction":           "",
      "planet_in_context":      "",
      "personality_appearance": "",
      "career_profession":      "",
      "health_constitution":    "",
      "marriage_relationships": "",
      "dasha_activation":       "",
      "remedies":               ""
    },
    "pull_quote": "",
    "effects": {
      "positive": [],
      "negative": [],
      "career":   []
    },
    "dasha_table": [],
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

### Introduction (200 words)
- Open with a vivid specific observation about this exact combination
- Explain the relationship between this planet and this lagna lord
- State clearly whether this is a strong or weak placement and why
- End with what makes this native different from others

### Planet in Context (150 words)  
- Which karakatvas of this planet are activated by this house
- Friendship/enmity with the lagna lord — state explicitly
- Any special dignity: uchha, neech, own sign, moolatrikona
- How the house lord and planet interact (exchange, aspect, conjunction)

### Personality and Appearance (200 words)
- Physical appearance tendencies — face, build, eyes, bearing
- Core personality traits specific to THIS combination only
- Not generic planet traits — specific to planet + house + lagna
- How strangers perceive this native on first meeting

### Career and Profession (200 words)
- Name 5 to 6 specific career fields
- Explain WHY this combination produces results in each field
- Mention the 10th house lord from this lagna
- Note any timing — which dasha period career peaks

### Health and Constitution (150 words)
- Body parts ruled by this house AND this planet combined
- Specific health vulnerabilities for this combination
- Ayurvedic dosha — vata/pitta/kapha tendency
- One practical daily health tip related to this planet

### Marriage and Relationships (200 words)
- This planet's aspect on the 7th house if applicable
- Nature of spouse indicated
- Power dynamics in relationships
- Best compatible lagnas for marriage

### Dasha Activation (150 words)
- This planet's mahadasha — what activates for this native
- Two or three key antardasha combinations to watch
- Age ranges when this placement typically delivers results
- Transit triggers (which transits light up this placement)

### Remedies (150 words)
- Daily practice: specific mantra with full transliteration
- Weekly: fasting day and what to eat/avoid
- Charity: specific item, specific day, specific recipient
- One practical lifestyle adjustment
- Reference to gemstone and rudraksha sections below

---

## FAQ Requirements
Write exactly 5 FAQs. Each must be:
- A real question people search on Google
- Specific to THIS planet + house + lagna combination
- Answer minimum 80 words
- No repetition of what is already in the prose

FAQ topics to cover:
1. Is this placement good or bad for [lagna]
2. Career/profession question
3. Marriage/relationship question  
4. Gemstone or remedy question
5. Dasha timing question

---

## Internal Links to Inject
Always include these based on the lagna of the post:
- kundali.vastucart.in → "Get your free {Lagna} Kundali"
- horoscope.vastucart.in → "{Lagna} Rashi horoscope"
- panchang.vastucart.in → "Today's panchang"
- muhurta.vastucart.in → "Muhurta for {Lagna} natives"
- store.vastucart.in → "Buy {gemstone} gemstone"
- stotra.vastucart.in → "Complete {planet} stotra"

---

## Quality Checklist (verify before saving)
- [ ] Minimum 1800 words in sections combined
- [ ] No em dashes anywhere
- [ ] No AI filler phrases
- [ ] No emoji
- [ ] Sanskrit terms italicised with English on first use
- [ ] All taxonomy data correctly pulled (no invented facts)
- [ ] 5 FAQs written
- [ ] Pull quote written (under 25 words, no em dash)
- [ ] Effects: 6 positive, 6 negative, 6 career items
- [ ] Dasha table has 4 rows minimum
- [ ] Internal links injected
- [ ] Gemstone has disclaimer flag: true
- [ ] Status set to "ready"
- [ ] PROGRESS.md updated
