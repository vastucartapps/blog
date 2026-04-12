"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SamagriItem } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { fadeInUp, inViewConfig } from "@/lib/motion";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  items: SamagriItem[];
  shop_label?: string;
  shop_url?: string;
  category?: string;
}

export function SamagriList({
  eyebrow,
  heading,
  items,
  shop_label,
  shop_url,
  category = "puja",
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
        style={{
          padding: "2rem",
          borderRadius: 18,
          background: "var(--cream-2)",
          border: "1px solid var(--border)",
          boxShadow: "0 14px 36px -22px rgba(1,63,71,0.18)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {items.map((it) => (
            <div
              key={it.name}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                background: "#ffffff",
                border: "1px solid var(--border)",
                opacity: it.optional ? 0.65 : 1,
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "flex",
                  width: 22,
                  height: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  background: it.optional ? "var(--cream-3)" : theme.accentPale,
                  border: `1px solid ${it.optional ? "var(--border-mid)" : theme.accentMid}`,
                  color: it.optional ? "var(--on-light-3)" : theme.accentDeep,
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                ✓
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    alignItems: "baseline",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--on-light-1)",
                    }}
                  >
                    {it.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--on-light-3)" }}>
                    {it.quantity}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 11.5,
                    color: "var(--on-light-3)",
                    lineHeight: 1.5,
                  }}
                >
                  {it.purpose}
                  {it.optional ? " · optional" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        {shop_label && shop_url ? (
          <div style={{ marginTop: 18, textAlign: "right" }}>
            <Link
              href={shop_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                background: `linear-gradient(180deg, ${theme.accentColor} 0%, ${theme.accentDeep} 100%)`,
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: `0 12px 28px -10px ${theme.accentDeep}80`,
              }}
            >
              <Icon name="shop" size={14} />
              {shop_label}
            </Link>
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
