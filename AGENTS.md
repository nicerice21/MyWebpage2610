# AGENTS.md

Portfolio site for a student engineer, replacing an existing site in Oct 2026.

## Repo state

- npm-workspaces monorepo, **implemented and verified**: `apps/web` (Astro 7 static site), `apps/api` (Hono on Cloudflare Workers via Wrangler 4), `packages/shared` (shared `Article` types).
- All specs and site content are in **Japanese**. Keep docs and user-facing copy in Japanese.
- `docs/` is the authoritative spec. Implement to match it, and update it if the design changes:
  - `docs/TechnicalArchitectureSpecification.md` — stack, repo layout, API, caching, deploy (primary reference)
  - `docs/DesignSpecification.md` — color palette, typography, "paper notebook" visual rules
  - `docs/contents_design.md` — page/section content structure

## Commands

```sh
npm install          # installs all workspaces (allowScripts approvals are already in package.json)
npm run dev          # both servers concurrently: Astro :4321, wrangler dev :8787
npm run dev:api      # API only
npm run dev:web      # web only
npm run typecheck    # shared (tsc) -> api (tsc) -> web (astro check); must be clean before finishing
npm run build        # static build to apps/web/dist
npm run deploy:api   # wrangler deploy from apps/api (requires wrangler login)
```

- There is no test suite yet; verification = `npm run typecheck` + `npm run build` + manual checks of `/health` and `/articles` while `npm run dev` is running.
- npm 11 `allow-scripts` blocks `esbuild`/`workerd` postinstall on fresh installs; approvals are recorded in root `package.json` `allowScripts`, so `npm install` just works. If a new version triggers a warning, run `npm approve-scripts <pkg>`.
- Do not commit `apps/web/dist/`, `.astro/`, `.wrangler/`, `.dev.vars`, or `.env` (all gitignored).

## Architecture notes

- **Deploy split**: Pages auto-deploys `main` (build command `npm install && npm run build`, output dir `apps/web/dist`, env var `PUBLIC_API_BASE_URL` = production Worker URL). The Worker is deployed separately via `npm run deploy:api`. After deploying the Worker, check `/health`.
- The web app fetches articles **client-side** from the Worker (`src/scripts/articles.ts`); the base URL comes from `import.meta.env.PUBLIC_API_BASE_URL` with `http://localhost:8787` fallback, inlined at build time. All other pages are fully static.
- **API caching** (`apps/api/src/lib/cache.ts`): Cloudflare Cache API keyed `articles:{source}`; 24h fresh window, 7-day stale retention. On upstream failure: serve stale cache, else empty array with HTTP 200 — the site must never break. Empty results are never cached.
- **External services**: Qiita via `GET /api/v2/items?query=user:{QIITA_USER}`; Hatena via the blog's Atom feed `{HATENA_BLOG_URL}/feed` (parsed with fast-xml-parser). Config lives in `wrangler.toml` `[vars]` (prod) and `.dev.vars` (local dev); `QIITA_ACCESS_TOKEN` is a Worker secret, never committed.
- CORS: only origins in `ALLOWED_ORIGINS` (comma-separated) get `Access-Control-Allow-Origin`; default is `http://localhost:4321`. Production domain must be added before deploying.
- Site content (profile, skills, projects) is static data in `apps/web/src/data/`, Git-managed. Project detail pages are generated via `getStaticPaths` from that data.

## Hard constraints (explicit non-goals in the spec)

- **No database, no CMS, no auth, no comment/like features, no in-site blog.** Articles are external links only.
- Articles are fetched **only by the Worker** (never directly from the browser), cached 6–24h there.
- Images/PDFs live on Cloudflare R2 served via the custom domain `ricezero.fun`; never put secrets in R2.
- Lightweight first: minimal JS, WebP/AVIF images, system fonts preferred, no heavy UI frameworks, Lighthouse Performance target ≥ 90.
- Design rules (paper-notebook look): palette and rules in `docs/DesignSpecification.md` — no rounded corners, gradients, or heavy shadows; thin 1px rules, 3px offset shadows, generous whitespace.
