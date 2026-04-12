"use client";

import { motion } from "framer-motion";
import type { VastuDirectionZone } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  highlight_direction:
    | "N"
    | "NE"
    | "E"
    | "SE"
    | "S"
    | "SW"
    | "W"
    | "NW";
  zones: VastuDirectionZone[];
  category?: string;
}

interface CompassPoint {
  key: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
  label: string;
  angleDeg: number; // 0 = top
}

const POINTS: CompassPoint[] = [
  { key: "N", label: "N", angleDeg: 0 },
  { key: "NE", label: "NE", angleDeg: 45 },
  { key: "E", label: "E", angleDeg: 90 },
  { key: "SE", label: "SE", angleDeg: 135 },
  { key: "S", label: "S", angleDeg: 180 },
  { key: "SW", label: "SW", angleDeg: 225 },
  { key: "W", label: "W", angleDeg: 270 },
  { key: "NW", label: "NW", angleDeg: 315 },
];

const DIR_NAMES: Record<CompassPoint["key"], string> = {
  N: "North",
  NE: "North East",
  E: "East",
  SE: "South East",
  S: "South",
  SW: "South West",
  W: "West",
  NW: "North West",
};

export function VastuCompass({
  eyebrow,
  heading,
  highlight_direction,
  zones,
  category = "vastu",
}: Props) {
  const theme = getTheme(category);
  const cx = 200;
  const cy = 200;
  const radius = 150;

  const highlightZone = zones.find(
    (z) => z.direction.toLowerCase() === DIR_NAMES[highlight_direction].toLowerCase()
  );

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
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 420px) minmax(0, 1fr)",
          gap: 36,
          padding: "2rem",
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "#ffffff",
          boxShadow: "0 18px 50px -28px rgba(1,63,71,0.25)",
        }}
      >
        <svg
          width="100%"
          viewBox="0 0 400 400"
          aria-label={`Vastu compass diagram highlighting ${DIR_NAMES[highlight_direction]}`}
          style={{ maxWidth: 420 }}
        >
          {/* Outer circle */}
          <circle cx={cx} cy={cy} r={radius} fill="var(--cream-2)" stroke="var(--border-mid)" strokeWidth="1.5" />
          {/* Inner circle */}
          <circle cx={cx} cy={cy} r={radius - 30} fill="none" stroke="var(--border-mid)" strokeWidth="0.8" />
          {/* Cross + diagonals */}
          {POINTS.map((p) => {
            const a = ((p.angleDeg - 90) * Math.PI) / 180;
            const x2 = cx + Math.cos(a) * radius;
            const y2 = cy + Math.sin(a) * radius;
            return (
              <line
                key={p.key}
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="var(--border-mid)"
                strokeWidth="0.8"
              />
            );
          })}
          {/* 8 sector wedges — highlight the active one */}
          {POINTS.map((p) => {
            const a1 = ((p.angleDeg - 90 - 22.5) * Math.PI) / 180;
            const a2 = ((p.angleDeg - 90 + 22.5) * Math.PI) / 180;
            const x1 = cx + Math.cos(a1) * radius;
            const y1 = cy + Math.sin(a1) * radius;
            const x2 = cx + Math.cos(a2) * radius;
            const y2 = cy + Math.sin(a2) * radius;
            const isActive = p.key === highlight_direction;
            return (
              <path
                key={`wedge-${p.key}`}
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                fill={isActive ? theme.accentColor : "transparent"}
                fillOpacity={isActive ? 0.18 : 0}
                stroke="none"
              />
            );
          })}
          {/* Direction labels */}
          {POINTS.map((p) => {
            const a = ((p.angleDeg - 90) * Math.PI) / 180;
            const lx = cx + Math.cos(a) * (radius - 18);
            const ly = cy + Math.sin(a) * (radius - 18);
            const isActive = p.key === highlight_direction;
            return (
              <text
                key={`lbl-${p.key}`}
                x={lx}
                y={ly + 4}
                textAnchor="middle"
                fontSize={isActive ? 14 : 12}
                fontWeight={isActive ? 700 : 600}
                fontFamily="Inter, sans-serif"
                fill={isActive ? theme.accentDeep : "var(--on-light-3)"}
                letterSpacing="0.06em"
              >
                {p.label}
              </text>
            );
          })}
          {/* Centre badge */}
          <circle cx={cx} cy={cy} r="38" fill="var(--dark)" />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
            fill="rgba(255,255,255,0.55)"
            letterSpacing="0.14em"
          >
            BRAHMA
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fontSize="11"
            fontFamily="Playfair Display, serif"
            fill={theme.accentColor}
          >
            STHANA
          </text>
        </svg>

        <div style={{ minWidth: 0 }}>
          {highlightZone ? (
            <div
              style={{
                marginBottom: 22,
                padding: "1.4rem 1.5rem",
                borderRadius: 14,
                background: `linear-gradient(135deg, ${theme.accentPale} 0%, #ffffff 100%)`,
                border: `1px solid ${theme.accentMid}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: theme.accentDeep,
                }}
              >
                Highlighted direction
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--on-light-1)",
                }}
              >
                {highlightZone.direction}
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <KV label="Deity" value={highlightZone.deity} />
                <KV label="Element" value={highlightZone.element} />
                <KV label="Planet" value={highlightZone.planet} />
              </div>
            </div>
          ) : null}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--on-light-3)",
              marginBottom: 10,
            }}
          >
            All eight zones
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {zones.map((z) => (
              <li
                key={z.direction}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  padding: "9px 0",
                  borderBottom: "1px solid var(--cream-3)",
                  fontSize: 12.5,
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--on-light-1)" }}>
                  {z.direction}
                </span>
                <span style={{ color: "var(--on-light-3)" }}>
                  {z.deity} · {z.element} · {z.planet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.10em",
          color: "var(--on-light-3)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 2,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--on-light-1)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
