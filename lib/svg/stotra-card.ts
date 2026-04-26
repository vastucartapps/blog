// ─────────────────────────────────────────────────────────────────
// stotra-card.ts — locked Navagraha stotra parchment template.
//
// Produces the canonical 1060×1048 verse parchment for any Jyotish
// post: deep teal background with gold dot pattern, cream parchment
// card, gold corner flourishes, top crest medallion with the planet
// glyph, eyebrow + subtitle, two-line Devanagari verse, two-line
// IAST transliteration, three-line English translation, dhyāna
// ślokaḥ footer.
//
// Single axis of variation: planet_id. Each of the 9 Navagrahas has
// a fixed canonical opening dhyāna verse cross-verified against
// stotra.vastucart.in. One WebP per planet is shared across all
// posts of that planet (12 houses × 1 stotra image = 12 reuses).
// ─────────────────────────────────────────────────────────────────

interface Verse {
  /** Two-line Devanagari shloka (each line ends with । or ॥). */
  devanagari: [string, string];
  /** Two-line IAST transliteration with diacritics. */
  iast: [string, string];
  /** Three-line English translation, faithful to the verse. */
  english: [string, string, string];
  /** Eyebrow title shown above the verse, e.g. "MAṄGALA STOTRAM". */
  eyebrow: string;
  /** Italic subtitle, e.g. "Navagraha · Verse to Mars". */
  subtitle: string;
  /** Single-glyph planet symbol used in the top crest medallion. */
  glyph: string;
  /** Deep-link URL on stotra.vastucart.in for the full stotra. */
  full_url: string;
}

// Sources verified 2026-04-26:
//   surya, chandra, mangal, budha, shukra, rahu, ketu →
//     stotra.vastucart.in/stotra/{planet}-stotram
//   guru → stotra.vastucart.in/stotra/guru-graha-stotra
//   shani → canonical Vyāsa Navagraha verse (partner site only
//     hosts the Dashrath version under shani-stotra)
const VERSES: Record<string, Verse> = {
  surya: {
    eyebrow: "ĀDITYA  STOTRAM",
    subtitle: "Navagraha · Verse to the Sun",
    glyph: "☉",
    devanagari: [
      "जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम् ।",
      "तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम् ॥",
    ],
    iast: [
      "japākusumasaṅkāśaṃ kāśyapeyaṃ mahādyutim",
      "tamo'riṃ sarvapāpaghnaṃ praṇato'smi divākaram",
    ],
    english: [
      "Luminous as the hibiscus, born of Kaśyapa,",
      "destroyer of darkness and every sin —",
      "to the Sun God I bow in reverence.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/surya-stotram",
  },
  chandra: {
    eyebrow: "CHANDRA  STOTRAM",
    subtitle: "Navagraha · Verse to the Moon",
    glyph: "☽",
    devanagari: [
      "दधिशंखतुषाराभं क्षीरोदार्णवसम्भवम् ।",
      "नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम् ॥",
    ],
    iast: [
      "dadhi-śaṅkha-tuṣārābhaṃ kṣīroda-arṇava-sambhavam",
      "namāmi śaśinaṃ somaṃ śambhor-mukuṭa-bhūṣaṇam",
    ],
    english: [
      "Bright as curd, conch, and snow,",
      "born of the milk-ocean's churning flow —",
      "I bow to the Moon, jewel on Śiva's crest.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/chandra-stotram",
  },
  mangal: {
    eyebrow: "MAṄGALA  STOTRAM",
    subtitle: "Navagraha · Verse to Mars",
    glyph: "♂",
    devanagari: [
      "धरणीगर्भसम्भूतं विद्युत्कान्तिसमप्रभम् ।",
      "कुमारं शक्तिहस्तं च मङ्गलं प्रणमाम्यहम् ॥",
    ],
    iast: [
      "dharaṇī-garbha-sambhūtaṃ vidyut-kānti-samaprabham",
      "kumāraṃ śakti-hastaṃ ca maṅgalaṃ praṇamāmyaham",
    ],
    english: [
      "I bow to Maṅgala — born of the Earth's womb,",
      "radiant as lightning, ever-youthful,",
      "bearing the spear of valor.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/mangal-stotram",
  },
  budha: {
    eyebrow: "BUDHA  STOTRAM",
    subtitle: "Navagraha · Verse to Mercury",
    glyph: "☿",
    devanagari: [
      "प्रियङ्गुकलिकाश्यामं रूपेणाप्रतिमं बुधम् ।",
      "सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम् ॥",
    ],
    iast: [
      "priyaṅgu-kalikā-śyāmaṃ rūpeṇāpratimaṃ budham",
      "saumyaṃ saumya-guṇopetaṃ taṃ budhaṃ praṇamāmyaham",
    ],
    english: [
      "Dark as the priyaṅgu bud, beauty unrivalled,",
      "gentle by nature, endowed with every grace —",
      "to Budha I offer my reverence.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/budha-stotram",
  },
  guru: {
    eyebrow: "BṚHASPATI  STOTRAM",
    subtitle: "Navagraha · Verse to Jupiter",
    glyph: "♃",
    devanagari: [
      "देवानां च ऋषीणां च गुरुं काञ्चनसन्निभम् ।",
      "बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम् ॥",
    ],
    iast: [
      "devānāṃ ca ṛṣīṇāṃ ca guruṃ kāñcana-sannibham",
      "buddhi-bhūtaṃ tri-loka-īśaṃ taṃ namāmi bṛhaspatim",
    ],
    english: [
      "Teacher of gods and sages alike,",
      "his form a glow of gold, wisdom incarnate —",
      "to Bṛhaspati, lord of the three worlds, I bow.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/guru-graha-stotra",
  },
  shukra: {
    eyebrow: "ŚUKRA  STOTRAM",
    subtitle: "Navagraha · Verse to Venus",
    glyph: "♀",
    devanagari: [
      "हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम् ।",
      "सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम् ॥",
    ],
    iast: [
      "hima-kunda-mṛṇālābhaṃ daityānāṃ paramaṃ gurum",
      "sarva-śāstra-pravaktāraṃ bhārgavaṃ praṇamāmyaham",
    ],
    english: [
      "Radiant as snow, jasmine, and lotus fibre,",
      "supreme teacher of the asuras, voice of every śāstra —",
      "to Bhārgava (Śukra) I offer my reverence.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/shukra-stotram",
  },
  shani: {
    eyebrow: "ŚANI  STOTRAM",
    subtitle: "Navagraha · Verse to Saturn",
    glyph: "♄",
    devanagari: [
      "नीलाञ्जनसमाभासं रविपुत्रं यमाग्रजम् ।",
      "छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम् ॥",
    ],
    iast: [
      "nīlāñjana-samābhāsaṃ ravi-putraṃ yamāgrajam",
      "chāyā-mārtaṇḍa-sambhūtaṃ taṃ namāmi śanaiścaram",
    ],
    english: [
      "Lustrous as kohl, son of the Sun,",
      "elder brother of Yama, child of Chāyā and Mārtaṇḍa —",
      "to slow-moving Śanaiścara I bow.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/shani-stotra",
  },
  rahu: {
    eyebrow: "RĀHU  STOTRAM",
    subtitle: "Navagraha · Verse to Rāhu",
    glyph: "☊",
    devanagari: [
      "अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम् ।",
      "सिंहिकागर्भसम्भूतं तं राहुं प्रणमाम्यहम् ॥",
    ],
    iast: [
      "ardha-kāyaṃ mahā-vīryaṃ candra-āditya-vimardanam",
      "siṃhikā-garbha-sambhūtaṃ taṃ rāhuṃ praṇamāmyaham",
    ],
    english: [
      "Half-bodied, of immense power,",
      "eclipser of Sun and Moon, born of Siṃhikā —",
      "to Rāhu I offer my reverence.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/rahu-stotram",
  },
  ketu: {
    eyebrow: "KETU  STOTRAM",
    subtitle: "Navagraha · Verse to Ketu",
    glyph: "☋",
    devanagari: [
      "पलाशपुष्पसंकाशं तारकाग्रहमस्तकम् ।",
      "रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम् ॥",
    ],
    iast: [
      "palāśa-puṣpa-saṅkāśaṃ tārakā-graha-mastakam",
      "raudraṃ raudrātmakaṃ ghoraṃ taṃ ketuṃ praṇamāmyaham",
    ],
    english: [
      "Crimson as palāśa blossoms,",
      "crown atop the stars and planets,",
      "fierce and dread — to Ketu I bow.",
    ],
    full_url: "https://stotra.vastucart.in/stotra/ketu-stotram",
  },
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface StotraCardData {
  /** surya | chandra | mangal | budha | guru | shukra | shani | rahu | ketu. */
  planet_id: string;
}

export function buildStotraCardSvg(data: StotraCardData): string {
  const v = VERSES[(data.planet_id ?? "").toLowerCase()];
  if (!v) throw new Error(`Unknown planet_id for stotra: ${data.planet_id}`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 1048" width="1060" height="1048">
  <defs>
    <linearGradient id="cardA" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F5EFE0"/>
      <stop offset="1" stop-color="#EFE4C9"/>
    </linearGradient>
    <radialGradient id="bgA" cx="0.5" cy="0.4" r="0.85">
      <stop offset="0" stop-color="#0A4F58"/>
      <stop offset="1" stop-color="#013F47"/>
    </radialGradient>
    <pattern id="dotsA" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="11" cy="11" r="0.7" fill="#C8A96A" opacity="0.18"/>
    </pattern>
  </defs>

  <rect width="1060" height="1048" fill="url(#bgA)"/>
  <rect width="1060" height="1048" fill="url(#dotsA)"/>

  <g stroke="#C8A96A" stroke-width="1" fill="none" opacity="0.55">
    <path d="M 38,38 L 38,90 M 38,38 L 90,38"/>
    <path d="M 38,72 Q 60,72 72,38"/>
    <path d="M 1022,38 L 1022,90 M 1022,38 L 970,38"/>
    <path d="M 1022,72 Q 1000,72 988,38"/>
    <path d="M 38,1010 L 38,958 M 38,1010 L 90,1010"/>
    <path d="M 38,976 Q 60,976 72,1010"/>
    <path d="M 1022,1010 L 1022,958 M 1022,1010 L 970,1010"/>
    <path d="M 1022,976 Q 1000,976 988,1010"/>
  </g>

  <rect x="80" y="100" width="900" height="848" rx="6" ry="6"
        fill="url(#cardA)" stroke="#C8A96A" stroke-width="2"/>
  <rect x="94" y="114" width="872" height="820" rx="3" ry="3"
        fill="none" stroke="#C8A96A" stroke-width="0.7" opacity="0.7"/>

  <g transform="translate(530,205)">
    <line x1="-160" y1="0" x2="-30" y2="0" stroke="#C8A96A" stroke-width="0.9"/>
    <line x1="30"   y1="0" x2="160" y2="0" stroke="#C8A96A" stroke-width="0.9"/>
    <circle r="22" fill="none" stroke="#C8A96A" stroke-width="1.1"/>
    <circle r="14" fill="#013F47"/>
    <text x="0" y="6" text-anchor="middle" font-family="serif" font-size="20"
          fill="#E97A2B" font-weight="600">${v.glyph}</text>
    <g fill="#C8A96A" opacity="0.85">
      <polygon points="-30,0 -25,-4 -20,0 -25,4"/>
      <polygon points="30,0 25,-4 20,0 25,4"/>
    </g>
  </g>

  <text x="530" y="265" text-anchor="middle" font-family="serif"
        letter-spacing="7" font-size="17" fill="#E97A2B" font-weight="500">${escapeXml(v.eyebrow)}</text>
  <text x="530" y="292" text-anchor="middle" font-family="serif"
        font-style="italic" font-size="15" fill="#A8884F" letter-spacing="2">${escapeXml(v.subtitle)}</text>

  <g font-family="FreeSerif, serif" fill="#013F47" text-anchor="middle">
    <text x="530" y="395" font-size="38">${escapeXml(v.devanagari[0])}</text>
    <text x="530" y="455" font-size="38">${escapeXml(v.devanagari[1])}</text>
  </g>

  <g transform="translate(530,510)">
    <line x1="-200" y1="0" x2="-18" y2="0" stroke="#C8A96A" stroke-width="0.8"/>
    <line x1="18" y1="0" x2="200" y2="0" stroke="#C8A96A" stroke-width="0.8"/>
    <polygon points="-12,0 0,-7 12,0 0,7" fill="none" stroke="#C8A96A" stroke-width="0.9"/>
    <circle r="2" fill="#E97A2B"/>
  </g>

  <g font-family="serif" font-style="italic" fill="#9B5A1F" text-anchor="middle">
    <text x="530" y="572" font-size="25">${escapeXml(v.iast[0])}</text>
    <text x="530" y="610" font-size="25">${escapeXml(v.iast[1])}</text>
  </g>

  <g transform="translate(530,665)">
    <line x1="-160" y1="0" x2="-8" y2="0" stroke="#C8A96A" stroke-width="0.6"/>
    <line x1="8" y1="0" x2="160" y2="0" stroke="#C8A96A" stroke-width="0.6"/>
    <circle r="2.2" fill="#C8A96A"/>
  </g>

  <g font-family="serif" fill="#013F47" text-anchor="middle">
    <text x="530" y="722" font-size="22">${escapeXml(v.english[0])}</text>
    <text x="530" y="757" font-size="22">${escapeXml(v.english[1])}</text>
    <text x="530" y="792" font-size="22">${escapeXml(v.english[2])}</text>
  </g>

  <g transform="translate(530,860)">
    <line x1="-90" y1="0" x2="-22" y2="0" stroke="#C8A96A" stroke-width="0.9"/>
    <line x1="22" y1="0" x2="90" y2="0" stroke="#C8A96A" stroke-width="0.9"/>
    <circle r="9" fill="none" stroke="#C8A96A" stroke-width="0.9"/>
    <circle r="2.5" fill="#E97A2B"/>
  </g>
  <text x="530" y="905" text-anchor="middle" font-family="serif"
        font-style="italic" font-size="14" fill="#A8884F" letter-spacing="3">|| dhyāna ślokaḥ ||</text>
</svg>
`;
}

export function getStotraUrl(planet_id: string): string | null {
  return VERSES[planet_id?.toLowerCase()]?.full_url ?? null;
}
