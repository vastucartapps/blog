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

export function Footer() {
  return (
    <footer className="diamond-bg" style={{ marginTop: "6rem" }}>
      <div className="wrap-page" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
        <div
          style={{
            display: "grid",
            gap: 48,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <div>
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
                maxWidth: 280,
                fontSize: 13,
                lineHeight: 1.65,
                color: "var(--on-dark-2)",
              }}
            >
              Ancient Jyotish wisdom, translated for the modern seeker. Rooted in classical shastra.
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--saffron-light)",
              }}
            >
              Explore
            </p>
            <ul
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 24px",
                fontSize: 13,
                listStyle: "none",
              }}
            >
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/${c.slug}`}
                    style={{ color: "var(--on-dark-3)" }}
                    className="hover:text-white"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--saffron-light)",
              }}
            >
              VastuCart Network
            </p>
            <ul
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 13,
                listStyle: "none",
              }}
            >
              {Object.values(VASTUCART_NETWORK).slice(0, 8).map((node) => (
                <li key={node.domain}>
                  <Link
                    href={node.url}
                    style={{ color: "var(--on-dark-3)" }}
                    className="hover:text-white"
                  >
                    {node.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--saffron-light)",
              }}
            >
              Editorial Trust
            </p>
            <ul
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 13,
                listStyle: "none",
              }}
            >
              <li>
                <Link
                  href="/authors"
                  style={{ color: "var(--on-dark-3)" }}
                  className="hover:text-white"
                >
                  Authors
                </Link>
              </li>
              <li>
                <Link
                  href="/authors/pt-raghav-sharma"
                  style={{ color: "var(--on-dark-3)" }}
                  className="hover:text-white"
                >
                  Pt. Raghav Sharma
                </Link>
              </li>
              <li>
                <Link
                  href="/authors/vastucart-editorial"
                  style={{ color: "var(--on-dark-3)" }}
                  className="hover:text-white"
                >
                  VastuCart Editorial
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-standards"
                  style={{ color: "var(--on-dark-3)" }}
                  className="hover:text-white"
                >
                  Editorial Standards
                </Link>
              </li>
              <li>
                <Link
                  href="/classical-sources"
                  style={{ color: "var(--on-dark-3)" }}
                  className="hover:text-white"
                >
                  Classical Sources
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: 11, color: "var(--on-dark-4)" }}>
            &copy; {new Date().getFullYear()} VastuCart. All rights reserved. Educational purposes only.
          </p>
          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              fontSize: 11,
              listStyle: "none",
            }}
          >
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <Link
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--on-dark-3)" }}
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
