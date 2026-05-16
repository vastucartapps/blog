// ─────────────────────────────────────────────────────────────────
// IndexNow helper.
//
// IndexNow (indexnow.org) is adopted by Bing, Yandex, Naver, Seznam.
// Publishing a single URL endpoint notifies every participating
// search engine at once.
//
// Key provisioning:
//   1. The DEFAULT_KEY constant below is a fresh 32-char hex string.
//      IndexNow keys are NOT secrets — they are public identifiers
//      paired with a key file at the matching keyLocation URL. Anyone
//      reading the source can re-submit URLs on this host, but
//      submissions only notify search engines about pages that
//      already exist publicly. No security implication.
//   2. The verification file is served at /indexnow/key.txt by
//      `app/indexnow/key.txt/route.ts`. `keyLocation` in the
//      submit payload MUST point at the same URL.
//   3. Call `submitToIndexNow(urls)` from a build/publish webhook
//      whenever posts change.
//
// History: the previous key `80e0a43d…7526` was poisoned in
// Bing/Yandex verifier state because the original `keyLocation`
// pointed at a 404 route (`/${key}.txt` instead of /indexnow/key.txt).
// Every submission returned HTTP 422 even after the route was fixed.
// Rotating to a fresh key value clears the verifier cache on the
// IndexNow providers' side.
// ─────────────────────────────────────────────────────────────────

import { SITE_URL } from "./utils";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// Fresh key rotated 2026-05-16 to clear Bing/Yandex verifier state
// that was caching the previous key as invalid. We unconditionally
// use this constant — env var override is intentionally disabled
// because the previous `INDEXNOW_KEY` value on Coolify (the poisoned
// one) would otherwise still be picked up and silently re-break
// every submission. To rotate again later, change this constant.
const ACTIVE_KEY = "e43d283075028bf4a7aecfb802f4814d";

function getKey(): string | null {
  return ACTIVE_KEY;
}

export function getIndexNowKey(): string | null {
  return getKey();
}

export async function submitToIndexNow(urls: string[]): Promise<{
  ok: boolean;
  status: number | null;
  error?: string;
}> {
  const key = getKey();
  if (!key) {
    return { ok: false, status: null, error: "INDEXNOW_KEY not configured" };
  }
  if (urls.length === 0) {
    return { ok: true, status: null };
  }

  const host = new URL(SITE_URL).hostname;
  // The verification file is served by app/indexnow/key.txt/route.ts.
  // `keyLocation` MUST match where the file actually lives, otherwise
  // Bing's verifier returns 404 and the submission is silently dropped.
  const payload = {
    host,
    key,
    keyLocation: `${SITE_URL}/indexnow/key.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return {
      ok: res.ok,
      status: res.status,
      ...(res.ok ? {} : { error: await res.text() }),
    };
  } catch (err) {
    return { ok: false, status: null, error: (err as Error).message };
  }
}
