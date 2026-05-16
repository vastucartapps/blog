import { getIndexNowKey } from "@/lib/indexnow";

// ─────────────────────────────────────────────────────────────────
// IndexNow key verification file, served at /indexnow/key.txt.
//
// Bing + Yandex verifiers fetch this URL and require an exact
// match against the `key` field in the IndexNow submit payload.
// The key value is now a compile-time constant in lib/indexnow.ts,
// so this route can prerender statically — that drops the
// `Vary: rsc, next-router-state-tree, ...` header that Next.js
// dynamic routes ship with, which some IndexNow verifiers refuse
// to cache.
// ─────────────────────────────────────────────────────────────────

export async function GET() {
  const key = getIndexNowKey();
  if (!key) {
    return new Response("IndexNow not configured", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
