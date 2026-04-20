import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function Header() {
  const primary = CATEGORIES.slice(0, 6);
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(250,246,239,0.94)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="wrap-page"
        style={{ display: "flex", alignItems: "center", gap: 24, height: 64 }}
      >
        <Link
          href="/"
          aria-label="VastuCart Blog home"
          style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
        >
          <Image
            src="/VastuCartLogo.png"
            alt="VastuCart"
            width={34}
            height={34}
            style={{ borderRadius: 4 }}
            priority
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--on-light-1)",
            }}
          >
            VastuCart <span style={{ color: "var(--saffron)" }}>Blog</span>
          </span>
        </Link>

        <nav
          className="hidden lg:flex"
          style={{ alignItems: "center", gap: 4 }}
          aria-label="Primary"
        >
          {primary.map((c) => (
            <Link
              key={c.id}
              href={`/${c.slug}`}
              style={{
                padding: "8px 12px",
                fontSize: 12.5,
                fontWeight: 500,
                color: "var(--on-light-1)",
                borderRadius: 6,
              }}
              className="hover:text-teal hover:bg-cream-2 transition-colors"
            >
              {c.label}
            </Link>
          ))}
          <Link
            href="/authors"
            style={{
              padding: "8px 12px",
              fontSize: 12.5,
              fontWeight: 500,
              color: "var(--on-light-1)",
              borderRadius: 6,
            }}
            className="hover:text-teal hover:bg-cream-2 transition-colors"
          >
            Authors
          </Link>
        </nav>

        <div style={{ marginLeft: "auto", display: "inline-flex", gap: 8, alignItems: "center" }}>
          <Link
            href="/search"
            aria-label="Search"
            style={{
              display: "inline-flex",
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              color: "var(--on-light-1)",
            }}
            className="hover:bg-cream-2"
          >
            <Icon name="search" size={16} aria-hidden />
          </Link>
          <Button href="https://kundali.vastucart.in" size="sm" variant="primary">
            FREE KUNDALI
          </Button>
        </div>
      </div>
    </header>
  );
}
