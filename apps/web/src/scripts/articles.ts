import {
  ARTICLE_SOURCES,
  type Article,
  type ArticleSource,
  type ArticlesResponse,
} from "@mywebpage/shared";

const BASE_URL: string = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:8787";
const STATUS_EMPTY = "表示できる記事がありません。";
const STATUS_UNAVAILABLE = "現在、記事を表示できません。";

export function mountAllArticles(): void {
  for (const root of document.querySelectorAll<HTMLElement>("[data-articles]")) {
    void mountArticles(root);
  }
}

async function mountArticles(root: HTMLElement): Promise<void> {
  const status = root.querySelector<HTMLElement>("[data-articles-status]");
  const list = root.querySelector<HTMLUListElement>("[data-articles-items]");
  if (status === null || list === null) return;

  const limit = parseLimit(root.dataset.limit);

  try {
    const response = await fetch(`${BASE_URL}/articles`);
    if (!response.ok) throw new Error(`api returned ${response.status}`);
    const payload: unknown = await response.json();
    if (!isArticlesResponse(payload)) throw new Error("unexpected payload");
    render(list, status, applyLimit(payload.articles, limit));
  } catch (error) {
    console.warn("[articles] failed to load", error);
    status.textContent = STATUS_UNAVAILABLE;
    list.hidden = true;
  }
}

function parseLimit(raw: string | undefined): number | undefined {
  if (raw === undefined || raw === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : undefined;
}

function applyLimit(articles: Article[], limit: number | undefined): Article[] {
  return limit === undefined ? articles : articles.slice(0, limit);
}

function render(list: HTMLUListElement, status: HTMLElement, articles: Article[]): void {
  if (articles.length === 0) {
    status.textContent = STATUS_EMPTY;
    list.hidden = true;
    return;
  }
  status.hidden = true;
  list.replaceChildren(...articles.map((article) => createItem(article)));
  list.hidden = false;
}

function createItem(article: Article): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "article-item";

  const meta = document.createElement("p");
  meta.className = "article-meta";

  const source = document.createElement("span");
  source.className = "article-source";
  source.textContent = article.source === "qiita" ? "Qiita" : "はてなブログ";

  const date = document.createElement("time");
  date.dateTime = article.publishedAt;
  date.textContent = article.publishedAt.slice(0, 10);

  meta.append(source, date);

  const link = document.createElement("a");
  link.className = "article-title";
  link.href = article.url;
  link.rel = "noopener external";
  link.target = "_blank";
  link.textContent = article.title;

  item.append(meta, link);
  return item;
}

function isArticlesResponse(value: unknown): value is ArticlesResponse {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.articles) || typeof record.updatedAt !== "string") return false;
  return record.articles.every(isArticle);
}

function isArticle(value: unknown): value is Article {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.title === "string" &&
    typeof record.url === "string" &&
    typeof record.publishedAt === "string" &&
    Array.isArray(record.tags) &&
    record.tags.every((tag) => typeof tag === "string") &&
    (ARTICLE_SOURCES as readonly string[]).includes(record.source as ArticleSource)
  );
}
