import type { CSSProperties, ReactNode } from "react";

// Shared section header used by every unique post section so the
// "eyebrow + heading + accent line" pattern stays identical across
// every category. Layout is frozen — only the accent colour changes
// per theme.

interface Props {
  eyebrow?: string;
  heading?: string;
  accentColor: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function SectionHeader({ eyebrow, heading, accentColor, children, style }: Props) {
  return (
    <header style={{ marginBottom: 22, ...style }}>
      {eyebrow ? (
        <div
          style={{
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 10.5,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: accentColor,
          }}
        >
          {eyebrow}
          <span
            style={{
              height: 1.5,
              width: 36,
              background: accentColor,
              opacity: 0.4,
              borderRadius: 1,
            }}
          />
        </div>
      ) : null}
      {heading ? (
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.2,
            color: "var(--on-light-1)",
            letterSpacing: "-0.012em",
          }}
        >
          {heading}
        </h2>
      ) : null}
      {children}
    </header>
  );
}
