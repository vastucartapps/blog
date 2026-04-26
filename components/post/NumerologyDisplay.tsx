"use client";

import { motion } from "framer-motion";
import type { NumerologyDisplayData } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  data: NumerologyDisplayData;
  category?: string;
}

export function NumerologyDisplay({
  eyebrow,
  heading,
  data,
  category = "numerology",
}: Props) {
  const theme = getTheme(category);
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{ marginTop: "4rem", marginBottom: "4rem" }}
    >
      <SectionHeader eyebrow={eyebrow} heading={heading} accentColor={theme.accentDeep} />

      <div
        className="diamond-bg relative overflow-hidden"
        style={{
          padding: "clamp(2rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2.5rem)",
          borderRadius: 22,
          backgroundColor: theme.heroBg,
          boxShadow: "0 28px 72px -32px rgba(1,63,71,0.40)",
          textAlign: "center",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: "50%",
            left: "50%",
            width: 360,
            height: 360,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 65%)`,
          }}
        />
        <svg
          aria-hidden
          width="220"
          height="220"
          viewBox="0 0 220 220"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.30,
          }}
        >
          <circle cx="110" cy="110" r="100" fill="none" stroke={theme.accentColor} strokeWidth="0.8" />
          <circle cx="110" cy="110" r="80" fill="none" stroke={theme.accentColor} strokeWidth="0.6" />
          <polygon
            points="110,20 200,170 20,170"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="0.6"
          />
          <polygon
            points="110,200 200,50 20,50"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="0.5"
          />
        </svg>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(80px, 22vw, 140px)",
              lineHeight: 1,
              fontWeight: 600,
              color: theme.accentColor,
              letterSpacing: "-0.04em",
            }}
          >
            {data.number}
          </div>
          {data.vibration ? (
            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              {data.vibration}
            </div>
          ) : null}
        </div>

        <div
          className="cell-grid"
          data-cols="4"
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 38,
            gap: 16,
            paddingTop: 28,
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <Cell label="Planet" value={data.planet} accent={theme.accentColor} />
          <Cell label="Element" value={data.element} accent={theme.accentColor} />
          <Cell label="Color" value={data.color} accent={theme.accentColor} />
          <Cell label="Energy" value="Yang" accent={theme.accentColor} />
        </div>
      </div>
    </motion.section>
  );
}

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 18,
          fontWeight: 600,
          color: "#ffffff",
        }}
      >
        {value}
      </div>
    </div>
  );
}
