# 学生エンジニア向けポートフォリオ 技術アーキテクチャ仕様書

## 1. 文書概要

### 1.1 目的

学生エンジニアのポートフォリオサイトを、軽量・高速・低コストで運用するための技術アーキテクチャを定義する。

### 1.2 対象範囲

- ワンページ形式のポートフォリオサイト
- プロジェクト詳細ページ
- Qiita・はてなブログ記事の外部API連携
- Cloudflare PagesによるWebサイト配信
- Cloudflare Workers + HonoによるAPI提供
- Cloudflare R2による画像・PDFなどのアセット配信

### 1.3 対象外

- サイト内ブログCMS
- 管理画面
- ユーザー認証
- コメント・いいね機能
- サイト内データベース
- 動画配信

## 2. 基本方針

1. フロントエンドはAstroによる静的生成を基本とする。
2. API処理はHonoを利用したCloudflare Workerに分離する。
3. 画像・PDFなどの大きな静的アセットはR2から配信する。
4. 外部記事は自サイトに保存せず、外部サービスへのリンクとして表示する。
5. APIレスポンスはWorker側でキャッシュし、外部APIへのアクセスを抑制する。
6. JavaScript、画像、フォントを必要最小限にして軽量性を優先する。
7. 紙面を意識したデザインを、画像テクスチャではなくCSSとタイポグラフィで表現する。

## 3. 全体構成

```text
GitHub Repository
        │
        ├── push
        ▼
Cloudflare Pages
        │
        └── Astro静的サイト
              ├── /
              ├── /about
              ├── /projects
              ├── /projects/:slug
              └── /articles

Browser ────────► Cloudflare Workers
                  └── Hono API
                       ├── Qiita API
                       ├── はてなブログAPI
                       └── Cache API またはKV

Browser ────────► Cloudflare R2 Custom Domain
                  └── 画像・PDF・ダウンロードファイル
```

## 4. 技術スタック

| 領域 | 採用技術 | 用途 |
| --- | --- | --- |
| UI | Astro | 静的ページ生成、コンポーネント管理 |
| 言語 | TypeScript | フロントエンド・APIの型安全性 |
| API | Hono | Cloudflare Workers上のルーティング・API処理 |
| Webホスティング | Cloudflare Pages | Astroの静的ファイル配信 |
| APIホスティング | Cloudflare Workers | 記事取得・キャッシュ・API提供 |
| ファイルストレージ | Cloudflare R2 | 画像、PDF、配布ファイル |
| CDN | Cloudflare Cache | R2アセット・APIレスポンスのキャッシュ |
| ソース管理 | GitHub | ソースコード管理・デプロイ連携 |
| バリデーション | TypeScriptの型定義 | APIレスポンス形式の統一 |

## 5. リポジトリ構成

```text
portfolio/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   │   ├── index.astro
│   │   │   │   ├── about.astro
│   │   │   │   ├── articles.astro
│   │   │   │   ├── contact.astro
│   │   │   │   └── projects/
│   │   │   │       ├── index.astro
│   │   │   │       └── [slug].astro
│   │   │   ├── data/
│   │   │   └── styles/
│   │   ├── public/
│   │   ├── astro.config.mjs
│   │   └── package.json
│   │
│   └── api/
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   │   ├── articles.ts
│       │   │   └── health.ts
│       │   ├── services/
│       │   │   ├── qiita.ts
│       │   │   └── hatena.ts
│       │   ├── schemas/
│       │   └── lib/
│       │       ├── cache.ts
│       │       └── normalize.ts
│       ├── wrangler.toml
│       └── package.json
│
├── packages/
│   └── shared/
│       └── src/
│           └── article.ts
│
├── package.json
└── README.md
```

## 6. ページ構成

### 6.1 トップページ `/`

ワンページ構成とし、次の順序で表示する。

1. Hero
2. About
3. Skills
4. Featured Projects
5. Articles
6. Activity
7. Contact
8. Footer

トップページにはプロジェクトの概要のみを表示し、詳細は個別ページへ遷移させる。

### 6.2 プロジェクト一覧 `/projects`

プロジェクトを一覧表示する。プロジェクト数が少ない間はトップページから省略してもよい。

### 6.3 プロジェクト詳細 `/projects/:slug`

各ページは次の構成とする。

- Overview
- Background
- Solution
- Features
- Tech Stack
- Development Process
- Challenges and Solutions
- Result
- Reflection
- Demo・GitHubリンク

### 6.4 記事一覧 `/articles`

Qiita・はてなブログの記事を外部リンクとして一覧表示する。記事本文はサイト内に保存しない。

## 7. API仕様

### 7.1 エンドポイント

| メソッド | パス | 用途 |
| --- | --- | --- |
| GET | `/health` | Workerの稼働確認 |
| GET | `/articles` | 全サービスの記事取得 |
| GET | `/articles?source=qiita` | Qiita記事のみ取得 |
| GET | `/articles?source=hatena` | はてな記事のみ取得 |

### 7.2 記事データ形式

```ts
export type Article = {
  title: string;
  url: string;
  source: "qiita" | "hatena";
  publishedAt: string;
  tags: string[];
  description?: string;
};
```

### 7.3 APIレスポンス例

```json
{
  "articles": [
    {
      "title": "Astroでポートフォリオを作った",
      "url": "https://example.com/article",
      "source": "qiita",
      "publishedAt": "2026-01-01T00:00:00Z",
      "tags": ["Astro", "Cloudflare"]
    }
  ],
  "updatedAt": "2026-01-01T01:00:00Z"
}
```

### 7.4 エラー方針

- 外部APIが失敗しても、サイト全体は表示可能にする。
- キャッシュ済みデータがある場合は、古いデータを返す。
- キャッシュがない場合は空配列を返し、HTTP 200を維持する。
- Worker内部の異常確認用にログを出力する。

## 8. キャッシュ方針

### 8.1 記事API

- キャッシュ時間：6〜24時間
- キャッシュキー：`articles:{source}`
- Qiita・はてなを個別にキャッシュする
- API障害時は stale data を返す

### 8.2 R2アセット

ハッシュ付きファイル名を利用し、変更されないファイルは長期キャッシュする。

```text
Cache-Control: public, max-age=31536000, immutable
```

## 9. R2仕様

### 9.1 バケット構成

```text
portfolio-assets/
├── profile/
├── projects/
├── documents/
└── icons/
```

### 9.2 公開ドメイン

```text
ricezero.fun
```

### 9.3 ファイル形式

- 写真・スクリーンショット：WebPまたはAVIF
- ベクターアイコン：SVG
- 履歴書：PDF
- 動画：原則として対象外

通常の公開画像はR2のカスタムドメインから直接配信する。認証や署名付きURLが必要になった場合のみHono経由に変更する。

## 10. デザイン・パフォーマンス要件

### 10.1 デザイン

- 生成り色の背景
- 白に近い紙面
- 濃色の本文
- 赤茶色または青灰色のアクセント
- 細い罫線
- 控えめな影
- 大きな余白
- 角丸・グラデーション・装飾を最小限にする

### 10.2 軽量化

- Astroの静的生成を利用する
- JavaScriptは必要なインタラクションに限定する
- Webフォントの利用を最小限にする
- 画像はWebPまたはAVIFに変換する
- トップページでは画像を遅延読み込みする
- 大容量の背景画像や動画を使用しない
- UIフレームワークを必要以上に導入しない

### 10.3 目標値

- トップページの初期JavaScript：最小限
- モバイル回線でも主要テキストを短時間で表示
- Lighthouse Performance：90以上を目標
- トップページの画像総容量：1MB以内を目安とする

## 11. セキュリティ

- 外部APIのトークンはWorkerのSecretに保存する。
- Qiita・はてなAPIをブラウザから直接呼び出さない。
- CORSは本番ドメインに限定する。
- R2には秘密情報を保存しない。
- 管理用アップロード機能は公開しない。
- 外部URLは許可したサービスのものだけを表示する。
- 依存パッケージを定期的に更新する。

## 12. デプロイ方針

### 12.1 Pages

- GitHubのmainブランチへのpushでデプロイする。
- ビルド対象は`apps/web`。
- ビルド成果物をCloudflare Pagesで配信する。

### 12.2 Workers

- `apps/api`からWranglerでデプロイする。
- 本番と開発で環境変数・バインディングを分離する。
- `/health`をデプロイ後の確認に利用する。

### 12.3 R2

- 画像は圧縮後にアップロードする。
- ファイル名は内容変更時に変更する。
- 不要な古いアセットは定期的に整理する。

## 13. 開発環境

```text
Node.js
TypeScript
Astro dev server
Wrangler dev
Cloudflare R2 local preview
```

ローカルでは、AstroとHonoを別々に起動する。

```text
Astro: http://localhost:4321
Hono:  http://localhost:8787
```

開発時のAPI URLは環境変数で切り替える。

```text
PUBLIC_API_BASE_URL=http://localhost:8787
```

## 14. 運用・監視

- Workerのエラーログを確認する。
- `/health`を定期的に確認する。
- 外部APIのレスポンス形式変更を確認する。
- R2のストレージ量とリクエスト量を確認する。
- Pagesのデプロイ失敗をGitHubまたはCloudflare Dashboardで確認する。

## 15. 将来拡張

必要になった場合のみ、次の機能を追加する。

- D1によるプロジェクト情報管理
- 管理画面
- Hono RPCによる型安全なAPIクライアント
- R2画像の自動変換
- 検索・タグフィルター
- お問い合わせフォーム
- アクセス解析

初期段階では、静的なプロジェクトデータをGit管理し、データベースを導入しない。

## 16. 採用結論

```text
Astro static site
        ↓
Cloudflare Pages

Hono API
        ↓
Cloudflare Workers

Images / PDF
        ↓
Cloudflare R2 + custom domain
```

この構成は、ワンページ中心のポートフォリオに必要な表示性能・保守性・低コストを満たしつつ、記事API連携やプロジェクト詳細ページにも対応できる。
