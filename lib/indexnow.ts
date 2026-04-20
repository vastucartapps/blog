// ─────────────────────────────────────────────────────────────────
// IndexNow helper.
//
// IndexNow (indexnow.org) is adopted by Bing, Yandex, and Naver.
// Publishing a single URL endpoint to IndexNow notifies every
// participating search engine at once.
//
// Key provisioning:
//   1. Generate a UUID (or use an existing one) and put it in
//      environment variable INDEXNOW_KEY.
//   2. The verification file is served by
//      `app/[indexnowKey].txt/route.ts` so Bing can GET
//      https://blog.vastucart.in/<key>.txt and verify ownership.
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
