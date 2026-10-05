export type TechChoice = { name: string; reason: string };
export type Challenge = { problem: string; approach: string; result: string };
export type ProjectLink = { label: string; url: string };
export type ProjectImage = { url: string; alt: string; caption: string };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  period: string;
  role: string;
  overview: string;
  background: string;
  solution: string;
  features: string[];
  techStack: TechChoice[];
  development: string;
  challenges: Challenge[];
  result: string;
  reflection: string;
  links: ProjectLink[];
  image?: ProjectImage;
};

export const projects: Project[] = [
  {
    slug: "portfolio-site",
    title: "ポートフォリオサイト",
    subtitle: "軽量性を最優先に設計した、紙の開発ノート風ポートフォリオ",
    year: "2026",
    period: "2026年10月",
    role: "設計・実装・運用",
    overview:
      "Astroによる静的生成と、Cloudflare Workers上のHono APIで構成したポートフォリオサイト。紙の開発ノートを想起させるデザインで、最小限のJavaScriptで高速に表示できる。",
    background:
      "従来のサイトは表示が重く、更新コストも高かった。ポートフォリオという目的に対して機能が過剰であり、閲覧速度と運用のシンプルさを最優先に再構築する必要があった。",
    solution:
      "ページをすべて静的生成し、外部記事の取得だけをAPIとして分離した。Qiita・はてなブログの記事はWorker側でキャッシュして返し、サイト本体は外部APIの状態に影響されないようにした。",
    features: [
      "ワンページ構成のトップページ",
      "開発ノート形式のプロジェクト詳細ページ",
      "Qiita・はてなブログの記事一覧（Worker経由で取得）",
      "画像・PDFはCloudflare R2から配信",
    ],
    techStack: [
      { name: "Astro", reason: "静的生成でJavaScriptを最小限に抑えられるため" },
      { name: "Hono", reason: "Workers上で軽量にAPIを構築できるため" },
      { name: "Cloudflare Pages / Workers", reason: "低コストで静的サイトとAPIを運用できるため" },
      { name: "Cloudflare R2", reason: "画像・PDFを独自ドメインで配信できるため" },
      { name: "TypeScript", reason: "WebとAPIで型を共有し、安全に開発するため" },
    ],
    development:
      "ドキュメントで仕様を定めてから実装を始めた。リポジトリはapps/web・apps/api・packages/sharedのモノリポ構成にし、WebとAPIで記事の型を共有している。",
    challenges: [
      {
        problem: "外部APIの失敗でサイト全体が表示できなくなるリスクがあった。",
        approach:
          "記事取得をWorker側に分離し、6〜24時間のキャッシュと、失敗時は古いデータ・空配列を返す方針にした。",
        result: "外部APIに障害があってもサイトは必ず表示され、記事欄だけ影響を受ける構成になった。",
      },
      {
        problem: "紙の質感を出そうとすると画像が増えて表示が重くなる問題があった。",
        approach: "テクスチャ画像を使わず、背景色・罫線・影・注釈といったCSSだけの表現に絞った。",
        result: "画像なしでも紙のノートらしい印象を保ちつつ、軽量なページを実現できた。",
      },
    ],
    result:
      "Lighthouse Performance 90以上を目標に、初期JavaScriptを最小限に抑えた軽量なサイトになった。",
    reflection:
      "「軽く見せる」より「軽く作る」ことを優先すると、デザインの選択肢が自然と絞られることを学んだ。次はR2からの画像配信と、記事キャッシュのチューニングを試したい。",
    links: [{ label: "GitHub", url: "https://github.com/〇〇" }],
  },
  {
    slug: "task-management-app",
    title: "タスク管理アプリ",
    subtitle: "チームのタスク管理を効率化するWebアプリ",
    year: "2025",
    period: "2025年〜",
    role: "バックエンド・インフラ",
    overview:
      "学生チームの課題管理のためのタスク管理アプリ。担当・期限・進捗を共有し、週次のミーティングで状況を確認しやすくする。",
    background:
      "チームのタスク共有がスプレッドシート散在になっており、誰が何を担当しているか把握に時間がかかっていた。",
    solution:
      "タスクの担当・期限・状態を一画面で共有できるシンプルなWebアプリを開発した。余計な機能を省き、更新の手間を最小にしている。",
    features: ["タスクの一覧・追加・更新", "担当者と期限の設定", "状態（未着手・進行中・完了）の管理"],
    techStack: [
      { name: "TypeScript", reason: "フロントとサーバーで同じ言語・型を使うため" },
      { name: "Hono", reason: "軽量にREST APIを構築できるため" },
    ],
    development:
      "要件をチームで整理したうえで、API設計→フロント実装の順で開発した。自分は主にAPIとデータ設計を担当した。",
    challenges: [
      {
        problem: "同時編集でタスクの更新が衝突し、上書きが発生していた。",
        approach: "更新時に更新日時を比較し、古い変更を弾く楽観ロックを導入した。",
        result: "上書きによる消失がなくなり、共同編集が安定した。",
      },
    ],
    result: "チームのミーティング前の状況共有が5分程度で済むようになった。",
    reflection: "「共有のための入力コスト」を下げることが、継続利用の一番のポイントだと学んだ。",
    links: [{ label: "GitHub", url: "https://github.com/〇〇" }],
  },
  {
    slug: "event-support-tool",
    title: "イベント運営支援ツール",
    subtitle: "サークルイベントの申し込みと当日運営を支援するツール",
    year: "2025",
    period: "2025年",
    role: "フロントエンド",
    overview:
      "サークルのイベント参加申し込みと、当日の受付リストをまとめて管理できるツール。参加者視点での入力のしやすさを重視した。",
    background:
      "イベントの参加申し込みがメッセージアプリ上のアンケートで行われており、集計と当日の受付で手間がかかっていた。",
    solution:
      "申し込みフォーム・集計・受付リストを一つのツールにまとめ、スマートフォンから入力しやすいフォームにした。",
    features: ["スマートフォン向けの参加申し込みフォーム", "参加者の集計・エクスポート", "当日用の受付リスト"],
    techStack: [
      { name: "Astro", reason: "静的生成で表示が速く、サーバー管理が不要なため" },
      { name: "Cloudflare Workers", reason: "申し込み受付のAPIを低コストで動かすため" },
    ],
    development:
      "運営メンバーへのヒアリングで入力項目を絞り込み、プロトタイプを1週間で作って実際のイベントで試した。",
    challenges: [
      {
        problem: "申し込みフォームの項目が多く、途中で離脱する参加者がいた。",
        approach: "必須項目を3つまで絞り、1画面で入力を完了できる構成にした。",
        result: "申し込みの離脱が減り、集計作業も簡単になった。",
      },
    ],
    result: "イベントごとの参加申し込み・受付の作業時間が大幅に減った。",
    reflection:
      "実際に使う場面で早期に試すことで、機能の増やしすぎを防げることを実感した。",
    links: [{ label: "GitHub", url: "https://github.com/〇〇" }],
  },
];
