"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TarotCardVisualData } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  data: TarotCardVisualData;
  category?: string;
}

export function TarotCardVisual({
  eyebrow,
  heading,
  data,
  category = "tarot",
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
        className="split-card diamond-bg relative overflow-hidden"
        data-media="240"
        style={{
          gap: 36,
          padding: "2.5rem",
          borderRadius: 22,
          backgroundColor: theme.heroBg,
          boxShadow: "0 28px 72px -32px rgba(1,63,71,0.40)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -100,
            left: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 65%)`,
          }}
        />
        <div
          className="split-media"
          style={{
            position: "relative",
            zIndex: 1,
            aspectRatio: "2 / 3.4",
            borderRadius: 14,
            border: `2px solid ${theme.accentColor}`,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.accentColor,
            overflow: "hidden",
          }}
        >
          {data.image_slot ? (
            <Image
              src={data.image_slot}
              alt={data.card_name}
              width={240}
              height={420}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: 16 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(44px, 12vw, 60px)",
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {data.card_number}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 18,
                  opacity: 0.9,
                }}
              >
                {data.card_name}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 10.5,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {data.arcana} Arcana
              </div>
            </div>
          )}
        </div>

        <div className="split-body" style={{ position: "relative", zIndex: 1 }}>
          <KeywordBlock
            label="Upright meaning"
            color={theme.accentColor}
            items={data.upright_keywords}
          />
          <div style={{ height: 22 }} />
          <KeywordBlock
            label="Reversed meaning"
            color="rgba(255,255,255,0.65)"
            items={data.reversed_keywords}
            muted
          />
        </div>
      </div>
    </motion.section>
  );
}

function KeywordBlock({
  label,
  items,
  color,
  muted,
}: {
  label: string;
  items: string[];
  color: string;
  muted?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((k) => (
          <span
            key={k}
            style={{
              display: "inline-flex",
              padding: "6px 12px",
              borderRadius: 999,
              background: muted ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.10)",
              border: `1px solid ${muted ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.20)"}`,
              color: muted ? "rgba(255,255,255,0.65)" : "#ffffff",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-body)",
            }}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
