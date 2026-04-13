export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-DT9CM3QZY1";

export const isGAEnabled =
  Boolean(GA_MEASUREMENT_ID) &&
  (process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_GA_DEBUG === "true");

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?]
  | ["set", Record<string, unknown>];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: GtagArgs) => void;
  }
}

export function pageview(url: string, title?: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: title ?? document.title,
    send_to: GA_MEASUREMENT_ID,
  });
}

export function event(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", name, params);
}
