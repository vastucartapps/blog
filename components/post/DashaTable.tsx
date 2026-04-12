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

// Responsive dasha table:
//   Desktop (≥640px): proper 4-column grid (Mahadasha | Duration | Themes | Intensity)
//   Mobile  (<640px):  each row stacks as a card with inline labels
// All breakpoint logic lives in styles/globals.css under .dasha-* classes.
// No horizontal scroll, no minWidth tricks.

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

      <div className="dasha-card">
        {/* Header row — hidden on mobile via .dasha-header class */}
        <div className="dasha-header">
          <div>Mahadasha</div>
          <div>Duration</div>
          <div>Key themes for this native</div>
          <div>Intensity</div>
        </div>

        {rows.map((r, i) => {
          const barColor = r.intensity_bar_color ?? intensityColor[r.intensity];
          const barWidth = r.intensity_bar_width ?? 60;
          const isLast = i === rows.length - 1;
          return (
            <div
              key={`${r.mahadasha}-${i}`}
              className="dasha-row"
              data-highlight={r.highlight ? "true" : undefined}
              style={{
                borderBottom: isLast ? "none" : "1px solid var(--cream-3)",
              }}
            >
              {/* Mahadasha cell */}
              <div className="dasha-cell" data-col="mahadasha">
                <span className="dasha-label">Mahadasha</span>
                <div className="dasha-value">
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
                        marginLeft: 10,
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
                      Peak
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Duration cell */}
              <div className="dasha-cell" data-col="duration">
                <span className="dasha-label">Duration</span>
                <div className="dasha-value" style={{ color: "var(--on-light-2)", fontWeight: 500 }}>
                  {r.duration}
                </div>
              </div>

              {/* Themes cell */}
              <div className="dasha-cell" data-col="themes">
                <span className="dasha-label">Key themes</span>
                <div className="dasha-value" style={{ color: "var(--on-light-2)", lineHeight: 1.6 }}>
                  {r.themes}
                </div>
              </div>

              {/* Intensity cell */}
              <div className="dasha-cell" data-col="intensity">
                <span className="dasha-label">Intensity</span>
                <div
                  className="dasha-value"
                  style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
                >
                  <div
                    style={{
                      height: 8,
                      width: `${barWidth}%`,
                      maxWidth: 160,
                      minWidth: 30,
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
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
