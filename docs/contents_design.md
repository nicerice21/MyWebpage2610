# サイトのコンテント設計

## サイト構成

```text
/
├── Hero
├── About
├── Skills
├── Featured Projects
├── Articles
├── Activity / Timeline
├── Contact
└── Footer

/projects/
├── index
├── project-a
├── project-b
└── project-c
```

## トップページの構成

### 1. Hero

名前　アイコン　自己紹介文を表示する．

例：

```text
〇〇大学の学生エンジニアです。
Webアプリケーションを中心に、
課題発見から設計・実装まで取り組んでいます。
```

### 2. About

所属，専攻，興味分野,経歴

### 3. Skills

簡単に短文で

### 4. Projects/Works

タイトルと簡単な説明(リンクとして表示)

### 5. Articles

ブログ機能ではなく、外部記事へのリンク集として扱います。

- 最新記事3〜5件
- Qiita・はてなのサービス名
- タイトル
- 投稿日
- 外部記事へのリンク
- すべての記事を見るリンク

```text
Articles
外部サービスで公開している技術記事

[Qiita] Astroでポートフォリオを作った
[はてなブログ] 学生開発で学んだこと
```

### 6. Activity / Timeline

- ハッカソン
- 学内プロジェクト
- インターン
- チーム開発
- LT・登壇
- 資格・受賞

### 7. Contact

最後に行動を促します。

- GitHub
- Qiita
- はてなブログ
- X
- メール

## プロジェクト詳細ページ

URLは次のようにします。

```text
/projects/project-name
```

### 詳細ページの構成

#### 1. Overview

- プロジェクト名
- 一言説明
- メインビジュアル
- デモサイト
- GitHub
- 開発期間

#### 2. Background

「なぜ作ったのか」を書きます。

```text
どのような課題を感じたか
誰を対象にしたか
既存の方法では何が不便だったか
```

#### 3. Solution

サービスの概要と主要機能を説明します。

- ユーザーができること
- 主な画面
- 利用フロー
- 解決した課題

#### 4. Tech Stack

```text
Frontend: Astro, TypeScript
API: Hono
Hosting: Cloudflare Pages, Workers
Storage: Cloudflare R2
```

技術名の羅列ではなく、各技術を採用した理由も短く記載します。

#### 5. Development

- 設計
- 実装
- テスト
- デプロイ
- チームでの役割
- 開発期間

#### 6. Challenges

ポートフォリオで特に重要な部分です。

```text
課題
→ 原因
→ 試した方法
→ 採用した解決策
→ 結果
```

例：

```text
外部APIの取得に時間がかかる問題があった。
そこでWorker側でレスポンスをキャッシュし、
画面表示時の待ち時間を短縮した。
```

## 推奨する最終構成

```text
/
├── Hero
├── About
├── Skills
├── Projects
│   └── 代表3〜4件
├── Articles
├── Activity
└── Contact

/projects/project-a
├── Overview
├── Background
├── Solution
├── Tech Stack
├── Development
├── Challenges
├── Result
└── Reflection
