// lib/forge/ledger.ts
import fs from "node:fs";
import path from "node:path";
import type { Ledger, LedgerEntry, ForgeStatus } from "./types";

export const DEFAULT_LEDGER_PATH = path.join(process.cwd(), "reports", "forge-ledger.json");

export function loadLedger(file: string = DEFAULT_LEDGER_PATH): Ledger {
  if (!fs.existsSync(file)) return { version: 1, entries: {} };
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (data && data.version === 1 && data.entries) return data as Ledger;
  } catch {
    // corrupt ledger — fall through to empty rather than crash the run
  }
  return { version: 1, entries: {} };
}

export function saveLedger(ledger: Ledger, file: string = DEFAULT_LEDGER_PATH): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(ledger, null, 2));
  fs.renameSync(tmp, file); // atomic on same filesystem; survives mid-write kill
}

export function upsertEntry(
  ledger: Ledger,
  slug: string,
  patch: Partial<Omit<LedgerEntry, "slug">>,
  nowIso: string,
): Ledger {
  const prev: LedgerEntry =
    ledger.entries[slug] ?? { slug, status: "pending" as ForgeStatus, attempts: 0, last_failures: [], updated_at: nowIso };
  ledger.entries[slug] = { ...prev, ...patch, slug, updated_at: nowIso };
  return ledger;
}

export function pendingSlugs(ledger: Ledger, allSlugs: string[]): string[] {
  return allSlugs.filter((s) => ledger.entries[s]?.status !== "passed");
}
