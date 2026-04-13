"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { pageview } from "@/lib/analytics/gtag";

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string | null>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const query = searchParams?.toString();
      lastTracked.current = query ? `${pathname}?${query}` : pathname;
      return;
    }
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (lastTracked.current === url) return;
    lastTracked.current = url;
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}

export function RouteTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
