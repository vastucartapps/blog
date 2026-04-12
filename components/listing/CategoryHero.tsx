import { Breadcrumb, type Crumb } from "@/components/layout/Breadcrumb";
import { Icon, type IconName } from "@/components/ui/Icon";
import { getTheme, type CategoryTheme } from "@/lib/category-themes";

interface Props {
  breadcrumb: Crumb[];
  eyebrow: string;
  label: string;
  labelHindi: string;
  description: string;
  icon: IconName;
  postCount: number;
  category?: string;
  theme?: CategoryTheme;
}

export function CategoryHero({
  breadcrumb,
  eyebrow,
  label,
  labelHindi,
  description,
  icon,
  postCount,
  category,
  theme: themeProp,
}: Props) {
  const theme = themeProp ?? getTheme(category);
  return (
    <section
      className="diamond-bg relative overflow-hidden"
      style={{ minHeight: 380, backgroundColor: theme.heroBg }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -120,
          right: -100,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 65%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: -120,
          left: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.glowColorAlt} 0%, transparent 65%)`,
        }}
      />

      <div className="wrap-hero-lg relative z-10">
        <div style={{ marginBottom: "1.5rem" }}>
          <Breadcrumb items={breadcrumb} tone="dark" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 22,
              border: `1px solid ${theme.tagBorder}`,
              background: `linear-gradient(135deg, ${theme.tagBg} 0%, rgba(255,255,255,0.04) 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.accentColor,
              flexShrink: 0,
              boxShadow: `0 18px 48px -16px ${theme.glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`,
            }}
          >
            <Icon name={icon} size={56} />
          </div>

          <div style={{ minWidth: 0 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 10.5,
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: 20,
                background: theme.tagBg,
                border: `1px solid ${theme.tagBorder}`,
                color: theme.accentColor,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
            <h1
              className="hero-display"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                color: "var(--on-dark-1)",
                marginTop: 14,
              }}
            >
              {label}
            </h1>
            <p
              className="verse"
              style={{ marginTop: 6, fontSize: 18, color: "var(--on-dark-3)" }}
            >
              {labelHindi}
            </p>
          </div>
        </div>

        <p
          style={{
            marginTop: 24,
            maxWidth: 720,
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--on-dark-2)",
            fontWeight: 300,
          }}
        >
          {description}
        </p>

        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            display: "flex",
            alignItems: "center",
            gap: 32,
            flexWrap: "wrap",
          }}
        >
          <Stat
            value={String(postCount)}
            label={postCount === 1 ? "Article published" : "Articles published"}
            color={theme.accentColor}
          />
          <Stat value="22+" label="Years of practice" color={theme.accentColor} />
          <Stat value="Free" label="Always, no paywall" color={theme.accentColor} />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          fontWeight: 600,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--on-dark-3)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
