#!/usr/bin/env tsx
// Dump the schema output of a post via buildPostSchema(), grouped
// by @type, for use as the canonical SOP reference template.
import fs from "node:fs";
import { buildPostSchema } from "../lib/schema-builder";
import type { ArticlePost } from "../lib/types";

const file = process.argv[2];
if (!file) {
  console.error("usage: dump-schema.ts <file.json>");
  process.exit(2);
}
const post = JSON.parse(fs.readFileSync(file, "utf8")) as ArticlePost;
const entities = buildPostSchema(post);

// Group by @type
const grouped: Record<string, unknown[]> = {};
for (const e of entities) {
  const t = (e["@type"] as string) ?? "Unknown";
  if (!grouped[t]) grouped[t] = [];
  grouped[t].push(e);
}

console.log(`# Schema entities for ${post.slug}\n`);
console.log(`Total: ${entities.length} entities across ${Object.keys(grouped).length} types\n`);
for (const [type, items] of Object.entries(grouped)) {
  console.log(`## ${type} (×${items.length})\n`);
  console.log("```json");
  console.log(JSON.stringify(items[0], null, 2));
  console.log("```\n");
}
