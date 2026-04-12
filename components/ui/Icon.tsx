import type { ReactElement, SVGProps } from "react";

// Icon SVGs extracted verbatim from public/vastucart_blog_enterprise_v2.html.
// Each entry is a render function so colour and size can be overridden per call.

export type IconName =
  // Brand / planetary
  | "sun"
  | "moon"
  | "mars"
  | "triangle-house"
  | "star"
  | "diamond-gem"
  // Meta / utility
  | "clock"
  | "check-circle"
  | "user"
  | "calendar"
  | "info-circle"
  | "external-link"
  | "arrow-right"
  | "plus"
  | "times"
  | "search"
  // Tools
  | "kundali"
  | "horoscope"
  | "panchang"
  | "muhurta"
  | "stotra"
  | "shop"
  | "tarot"
  | "gem"
  | "beads"
  | "yantra"
  | "book"
  | "vastu";

type Props = SVGProps<SVGSVGElement> & { size?: number };

function svg(p: Props, extra?: { viewBox?: string }) {
  const { size = 16, className, ...rest } = p;
  return {
    width: size,
    height: size,
    viewBox: extra?.viewBox ?? "0 0 16 16",
    fill: "none" as const,
    className,
    ...rest,
  };
}

const REG: Record<IconName, (p: Props) => ReactElement> = {
  // Sun — filled disc, ring, inner core
  sun: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <circle cx="9" cy="9" r="5" fill="currentColor" opacity=".85" />
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1" opacity=".3" />
      <circle cx="9" cy="9" r="3" fill="currentColor" />
    </svg>
  ),
  // Moon — crescent
  moon: (p) => (
    <svg {...svg(p, { viewBox: "0 0 30 30" })}>
      <path d="M22 15a10 10 0 01-13 9.5A10 10 0 0115 5a10 10 0 017 10z" fill="currentColor" opacity=".5" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  // Mars — circle with ram curves
  mars: (p) => (
    <svg {...svg(p, { viewBox: "0 0 30 30" })}>
      <circle cx="15" cy="18" r="6" fill="currentColor" opacity=".3" stroke="currentColor" strokeWidth="1" />
      <path d="M9 12C9 12 10 8 15 8C20 8 21 12 21 12" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  ),
  // House triangle (1st house glyph used in stat cells)
  "triangle-house": (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <polygon points="9,2 16,14 2,14" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <polygon points="9,5 13.5,13 4.5,13" fill="currentColor" opacity=".25" />
    </svg>
  ),
  // Star (strength cell, author lineage)
  star: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <path d="M9 2l1.8 5H16l-4.2 3 1.6 5L9 12.3 4.6 15l1.6-5L2 7h5.2z" fill="currentColor" opacity=".7" />
    </svg>
  ),
  // Diamond gem (ruby/manik svg)
  "diamond-gem": (p) => (
    <svg {...svg(p, { viewBox: "0 0 36 36" })}>
      <polygon points="18,4 30,12 30,24 18,32 6,24 6,12" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="18,8 26,14 26,22 18,28 10,22 10,14" fill="currentColor" opacity=".3" />
      <polygon points="18,12 22,16 22,20 18,24 14,20 14,16" fill="currentColor" opacity=".55" />
    </svg>
  ),
  clock: (p) => (
    <svg {...svg(p, { viewBox: "0 0 13 13" })}>
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1" />
      <path d="M6.5 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  "check-circle": (p) => (
    <svg {...svg(p, { viewBox: "0 0 13 13" })}>
      <path d="M6.5 1.5a5 5 0 100 10 5 5 0 000-10z" stroke="currentColor" strokeWidth="1" />
      <path d="M4.5 6.5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  user: (p) => (
    <svg {...svg(p, { viewBox: "0 0 13 13" })}>
      <circle cx="6.5" cy="4" r="2" stroke="currentColor" strokeWidth="1" />
      <path d="M2 11c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  calendar: (p) => (
    <svg {...svg(p, { viewBox: "0 0 12 12" })}>
      <rect x="1" y="3" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
      <path d="M1 6h10M4 2v2M8 2v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  "info-circle": (p) => (
    <svg {...svg(p)}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" />
      <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  "external-link": (p) => (
    <svg {...svg(p, { viewBox: "0 0 13 13" })}>
      <rect x="2" y="2" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1" />
      <path d="M5 5h3M5 7h2" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" />
    </svg>
  ),
  "arrow-right": (p) => (
    <svg {...svg(p, { viewBox: "0 0 14 14" })}>
      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  plus: (p) => (
    <svg {...svg(p, { viewBox: "0 0 22 22" })}>
      <path d="M11 5v12M5 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  times: (p) => (
    <svg {...svg(p, { viewBox: "0 0 22 22" })}>
      <path d="M6 6l10 10M16 6L6 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  search: (p) => (
    <svg {...svg(p)}>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  kundali: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1" />
      <path d="M9 2v7l4 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  horoscope: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <path d="M9 2a7 7 0 100 14A7 7 0 009 2z" stroke="currentColor" strokeWidth="1" />
      <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  panchang: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <rect x="2" y="4" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1" />
      <path d="M2 8h14M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  muhurta: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1" />
      <path d="M9 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  stotra: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1" />
      <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  shop: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <rect x="2" y="6" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1" />
      <path d="M5 6V5a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  tarot: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <rect x="4" y="2" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1" />
      <rect x="6" y="4" width="8" height="14" rx="1.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  gem: (p) => (
    <svg {...svg(p, { viewBox: "0 0 16 16" })}>
      <polygon points="8,2 13,7 10,14 6,14 3,7" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  beads: (p) => (
    <svg {...svg(p, { viewBox: "0 0 20 20" })}>
      <circle cx="10" cy="4" r="2" fill="currentColor" opacity=".6" />
      <circle cx="4" cy="10" r="2" fill="currentColor" opacity=".6" />
      <circle cx="16" cy="10" r="2" fill="currentColor" opacity=".6" />
      <circle cx="7" cy="16" r="2" fill="currentColor" opacity=".6" />
      <circle cx="13" cy="16" r="2" fill="currentColor" opacity=".6" />
    </svg>
  ),
  yantra: (p) => (
    <svg {...svg(p, { viewBox: "0 0 130 130" })}>
      <rect x="5" y="5" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="1" opacity=".4" />
      <rect x="12" y="12" width="106" height="106" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".3" />
      <circle cx="65" cy="65" r="45" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".35" />
      <polygon points="65,20 108,90 22,90" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
      <polygon points="65,110 22,40 108,40" fill="none" stroke="currentColor" strokeWidth="1" opacity=".35" />
      <circle cx="65" cy="65" r="18" fill="currentColor" opacity=".12" stroke="currentColor" strokeWidth="1" />
      <circle cx="65" cy="65" r="5" fill="currentColor" opacity=".6" />
    </svg>
  ),
  book: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <path d="M3 3h5a3 3 0 013 3v9H6a3 3 0 01-3-3V3z" stroke="currentColor" strokeWidth="1" />
      <path d="M15 3h-5a3 3 0 00-3 3v9h5a3 3 0 003-3V3z" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  vastu: (p) => (
    <svg {...svg(p, { viewBox: "0 0 18 18" })}>
      <rect x="2" y="2" width="14" height="14" stroke="currentColor" strokeWidth="1" />
      <path d="M2 9h14M9 2v14" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
};

export interface IconProps extends Props {
  name: IconName;
}

export function Icon({ name, ...rest }: IconProps) {
  const Component = REG[name];
  if (!Component) return null;
  return <Component {...rest} />;
}
