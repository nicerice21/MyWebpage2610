# MyWebpage2610

学生エンジニア向けのポートフォリオサイト（2026年10月リプレイス）。

Astro製の静的サイト（Cloudflare Pages）と、Qiita・はてなブログの記事を返すHono製API（Cloudflare Workers）で構成されたnpm workspacesのモノリポです。

## 構成

```text
apps/
├── web/          Astro静的サイト（Cloudflare Pagesで配信）
└── api/          Hono API・Cloudflare Workers（記事取得とキャッシュ）
packages/
└── shared/       WebとAPIで共有する記事の型定義
docs/             仕様書（アーキテクチャ・デザイン・コンテンツ設計）
```

## セットアップ

```sh
npm install
```

## 開発

```sh
npm run dev
```

- Web: http://localhost:4321（Astro）
- API: http://localhost:8787（wrangler dev）

記事取得元の設定は `apps/api/wrangler.toml` と `apps/api/.dev.vars`（`.dev.vars.example` 参照）で行う。設定しなくてもサイトは動作し、記事欄は空になる。

## 主なコマンド

```sh
npm run dev         # Web + API を同時起動
npm run build       # 静的サイトを apps/web/dist に生成
npm run typecheck   # shared / api / web の型チェック
npm run deploy:api  # Worker を本番デプロイ（要 wrangler ログイン）
```

## デプロイ

- **Web（Cloudflare Pages）**: mainブランチへのpushで自動デプロイ。ビルドコマンド `npm install && npm run build`、出力ディレクトリ `apps/web/dist`。環境変数 `PUBLIC_API_BASE_URL` に本番WorkerのURLを設定する。
- **API（Workers）**: `npm run deploy:api`。デプロイ後は `/health` で稼働確認する。

詳細は `apps/web/README.md`・`apps/api/README.md`、仕様は `docs/` を参照。
