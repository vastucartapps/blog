import type { Metadata } from "next";
import "@/styles/globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.vastucart.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VastuCart Blog, Vedic Astrology, Jyotish and Spiritual Wisdom",
    template: "%s | VastuCart Blog",
  },
  description:
    "Deep, authentic Vedic astrology and Jyotish guidance. Planets, houses, nakshatras, tarot, numerology, vastu, gemstones and remedies from practicing experts.",
  applicationName: "VastuCart Blog",
  authors: [{ name: "VastuCart", url: "https://vastucart.in" }],
  creator: "VastuCart",
  publisher: "VastuCart",
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
    title: "VastuCart Blog, Vedic Astrology, Jyotish and Spiritual Wisdom",
    description:
      "Deep, authentic Vedic astrology and Jyotish guidance from practicing experts.",
    images: [{ url: "/VastuCartLogo.png", width: 1024, height: 1024, alt: "VastuCart" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vastucart",
    creator: "@vastucart",
    title: "VastuCart Blog",
    description: "Vedic astrology, Jyotish and spiritual wisdom.",
    images: ["/VastuCartLogo.png"],
  },
  icons: {
    icon: "/VastuCartLFAV.png",
    shortcut: "/VastuCartLFAV.png",
    apple: "/VastuCartLFAV.png",
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
