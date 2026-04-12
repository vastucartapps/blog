import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.vastucart.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VastuCart Blog — Vedic Astrology, Jyotish, Vastu and Spiritual Wisdom",
    template: "%s | VastuCart Blog",
  },
  description:
    "Practitioner-grade Vedic astrology and Jyotish from Pt. Raghav Sharma and the VastuCart panel. Planets, houses, nakshatras, tarot, numerology, vastu, gemstones, rudraksha and remedies.",
  applicationName: "VastuCart Blog",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "VastuCart", url: "https://vastucart.in" }],
  creator: "VastuCart",
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
    "Gemstones",
    "Rudraksha",
    "Remedies",
    "Pt. Raghav Sharma",
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
    siteName: "VastuCart Blog",
    url: SITE_URL,
    title: "VastuCart Blog — Vedic Astrology, Jyotish and Spiritual Wisdom",
    description:
      "Practitioner-grade Vedic astrology and Jyotish from VastuCart. Planets, houses, nakshatras, gemstones, remedies.",
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/VastuCartLFAV.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/VastuCartLFAV.png",
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
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
      <body>{children}</body>
    </html>
  );
}
