const FRESH_SECONDS = 24 * 60 * 60;
const RETENTION_SECONDS = 7 * 24 * 60 * 60;

type CacheEnvelope<T> = {
  data: T;
  fetchedAt: string;
};

export type CachedResult<T> = {
  data: T | null;
  fetchedAt: string;
  stale: boolean;
};

export async function withCache<T>(
  key: string,
  loader: () => Promise<T>
): Promise<CachedResult<T>> {
  const cacheKey = new Request(`https://cache.local/${key}`);
  const cached = await readCache<T>(cacheKey);

  if (cached && ageOf(cached.fetchedAt) < FRESH_SECONDS) {
    return { data: cached.data, fetchedAt: cached.fetchedAt, stale: false };
  }

  try {
    const data = await loader();
    const fetchedAt = new Date().toISOString();
    if (shouldPersist(data)) {
      await writeCache(cacheKey, { data, fetchedAt });
    }
    return { data, fetchedAt, stale: false };
  } catch (error) {
    console.warn(`[cache] loader failed for ${key}`, error);
    if (cached) {
      return { data: cached.data, fetchedAt: cached.fetchedAt, stale: true };
    }
    return { data: null, fetchedAt: new Date().toISOString(), stale: false };
  }
}

function shouldPersist(data: unknown): boolean {
  return !(Array.isArray(data) && data.length === 0);
}

function ageOf(fetchedAt: string): number {
  return (Date.now() - Date.parse(fetchedAt)) / 1000;
}

async function readCache<T>(cacheKey: Request): Promise<CacheEnvelope<T> | null> {
  try {
    const hit = await caches.default.match(cacheKey);
    if (!hit) return null;
    const parsed = (await hit.json()) as CacheEnvelope<T>;
    if (typeof parsed?.fetchedAt !== "string" || !("data" in parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeCache(cacheKey: Request, envelope: CacheEnvelope<unknown>): Promise<void> {
  try {
    await caches.default.put(
      cacheKey,
      new Response(JSON.stringify(envelope), {
        headers: {
          "content-type": "application/json",
          "cache-control": `public, max-age=${RETENTION_SECONDS}`,
        },
      })
    );
  } catch {
    console.debug("[cache] write skipped");
  }
}
