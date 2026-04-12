# Template: Tarot Card
**File:** templates/tarot-card.md  
**Used for:** 22 Major Arcana + 56 Minor Arcana if extended  
**Author:** Pt. Raghav Sharma  
**Min words:** 1700  
**Category:** tarot/major-arcana

---

## Output File Location
/content/tarot/major-arcana/{card-slug}.json

## Slug Format
{card-english-lower-hyphen}
Example: the-fool, the-magician, the-high-priestess

## Taxonomy Files to Read First
- /lib/taxonomy/tarot-majors.json → find the card object
- /lib/taxonomy/tarot-suits.json → if minor arcana
- /lib/taxonomy/planets.json → card's planetary ruler
- /lib/taxonomy/signs.json → card's zodiac association
- /lib/taxonomy/elements.json → element of the card
- /lib/taxonomy/authors.json → get Pt. Raghav Sharma

---

## JSON Output Structure

```json
{
  "id": "{slug}",
  "slug": "{slug}",
  "title": "{Card Name} — Tarot Meaning Guide",
  "subtitle": "Upright, reversed, love, career and advice 
               for the {card name} card",
  "category": "tarot",
  "subcategory": "major-arcana",
  "template": "tarot-card",
  "author_id": "pt-raghav-sharma",
  "reading_time_minutes": 8,
  "status": "ready",
  "tags": [],
  "meta": {
    "title": "{Card Name} Tarot — Meaning, Love, Career",
    "description": "",
    "focus_keyword": "",
    "secondary_keywords": [],
    "lsi_keywords": [],
    "og_image": "/og/{slug}.png",
    "canonical": "https://blog.vastucart.in/tarot/major-arcana/{slug}"
  },
  "schema": {},
  "content": {
    "stat_strip": {
      "number":  { "label": "Number",  "value": "", "sub": "", "icon": "" },
      "element": { "label": "Element", "value": "", "sub": "", "icon": "" },
      "planet":  { "label": "Planet",  "value": "", "sub": "", "icon": "" },
      "sign":    { "label": "Sign",    "value": "", "sub": "", "icon": "" }
    },
    "sections": {
      "introduction":       "",
      "symbolism":          "",
      "upright_meaning":    "",
      "reversed_meaning":   "",
      "love_relationships": "",
      "career_money":       "",
      "health_wellbeing":   "",
      "spiritual_meaning":  "",
      "card_combinations":  "",
      "advice":             ""
    },
    "pull_quote": "",
    "keywords": {
      "upright":  [],
      "reversed": []
    },
    "yes_no": "",
    "card_combos": [],
    "faq": [],
    "internal_links": []
  }
}
```

---

## Section Writing Guide

### Introduction (200 words)
- The card's number in the Major Arcana sequence
- First impression of the imagery
- Core message the card delivers to a querent
- Where it sits in the Fool's journey

### Symbolism (220 words)
- Key visual elements on the Rider Waite deck
- Colour symbolism
- Figures, animals, landscape elements
- Hidden or overlooked details most readers miss

### Upright Meaning (220 words)
- Primary meaning in a general reading
- What the card says about present circumstances
- What action it suggests
- When this card is a clear yes vs a nuanced answer

### Reversed Meaning (200 words)
- Not simply "the opposite" — the shadow aspect
- Internal vs external blockages
- Warning the card carries when reversed
- How to work with the energy rather than against it

### Love and Relationships (200 words)
- Single querent — what to expect
- Committed relationship — what shifts
- Reversed position in love
- Compatibility signals this card gives

### Career and Money (180 words)
- Career direction the card points to
- Workplace dynamics
- Money outlook — earning, spending, saving
- Reversed position in career matters

### Health and Wellbeing (140 words)
- Physical health signals
- Mental and emotional wellbeing
- Body parts or systems linked
- When to seek professional help

### Spiritual Meaning (160 words)
- Soul lesson this card carries
- Connection to meditation or inner work
- Archetypal wisdom
- How to integrate the card's teaching

### Card Combinations (160 words)
- Three key combinations with other majors
- What changes when it appears next to a court card
- Classic "yes" combinations
- Classic warning combinations

### Advice (120 words)
- One clear sentence of advice from this card
- A practice the querent can adopt for 7 days
- What to avoid this week
- How to honour the card's energy

---

## FAQ Requirements
Write exactly 5 FAQs, 80+ words each:
1. What does {Card} mean in a love reading
2. Is {Card} a yes or no card
3. What does {Card} reversed mean
4. {Card} in career question
5. What does {Card} mean for the future

---

## Internal Links to Inject
- tarot.vastucart.in → "Free tarot reading"
- horoscope.vastucart.in → "Today's horoscope"
- stotra.vastucart.in → "Mantras for clarity"
- vastucart.in → "33 free astrology tools"
- Link to 3 other major arcana cards (previous, next, thematic)

---

## Quality Checklist
- [ ] Minimum 1700 words in sections combined
- [ ] No em dashes
- [ ] No AI filler phrases
- [ ] No emoji
- [ ] Upright keywords: 8, reversed keywords: 8
- [ ] Yes/no answer set
- [ ] 3 card combinations described
- [ ] 5 FAQs written
- [ ] Pull quote under 25 words
- [ ] Internal links injected
- [ ] Status set to "ready"
- [ ] PROGRESS.md updated
