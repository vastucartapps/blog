"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportWebVital } from "@/lib/analytics/gtag";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    reportWebVital({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      label: metric.label,
      rating:
        "rating" in metric
          ? (metric as { rating?: "good" | "needs-improvement" | "poor" }).rating
          : undefined,
      delta: "delta" in metric ? (metric as { delta?: number }).delta : undefined,
      navigationType:
        "navigationType" in metric
          ? (metric as { navigationType?: string }).navigationType
          : undefined,
    });
  });
  return null;
}
