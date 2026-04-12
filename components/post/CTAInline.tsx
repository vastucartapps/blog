"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { CTAInlineData } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";

interface Props {
  data: CTAInlineData;
}

const featureBullets = [
  "Birth chart with all 9 grahas",
  "Vimshottari dasha timeline",
  "Free, no signup required",
];

export function CTAInline({ data }: Props) {
  const accent = data.button_variant === "teal" ? "var(--teal)" : "var(--saffron)";
  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      style={{
        margin: "3rem 0",
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        background:
          "linear-gradient(135deg, var(--teal-pale) 0%, #d6ecef 60%, #c4e0e4 100%)",
        border: "1px solid var(--border-mid)",
        boxShadow: "0 22px 56px -32px rgba(1,63,71,0.30)",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${data.button_variant === "teal" ? "rgba(51,138,149,0.20)" : "rgba(232,132,10,0.18)"} 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 28,
          padding: "1.75rem 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flex: "1 1 320px",
            minWidth: 0,
          }}
        >
          <span
            style={{
              display: "flex",
              width: 60,
              height: 60,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              background: `linear-gradient(135deg, ${accent} 0%, #d4760a 100%)`,
              color: "#ffffff",
              flexShrink: 0,
              boxShadow: `0 14px 30px -10px ${accent}80, inset 0 1px 0 rgba(255,255,255,0.30)`,
            }}
          >
            <Icon name="kundali" size={28} />
          </span>
          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 600,
                color: "var(--on-light-1)",
                lineHeight: 1.25,
                letterSpacing: "-0.005em",
              }}
            >
              {data.title}
            </h4>
            <p
              style={{
                margin: "5px 0 0",
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "var(--on-light-3)",
              }}
            >
              {data.subtitle}
            </p>
            <ul
              style={{
                margin: "12px 0 0",
                padding: 0,
                listStyle: "none",
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {featureBullets.map((b) => (
                <li
                  key={b}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      width: 16,
                      height: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "#1a6b2a",
                      color: "#ffffff",
                      fontSize: 10,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Button
          href={data.button_url}
          size="lg"
          variant={data.button_variant === "teal" ? "teal" : "primary"}
          iconTrailing="arrow-right"
        >
          {data.button_label}
        </Button>
      </div>
    </motion.aside>
  );
}
