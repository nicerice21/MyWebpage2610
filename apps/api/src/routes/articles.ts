import { Hono } from "hono";
import type { Article, ArticleSource, ArticlesResponse } from "@mywebpage/shared";
import type { Bindings } from "../index";
import { withCache } from "../lib/cache";
import { isArticleSource } from "../schemas/articles";
import { fetchHatenaArticles } from "../services/hatena";
import { fetchQiitaArticles } from "../services/qiita";

const articles = new Hono<{ Bindings: Bindings }>().get("/articles", async (c) => {
  const sourceParam = c.req.query("source");
  if (sourceParam !== undefined && !isArticleSource(sourceParam)) {
    return c.json({ error: "invalid source" }, 400);
  }

  const sources: ArticleSource[] = sourceParam === undefined ? ["qiita", "hatena"] : [sourceParam];
  const loaders: Record<ArticleSource, () => Promise<Article[]>> = {
    qiita: () => fetchQiitaArticles(c.env),
    hatena: () => fetchHatenaArticles(c.env),
  };

  const results = await Promise.all(
    sources.map((source) => withCache(`articles:${source}`, loaders[source]))
  );

  const merged: Article[] = results.flatMap((result) => result.data ?? []);
  merged.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const updatedAt =
    results
      .filter((result) => result.data !== null)
      .map((result) => result.fetchedAt)
      .sort()
      .at(-1) ?? new Date().toISOString();

  const response: ArticlesResponse = { articles: merged, updatedAt };
  return c.json(response);
});

export default articles;
