import type { Article } from "@mywebpage/shared";
import type { Bindings } from "../index";
import { fetchWithTimeout } from "../lib/http";
import { asIsoDate, asString, excerpt, stripMarkdown } from "../lib/normalize";

const PER_PAGE = 20;

type QiitaItem = {
  title?: unknown;
  url?: unknown;
  created_at?: unknown;
  body?: unknown;
  tags?: unknown;
};

type QiitaTag = {
  name?: unknown;
};

export async function fetchQiitaArticles(env: Bindings): Promise<Article[]> {
  const user = env.QIITA_USER;
  if (!user) {
    console.warn("[qiita] QIITA_USER is not configured");
    return [];
  }

  const headers: Record<string, string> = { accept: "application/json" };
  if (env.QIITA_ACCESS_TOKEN) {
    headers.authorization = `Bearer ${env.QIITA_ACCESS_TOKEN}`;
  }

  const query = encodeURIComponent(`user:${user}`);
  const response = await fetchWithTimeout(
    `https://qiita.com/api/v2/items?per_page=${PER_PAGE}&query=${query}`,
    { headers }
  );
  if (!response.ok) {
    throw new Error(`qiita api returned ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("qiita api returned unexpected payload");
  }

  return payload
    .map((item) => itemToArticle(item as QiitaItem))
    .filter((article): article is Article => article !== null);
}

function itemToArticle(item: QiitaItem): Article | null {
  const title = asString(item.title);
  const url = asString(item.url);
  const publishedAt = asIsoDate(asString(item.created_at));
  if (title === undefined || url === undefined || publishedAt === undefined) {
    return null;
  }

  const tags = Array.isArray(item.tags)
    ? item.tags
        .map((tag) => asString((tag as QiitaTag)?.name))
        .filter((name): name is string => name !== undefined && name !== "")
        .slice(0, 5)
    : [];

  return {
    title,
    url,
    source: "qiita",
    publishedAt,
    tags,
    description: excerpt(stripMarkdown(asString(item.body) ?? ""), 140),
  };
}
