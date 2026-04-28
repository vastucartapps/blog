// ─────────────────────────────────────────────────────────────────
// numerology-mandala.ts — square 1024×1024 in-body diagram for
// numerology posts. Renders the life-path numeral at the centre of an
// n-petal lotus mandala with the ruling-planet sigil and Devanagari
// label. Same brand grammar as the hero card right panel, but at
// square aspect ratio so it works as the secondary in-body figure.
// ─────────────────────────────────────────────────────────────────

const PLANETS = {
  surya:   { english: "Sun",     sanskrit: "Surya",   glyph: "☉", accent: "#F2A04C", devanagari: "सूर्य" },
  chandra: { english: "Moon",    sanskrit: "Chandra", glyph: "☽", accent: "#E8E5D4", devanagari: "चन्द्र" },
  mangal:  { english: "Mars",    sanskrit: "Mangala", glyph: "♂", accent: "#E97A2B", devanagari: "मङ्गल" },
  budha:   { english: "Mercury", sanskrit: "Budha",   glyph: "☿", accent: "#7CC8A5", devanagari: "बुध" },
  guru:    { english: "Jupiter", sanskrit: "Guru",    glyph: "♃", accent: "#F4B942", devanagari: "गुरु" },
  shukra:  { english: "Venus",   sanskrit: "Shukra",  glyph: "♀", accent: "#F2C8D8", devanagari: "शुक्र" },
  shani:   { english: "Saturn",  sanskrit: "Shani",   glyph: "♄", accent: "#9DA8AC", devanagari: "शनि" },
  rahu:    { english: "Rahu",    sanskrit: "Rahu",    glyph: "☊", accent: "#9B7CB7", devanagari: "राहु" },
  ketu:    { english: "Ketu",    sanskrit: "Ketu",    glyph: "☋", accent: "#C5A88A", devanagari: "केतु" },
} as const;

type PlanetId = keyof typeof PLANETS;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface NumerologyMandalaData {
  number: number;
  ruling_planet: PlanetId | string;
}

export function buildNumerologyMandalaSvg(
  data: NumerologyMandalaData
): string {
  const planetKey = (data.ruling_planet ?? "").toLowerCase() as PlanetId;
  const planet = PLANETS[planetKey];
  if (!planet) throw new Error(`Unknown ruling_planet: ${data.ruling_planet}`);

  const n = data.number;
  if (!Number.isInteger(n) || n < 1 || n > 9) {
    throw new Error(`number must be 1..9, got: ${n}`);
  }

  const cx = 512;
  const cy = 512;
  const petalR = 200;
  const petalLen = 130 * Math.min(1, 0.55 + 0.075 * n);

  function petalPath(angleDeg: number): string {
    const a = (angleDeg - 90) * (Math.PI / 180);
    const tipX = cx + Math.cos(a) * (petalR + petalLen);
    const tipY = cy + Math.sin(a) * (petalR + petalLen);
    const baseLA = a + Math.PI / (n * 1.05);
    const baseRA = a - Math.PI / (n * 1.05);
    const baseLX = cx + Math.cos(baseLA) * petalR;
    const baseLY = cy + Math.sin(baseLA) * petalR;
    const baseRX = cx + Math.cos(baseRA) * petalR;
    const baseRY = cy + Math.sin(baseRA) * petalR;
    const ctrlLX = cx + Math.cos(a + Math.PI / (n * 2)) * (petalR + petalLen * 0.6);
    const ctrlLY = cy + Math.sin(a + Math.PI / (n * 2)) * (petalR + petalLen * 0.6);
    const ctrlRX = cx + Math.cos(a - Math.PI / (n * 2)) * (petalR + petalLen * 0.6);
    const ctrlRY = cy + Math.sin(a - Math.PI / (n * 2)) * (petalR + petalLen * 0.6);
    return `M ${baseLX.toFixed(1)} ${baseLY.toFixed(1)} Q ${ctrlLX.toFixed(1)} ${ctrlLY.toFixed(1)}, ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q ${ctrlRX.toFixed(1)} ${ctrlRY.toFixed(1)}, ${baseRX.toFixed(1)} ${baseRY.toFixed(1)} Z`;
  }

  const petals: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (360 / n) * i;
    petals.push(
      `<path d="${petalPath(angle)}" fill="${planet.accent}" fill-opacity="0.20" stroke="#B8893E" stroke-width="2.2" stroke-opacity="0.9"/>`
    );
  }

  // Ruling-planet glyph dotted around the outer rim, n times.
  const sigils: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((360 / n) * i + 360 / (n * 2) - 90) * (Math.PI / 180);
    const r = petalR + petalLen + 60;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    sigils.push(
      `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
         <circle r="22" fill="#013F47" stroke="#B8893E" stroke-width="1.4"/>
         <text y="9" font-family="Georgia, serif" font-size="26" fill="${planet.accent}" text-anchor="middle" font-weight="600">${planet.glyph}</text>
       </g>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg"
     width="1024" height="1024" viewBox="0 0 1024 1024"
     role="img" aria-label="${escapeXml(`Number ${n} mandala with ${planet.english} sigils on the rim`)}">
  <defs>
    <radialGradient id="bgRadial" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#FBF6E8"/>
      <stop offset="80%" stop-color="#F2EAD3"/>
      <stop offset="100%" stop-color="#ECE0C5"/>
    </radialGradient>
    <radialGradient id="centreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${planet.accent}" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="${planet.accent}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${planet.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1024" height="1024" fill="url(#bgRadial)"/>

  <!-- Decorative outer ring -->
  <circle cx="${cx}" cy="${cy}" r="${petalR + petalLen + 100}" fill="none" stroke="#B8893E" stroke-width="1" opacity="0.45"/>
  <circle cx="${cx}" cy="${cy}" r="${petalR + petalLen + 110}" fill="none" stroke="#B8893E" stroke-width="0.6" opacity="0.30"/>

  <!-- Centre glow -->
  <circle cx="${cx}" cy="${cy}" r="${petalR + petalLen + 60}" fill="url(#centreGlow)"/>

  <!-- Sigils on rim -->
  ${sigils.join("\n  ")}

  <!-- Lotus petals -->
  ${petals.join("\n  ")}

  <!-- Inner disc -->
  <circle cx="${cx}" cy="${cy}" r="${petalR}" fill="#FBF6E8" stroke="#B8893E" stroke-width="2.4"/>
  <circle cx="${cx}" cy="${cy}" r="${petalR - 14}" fill="none" stroke="${planet.accent}" stroke-width="1.6" opacity="0.55"/>
  <circle cx="${cx}" cy="${cy}" r="${petalR - 28}" fill="none" stroke="#B8893E" stroke-width="0.8" opacity="0.4"/>

  <!-- Devanagari label arched above the numeral -->
  <text x="${cx}" y="${cy - 100}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="34"
        fill="#7D5519" letter-spacing="3" opacity="0.85">${escapeXml(planet.devanagari)}</text>

  <!-- Big numeral -->
  <text x="${cx}" y="${cy + 80}" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="280"
        fill="${planet.accent}" font-weight="700">${n}</text>

  <!-- Caption -->
  <text x="${cx}" y="${cy + petalR + petalLen + 95}" text-anchor="middle"
        font-family="Georgia, serif" font-size="16"
        fill="#013F47" opacity="0.85" letter-spacing="2.5"
        font-weight="500">${escapeXml(`LIFE PATH ${n} · ${planet.english.toUpperCase()} (${planet.sanskrit.toUpperCase()})`)}</text>
  <text x="${cx}" y="${cy + petalR + petalLen + 122}" text-anchor="middle"
        font-family="Georgia, serif" font-size="13"
        fill="#7D5519" opacity="0.75" letter-spacing="1.8"
        font-style="italic">Vedic Numerology Mandala · VastuCart Editorial</text>
</svg>
`;
}
