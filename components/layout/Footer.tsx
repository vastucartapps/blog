import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, VASTUCART_NETWORK } from "@/lib/categories";

const SOCIALS = [
  { label: "Facebook", url: "https://www.facebook.com/vastucartindia" },
  { label: "Instagram", url: "https://www.instagram.com/vastucart/" },
  { label: "Pinterest", url: "https://in.pinterest.com/vastucart/" },
  { label: "Threads", url: "https://www.threads.com/@vastucart" },
  { label: "X", url: "https://x.com/vastucart" },
  { label: "Etsy", url: "https://vastucart.etsy.com" },
];

const EDITORIAL = [
  { label: "About the Editorial Desk", href: "/authors" },
  { label: "VastuCart Editorial", href: "/authors/vastucart-editorial" },
  { label: "Editorial Standards", href: "/editorial-standards" },
  { label: "Classical Sources", href: "/classical-sources" },
];

const linkStyle = { color: "var(--on-dark-3)" } as const;

const headingStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--saffron-light)",
  margin: 0,
} as const;

export function Footer() {
  return (
    <footer className="diamond-bg" style={{ marginTop: "6rem" }}>
      <div className="wrap-page footer-pad">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Image
                src="/VastuCartLogo.png"
                alt="VastuCart"
                width={40}
                height={40}
                style={{ borderRadius: 4 }}
              />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "var(--on-dark-1)",
                }}
              >
                VastuCart <span style={{ color: "var(--saffron-light)" }}>Blog</span>
              </span>
            </Link>
            <p
              className="verse"
              style={{
                marginTop: 16,
                maxWidth: 320,
                fontSize: 13,
                lineHeight: 1.65,
                color: "var(--on-dark-2)",
              }}
            >
              Ancient Jyotish wisdom, translated for the modern seeker. Rooted in classical shastra.
            </p>
          </div>

          <div className="footer-col">
            <p style={headingStyle}>Explore</p>
            <ul className="footer-list">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/${c.slug}`} style={linkStyle} className="hover:text-white">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <p style={headingStyle}>VastuCart Network</p>
            <ul className="footer-list">
              {Object.values(VASTUCART_NETWORK).slice(0, 8).map((node) => (
                <li key={node.domain}>
                  <Link href={node.url} style={linkStyle} className="hover:text-white">
                    {node.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <p style={headingStyle}>Editorial Trust</p>
            <ul className="footer-list">
              {EDITORIAL.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} style={linkStyle} className="hover:text-white">
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ fontSize: 11, color: "var(--on-dark-4)", margin: 0 }}>
            &copy; {new Date().getFullYear()} VastuCart. All rights reserved. Educational purposes only.
          </p>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              fontSize: 11,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  className="hover:text-white"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
