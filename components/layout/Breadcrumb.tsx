import Link from "next/link";

// Reference .breadcrumb on dark hero:
// 11px, --on-dark-3 text, 6px gap, .bc-sep opacity .3.

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  items: Crumb[];
  tone?: "dark" | "light";
}

export function Breadcrumb({ items, tone = "light" }: Props) {
  const base = tone === "dark" ? "text-white/50" : "text-ink-muted";
  const linkHover = tone === "dark" ? "hover:text-saffron-light" : "hover:text-saffron";
  const sep = tone === "dark" ? "text-white/30" : "text-ink-faint";
  const current = tone === "dark" ? "text-white/60" : "text-ink";

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-[6px] text-[11px] tracking-[0.07em]"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-[6px]">
            {isLast || !item.href ? (
              <span className={current}>{item.label}</span>
            ) : (
              <Link href={item.href} className={`${base} ${linkHover} transition-colors`}>
                {item.label}
              </Link>
            )}
            {!isLast ? <span className={`${sep} text-[10px]`}>›</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
