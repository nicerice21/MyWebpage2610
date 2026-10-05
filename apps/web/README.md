# @mywebpage/web

Astroによる静的ポートフォリオサイト。

## セットアップ

1. `.env.example` を参照して、必要に応じて `apps/web/.env` を作成する。
   - `PUBLIC_API_BASE_URL`: 記事APIのオリジン（開発の既定値は `http://localhost:8787`）
2. プロフィール・プロジェクト等のサイト内容は `src/data/` のデータを編集する（Git管理）。

## コマンド

```sh
npm run dev -w apps/web      # astro dev → http://localhost:4321
npm run build -w apps/web    # 静的ファイルを dist/ に生成
npm run check -w apps/web   # 型チェック
```

## Cloudflare Pages

- ビルドコマンド: `npm run build`（リポジトリルートから。Pagesのビルド作業ディレクトリはリポジトリルートを指定し、出力ディレクトリは `apps/web/dist`）
- 環境変数 `PUBLIC_API_BASE_URL` に本番のWorker URLを設定する
