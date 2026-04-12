"use client";

import { motion } from "framer-motion";
import type { ContraIndication } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  do_not_wear: ContraIndication[];
}

// Red warning panel listing contraindications. Always rendered before
// the disclaimer block on gemstone posts.

export function ContraIndications({ eyebrow, heading, do_not_wear }: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={staggerContainer}
      style={{ marginTop: "4rem", marginBottom: "4rem" }}
    >
      <SectionHeader eyebrow={eyebrow} heading={heading} accentColor="#8b1a1a" />

      <div
        style={{
          padding: "1.75rem 2rem",
          borderRadius: 18,
          background: "linear-gradient(180deg, #fdf3f4 0%, #f9dde0 100%)",
          border: "1px solid #f0b8bc",
          boxShadow: "0 18px 50px -28px rgba(139,26,26,0.20)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            color: "#8b1a1a",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
          }}
        >
          <Icon name="info-circle" size={16} />
          Do not wear if
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {do_not_wear.map((c, i) => (
            <motion.li
              key={`${c.condition}-${i}`}
              variants={fadeInUp}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 14,
                padding: "12px 0",
                borderBottom:
                  i === do_not_wear.length - 1 ? "none" : "1px solid #f0b8bc",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "flex",
                  width: 26,
                  height: 26,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#c94444",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                !
              </span>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#5a0f0f",
                  }}
                >
                  {c.condition}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 13,
                    color: "#7a1818",
                    lineHeight: 1.6,
                  }}
                >
                  {c.reason}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
