export const profile = {
  name: "〇〇",
  role: "学生エンジニア",
  affiliation: "〇〇大学 〇〇学部 〇〇学科",
  intro:
    "〇〇大学で情報技術を学びながら、Webアプリケーションを中心に、課題発見から設計・実装まで取り組んでいます。",
  interests: ["Webアプリケーション開発", "クラウドインフラ", "UIデザイン"],
  bio: [
    "〇〇大学に入学し、プログラミングを本格的に学び始める。",
    "学内プロジェクトやハッカソンに参加し、チーム開発を経験。",
    "現在は、軽量なWeb技術とクラウドを活用した個人開発に取り組んでいる。",
  ],
};

export const skills: { area: string; detail: string }[] = [
  { area: "フロントエンド", detail: "HTML / CSS / TypeScript / Astro" },
  { area: "バックエンド", detail: "Hono / Cloudflare Workers / API設計" },
  { area: "インフラ", detail: "Cloudflare Pages / Workers / R2" },
  { area: "その他", detail: "Git / GitHub Actions / CI・CD" },
];

export const activities: { year: string; title: string; note: string }[] = [
  { year: "2026", title: "ポートフォリオサイトをリプレイス", note: "Astro + Cloudflare構成に移行" },
  { year: "2025", title: "学内ハッカソンに参加", note: "チームでWebアプリを開発" },
  { year: "2025", title: "チームでのWebアプリ開発", note: "タスク管理アプリを共同開発" },
];

export const contacts: { label: string; url: string }[] = [
  { label: "GitHub", url: "https://github.com/〇〇" },
  { label: "Qiita", url: "https://qiita.com/〇〇" },
  { label: "はてなブログ", url: "https://〇〇.hatenablog.com" },
  { label: "X", url: "https://x.com/〇〇" },
  { label: "メール", url: "mailto:sample@example.com" },
];
