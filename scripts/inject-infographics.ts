#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// inject-infographics.ts
//
// Walks every Jyotish post and inserts `infographic` content blocks
// at the structurally-matched slot for each thematically-relevant
// illustration in public/illustrations/manifest.json.
//
// Mapping rules (heuristic):
//   - heading contains "career" / "vocation" → career or work theme
//   - heading contains "remedies" / "daily practice" → meditation
//     or devotion theme
//   - heading contains "marriage" / "partnership" → partnership
//   - heading contains "health" → healthcare
//   - heading contains "mother" → family
//   - heading contains "wealth" / "prosperity" → prosperity
//   - heading contains "transformation" / "occult" → transformation
//   - else fall back to "wisdom"
//
// Idempotent — skips when an infographic with the same illustration
// already sits at that slot.
//
// Usage:
//   npx tsx scripts/inject-infographics.ts                # dry run
//   npx tsx scripts/inject-infographics.ts --apply        # write
//   npx tsx scripts/inject-infographics.ts --apply --slug sun-1st-house-aries-lagna
// ─────────────────────────────────────────────────────────────────

import fs from "node:fs";
import path from "node:path";

interface Options {
  apply: boolean;
  slug?: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const MANIFEST_PATH = path.join(
  process.cwd(),
  "public",
  "illustrations",
  "manifest.json"
);

interface ManifestEntry {
  theme: string;
  filename: string;
  alt: string;
}

interface Manifest {
  themes: ManifestEntry[];
}

interface Block {
  type: string;
  illustration?: string;
  heading?: string;
  [k: string]: unknown;
}

interface Post {
  slug: string;
  category?: string;
  content: Block[];
  [k: string]: unknown;
}

function loadManifest(): Map<string, ManifestEntry[]> {
  if (!fs.existsSync(MANIFEST_PATH)) return new Map();
  const json = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8")) as Manifest;
  const grouped = new Map<string, ManifestEntry[]>();
  for (const entry of json.themes) {
    if (!grouped.has(entry.theme)) grouped.set(entry.theme, []);
    grouped.get(entry.theme)!.push(entry);
  }
  return grouped;
}

function pickIllustration(
  manifest: Map<string, ManifestEntry[]>,
  theme: string,
  slug: string
): ManifestEntry | null {
  const candidates = manifest.get(theme);
  if (!candidates || candidates.length === 0) return null;
  // Stable selection per post slug: hash slug, modulo
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(h) % candidates.length;
  return candidates[idx];
}

function classifyHeading(heading: string): string {
  const h = heading.toLowerCase();
  if (h.includes("career") || h.includes("vocation") || h.includes("livelihood"))
    return "career";
  if (h.includes("remedies") || h.includes("daily practice"))
    return "meditation";
  if (
    h.includes("partnership") ||
    h.includes("marriage") ||
    h.includes("spouse")
  )
    return "partnership";
  if (h.includes("health") || h.includes("healing")) return "healthcare";
  if (h.includes("mother") || h.includes("family")) return "family";
  if (
    h.includes("wealth") ||
    h.includes("prosperity") ||
    h.includes("dhana")
  )
    return "prosperity";
  if (
    h.includes("transformation") ||
    h.includes("occult") ||
    h.includes("research")
  )
    return "transformation";
  if (h.includes("communication") || h.includes("speech"))
    return "conversation";
  if (h.includes("courage") || h.includes("effort")) return "courage";
  if (h.includes("philosoph") || h.includes("dharma") || h.includes("learning"))
    return "wisdom";
  if (h.includes("meditation") || h.includes("mantra")) return "mantra";
  if (h.includes("celebration") || h.includes("festival"))
    return "celebration";
  if (h.includes("writing") || h.includes("authored")) return "writing";
  if (h.includes("temple") || h.includes("devotion")) return "devotion";
  return "wisdom";
}

function alreadyHasIllustration(
  content: Block[],
  filename: string
): boolean {
  return content.some(
    (b) => b.type === "infographic" && b.illustration === filename
  );
}

function injectInfographics(
  post: Post,
  manifest: Map<string, ManifestEntry[]>
): { changed: boolean; post: Post } {
  if (post.category !== "jyotish") return { changed: false, post };
  if (!Array.isArray(post.content)) return { changed: false, post };

  let changed = false;
  // Find scannable-prose / prose blocks with substantive headings
  // (career, remedies, deep-dive, etc) and insert an infographic
  // right after each. Limit to 2-3 to avoid clutter.
  const targetTypes = new Set(["scannable-prose", "prose"]);
  const candidates: { idx: number; theme: string }[] = [];

  for (let i = 0; i < post.content.length; i++) {
    const b = post.content[i];
    if (!targetTypes.has(b.type)) continue;
    const heading = String(b.heading ?? "");
    if (!heading) continue;
    const theme = classifyHeading(heading);
    // Only keep "interesting" themes — skip generic at-a-glance / body
    if (
      !["career", "meditation", "partnership", "healthcare", "family",
       "prosperity", "transformation", "conversation", "courage",
       "wisdom", "writing"].includes(theme)
    ) continue;
    if (heading.toLowerCase().includes("at a glance")) continue;
    if (heading.toLowerCase().includes("body and temperament")) continue;
    candidates.push({ idx: i, theme });
  }

  // Take up to 2 from career + remedies + deep-dive (alternating).
  // Insert in REVERSE order so earlier indices stay valid as we
  // splice later positions in.
  const seenThemes = new Set<string>();
  const picks: { idx: number; theme: string }[] = [];
  for (const c of candidates) {
    if (seenThemes.has(c.theme)) continue;
    seenThemes.add(c.theme);
    picks.push(c);
    if (picks.length >= 2) break;
  }

  // Insert in descending index order
  picks.sort((a, b) => b.idx - a.idx);

  for (const pick of picks) {
    const entry = pickIllustration(manifest, pick.theme, post.slug);
    if (!entry) continue;
    if (alreadyHasIllustration(post.content, entry.filename)) continue;
    const block: Block = {
      type: "infographic",
      illustration: entry.filename,
      alt: entry.alt,
      caption: undefined,
      eyebrow: pick.theme.toUpperCase().replace(/_/g, " "),
      heading: undefined,
    };
    post.content.splice(pick.idx + 1, 0, block);
    changed = true;
  }

  return { changed, post };
}

function walk(dir: string, cb: (file: string) => void): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const opts: Options = { apply: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--apply") opts.apply = true;
    else if (args[i] === "--slug" && args[i + 1]) {
      opts.slug = args[i + 1];
      i++;
    }
  }
  return opts;
}

function main() {
  const opts = parseArgs();
  const manifest = loadManifest();
  if (manifest.size === 0) {
    console.error(
      "manifest.json not found or empty — run the illustration pipeline first"
    );
    process.exit(1);
  }
  const files: string[] = [];
  walk(CONTENT_DIR, (f) => {
    if (f.endsWith(".json")) files.push(f);
  });
  let updated = 0;
  let unchanged = 0;
  for (const file of files) {
    let post: Post;
    try {
      post = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
      continue;
    }
    if (opts.slug && post.slug !== opts.slug) continue;
    const { changed } = injectInfographics(post, manifest);
    if (changed) {
      updated++;
      if (opts.apply) {
        fs.writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
      }
      console.log(`  ${opts.apply ? "✓" : "~"} ${path.basename(file)}`);
    } else {
      unchanged++;
    }
  }
  console.log(
    `\n${updated} ${opts.apply ? "updated" : "would update"}, ${unchanged} unchanged.`
  );
  if (!opts.apply && updated > 0) {
    console.log(`\nRun with --apply to write changes.`);
  }
}

main();
