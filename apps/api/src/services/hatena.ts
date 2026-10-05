import { XMLParser } from "fast-xml-parser";
import type { Article } from "@mywebpage/shared";
import type { Bindings } from "../index";
import { fetchWithTimeout } from "../lib/http";
import { asIsoDate, asString, excerpt, stripHtml } from "../lib/normalize";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  isArray: (name) => name === "entry" || name === "link" || name === "category",
});

type AtomLink = { "@_rel"?: unknown; "@_href"?: unknown };
type AtomCategory = { "@_term"?: unknown };
type AtomEntry = {
  title?: unknown;
  link?: unknown;
  updated?: unknown;
  summary?: unknown;
  content?: unknown;
  category?: unknown;
};
type AtomFeed = { feed?: { entry?: AtomEntry[] } };

export async function fetchHatenaArticles(env: Bindings): Promise<Article[]> {
  const origin = env.HATENA_BLOG_URL;
  if (!origin) {
    console.warn("[hatena] HATENA_BLOG_URL is not configured");
    return [];
  }

  const feedUrl = `${origin.replace(/\/+$/, "")}/feed`;
  const response = await fetchWithTimeout(feedUrl, {
    headers: { accept: "application/atom+xml, application/xml, text/xml" },
  });
  if (!response.ok) {
    throw new Error(`hatena feed returned ${response.status}`);
  }

  const xml = await response.text();
  let parsed: unknown;
  try {
    parsed = parser.parse(xml);
  } catch {
    throw new Error("hatena feed is not valid xml");
  }

  const entries = (parsed as AtomFeed)?.feed?.entry ?? [];
  return entries
    .map((entry) => entryToArticle(entry))
    .filter((article): article is Article => article !== null);
}

function entryToArticle(entry: AtomEntry): Article | null {
  const links = Array.isArray(entry.link) ? (entry.link as AtomLink[]) : [];
  const alternate = links.find((link) => asString(link["@_rel"]) === "alternate") ?? links[0];
  const url = alternate ? asString(alternate["@_href"]) : undefined;
  const title = asString(entry.title);
  const publishedAt = asIsoDate(asString(entry.updated));
  if (title === undefined || url === undefined || publishedAt === undefined) {
    return null;
  }

  const categories = Array.isArray(entry.category) ? (entry.category as AtomCategory[]) : [];
  const tags = categories
    .map((category) => asString(category["@_term"]))
    .filter((term): term is string => term !== undefined && term !== "")
    .slice(0, 5);

  const summary = asString(entry.summary) ?? asString(entry.content) ?? "";

  return {
    title,
    url,
    source: "hatena",
    publishedAt,
    tags,
    description: excerpt(stripHtml(summary), 140),
  };
}
