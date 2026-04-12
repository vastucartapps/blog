import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VastuCart Blog — Vedic Astrology and Jyotish",
    short_name: "VastuCart Blog",
    description:
      "Practitioner-grade Vedic astrology and Jyotish from VastuCart. Planets, houses, nakshatras, gemstones, remedies.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf3",
    theme_color: "#013f47",
    icons: [
      {
        src: "/icon-192.png?v=3",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png?v=3",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["education", "lifestyle", "spirituality"],
    lang: "en-IN",
    orientation: "portrait-primary",
  };
}
