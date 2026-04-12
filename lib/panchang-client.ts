// ─────────────────────────────────────────────────────────────────
// Panchang API client.
//
// Stubbed against the future panchang.vastucart.in HTTP API. The
// final endpoint shape will arrive via /docs/panchang-api.md (added
// by the user). Until then, the client returns shaped placeholder
// data based on the festival key + year so the rest of the platform
// can be wired and the festival post route can be built.
//
// Caching: simple file cache in /.cache/. Festival data refreshes
// every 24h, daily panchang every 1h, muhurta every 24h.
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const API_URL = process.env.PANCHANG_API_URL ?? "https://api.panchang.vastucart.in";
const API_KEY = process.env.PANCHANG_API_KEY ?? "";

const CACHE_TTL_FESTIVAL_MS = 24 * 60 * 60 * 1000;
const CACHE_TTL_DAILY_MS = 60 * 60 * 1000;
const CACHE_TTL_MUHURTA_MS = 24 * 60 * 60 * 1000;

export interface MuhurtaWindow {
  name: string;
  start: string;
  end: string;
  type: "auspicious" | "inauspicious" | "neutral";
  description?: string;
}

export interface PanchangFestivalResponse {
  festival_key: string;
  name: string;
  year: number;
  date: string;
  date_formatted: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  paksha: "shukla" | "krishna";
  sunrise: string;
  sunset: string;
  muhurta_windows: MuhurtaWindow[];
}

export interface DailyPanchangResponse {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  vara: string;
  sunrise: string;
  sunset: string;
  moonrise?: string;
  moonset?: string;
  rahukaal: { start: string; end: string };
  yamaganda: { start: string; end: string };
  gulika: { start: string; end: string };
  abhijit_muhurta: { start: string; end: string };
}

interface CacheEntry<T> {
  cached_at: number;
  data: T;
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function readCache<T>(key: string, ttl: number): T | null {
  ensureCacheDir();
  const file = path.join(CACHE_DIR, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, "utf8");
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - entry.cached_at > ttl) return null;
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T): void {
  ensureCacheDir();
  const file = path.join(CACHE_DIR, `${key}.json`);
  const entry: CacheEntry<T> = { cached_at: Date.now(), data };
  fs.writeFileSync(file, JSON.stringify(entry, null, 2));
}

// ─── Public API ────────────────────────────────────────────────

/**
 * Get full festival data for a given festival key and year.
 * Cached 24 hours.
 */
export async function getPanchangFestivalData(
  festivalKey: string,
  year: number
): Promise<PanchangFestivalResponse> {
  const cacheKey = `festival_${festivalKey}_${year}`;
  const cached = readCache<PanchangFestivalResponse>(cacheKey, CACHE_TTL_FESTIVAL_MS);
  if (cached) return cached;

  // TODO: replace with real fetch once /docs/panchang-api.md lands
  // const res = await fetch(`${API_URL}/festivals/${festivalKey}?year=${year}`, {
  //   headers: { "X-API-Key": API_KEY },
  //   cache: "force-cache",
  //   next: { revalidate: 86400 },
  // });
  // if (!res.ok) throw new Error(`Panchang API error: ${res.status}`);
  // const data = (await res.json()) as PanchangFestivalResponse;

  void API_URL;
  void API_KEY;

  // Placeholder shaped response — never thrown, just stub data
  const data: PanchangFestivalResponse = {
    festival_key: festivalKey,
    name: festivalKey
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    year,
    date: `${year}-11-01`,
    date_formatted: `1 November ${year}`,
    tithi: "Amavasya",
    nakshatra: "Swati",
    yoga: "Saubhagya",
    karana: "Naga",
    paksha: "krishna",
    sunrise: "06:24",
    sunset: "17:38",
    muhurta_windows: [
      {
        name: "Pradosh Kaal",
        start: "17:38",
        end: "20:13",
        type: "auspicious",
        description: "Most auspicious window for Lakshmi Puja",
      },
      {
        name: "Vrishabha Kaal",
        start: "18:14",
        end: "20:10",
        type: "auspicious",
        description: "Stable Taurus lagna window",
      },
      {
        name: "Mahanishita Kaal",
        start: "23:39",
        end: "00:31",
        type: "auspicious",
        description: "Tantric and meditative practices",
      },
    ],
  };

  writeCache(cacheKey, data);
  return data;
}

/**
 * Get daily panchang for a given date (YYYY-MM-DD). Cached 1 hour.
 */
export async function getDailyPanchang(
  date: string
): Promise<DailyPanchangResponse> {
  const cacheKey = `daily_${date}`;
  const cached = readCache<DailyPanchangResponse>(cacheKey, CACHE_TTL_DAILY_MS);
  if (cached) return cached;

  void API_URL;
  void API_KEY;

  const data: DailyPanchangResponse = {
    date,
    tithi: "Tritiya",
    nakshatra: "Rohini",
    yoga: "Shukla",
    karana: "Bava",
    vara: "Sunday",
    sunrise: "06:18",
    sunset: "18:42",
    moonrise: "07:55",
    moonset: "19:24",
    rahukaal: { start: "16:32", end: "18:08" },
    yamaganda: { start: "12:24", end: "14:00" },
    gulika: { start: "15:00", end: "16:32" },
    abhijit_muhurta: { start: "12:08", end: "12:55" },
  };

  writeCache(cacheKey, data);
  return data;
}

/**
 * Get only the muhurta windows for a festival. Cached 24 hours.
 */
export async function getFestivalMuhurta(
  festivalKey: string,
  year: number
): Promise<MuhurtaWindow[]> {
  const full = await getPanchangFestivalData(festivalKey, year);
  return full.muhurta_windows;
}
