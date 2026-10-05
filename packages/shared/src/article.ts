export const ARTICLE_SOURCES = ["qiita", "hatena"] as const;

export type ArticleSource = (typeof ARTICLE_SOURCES)[number];

export type Article = {
  title: string;
  url: string;
  source: ArticleSource;
  publishedAt: string;
  tags: string[];
  description?: string;
};

export type ArticlesResponse = {
  articles: Article[];
  updatedAt: string;
};
