"use client";

import { motion } from "framer-motion";
import type { DashaRow } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  heading?: string;
  introHtml?: string;
  rows: DashaRow[];
}

const intensityColor: Record<DashaRow["intensity"], string> = {
  "Very high": "#e8840a",
  High: "#c94444",
  Good: "#338a95",
  Moderate: "#888888",
  Low: "#a3a3a3",
};

export function DashaTable({ eyebrow, heading, introHtml, rows }: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{ marginTop: "4.5rem", marginBottom: "4.5rem" }}
    >
      {eyebrow ? (
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "var(--teal)",
          }}
        >
          {eyebrow}
          <span style={{ height: 1.5, width: 32, background: "var(--teal)", opacity: 0.4 }} />
        </div>
      ) : null}
      {heading ? (
        <h2
          style={{
            marginBottom: 16,
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.25,
            color: "var(--on-light-1)",
            letterSpacing: "-0.01em",
          }}
        >
          {heading}
        </h2>
      ) : null}
      {introHtml ? (
        <div
          className="prose-block"
          style={{ marginBottom: 22 }}
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      ) : null}

      <div
        className="table-wrap"
        style={{
          overflowX: "auto",
          overflowY: "hidden",
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "#ffffff",
          boxShadow: "0 22px 60px -32px rgba(1,63,71,0.30)",
          maxWidth: "100%",
          WebkitOverflowScrolling: "touch",
        }}
      >
       <div style={{ minWidth: 640 }}>
        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr 2.4fr 1.4fr",
            gap: 16,
            padding: "16px 22px",
            background: "var(--cream-2)",
            borderBottom: "1px solid var(--border)",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--on-light-3)",
          }}
        >
          <div>Mahadasha</div>
          <div>Duration</div>
          <div>Key themes for this native</div>
          <div>Intensity</div>
        </div>

        {rows.map((r, i) => {
          const barColor = r.intensity_bar_color ?? intensityColor[r.intensity];
          const barWidth = r.intensity_bar_width ?? 60;
          return (
            <div
              key={`${r.mahadasha}-${i}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr 2.4fr 1.4fr",
                gap: 16,
                padding: "18px 22px",
                borderBottom:
                  i === rows.length - 1 ? "none" : "1px solid var(--cream-3)",
                background: r.highlight ? "var(--saffron-pale)" : "#ffffff",
                alignItems: "center",
                fontSize: 13.5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  minWidth: 0,
                }}
              >
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                  }}
                >
                  {r.mahadasha}
                </strong>
                {r.highlight ? (
                  <span
                    style={{
                      alignSelf: "flex-start",
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 9px",
                      borderRadius: 4,
                      background: "var(--saffron-mid)",
                      color: "#7a3d00",
                      fontSize: 10,
                      fontWeight: 700,
                      border: "1px solid rgba(232,132,10,0.30)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Peak period
                  </span>
                ) : null}
              </div>
              <div style={{ color: "var(--on-light-2)", fontWeight: 500 }}>
                {r.duration}
              </div>
              <div style={{ color: "var(--on-light-2)", lineHeight: 1.6 }}>
                {r.themes}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    height: 8,
                    width: barWidth,
                    minWidth: 12,
                    borderRadius: 999,
                    background: barColor,
                    boxShadow: `0 2px 6px -2px ${barColor}80`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--on-light-3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.intensity}
                </span>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </motion.section>
  );
}
