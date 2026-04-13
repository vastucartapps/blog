export const GA_MEASUREMENT_ID: string =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-DT9CM3QZY1";

export const GA_ENABLED: boolean =
  Boolean(GA_MEASUREMENT_ID) &&
  process.env.NEXT_PUBLIC_GA_DISABLED !== "true";

export const GA_DEBUG: boolean =
  process.env.NEXT_PUBLIC_GA_DEBUG === "true";

export const GA_COOKIE_DOMAIN: string =
  process.env.NEXT_PUBLIC_GA_COOKIE_DOMAIN ?? "auto";

export const GA_DEFAULT_CONSENT_REGIONS: readonly string[] = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE",
  "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT",
  "RO", "SK", "SI", "ES", "SE", "GB", "IS", "LI", "NO", "CH", "IN",
];
