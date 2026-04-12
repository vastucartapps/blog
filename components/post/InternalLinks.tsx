"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { InternalLinksData, ToolLink } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  heading?: string;
  data: InternalLinksData;
}

const variantBg: Record<ToolLink["icon_variant"], { bg: string; color: string; border: string }> = {
  dark: { bg: "var(--dark)", color: "#93d4db", border: "var(--dark-2)" },
  saff: { bg: "var(--saffron-pale)", color: "#8b4a00", border: "var(--saffron-mid)" },
  teal: { bg: "var(--teal-pale)", color: "var(--dark)", border: "var(--border-mid)" },
  rose: { bg: "var(--rose-pale)", color: "#7a2e38", border: "var(--rose-mid)" },
};

export function InternalLinks({ eyebrow, heading, data }: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={staggerContainer}
      style={{ marginTop: "4rem", marginBottom: "4rem" }}
    >
      {eyebrow ? (
        <motion.div
          variants={fadeInUp}
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
        </motion.div>
      ) : null}
      {heading ? (
        <motion.h2
          variants={fadeInUp}
          style={{
            marginBottom: 22,
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.25,
            color: "var(--on-light-1)",
            letterSpacing: "-0.01em",
          }}
        >
          {heading}
        </motion.h2>
      ) : null}

      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {data.tools.map((t, i) => {
          const v = variantBg[t.icon_variant];
          return (
            <motion.div variants={fadeInUp} key={`${t.url}-${i}`}>
              <Link
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tool-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 18px",
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 12px 32px -22px rgba(1,63,71,0.20)",
                  transition: "border-color .2s ease, transform .2s ease, box-shadow .2s ease",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    width: 46,
                    height: 46,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    background: v.bg,
                    color: v.color,
                    border: `1px solid ${v.border}`,
                    flexShrink: 0,
                  }}
                >
                  <Icon name={t.icon as IconName} size={22} />
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--on-light-1)",
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 11.5,
                      color: "var(--on-light-4)",
                    }}
                  >
                    {t.sub}
                  </div>
                </div>
                <Icon
                  name="arrow-right"
                  size={16}
                  style={{ marginLeft: "auto", flexShrink: 0, color: "var(--saffron)" }}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
