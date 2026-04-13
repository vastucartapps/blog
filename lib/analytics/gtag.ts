import { GA_MEASUREMENT_ID } from "./config";

type ConsentState = "granted" | "denied";

export interface ConsentUpdate {
  ad_storage?: ConsentState;
  ad_user_data?: ConsentState;
  ad_personalization?: ConsentState;
  analytics_storage?: ConsentState;
  functionality_storage?: ConsentState;
  personalization_storage?: ConsentState;
  security_storage?: ConsentState;
}

type GtagFn = {
  (command: "js", value: Date): void;
  (command: "config", targetId: string, config?: Record<string, unknown>): void;
  (command: "event", name: string, params?: Record<string, unknown>): void;
  (command: "set", params: Record<string, unknown>): void;
  (command: "consent", action: "default" | "update", params: ConsentUpdate & { wait_for_update?: number; region?: readonly string[] }): void;
  (command: "get", targetId: string, fieldName: string, callback: (value: unknown) => void): void;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: GtagFn;
  }
}

function hasGtag(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function pageview(url: string, title?: string): void {
  if (!hasGtag()) return;
  window.gtag("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: title ?? document.title,
    send_to: GA_MEASUREMENT_ID,
  });
}

export function trackEvent(
  name: string,
  params: Record<string, unknown> = {},
): void {
  if (!hasGtag()) return;
  window.gtag("event", name, { send_to: GA_MEASUREMENT_ID, ...params });
}

export function updateConsent(update: ConsentUpdate): void {
  if (!hasGtag()) return;
  window.gtag("consent", "update", update);
}

export interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  label?: string;
  rating?: "good" | "needs-improvement" | "poor";
  delta?: number;
  navigationType?: string;
}

export function reportWebVital(metric: WebVitalMetric): void {
  if (!hasGtag()) return;
  const value =
    metric.name === "CLS"
      ? Math.round(metric.value * 1000)
      : Math.round(metric.value);
  window.gtag("event", metric.name, {
    event_category:
      metric.label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    event_label: metric.id,
    value,
    non_interaction: true,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    send_to: GA_MEASUREMENT_ID,
  });
}
