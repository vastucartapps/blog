"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";
import type { GemCard } from "@/lib/types";

interface Props {
  eyebrow?: string;
  heading?: string;
  introHtml?: string;
  cards: GemCard[];
  disclaimer: string;
}

export function GemstoneSection({
  eyebrow,
  heading,
  introHtml,
  cards,
  disclaimer,
}: Props) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={staggerContainer}
      style={{ marginTop: "4.5rem", marginBottom: "4.5rem" }}
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
      {introHtml ? (
        <motion.div
          variants={fadeInUp}
          className="prose-block"
          style={{ marginBottom: 26 }}
          dangerouslySetInnerHTML={{ __html: introHtml }}
        />
      ) : null}

      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
        }}
      >
        {cards.map((card, i) => {
          if (card.role === "shop") {
            return (
              <motion.div
                key={`shop-${i}`}
                variants={fadeInUp}
                className="gem-card-shop"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  border: "1.5px dashed var(--border-mid)",
                  background:
                    "linear-gradient(160deg, var(--cream-2) 0%, var(--cream-3) 100%)",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  minHeight: 320,
                }}
              >
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: "50%",
                    background: "#ffffff",
                    border: "1px solid var(--saffron-mid)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                    boxShadow: "0 16px 38px -16px rgba(232,132,10,0.35)",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="/VastuCartLogo.png"
                    alt="VastuCart"
                    width={64}
                    height={64}
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                    marginBottom: 6,
                  }}
                >
                  {card.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--on-light-3)",
                    marginBottom: 22,
                    maxWidth: 220,
                  }}
                >
                  {card.sub}
                </div>
                {card.shop_label && card.shop_url ? (
                  <Button href={card.shop_url} size="sm" variant="primary">
                    {card.shop_label}
                  </Button>
                ) : null}
              </motion.div>
            );
          }
          const isPrimary = card.role === "primary";
          const tagBg = isPrimary
            ? "linear-gradient(135deg, var(--saffron) 0%, var(--saffron-light) 100%)"
            : "linear-gradient(135deg, var(--teal) 0%, var(--teal-light) 100%)";
          const photoBg = isPrimary
            ? "radial-gradient(circle at 50% 60%, rgba(232,132,10,0.18) 0%, rgba(232,132,10,0) 65%), linear-gradient(160deg, #fff8e7 0%, #faf0d6 100%)"
            : "radial-gradient(circle at 50% 60%, rgba(51,138,149,0.16) 0%, rgba(51,138,149,0) 65%), linear-gradient(160deg, #f2faf6 0%, #e0f0ec 100%)";
          const imageSrc = card.image_slug
            ? `/gemstones/${card.image_slug}.webp`
            : null;
          return (
            <motion.div
              key={`${card.name}-${i}`}
              variants={fadeInUp}
              className="gem-card"
              style={{
                overflow: "hidden",
                borderRadius: 18,
                border: "1px solid var(--border)",
                background: "#ffffff",
                boxShadow: "0 18px 50px -28px rgba(1,63,71,0.25)",
                transition:
                  "transform .2s ease, border-color .2s ease, box-shadow .2s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 160,
                  background: photoBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={card.name}
                    width={130}
                    height={130}
                    style={{
                      objectFit: "contain",
                      maxHeight: 130,
                      filter: "drop-shadow(0 14px 26px rgba(1,63,71,0.30))",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      border: "1.5px solid var(--gold-light)",
                      background: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isPrimary ? "var(--saffron)" : "var(--teal)",
                    }}
                  >
                    <Icon name="diamond-gem" size={48} />
                  </div>
                )}
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: tagBg,
                    color: "#ffffff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 999,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    boxShadow: "0 6px 16px -8px rgba(1,63,71,0.40)",
                  }}
                >
                  {isPrimary ? "Primary" : "Secondary"}
                </span>
              </div>
              <div style={{ padding: "1.25rem 1.25rem 1.4rem 1.25rem" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 19,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                    lineHeight: 1.25,
                  }}
                >
                  {card.name}
                </div>
                {card.sub ? (
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "var(--on-light-4)",
                    }}
                  >
                    {card.sub}
                  </div>
                ) : null}
                <div style={{ marginTop: 14 }}>
                  {(card.items ?? []).map((kv, k) => (
                    <div
                      key={`${kv.k}-${k}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "6px 0",
                        borderBottom: "1px solid var(--cream-3)",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: "var(--on-light-3)" }}>{kv.k}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--on-light-1)",
                          textAlign: "right",
                        }}
                      >
                        {kv.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 22,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "1rem 1.25rem",
          borderRadius: 12,
          border: "1px solid rgba(232,132,10,0.25)",
          background: "var(--saffron-pale)",
        }}
      >
        <span
          style={{ marginTop: 2, color: "#8b4a00", flexShrink: 0 }}
          aria-hidden
        >
          <Icon name="info-circle" size={16} />
        </span>
        <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "#7a3d00", margin: 0 }}>
          <strong>Disclaimer:</strong> {disclaimer}
        </p>
      </div>
    </motion.section>
  );
}
