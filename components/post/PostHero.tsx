import Link from "next/link";
import { Breadcrumb, type Crumb } from "@/components/layout/Breadcrumb";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { HeroMetaItem, HeroTag } from "@/lib/types";
import {
  resolveEntityLink,
  authorUrl,
  tagUrl,
} from "@/lib/internal-links";
import { AUTHORS } from "@/lib/authors";
import { getTheme, type CategoryTheme } from "@/lib/category-themes";

interface Props {
  breadcrumb: Crumb[];
  badgeLabel: string;
  titleHtml: string;
  description: string;
  meta: HeroMetaItem[];
  tags: HeroTag[];
  authorId?: string;
  /** Category id to pull theme colours. Falls back to jyotish. */
  category?: string;
  /** Pre-resolved theme override (rare; component normally derives from category) */
  theme?: CategoryTheme;
}

function metaLink(value: string, authorId: string | undefined): string | null {
  if (!authorId) return null;
  const author = AUTHORS[authorId];
  if (!author) return null;
  if (value.includes(author.name)) return authorUrl(authorId);
  return null;
}

export function PostHero({
  breadcrumb,
  badgeLabel,
  titleHtml,
  description,
  meta,
  tags,
  authorId,
  category,
  theme: themeProp,
}: Props) {
  const theme = themeProp ?? getTheme(category);
  return (
    <section
      className="diamond-bg relative overflow-hidden"
      style={{ backgroundColor: theme.heroBg }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -100,
          right: -80,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 65%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: -80,
          left: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.glowColorAlt} 0%, transparent 65%)`,
        }}
      />

      <div className="wrap-hero relative z-10">
        <div style={{ marginBottom: "1.5rem" }}>
          <Breadcrumb items={breadcrumb} tone="dark" />
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: theme.tagBg,
            border: `1px solid ${theme.tagBorder}`,
            color: theme.accentColor,
            fontSize: 10.5,
            fontWeight: 600,
            padding: "5px 14px",
            borderRadius: 20,
            marginBottom: "1.25rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
            <polygon
              points="5,1 6.5,4 10,4.5 7.5,7 8,10 5,8.5 2,10 2.5,7 0,4.5 3.5,4"
              fill={theme.accentColor}
            />
          </svg>
          {badgeLabel}
        </span>

        <h1
          className="hero-display-sm"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--on-dark-1)",
            marginBottom: "1rem",
            maxWidth: 620,
          }}
          dangerouslySetInnerHTML={{
            __html: decorateEm(titleHtml, theme.accentColor),
          }}
        />

        <p
          className="hero-body"
          style={{
            color: "var(--on-dark-2)",
            maxWidth: 560,
            marginBottom: "1.75rem",
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: "1.1rem",
            marginBottom: "1.1rem",
          }}
        >
          {meta.map((m, i) => {
            const linkHref = metaLink(m.value, authorId);
            const inner = (
              <>
                <Icon name={m.icon as IconName} size={13} aria-hidden />
                <strong style={{ color: "var(--on-dark-2)", fontWeight: 600 }}>
                  {m.value}
                </strong>
              </>
            );
            const itemStyle: React.CSSProperties = {
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--on-dark-3)",
              textDecoration: "none",
              transition: "color .2s ease",
            };
            return (
              <span
                key={`${m.icon}-${i}`}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                {linkHref ? (
                  <Link href={linkHref} style={itemStyle} className="hero-meta-link">
                    {inner}
                  </Link>
                ) : (
                  <span style={itemStyle}>{inner}</span>
                )}
                {i < meta.length - 1 ? (
                  <span
                    aria-hidden
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.20)",
                      marginLeft: "1.5rem",
                    }}
                  />
                ) : null}
              </span>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tags.map((t, i) => {
            // Resolve to canonical entity URL when known; fall back
            // to the tag-listing page so EVERY hero tag is clickable.
            const href = resolveEntityLink(t.label) ?? tagUrl(t.label);
            const tagStyle: React.CSSProperties =
              t.tone === "teal"
                ? {
                    fontSize: 10.5,
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: `1px solid ${theme.tagBorder}`,
                    background: theme.tagBg,
                    color: theme.tagColor,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                    transition: "background .2s ease, color .2s ease",
                  }
                : {
                    fontSize: 10.5,
                    padding: "5px 12px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "var(--on-dark-3)",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                    transition: "background .2s ease, color .2s ease",
                  };
            if (href) {
              return (
                <Link
                  key={`${t.label}-${i}`}
                  href={href}
                  style={tagStyle}
                  className="hero-tag-link"
                >
                  {t.label}
                </Link>
              );
            }
            return (
              <span key={`${t.label}-${i}`} style={tagStyle}>
                {t.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function decorateEm(html: string, accent: string): string {
  return html.replace(
    /<em>/g,
    `<em style="color:${accent};font-style:italic;font-weight:400">`
  );
}
