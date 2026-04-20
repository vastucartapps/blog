import type { FAQInput } from "./schema";

// ─────────────────────────────────────────────────────────────────
// Category-level FAQs — displayed on each /{category} hub page
// and emitted as a FAQPage schema entity. These target high-volume
// informational queries that Google surfaces as rich results.
// Answers stay factual, practitioner-tone, no filler phrases.
// ─────────────────────────────────────────────────────────────────

export const CATEGORY_FAQS: Record<string, FAQInput[]> = {
  jyotish: [
    {
      q: "What is Jyotish?",
      a: "Jyotish, the science of light and time, is the classical Vedic system of astrology codified in the Brihat Parashara Hora Shastra, Jaimini Sutras, Saravali, and Phaladeepika. It reads Graha (planetary) positions against twelve Bhavas (houses) and Nakshatras (lunar mansions) to map life patterns and timing through Vimshottari Dasha.",
    },
    {
      q: "How is Jyotish different from Western astrology?",
      a: "Jyotish uses the sidereal zodiac fixed to the constellations, while Western astrology uses the tropical zodiac tied to equinoxes. Jyotish adds Nakshatras, specific yogas, and the Dasha timing system, none of which appear in Western charts.",
    },
    {
      q: "Do I need my exact birth time for a Jyotish reading?",
      a: "Yes. An accurate birth time is needed to determine the Lagna (ascendant) and the Bhava cusps. Without birth time, Rashi (Moon sign) analysis is still possible, but Bhava-based predictions and Dasha activation lose precision.",
    },
    {
      q: "What are the nine Grahas?",
      a: "Surya (Sun), Chandra (Moon), Mangal (Mars), Budha (Mercury), Guru or Brihaspati (Jupiter), Shukra (Venus), Shani (Saturn), and the two lunar nodes Rahu and Ketu. Parashari Jyotish treats all nine as Grahas carrying specific karakatva and influence.",
    },
    {
      q: "How long does a Vimshottari Dasha cycle last?",
      a: "One complete Vimshottari cycle spans 120 years, divided across the nine Grahas with fixed periods: Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17. The starting Dasha is decided by the Moon's nakshatra at birth.",
    },
    {
      q: "Can Jyotish remedies actually change a chart's outcome?",
      a: "Classical remedies (mantra, daana, specific ratna, puja, fasting) mitigate but do not erase karma-based outcomes. They help the native respond better to a placement rather than overwrite it, which is why authentic practitioners prescribe remedies only after a full chart and Dasha analysis.",
    },
  ],

  numerology: [
    {
      q: "What is Vedic numerology?",
      a: "Vedic numerology derives a native's Life Path, Destiny, and Soul Urge numbers from the date of birth and full name, then maps each number to a ruling Graha. It sits alongside Jyotish as a complementary tool for timing and compatibility.",
    },
    {
      q: "How is the Life Path number calculated?",
      a: "Add every digit of the date of birth and reduce to a single digit, keeping Master numbers 11, 22, and 33 intact. A native born on 14 March 1990 has Life Path 1+4+3+1+9+9+0 = 27, reduced to 2+7 = 9.",
    },
    {
      q: "What is the difference between Pythagorean and Chaldean numerology?",
      a: "Pythagorean numerology assigns A=1, B=2 through Z=26 and reduces. Chaldean numerology uses an older letter-value table based on sound vibration, skips the number 9, and is closer to the Vedic Vargottama tradition for name numerology.",
    },
    {
      q: "Do repeating angel numbers have a fixed meaning?",
      a: "Repeating sequences like 111, 222, 333 are interpreted symbolically in modern numerology, often as a prompt toward the digit's ruling energy. They are not part of classical Vedic numerology but are widely read as intuitive signals.",
    },
  ],

  tarot: [
    {
      q: "How many cards are in a tarot deck?",
      a: "A standard tarot deck has 78 cards: 22 Major Arcana carrying archetypal life themes and 56 Minor Arcana across four suits (Wands, Cups, Swords, Pentacles). The Rider Waite deck published in 1910 is the reference imagery for most modern readings.",
    },
    {
      q: "Do reversed tarot cards have different meanings?",
      a: "Yes. A reversed card usually softens, blocks, or inverts the upright meaning. Some readers shuffle to read only upright; traditional readings use both orientations.",
    },
    {
      q: "What is the Celtic Cross spread?",
      a: "A ten-card spread that covers present situation, immediate challenge, past influence, subconscious base, near future, attitudes, external factors, hopes, fears, and final outcome. It is the most widely taught comprehensive tarot spread.",
    },
    {
      q: "Can tarot predict the future?",
      a: "Tarot reads probabilities based on the current energy around a question. It surfaces tendencies and warnings rather than fixed outcomes; the native's choices shape the final result.",
    },
  ],

  vastu: [
    {
      q: "What is Vastu Shastra?",
      a: "Vastu Shastra is the classical Indian science of architecture codified in the Manasara, Mayamatam, and Vishwakarma Prakash. It prescribes direction, room placement, proportion, and material choice so a space aligns with the Pancha Bhutas (five great elements) and the Vastu Purusha Mandala.",
    },
    {
      q: "Which direction should the main door face?",
      a: "Classical Vastu favours North, East, or North-East for the main door, since these admit the morning sun and cooler prevailing winds. Specific recommendations vary by the native's horoscope and the plot's facing.",
    },
    {
      q: "What is the Brahmasthana?",
      a: "The Brahmasthana is the sacred central zone of a plot or building, kept open and free of heavy construction. It is considered the seat of the Vastu Purusha and the subtle energetic centre of the space.",
    },
    {
      q: "Can a Vastu dosha be fixed without demolition?",
      a: "Most doshas have non-structural remedies: mirror placement, specific yantras, colour correction, plant placement, and pyramid or copper corrections. Demolition is reserved for severe structural faults in the North-East or Brahmasthana.",
    },
  ],

  puja: [
    {
      q: "What is the right order of steps in a basic puja?",
      a: "The classical sixteen-step Shodashopachara puja begins with Avahana (invocation), followed by Asana, Padya, Arghya, Achamana, Snana, Vastra, Yajnopavita, Gandha, Pushpa, Dhupa, Deepa, Naivedya, Tambula, Arati, and ends with Pradakshina and Namaskara.",
    },
    {
      q: "What samagri is needed for a home puja?",
      a: "Basic samagri includes akshata (unbroken rice), haldi, kumkum, chandan, incense, ghee lamp, fresh flowers, fruit, and naivedya (prasad). Deity-specific items (durva for Ganesh, tulsi for Vishnu, bilva for Shiva) are added as needed.",
    },
    {
      q: "Does puja require a priest?",
      a: "Nitya puja and vrat can be performed by any family member after ritual bathing and wearing clean clothes. Major Naimittika puja (Satyanarayan Katha, Grih Pravesh, Rudrabhishek) and most festival havans typically need a trained karmakandi.",
    },
    {
      q: "What is the best time of day for puja?",
      a: "Brahma Muhurta, roughly 90 minutes before sunrise, is most auspicious for nitya puja. Evening puja during Pradosh Kaal, the twilight window before sunset, is favoured for Shiva and for vrat concluding rites.",
    },
  ],

  festivals: [
    {
      q: "How are Hindu festival dates decided?",
      a: "Festival dates follow the panchanga (tithi, vara, nakshatra, yoga, karana) and the lunisolar calendar. Diwali falls on Kartik Amavasya, Holi on Phalguna Purnima, Navratri starts at Chaitra Shukla Pratipada. Exact timings vary by location because muhurta is sun-position dependent.",
    },
    {
      q: "What is the significance of Ekadashi?",
      a: "Ekadashi, the eleventh tithi of each paksha, is dedicated to Vishnu. Devotees observe vrat with grain-free food and japa. Classical texts list 24 Ekadashis a year, each with a distinct katha and spiritual focus.",
    },
    {
      q: "Why is muhurta important for festival puja?",
      a: "Tithi and nakshatra windows govern which hours within a festival day carry the peak spiritual energy. Performing Lakshmi Puja during Pradosh Kaal on Diwali, or the Chaughadiya windows during Navratri, amplifies the ritual's effect.",
    },
    {
      q: "What is paksha?",
      a: "Paksha is a lunar fortnight. Shukla Paksha runs from Amavasya to Purnima (waxing moon); Krishna Paksha runs from Purnima to Amavasya (waning moon). Each paksha holds fifteen tithis.",
    },
  ],

  gemstones: [
    {
      q: "How is the right Jyotish gemstone chosen?",
      a: "A certified practitioner analyses the full chart: Lagna lord, functional benefics, functional malefics, Dasha state, and current transits. The gemstone strengthens a favourable Graha. Wearing a stone for a debilitated or malefic planet can amplify adverse results.",
    },
    {
      q: "What metal should a Jyotish gemstone be set in?",
      a: "Classical prescriptions pair gold with Sun, Jupiter, and Mars stones; silver with Moon and Venus; panchdhatu or copper with Saturn and Rahu; panchdhatu with Ketu. The metal carries the planet's carrier-wave into the skin.",
    },
    {
      q: "On which finger are Jyotish gemstones worn?",
      a: "Ring finger for Sun (ruby) and Jupiter (yellow sapphire). Middle finger for Saturn (blue sapphire). Index finger for Mars (coral) and Rahu (hessonite). Little finger for Mercury (emerald). Moon (pearl) and Venus (diamond) on the ring finger of the other hand.",
    },
    {
      q: "How is the ideal carat weight calculated?",
      a: "Ratna shastra prescribes a minimum ratti (approximately 1/8 gram) per kilogram of body weight for primary stones. The exact weight depends on the stone's quality, the native's chart strength, and the intended Dasha activation.",
    },
  ],

  rudraksha: [
    {
      q: "What is Rudraksha?",
      a: "Rudraksha, literally the tears of Rudra, is the seed of the Elaeocarpus ganitrus tree. Classical texts (Garuda Purana, Rudraksha Jabala Upanishad, Shiva Purana) classify beads by mukhi (facets) and assign each mukhi to a specific Graha or deity.",
    },
    {
      q: "How many mukhi rudrakshas exist?",
      a: "Classical texts catalogue one-mukhi through fourteen-mukhi beads plus the Gauri-Shankar (two beads naturally joined) and Ganesha rudraksha (with a trunk-like protrusion). The common therapeutic range is one to fourteen mukhi.",
    },
    {
      q: "When is the best day to begin wearing Rudraksha?",
      a: "Monday morning after snana, with Shiva mantra japa, during a favourable muhurta. Specific mukhis also tie to their Graha's day (two-mukhi on Monday for Moon, six-mukhi on Tuesday for Mars, and so on).",
    },
    {
      q: "Does Rudraksha need to be energised before wearing?",
      a: "Yes. Classical Prana Pratishtha includes Abhishek with Ganga jala or pure water, anointing with chandan, Shiva mool mantra japa (minimum 108 times), and a formal sankalpa. An unenergised bead is considered inert.",
    },
  ],
};

export function getCategoryFAQs(categorySlug: string): FAQInput[] {
  return CATEGORY_FAQS[categorySlug] ?? [];
}
