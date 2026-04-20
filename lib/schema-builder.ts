// ─────────────────────────────────────────────────────────────────
// Compatibility shim.
//
// The single-file 650-line schema-builder has been split into the
// per-type modules under `lib/schema/`. This shim re-exports the
// same public API so consumers (route pages, components) continue to
// work without edits. New code should import directly from
// `@/lib/schema`.
//
// Contracts:
//   public/00-shared-contracts.md (universal)
//   public/04-blog-vastucart-in.md (this subdomain)
// ─────────────────────────────────────────────────────────────────

export { buildPostSchema } from "./schema";
