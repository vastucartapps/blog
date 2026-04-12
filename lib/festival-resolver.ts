// ─────────────────────────────────────────────────────────────────
// Festival resolver — turns a festival_key + current year into the
// resolved date, tithi, muhurta, and panchang context.
//
// Used by the dynamic festival route so a single content/festivals/
// diwali.json file shows current-year data forever.
//
// Falls back to static approximation if the panchang API is down.
// ─────────────────────────────────────────────────────────────────

import {
  getPanchangFestivalData,
  type MuhurtaWindow,
  type PanchangFestivalResponse,
} from "./panchang-client";

export interface ResolvedFestival {
  year: number;
  name: string;
  date: string;
  date_formatted: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  paksha: "shukla" | "krishna";
  sunrise: string;
  sunset: string;
  muhurta_windows: MuhurtaWindow[];
  source: "api" | "fallback";
}

interface FestivalFallback {
  name: string;
  approximate_date: (year: number) => string;
  tithi: string;
  paksha: "shukla" | "krishna";
}

const FALLBACKS: Record<string, FestivalFallback> = {
  DIWALI: {
    name: "Diwali",
    approximate_date: (year) => `${year}-11-01`,
    tithi: "Amavasya",
    paksha: "krishna",
  },
  HOLI: {
    name: "Holi",
    approximate_date: (year) => `${year}-03-14`,
    tithi: "Purnima",
    paksha: "shukla",
  },
  NAVRATRI: {
    name: "Navratri",
    approximate_date: (year) => `${year}-10-03`,
    tithi: "Pratipada",
    paksha: "shukla",
  },
  GANESH_CHATURTHI: {
    name: "Ganesh Chaturthi",
    approximate_date: (year) => `${year}-08-27`,
    tithi: "Chaturthi",
    paksha: "shukla",
  },
  RAKSHA_BANDHAN: {
    name: "Raksha Bandhan",
    approximate_date: (year) => `${year}-08-09`,
    tithi: "Purnima",
    paksha: "shukla",
  },
  KRISHNA_JANMASHTAMI: {
    name: "Krishna Janmashtami",
    approximate_date: (year) => `${year}-08-15`,
    tithi: "Ashtami",
    paksha: "krishna",
  },
  MAHA_SHIVRATRI: {
    name: "Maha Shivratri",
    approximate_date: (year) => `${year}-02-18`,
    tithi: "Chaturdashi",
    paksha: "krishna",
  },
};

function getFallback(festivalKey: string, year: number): ResolvedFestival {
  const fb = FALLBACKS[festivalKey] ?? {
    name: festivalKey,
    approximate_date: (y: number) => `${y}-01-01`,
    tithi: "Pratipada",
    paksha: "shukla" as const,
  };
  return {
    year,
    name: fb.name,
    date: fb.approximate_date(year),
    date_formatted: new Date(fb.approximate_date(year)).toLocaleDateString(
      "en-IN",
      { year: "numeric", month: "long", day: "numeric" }
    ),
    tithi: fb.tithi,
    nakshatra: "—",
    yoga: "—",
    paksha: fb.paksha,
    sunrise: "06:00",
    sunset: "18:00",
    muhurta_windows: [],
    source: "fallback",
  };
}

export async function resolveFestival(
  festivalKey: string
): Promise<ResolvedFestival> {
  const year = new Date().getFullYear();
  try {
    const data: PanchangFestivalResponse = await getPanchangFestivalData(
      festivalKey,
      year
    );
    return {
      year: data.year,
      name: data.name,
      date: data.date,
      date_formatted: data.date_formatted,
      tithi: data.tithi,
      nakshatra: data.nakshatra,
      yoga: data.yoga,
      paksha: data.paksha,
      sunrise: data.sunrise,
      sunset: data.sunset,
      muhurta_windows: data.muhurta_windows,
      source: "api",
    };
  } catch {
    return getFallback(festivalKey, year);
  }
}
