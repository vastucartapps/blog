import { getIndexNowKey } from "@/lib/indexnow";

// ─────────────────────────────────────────────────────────────────
// IndexNow key verification file, served at /indexnow/key.txt.
//
// The IndexNow spec allows the key file to sit anywhere as long as
// the submission payload's `keyLocation` points to this exact URL.
// We publish the env-configured INDEXNOW_KEY here so Bing, Yandex,
// Naver and Seznam can verify ownership before accepting pings.
// ─────────────────────────────────────────────────────────────────

// Must read process.env at request time, not build time. If we marked
// this route static, Next.js would bake the env value into the build
// cache — and if INDEXNOW_KEY wasn't present during the build, the
// "not configured" fallback would be served forever.
export const dynamic = "force-dynamic";

export async function GET() {
  const key = getIndexNowKey();
  if (!key) {
    return new Response("IndexNow not configured", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
