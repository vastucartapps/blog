import { getIndexNowKey } from "@/lib/indexnow";

// ─────────────────────────────────────────────────────────────────
// IndexNow key verification file, served at /indexnow/key.txt.
//
// The IndexNow spec allows the key file to sit anywhere as long as
// the submission payload's `keyLocation` points to this exact URL.
// We publish the env-configured INDEXNOW_KEY here so Bing, Yandex,
// Naver and Seznam can verify ownership before accepting pings.
// ─────────────────────────────────────────────────────────────────

export const dynamic = "force-static";
export const revalidate = 3600;

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
