#!/usr/bin/env tsx
// scripts/forge-check.ts
// Run every commit gate for ONE post and update the forge ledger.
// Exit 0 => commit-worthy. Exit 1 => not (failures printed + recorded).
import fs from "node:fs";
import path from "node:path";
import { runGates } from "../lib/forge/gates";
import { checkImages } from "../lib/forge/image-qa";
import { loadLedger, saveLedger, upsertEntry } from "../lib/forge/ledger";

async function main() {
  const postPath = process.argv[2];
  if (!postPath) {
    console.error("usage: forge-check.ts <post.json>");
    process.exit(2);
  }
  const post = JSON.parse(fs.readFileSync(postPath, "utf8"));
  const slug: string = post.slug ?? path.basename(postPath, ".json");

  const verdict = runGates(postPath);
  const img = await checkImages(post);
  const allPassed = verdict.passed && img.passed;

  const failures = [
    ...verdict.results.filter((r) => !r.passed).flatMap((r) => r.details.map((d) => `${r.name}: ${d}`)),
    ...img.issues.map((i) => `image-qa: ${i.file} — ${i.problem}`),
  ];

  const nowIso = new Date().toISOString();
  let ledger = loadLedger();
  const prevAttempts = ledger.entries[slug]?.attempts ?? 0;
  ledger = upsertEntry(
    ledger,
    slug,
    { status: allPassed ? "passed" : "pending", attempts: prevAttempts + 1, last_failures: failures },
    nowIso,
  );
  saveLedger(ledger);

  if (allPassed) {
    console.log(`[FORGE PASS] ${slug}`);
    process.exit(0);
  }
  console.log(`[FORGE FAIL] ${slug}`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

main();
