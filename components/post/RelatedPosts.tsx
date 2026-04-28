"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { RelatedPostRef } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fadeInUp, staggerContainer, inViewConfig } from "@/lib/motion";

/**
 * RelatedPostRef + an optional resolved featured image, populated
 * server-side by BlockRenderer (which can read the JSON file off
 * disk). When present, the card renders the actual post hero
 * instead of the themed icon medallion.
 */
export interface RelatedPostCard extends RelatedPostRef {
  image?: { src: string; alt: string; width?: number; height?: number } | null;
}

interface Props {
  eyebrow?: string;
  heading?: string;
  posts: RelatedPostCard[];
}

const iconMap: Record<
  NonNullable<RelatedPostRef["icon_variant"]>,
  { name: IconName; color: string; bg: string; accent: string }
> = {
  sun: {
    name: "sun",
    color: "#f5a623",
    bg: "radial-gradient(circle at 30% 40%, rgba(232,132,10,0.45) 0%, rgba(232,132,10,0.05) 60%, transparent 80%)",
    accent: "var(--saffron)",
  },
  moon: {
    name: "moon",
    color: "#93d4db",
    bg: "radial-gradient(circle at 30% 40%, rgba(74,165,178,0.40) 0%, rgba(74,165,178,0.04) 60%, transparent 80%)",
    accent: "var(--teal)",
  },
  rose: {
    name: "mars",
    color: "#d4a0a8",
    bg: "radial-gradient(circle at 30% 40%, rgba(183,110,121,0.40) 0%, rgba(183,110,121,0.04) 60%, transparent 80%)",
    accent: "var(--rose)",
  },
  teal: {
    name: "star",
    color: "#7ed4de",
    bg: "radial-gradient(circle at 30% 40%, rgba(74,165,178,0.40) 0%, rgba(74,165,178,0.04) 60%, transparent 80%)",
    accent: "var(--teal)",
  },
  generic: {
    name: "diamond-gem",
    color: "#e2c97e",
    bg: "radial-gradient(circle at 30% 40%, rgba(201,168,76,0.40) 0%, rgba(201,168,76,0.04) 60%, transparent 80%)",
    accent: "var(--gold)",
  },
};

export function RelatedPosts({ eyebrow, heading, posts }: Props) {
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
            gap: 12,
            fontSize: 10.5,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--teal)",
          }}
        >
          {eyebrow}
          <span style={{ height: 1.5, width: 36, background: "var(--teal)", opacity: 0.4 }} />
        </motion.div>
      ) : null}
      {heading ? (
        <motion.h2
          variants={fadeInUp}
          style={{
            marginBottom: 22,
            fontFamily: "var(--font-display)",
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "var(--on-light-1)",
            letterSpacing: "-0.012em",
          }}
        >
          {heading}
        </motion.h2>
      ) : null}

      <div className="related-posts-grid">
        {posts.map((p, i) => {
          const ico = iconMap[p.icon_variant ?? "generic"];
          const featured = p.image ?? null;
          return (
            <motion.div variants={fadeInUp} key={`${p.href}-${i}`}>
              <Link
                href={p.href}
                className="post-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 18,
                  border: "1px solid var(--border)",
                  background: "#ffffff",
                  textDecoration: "none",
                  boxShadow: "0 18px 44px -24px rgba(1,63,71,0.25)",
                  transition: "transform .2s ease, border-color .2s ease, box-shadow .2s ease",
                }}
              >
                {featured ? (
                  <div
                    style={{
                      position: "relative",
                      height: 200,
                      overflow: "hidden",
                      background: "var(--cream-2)",
                    }}
                  >
                    <Image
                      src={featured.src}
                      alt={featured.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                      style={{ objectFit: "cover" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.55)",
                        color: ico.color,
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Deep study
                    </span>
                  </div>
                ) : (
                  <div
                    className="diamond-bg relative"
                    style={{
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{ background: ico.bg }}
                    />
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        width: 96,
                        height: 96,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.06)",
                        border: `2px solid ${ico.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: ico.color,
                        boxShadow: `0 12px 32px -10px ${ico.color}80`,
                      }}
                    >
                      <Icon name={ico.name} size={48} />
                    </div>
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.55)",
                        color: ico.color,
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Deep study
                    </span>
                  </div>
                )}
                <div
                  style={{
                    padding: "1.25rem 1.4rem 1.5rem",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-display)",
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: "var(--on-light-1)",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 13,
                      lineHeight: 1.62,
                      color: "var(--on-light-3)",
                    }}
                  >
                    {p.sub}
                  </p>
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: ico.accent,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Read the study
                    <Icon name="arrow-right" size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
