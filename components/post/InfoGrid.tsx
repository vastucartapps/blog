"use client";

import { motion } from "framer-motion";
import type { InfoCard } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";

interface Props {
  eyebrow?: string;
  heading?: string;
  cards: InfoCard[];
}

export function InfoGrid({ eyebrow, heading, cards }: Props) {
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
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
        }}
      >
        {cards.map((c, i) => (
          <motion.div
            key={`${c.title}-${i}`}
            variants={fadeInUp}
            style={{
              overflow: "hidden",
              borderRadius: 18,
              border: "1px solid var(--border)",
              background: "#ffffff",
              boxShadow: "0 18px 50px -28px rgba(1,63,71,0.25)",
            }}
          >
            <div
              className="diamond-bg"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "1.1rem 1.25rem",
                position: "relative",
              }}
            >
              <span
                style={{
                  display: "flex",
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, rgba(232,132,10,0.20) 0%, rgba(232,132,10,0.06) 100%)",
                  border: "1px solid rgba(232,132,10,0.35)",
                  color: "var(--saffron-light)",
                  flexShrink: 0,
                }}
              >
                <Icon name={c.icon as IconName} size={22} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#ffffff",
                    lineHeight: 1.25,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 11.5,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {c.subtitle}
                </div>
              </div>
            </div>
            <div style={{ padding: "1.25rem 1.4rem 1.4rem" }}>
              {c.items.map((kv, k) => (
                <div
                  key={`${kv.k}-${k}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "9px 0",
                    borderBottom:
                      k === c.items.length - 1 ? "none" : "1px solid var(--cream-3)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--on-light-3)" }}>{kv.k}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      textAlign: "right",
                      minWidth: 0,
                      overflowWrap: "anywhere",
                      color:
                        kv.tone === "good"
                          ? "#1a6b2a"
                          : kv.tone === "bad"
                            ? "#8b1a1a"
                            : "var(--on-light-1)",
                    }}
                  >
                    {kv.v}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
