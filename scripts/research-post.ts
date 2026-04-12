#!/usr/bin/env tsx
// ─────────────────────────────────────────────────────────────────
// research-post.ts — generates a keyword brief from a topic seed.
//
// Currently a stub. Will be wired to an SERP / autosuggest API
// later. Until then, it expands the seed using the Romanised
// variation registry and prints a starter brief that the post
// generation step uses.
//
// Usage:
//   npx tsx scripts/research-post.ts \
//     --topic "sun in 1st house aries lagna" \
//     --canonical "surya,mesh"
// ─────────────────────────────────────────────────────────────────

import { flatVariants } from "../lib/keyword-variations";

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i + 1];
      out[key] = val;
      i++;
    }
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.topic) {
    console.error("usage: research-post.ts --topic '...' --canonical 'a,b'");
    process.exit(2);
  }
  const canonicals = (args.canonical ?? "").split(",").filter(Boolean);
  const variations: Record<string, string[]> = {};
  for (const c of canonicals) {
    variations[c] = flatVariants(c);
  }
  const brief = {
    focus_keyword: args.topic,
    secondary_keywords: [
      // TODO: derived from real SERP/autosuggest API
      `${args.topic} effects`,
      `${args.topic} remedies`,
      `${args.topic} career`,
      `${args.topic} marriage`,
      `${args.topic} dasha`,
    ],
    seed_queries: [
      args.topic,
      ...canonicals.flatMap((c) =>
        flatVariants(c).map((v) => `${args.topic.replace(c, v)}`)
      ),
    ].slice(0, 30),
    lingual_variations: variations,
    content_gaps: [
      "TODO: identify after SERP scrape",
      "TODO: identify after SERP scrape",
      "TODO: identify after SERP scrape",
    ],
    questions: [
      `Is ${args.topic} good?`,
      `What is the best career for ${args.topic}?`,
      `How to wear remedies for ${args.topic}?`,
      `When does ${args.topic} give best results?`,
      `Why does ${args.topic} cause challenges?`,
    ],
    lsi_terms: [
      "TODO: derive from topic",
    ],
    density_targets: {
      focus_min: 0.008,
      focus_max: 0.015,
      secondary_min: 0.003,
      secondary_max: 0.006,
    },
  };
  console.log(JSON.stringify(brief, null, 2));
}

main();
