import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadLedger, saveLedger, upsertEntry, pendingSlugs } from "../ledger";
import type { Ledger } from "../types";

function tmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "forge-led-"));
}

test("loadLedger returns empty ledger when file missing", () => {
  const l = loadLedger(path.join(tmpDir(), "missing.json"));
  assert.equal(l.version, 1);
  assert.deepEqual(l.entries, {});
});

test("saveLedger then loadLedger round-trips and is atomic", () => {
  const f = path.join(tmpDir(), "ledger.json");
  let l = loadLedger(f);
  l = upsertEntry(l, "a-slug", { status: "passed", attempts: 2 }, "2026-05-29T00:00:00.000Z");
  saveLedger(l, f);
  assert.ok(!fs.existsSync(`${f}.tmp`), "tmp file removed after atomic rename");
  const back = loadLedger(f);
  assert.equal(back.entries["a-slug"].status, "passed");
  assert.equal(back.entries["a-slug"].attempts, 2);
  assert.equal(back.entries["a-slug"].updated_at, "2026-05-29T00:00:00.000Z");
});

test("upsertEntry merges over previous entry", () => {
  let l: Ledger = { version: 1, entries: {} };
  l = upsertEntry(l, "s", { status: "pending", attempts: 1 }, "t1");
  l = upsertEntry(l, "s", { attempts: 2, last_failures: ["x"] }, "t2");
  assert.equal(l.entries["s"].status, "pending");
  assert.equal(l.entries["s"].attempts, 2);
  assert.deepEqual(l.entries["s"].last_failures, ["x"]);
  assert.equal(l.entries["s"].updated_at, "t2");
});

test("pendingSlugs excludes only passed", () => {
  let l: Ledger = { version: 1, entries: {} };
  l = upsertEntry(l, "done", { status: "passed" }, "t");
  l = upsertEntry(l, "todo", { status: "quarantined" }, "t");
  assert.deepEqual(pendingSlugs(l, ["done", "todo", "new"]), ["todo", "new"]);
});
