import { Button } from "@/components/ui/Button";

interface Props {
  totalPosts: number;
  totalCategories: number;
}

export function HomeHero({ totalPosts, totalCategories }: Props) {
  return (
    <section className="diamond-bg relative overflow-hidden">
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -140,
          right: -120,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(51,138,149,0.22) 0%, transparent 65%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: -120,
          left: -100,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,132,10,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="wrap-hero-lg relative z-10" style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--saffron-light)",
          }}
        >
          VastuCart Blog
        </p>
        <h1
          className="hero-display"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--on-dark-1)",
            marginTop: "1.25rem",
            maxWidth: 820,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Ancient Jyotish wisdom,
          <br />
          <span
            style={{
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--saffron-light)",
            }}
          >
            for the modern seeker.
          </span>
        </h1>
        <p
          className="hero-body"
          style={{
            color: "var(--on-dark-2)",
            maxWidth: 620,
            marginTop: "1.4rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Deep articles on Vedic astrology, tarot, numerology, vastu and spiritual
          practice. Rooted in classical shastra, written by practicing experts.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: "2.25rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button href="https://kundali.vastucart.in" size="lg" variant="primary">
            GET YOUR FREE KUNDALI
          </Button>
          <Button href="/jyotish" size="lg" variant="outline-dark">
            BROWSE ARTICLES
          </Button>
        </div>
        <div style={{ marginTop: "3.25rem", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(1rem, 4vw, 3rem)",
              padding: "1rem clamp(1rem, 3vw, 2rem)",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Stat value={String(totalPosts)} label="Articles" />
            <Stat value={String(totalCategories)} label="Categories" />
            <Stat value="3" label="Authors" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 500,
          color: "var(--on-dark-1)",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--on-dark-3)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
