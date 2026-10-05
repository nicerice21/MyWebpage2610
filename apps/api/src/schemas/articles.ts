import { ARTICLE_SOURCES, type ArticleSource } from "@mywebpage/shared";

export function isArticleSource(value: string): value is ArticleSource {
  return (ARTICLE_SOURCES as readonly string[]).includes(value);
}
