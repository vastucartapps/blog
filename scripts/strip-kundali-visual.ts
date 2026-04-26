#!/usr/bin/env tsx
// Strip every `kundali-visual` content block from Jyotish posts.
// Hero card already embeds a North Indian D-1 chart with the
// highlighted house and planet marker, so the standalone block is
// redundant. The adjacent kundali image-figure is left intact.
//
// Also collapses consecutive dividers that are left over after the
// block is removed, since `divider, kundali-visual, divider`
// becomes `divider, divider` which renders an ugly double rule.

import fs from "node:fs";
import path from "node:path";

interface Block {
  type: string;
  [k: string]: unknown;
}
interface Post {
  slug: string;
  content: Block[];
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

const CONTENT_DIR = path.join(
  process.cwd(),
  "content",
  "jyotish",
  "graha-in-bhava",
);

function collapseDoubleDividers(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    const prev = out[out.length - 1];
    if (prev?.type === "divider" && b.type === "divider") continue;
    out.push(b);
  }
  return out;
}

function trimEdgeDividers(blocks: Block[]): Block[] {
  const out = [...blocks];
  while (out[0]?.type === "divider") out.shift();
  while (out[out.length - 1]?.type === "divider") out.pop();
  return out;
}

let touched = 0;
for (const f of fs.readdirSync(CONTENT_DIR)) {
  if (!f.endsWith(".json")) continue;
  const full = path.join(CONTENT_DIR, f);
  const post: Post = JSON.parse(fs.readFileSync(full, "utf-8"));
  const before = post.content.length;
  let next = post.content.filter((b) => b.type !== "kundali-visual");
  next = collapseDoubleDividers(next);
  next = trimEdgeDividers(next);
  if (next.length !== before) {
    post.content = next;
    if (!dryRun) {
      fs.writeFileSync(full, JSON.stringify(post, null, 2) + "\n");
    }
    touched++;
  }
}
console.log(
  `${touched} post(s) ${dryRun ? "would be" : ""} updated`.replace(/\s+/g, " "),
);
