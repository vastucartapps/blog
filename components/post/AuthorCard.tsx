"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { AuthorCardData } from "@/lib/types";
import { fadeInUp, inViewConfig } from "@/lib/motion";
import { getAuthor } from "@/lib/authors";

interface Props {
  author: AuthorCardData;
}

const badgeTone: Record<"teal" | "saff" | "rose", { bg: string; color: string; border: string }> = {
  teal: { bg: "var(--teal-pale)", color: "var(--dark)", border: "var(--border-mid)" },
  saff: { bg: "var(--saffron-mid)", color: "#7a3d00", border: "rgba(232,132,10,0.30)" },
  rose: { bg: "var(--rose-pale)", color: "#7a2e38", border: "var(--rose-mid)" },
};

export function AuthorCard({ author }: Props) {
  const profile = getAuthor(author.author_id);
  if (!profile) return null;
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={inViewConfig}
      variants={fadeInUp}
      className="author-card"
      style={{
        marginTop: "4rem",
        marginBottom: "4rem",
        borderRadius: 22,
        background: "#ffffff",
        border: "1px solid var(--border)",
        boxShadow: "0 22px 60px -32px rgba(1,63,71,0.25)",
      }}
    >
      <div
        style={{
          width: 104,
          height: 104,
          borderRadius: "50%",
          background: profile.avatar_url
            ? "transparent"
            : "linear-gradient(135deg, var(--dark) 0%, var(--teal) 100%)",
          border: "2px solid var(--gold-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--gold-light)",
          fontFamily: "var(--font-display)",
          fontSize: 32,
          fontWeight: 600,
          flexShrink: 0,
          overflow: "hidden",
          boxShadow: "0 14px 32px -16px rgba(1,63,71,0.40)",
          position: "relative",
        }}
      >
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={`${profile.name}, ${profile.title}`}
            fill
            sizes="104px"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        ) : (
          profile.initials
        )}
      </div>
      <div className="author-card-body">
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 600,
            color: "var(--on-light-1)",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            marginTop: 4,
            marginBottom: 14,
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--teal)",
          }}
        >
          {author.title_line}
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.75,
            color: "var(--on-light-2)",
          }}
        >
          {author.bio}
        </p>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {author.badges.map((b, i) => {
            const tone = badgeTone[b.tone];
            return (
              <span
                key={`${b.label}-${i}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 11px",
                  borderRadius: 999,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  background: tone.bg,
                  color: tone.color,
                  border: `1px solid ${tone.border}`,
                }}
              >
                {b.label}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            color: "var(--on-light-3)",
            fontSize: 11.5,
          }}
        >
          {author.meta.map((m, i) => (
            <span
              key={`${m.text}-${i}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Icon name={m.icon as IconName} size={12} />
              {m.text}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
