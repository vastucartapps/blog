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
        src: "/VastuCartLFAV.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/VastuCartLogo.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
    categories: ["education", "lifestyle", "spirituality"],
    lang: "en-IN",
    orientation: "portrait-primary",
  };
}
