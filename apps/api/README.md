# @mywebpage/api

Qiita・はてなブログの記事を取得して返す、Cloudflare Workers + Hono のAPI。

## エンドポイント

| メソッド | パス | 用途 |
| --- | --- | --- |
| GET | `/health` | Workerの稼働確認 |
| GET | `/articles` | 全サービスの記事取得 |
| GET | `/articles?source=qiita` | Qiita記事のみ |
| GET | `/articles?source=hatena` | はてな記事のみ |

外部APIが失敗した場合は、キャッシュ済みの古いデータを返し、なければ空配列をHTTP 200で返す。

## セットアップ

1. `wrangler.toml` の `[vars]` を設定する。
   - `QIITA_USER`: QiitaのユーザーID
   - `HATENA_BLOG_URL`: はてなブログのURL（例: `https://xxx.hatenablog.com`）
   - `ALLOWED_ORIGINS`: CORSで許可するオリジン（カンマ区切り。本番はPagesのドメインを追加）
2. QiitaのアクセストークンはSecretに保存する（任意。レート制限が緩和される）。
   - 開発: `apps/api/.dev.vars` に `QIITA_ACCESS_TOKEN=...` を記述（`.dev.vars.example` 参照）
   - 本番: `npx wrangler secret put QIITA_ACCESS_TOKEN`

## コマンド

```sh
npm run dev -w apps/api        # wrangler dev → http://localhost:8787
npm run typecheck -w apps/api
npm run deploy -w apps/api     # wrangler deploy
```

デプロイ後は `https://<worker名>.<アカウント>.workers.dev/health` で稼働確認する。
