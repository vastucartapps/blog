import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { RouteTracker } from "@/components/analytics/route-tracker";
import { WebVitalsReporter } from "@/components/analytics/web-vitals-reporter";
import { GA_ENABLED } from "@/lib/analytics/config";
import "@/styles/globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.vastucart.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "VastuCart Blog — Vedic Astrology, Jyotish, Vastu and Spiritual Wisdom",
    template: "%s | VastuCart Blog",
  },
  description:
    "Long-form Vedic astrology, Jyotish, Vastu, numerology, tarot, gemstones, rudraksha, puja vidhi and festival guidance from VastuCart Editorial. Jyotish content is reviewed by the VastuCart Jyotish Review Panel before publication.",
  applicationName: "VastuCart Blog",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  authors: [
    {
      name: "VastuCart Editorial",
      url: `${SITE_URL}/authors/vastucart-editorial`,
    },
  ],
  creator: "VastuCart Editorial",
  publisher: "VastuCart",
  category: "Vedic Astrology",
  keywords: [
    "Vedic astrology",
    "Jyotish",
    "Kundali",
    "Lagna",
    "Nakshatra",
    "Numerology",
    "Tarot",
    "Vastu Shastra",
    "Puja Vidhi",
    "Festivals",
    "Gemstones",
    "Rudraksha",
    "Remedies",
    "VastuCart Blog",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN"],
    siteName: "VastuCart Blog",
    url: SITE_URL,
    title: "VastuCart Blog — Vedic Astrology, Jyotish and Spiritual Wisdom",
    description:
      "Practitioner-grade Vedic astrology and Jyotish from VastuCart. Planets, houses, nakshatras, gemstones, remedies, reviewed by senior Jyotishacharyas.",
    images: [
      {
        url: "/VastuCartLogo.png",
        width: 1024,
        height: 1024,
        alt: "VastuCart, Vedic Astrology and Jyotish",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vastucart",
    creator: "@vastucart",
    title: "VastuCart Blog — Vedic Astrology and Jyotish",
    description:
      "Practitioner-grade Vedic astrology, Jyotish, vastu, gemstones and remedies.",
    images: ["/VastuCartLogo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/icon-192.png?v=3", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png?v=3", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: "/apple-touch-icon.png?v=3",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "x-default": SITE_URL,
    },
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
      "application/feed+json": `${SITE_URL}/feed.json`,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffaf3" },
    { media: "(prefers-color-scheme: dark)", color: "#013f47" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>{GA_ENABLED ? <GoogleAnalytics /> : null}</head>
      <body>
        {children}
        {GA_ENABLED ? <RouteTracker /> : null}
        {GA_ENABLED ? <WebVitalsReporter /> : null}
      </body>
    </html>
  );
}
