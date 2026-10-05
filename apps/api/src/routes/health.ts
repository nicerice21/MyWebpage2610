import { Hono } from "hono";

const health = new Hono().get("/health", (c) =>
  c.json({ ok: true, timestamp: new Date().toISOString() })
);

export default health;
