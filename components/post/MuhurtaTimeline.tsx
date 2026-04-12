import Link from "next/link";
import { resolveFestival } from "@/lib/festival-resolver";
import { getTheme } from "@/lib/category-themes";
import { SectionHeader } from "./section-helpers";

interface Props {
  eyebrow?: string;
  heading?: string;
  festival_key: string;
  category?: string;
}

// Server component — fetches live (or fallback) muhurta data via the
// festival resolver. Used in festival posts. Refreshed every 24h via
// the route's revalidate setting.

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

export async function MuhurtaTimeline({
  eyebrow,
  heading,
  festival_key,
  category = "festivals",
}: Props) {
  const theme = getTheme(category);
  const festival = await resolveFestival(festival_key);

  // Build a 24h timeline from sunrise to sunset
  const start = timeToMinutes(festival.sunrise);
  const end = timeToMinutes(festival.sunset);
  const span = Math.max(end - start, 1);

  return (
    <section style={{ marginTop: "4rem", marginBottom: "4rem" }}>
      <SectionHeader eyebrow={eyebrow} heading={heading} accentColor={theme.accentDeep} />

      <div
        style={{
          padding: "2rem 2.25rem",
          borderRadius: 18,
          border: "1px solid var(--border)",
          background: "#ffffff",
          boxShadow: "0 18px 50px -28px rgba(1,63,71,0.25)",
        }}
      >
        {/* Festival summary row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 18,
            marginBottom: 26,
            paddingBottom: 22,
            borderBottom: "1px solid var(--cream-3)",
          }}
        >
          <Cell label="Year" value={String(festival.year)} accent={theme.accentDeep} />
          <Cell label="Date" value={festival.date_formatted} accent={theme.accentDeep} />
          <Cell label="Tithi" value={festival.tithi} accent={theme.accentDeep} />
          <Cell
            label="Nakshatra"
            value={festival.nakshatra}
            accent={theme.accentDeep}
          />
        </div>

        {/* Sunrise → sunset axis */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--on-light-3)",
          }}
        >
          <span>Sunrise · {festival.sunrise}</span>
          <span>Sunset · {festival.sunset}</span>
        </div>

        <div
          style={{
            position: "relative",
            height: 90,
            background: "var(--cream-2)",
            borderRadius: 12,
            border: "1px solid var(--border-mid)",
            overflow: "hidden",
          }}
        >
          {festival.muhurta_windows.map((w, i) => {
            const wStart = timeToMinutes(w.start);
            const wEnd = timeToMinutes(w.end);
            // Clamp into the visible 0..span range
            const clampStart = Math.max(0, Math.min(span, wStart - start));
            const clampEnd = Math.max(0, Math.min(span, wEnd - start));
            const widthPct = ((clampEnd - clampStart) / span) * 100;
            const leftPct = (clampStart / span) * 100;
            if (widthPct <= 0) return null;
            return (
              <div
                key={`${w.name}-${i}`}
                title={`${w.name} · ${w.start} – ${w.end}`}
                style={{
                  position: "absolute",
                  top: 8,
                  bottom: 8,
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                  background:
                    w.type === "auspicious"
                      ? `linear-gradient(180deg, ${theme.accentColor} 0%, ${theme.accentDeep} 100%)`
                      : w.type === "inauspicious"
                        ? "linear-gradient(180deg, #c94444 0%, #8b1a1a 100%)"
                        : "linear-gradient(180deg, #cccccc 0%, #888888 100%)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  padding: "0 8px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  boxShadow: "0 6px 16px -8px rgba(1,63,71,0.45)",
                }}
              >
                {w.name}
              </div>
            );
          })}
        </div>

        {/* Window legend with detail */}
        <ul style={{ marginTop: 22, listStyle: "none", padding: 0 }}>
          {festival.muhurta_windows.map((w, i) => (
            <li
              key={`leg-${w.name}-${i}`}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 0",
                borderBottom:
                  i === festival.muhurta_windows.length - 1
                    ? "none"
                    : "1px solid var(--cream-3)",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  marginTop: 6,
                  flexShrink: 0,
                  background:
                    w.type === "auspicious"
                      ? theme.accentColor
                      : w.type === "inauspicious"
                        ? "#c94444"
                        : "#888",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--on-light-1)",
                  }}
                >
                  {w.name}
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    color: "var(--on-light-3)",
                  }}
                >
                  {w.start} – {w.end} · {w.description ?? ""}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: 18,
            paddingTop: 18,
            borderTop: "1px solid var(--cream-3)",
            fontSize: 11,
            color: "var(--on-light-4)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span>
            Source: {festival.source === "api" ? "Live panchang API" : "Approximate fallback"}
          </span>
          <Link
            href="https://panchang.vastucart.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.accentDeep, fontWeight: 600 }}
          >
            Powered by panchang.vastucart.in →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 17,
          fontWeight: 600,
          color: "var(--on-light-1)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
