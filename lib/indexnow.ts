// ─────────────────────────────────────────────────────────────────
// IndexNow helper.
//
// IndexNow (indexnow.org) is adopted by Bing, Yandex, Naver, Seznam.
// Publishing a single URL endpoint notifies every participating
// search engine at once.
//
// Key provisioning:
//   1. Generate a UUID/hex string and put it in env INDEXNOW_KEY.
//   2. The verification file is served at /indexnow/key.txt by
//      `app/indexnow/key.txt/route.ts`. `keyLocation` in the
//      submit payload MUST point at the same URL, otherwise Bing's
//      verifier will GET a 404 and silently reject the submission.
//   3. Call `submitToIndexNow(urls)` from a build/publish webhook
//      whenever posts change.
// ─────────────────────────────────────────────────────────────────

import { SITE_URL } from "./utils";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function getKey(): string | null {
  return process.env.INDEXNOW_KEY?.trim() || null;
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
