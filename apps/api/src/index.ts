import { Hono } from "hono";
import { cors } from "hono/cors";
import articles from "./routes/articles";
import health from "./routes/health";

export type Bindings = {
  QIITA_USER: string;
  HATENA_BLOG_URL: string;
  QIITA_ACCESS_TOKEN?: string;
  ALLOWED_ORIGINS?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  const allowed = (c.env.ALLOWED_ORIGINS ?? "http://localhost:4321")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin !== "");
  return cors({ origin: (origin) => (allowed.includes(origin) ? origin : undefined) })(c, next);
});

app.route("/", health);
app.route("/", articles);

app.onError((err, c) => {
  console.error("[api] unhandled error", err);
  return c.json({ error: "internal error" }, 500);
});

export default app;
