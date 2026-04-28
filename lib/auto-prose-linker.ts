// ─────────────────────────────────────────────────────────────────
// auto-prose-linker.ts — server-side prose post-processor.
//
// Walks rendered prose HTML and wraps the FIRST occurrence of each
// recognised taxonomy entity (planet, lagna, sanskrit house name,
// gemstone, life-path number) in an internal <a href>. Subsequent
// occurrences stay as plain text so the prose doesn't sea-of-blue.
//
// This runs at render time inside BlockRenderer for every prose,
// scannable-prose, and pull-quote block. The post JSON does NOT
// need to embed any inline links — the system does it automatically.
//
// Mechanism guarantees: every category, every terminal, every post
// gets the same auto-linking on render.
// ─────────────────────────────────────────────────────────────────

import {
  resolveEntityLink,
  PLANET_LABELS,
  LAGNA_LABELS,
  HOUSE_SANSKRIT,
  type PlanetSlug,
  type LagnaSlug,
} from "./internal-links";

interface EntityRule {
  /** Display label exactly as it should appear in the rendered <a> text. */
  label: string;
  /** Resolved internal URL. */
  href: string;
  /** Lower-case search needles, in priority order (longest first). */
  needles: string[];
}

// Build the canonical rule list once. Order matters: longer phrases
// must come before shorter ones so "Mesh Lagna" is matched before
// "Mesh" alone.
function buildRuleList(): EntityRule[] {
  const rules: EntityRule[] = [];

  // Lagnas — both "{Sanskrit} Lagna", "{English} Ascendant" and
  // bare names. Resolve through resolveEntityLink so the URL stays
  // contract-driven.
  for (const [slug, l] of Object.entries(LAGNA_LABELS) as [LagnaSlug, typeof LAGNA_LABELS[LagnaSlug]][]) {
    const label = `${l.sanskrit} Lagna`;
    const href = resolveEntityLink(label);
    if (href) {
      rules.push({
        label,
        href,
        needles: [
          `${l.sanskrit.toLowerCase()} lagna`,
          `${l.english.toLowerCase()} ascendant`,
          `${l.english.toLowerCase()} lagna`,
        ],
      });
    }
    void slug;
  }

  // Planets — both Sanskrit and English names.
  for (const [slug, p] of Object.entries(PLANET_LABELS) as [PlanetSlug, typeof PLANET_LABELS[PlanetSlug]][]) {
    const href = resolveEntityLink(p.sanskrit);
    if (href) {
      rules.push({
        label: p.sanskrit,
        href,
        needles: [p.sanskrit.toLowerCase(), p.english.toLowerCase()],
      });
    }
    void slug;
  }

  // Sanskrit house names (Vyaya Bhava, Tanu Bhava, etc.) — only emit
  // when resolveEntityLink returns a real anchor.
  for (const name of Object.values(HOUSE_SANSKRIT)) {
    const href = resolveEntityLink(name);
    if (href) {
      rules.push({
        label: name,
        href,
        needles: [name.toLowerCase()],
      });
    }
  }

  // Sort by needle length descending so longer phrases win.
  rules.sort((a, b) => {
    const al = Math.max(...a.needles.map((n) => n.length));
    const bl = Math.max(...b.needles.map((n) => n.length));
    return bl - al;
  });
  return rules;
}

let cachedRules: EntityRule[] | null = null;
function getRules(): EntityRule[] {
  if (!cachedRules) cachedRules = buildRuleList();
  return cachedRules;
}

/**
 * Returns true if the position in `lower` falls inside an existing
 * <a>...</a> tag pair, an attribute value, an HTML tag, or an `<em>`
 * already-italicised first-mention block. Used to skip wrapping
 * inside text that's already linked or already styled.
 */
function isInsideExistingMarkup(html: string, idx: number): boolean {
  // Walk backwards from idx looking for the nearest `<` and `>` —
  // if we land inside a `<a ...>...</a>` block, skip.
  let inAnchor = 0;
  let i = 0;
  while (i < idx) {
    if (html.startsWith("<a", i) && (html[i + 2] === " " || html[i + 2] === ">")) {
      inAnchor++;
      i += 2;
      continue;
    }
    if (html.startsWith("</a>", i)) {
      inAnchor = Math.max(0, inAnchor - 1);
      i += 4;
      continue;
    }
    i++;
  }
  if (inAnchor > 0) return true;
  // Inside an HTML tag attribute? Find nearest unmatched `<`.
  const lastOpen = html.lastIndexOf("<", idx);
  const lastClose = html.lastIndexOf(">", idx);
  if (lastOpen > lastClose) return true;
  return false;
}

/**
 * Wrap the first occurrence of each entity rule whose needle matches
 * `html`. Skips occurrences already inside <a>, attributes, or tags.
 * Each entity is wrapped at most once across the whole HTML chunk.
 */
export function autoLinkProseHtml(html: string): string {
  if (!html) return html;
  let out = html;
  const used = new Set<string>();
  for (const rule of getRules()) {
    if (used.has(rule.href)) continue;
    const lower = out.toLowerCase();
    for (const needle of rule.needles) {
      const idx = lower.indexOf(needle);
      if (idx < 0) continue;
      // Only wrap if it's a word-boundary match.
      const before = idx === 0 ? " " : lower[idx - 1];
      const after = idx + needle.length >= lower.length ? " " : lower[idx + needle.length];
      const wb = (c: string) => /[^a-z0-9]/.test(c);
      if (!wb(before) || !wb(after)) continue;
      if (isInsideExistingMarkup(out, idx)) continue;
      // Preserve the exact-case substring from the original HTML.
      const original = out.slice(idx, idx + needle.length);
      const replacement = `<a href="${rule.href}" class="auto-link" data-entity="${escapeAttr(rule.label)}">${original}</a>`;
      out = out.slice(0, idx) + replacement + out.slice(idx + needle.length);
      used.add(rule.href);
      break;
    }
  }
  return out;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
