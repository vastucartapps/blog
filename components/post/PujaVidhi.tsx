"use client";

import { motion } from "framer-motion";
import type { PujaStep } from "@/lib/types";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  steps: PujaStep[];
  category?: string;
}

// Numbered step-by-step puja procedure. Auto-emits HowTo schema.

export function PujaVidhi({ eyebrow, heading, steps, category = "puja" }: Props) {
  const theme = getTheme(category);
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: heading ?? "Puja vidhi",
    step: steps.map((s) => ({
      "@type": "HowToStep",
      position: s.number,
      name: s.title,
      text: s.description,
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
        {steps.map((s) => (
          <motion.li
            key={s.number}
            variants={fadeInUp}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: 20,
              padding: "1.4rem 1.5rem",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "#ffffff",
              boxShadow: "0 14px 36px -22px rgba(1,63,71,0.20)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: `linear-gradient(180deg, ${theme.accentColor} 0%, ${theme.accentDeep} 100%)`,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 700,
                flexShrink: 0,
                boxShadow: `0 12px 26px -10px ${theme.accentDeep}80`,
              }}
            >
              {s.number}
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                    lineHeight: 1.3,
                  }}
                >
                  {s.title}
                </h3>
                {s.duration ? (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: theme.accentDeep,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.duration}
                  </span>
                ) : null}
              </div>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 14,
                  lineHeight: 1.72,
                  color: "var(--on-light-2)",
                }}
              >
                {s.description}
              </p>
              {s.mantra ? (
                <div
                  className="verse"
                  style={{
                    marginTop: 14,
                    padding: "12px 16px",
                    borderLeft: `3px solid ${theme.accentColor}`,
                    background: theme.accentPale,
                    borderRadius: "0 10px 10px 0",
                    fontSize: 14.5,
                    color: theme.accentDeep,
                    fontStyle: "italic",
                    lineHeight: 1.7,
                  }}
                >
                  {s.mantra}
                </div>
              ) : null}
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
