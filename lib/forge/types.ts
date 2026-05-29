// lib/forge/types.ts
// Shared contracts for the Content Forge pipeline. Substrate-agnostic:
// the same types are reused by the Plan 2 orchestrator and a future
// headless (SDK) build.

export type ForgeStatus = "pending" | "in-progress" | "passed" | "quarantined";

export interface PostSpec {
  slug: string;
  category: string;
  subcategory: string;
  template: string;
  planet_id?: string;
  house_number?: number;
  lagna_id?: string;
}

export interface LedgerEntry {
  slug: string;
  status: ForgeStatus;
  attempts: number;
  last_failures: string[];
  updated_at: string; // ISO 8601
}

export interface Ledger {
  version: 1;
  entries: Record<string, LedgerEntry>; // keyed by slug
}

export interface GateResult {
  name: string;        // "validate-post" | "duplicate-content"
  passed: boolean;
  details: string[];   // failure lines (empty when passed)
}

export interface GateVerdict {
  slug: string;
  passed: boolean;     // logical AND of all results
  results: GateResult[];
}

export interface ImageQaIssue {
  file: string;
  problem: string;
}

export interface ImageQaResult {
  passed: boolean;
  issues: ImageQaIssue[];
}
