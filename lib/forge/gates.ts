// lib/forge/gates.ts
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GateResult, GateVerdict } from "./types";

export type ScriptRunner = (script: string, args: string[]) => { code: number; out: string };

// Resolve gate scripts against the repo root (this file lives at
// lib/forge/gates.ts), NOT process.cwd() — so the gates run correctly
// no matter which directory the orchestrator invokes them from. A
// cwd-relative path would silently "not find" the scripts and record a
// false failure indistinguishable from a real one.
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const defaultRunner: ScriptRunner = (script, args) => {
  const res = spawnSync("npx", ["tsx", path.join(REPO_ROOT, script), ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  // ENOENT / signal kill => status is null. Fail closed, and surface why.
  if (res.error) return { code: 1, out: `spawn error: ${res.error.message}` };
  return { code: res.status ?? 1, out: `${res.stdout ?? ""}${res.stderr ?? ""}` };
};

const ANSI = /\x1b\[[0-9;]*m/g;

// Pull human-readable failure lines out of a validator's stdout: both the
// hard-failure blockers ("× ...") and the per-check soft issues ("- ..."),
// plus duplicate-content pairs ("a ↔ b"). ANSI colour codes are stripped
// first so coloured lines are not missed.
function extractIssues(out: string): string[] {
  return out
    .split("\n")
    .map((l) => l.replace(ANSI, "").trim())
    .filter((l) => l.startsWith("- ") || l.startsWith("× ") || l.includes("↔"))
    .slice(0, 25);
}

export function runGates(postPath: string, run: ScriptRunner = defaultRunner): GateVerdict {
  const results: GateResult[] = [];

  const vp = run("scripts/validate-post.ts", [postPath]);
  results.push({ name: "validate-post", passed: vp.code === 0, details: vp.code === 0 ? [] : extractIssues(vp.out) });

  const dup = run("scripts/duplicate-content-audit.ts", ["--against", postPath]);
  results.push({ name: "duplicate-content", passed: dup.code === 0, details: dup.code === 0 ? [] : extractIssues(dup.out) });

  const slug = path.basename(postPath, ".json");
  return { slug, passed: results.every((r) => r.passed), results };
}
