interface Props {
  text: string;
}

// Visible summary card. Server component: the same text is in the HTML
// the crawler fetches and in what the reader sees. No heading element, so it
// cannot break heading order.
export function QuickTakeaway({ text }: Props) {
  return (
    <section
      className="quick-takeaway"
      aria-label="Quick Takeaway"
      style={{
        marginTop: "1.75rem",
        marginBottom: "1.75rem",
        padding: "1.1rem 1.4rem",
        borderLeft: "3px solid var(--saffron)",
        borderRadius: 10,
        background: "var(--saffron-pale)",
      }}
    >
      <div
        style={{
          marginBottom: 6,
          fontSize: 10.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--saffron)",
        }}
      >
        Quick Takeaway
      </div>
      <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.75, color: "var(--on-light-1)" }}>{text}</p>
    </section>
  );
}
