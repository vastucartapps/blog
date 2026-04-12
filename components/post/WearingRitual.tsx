"use client";

import { motion } from "framer-motion";
import type { WearingRitualStep } from "@/lib/types";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  steps: WearingRitualStep[];
  category?: string;
}

// Same numbered visual as PujaVidhi but tuned for gemstone wearing.
// Emits HowTo schema.

export function WearingRitual({
  eyebrow,
  heading,
  steps,
  category = "gemstones",
}: Props) {
  const theme = getTheme(category);
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: heading ?? "Gemstone wearing ritual",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.action,
      text: `${s.action}. ${s.timing}.${s.mantra ? " Mantra: " + s.mantra : ""}`,
    })),
  };
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={staggerContainer}
      style={{ marginTop: "4rem", marginBottom: "4rem" }}
    >
      <SectionHeader eyebrow={eyebrow} heading={heading} accentColor={theme.accentDeep} />

      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {steps.map((s, i) => (
          <motion.li
            key={`${s.action}-${i}`}
            variants={fadeInUp}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: 20,
              alignItems: "center",
              padding: "1.4rem 1.5rem",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "#ffffff",
              boxShadow: "0 14px 36px -22px rgba(1,63,71,0.18)",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: `linear-gradient(180deg, ${theme.accentColor} 0%, ${theme.accentDeep} 100%)`,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--on-light-1)",
                  lineHeight: 1.3,
                }}
              >
                {s.action}
              </div>
              {s.mantra ? (
                <div
                  className="verse"
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    fontStyle: "italic",
                    color: theme.accentDeep,
                  }}
                >
                  {s.mantra}
                </div>
              ) : null}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: theme.accentDeep,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {s.timing}
            </div>
          </motion.li>
        ))}
      </ol>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </motion.section>
  );
}
