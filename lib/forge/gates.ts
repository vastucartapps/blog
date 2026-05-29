// lib/forge/gates.ts
import { spawnSync } from "node:child_process";
import path from "node:path";
import type { GateResult, GateVerdict } from "./types";

export type ScriptRunner = (script: string, args: string[]) => { code: number; out: string };

const defaultRunner: ScriptRunner = (script, args) => {
  const res = spawnSync("npx", ["tsx", script, ...args], { cwd: process.cwd(), encoding: "utf8" });
  return { code: res.status ?? 1, out: `${res.stdout ?? ""}${res.stderr ?? ""}` };
};

// Pull human-readable failure lines out of a validator's stdout.
function extractIssues(out: string): string[] {
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- ") || l.includes("↔"))
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
