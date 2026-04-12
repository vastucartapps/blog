import * as React from "react";
import Link from "next/link";
import { Icon, type IconName } from "./Icon";

// Inline styles, NOT Tailwind arbitrary values, because Tailwind v4 in this
// setup silently drops bracket-syntax classes.

type Variant =
  | "primary"
  | "teal"
  | "outline-dark"
  | "outline-light"
  | "ghost-sm-saff"
  | "ghost-sm-teal";

type Size = "sm" | "md" | "lg";

const sizeStyle: Record<Size, React.CSSProperties> = {
  sm: { height: 38, padding: "0 18px", fontSize: 12, gap: 6, borderRadius: 8 },
  md: { height: 46, padding: "0 24px", fontSize: 13.5, gap: 8, borderRadius: 10 },
  lg: { height: 54, padding: "0 30px", fontSize: 14.5, gap: 10, borderRadius: 12 },
};

function variantStyle(v: Variant): React.CSSProperties {
  switch (v) {
    case "primary":
      return {
        background: "linear-gradient(180deg, var(--saffron) 0%, #d4760a 100%)",
        color: "#ffffff",
        border: "1px solid rgba(0,0,0,0.05)",
        fontWeight: 600,
        boxShadow:
          "0 12px 28px -10px rgba(232,132,10,0.55), inset 0 1px 0 rgba(255,255,255,0.30)",
      };
    case "teal":
      return {
        background: "linear-gradient(180deg, var(--teal) 0%, #267782 100%)",
        color: "#ffffff",
        border: "1px solid rgba(0,0,0,0.05)",
        fontWeight: 600,
        boxShadow:
          "0 12px 28px -10px rgba(51,138,149,0.55), inset 0 1px 0 rgba(255,255,255,0.20)",
      };
    case "outline-dark":
      return {
        background: "transparent",
        color: "#ffffff",
        border: "2px solid #ffffff",
        fontWeight: 600,
      };
    case "outline-light":
      return {
        background: "transparent",
        color: "var(--on-light-1)",
        border: "1.5px solid var(--border-mid)",
        fontWeight: 600,
      };
    case "ghost-sm-saff":
      return {
        background: "var(--saffron)",
        color: "#ffffff",
        border: "none",
        fontWeight: 600,
        boxShadow: "0 8px 20px -10px rgba(232,132,10,0.5)",
      };
    case "ghost-sm-teal":
      return {
        background: "var(--teal)",
        color: "#ffffff",
        border: "none",
        fontWeight: 600,
        boxShadow: "0 8px 20px -10px rgba(51,138,149,0.5)",
      };
  }
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconTrailing?: IconName;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & { href?: undefined };
type ButtonAsLink = CommonProps & { href: string; target?: string; rel?: string };

const baseStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  cursor: "pointer",
  userSelect: "none",
  textDecoration: "none",
  fontFamily: "var(--font-body)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  transition:
    "transform 0.18s ease, box-shadow 0.18s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
};

function body(
  icon: IconName | undefined,
  iconTrailing: IconName | undefined,
  children: React.ReactNode
) {
  return (
    <>
      {icon ? <Icon name={icon} size={15} aria-hidden /> : null}
      <span>{children}</span>
      {iconTrailing ? <Icon name={iconTrailing} size={15} aria-hidden /> : null}
    </>
  );
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    icon,
    iconTrailing,
    className,
    children,
  } = props;

  const style: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyle[size],
    ...variantStyle(variant),
  };

  const cls = ["btn", `btn--${variant}`, className].filter(Boolean).join(" ");

  if ("href" in props && props.href) {
    const external = /^https?:/.test(props.href);
    return (
      <Link
        href={props.href}
        target={props.target ?? (external ? "_blank" : undefined)}
        rel={props.rel ?? (external ? "noopener noreferrer" : undefined)}
        className={cls}
        style={style}
      >
        {body(icon, iconTrailing, children)}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    icon: _i,
    iconTrailing: _it,
    className: _c,
    children: _ch,
    ...rest
  } = props as ButtonAsButton;
  void _v; void _s; void _i; void _it; void _c; void _ch;
  return (
    <button className={cls} style={style} {...rest}>
      {body(icon, iconTrailing, children)}
    </button>
  );
}
