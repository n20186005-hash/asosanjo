# 阿蘇山上ガイド

阿蘇山上広場・阿蘇山上ターミナル周辺を案内する、日本語の観光サイトです。火口規制、アクセス、草千里、食事、時間別プランを、外部サービスに依存しない静的コンテンツとして管理します。

## 技術構成

- Astro 7 / TypeScript
- Tailwind CSS 4
- pnpm
- Cloudflare Workers (`@astrojs/cloudflare`)
- Google Analytics 4: `G-HXM22WWPKP`
- データベース、ログイン、CMS なし

## 開発

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

型・構文確認とビルド：

```bash
pnpm check
pnpm build
```

Cloudflare Workers へデプロイ：

```bash
pnpm deploy
```

## ドメイン設定

既定値は `.env.example`、`astro.config.mjs`、`wrangler.jsonc` にあります。取得するドメインを変更した場合は、次の環境変数だけを更新します。

```dotenv
PUBLIC_SITE_URL=https://AsoSanjo.com
```

ドメイン文字列はページ本文には表示されません。Cloudflare Dashboard で Worker に Custom Domain を追加してください。

## 情報更新

火口・道路・バスの案内は `src/config/status.ts` に集約しています。公式発表が変わったときは、`alert` と `items` を更新してください。サイトは外部サイトを実行時にスクレイピングしません。

飲食店・FAQ は `src/data/content.ts` で管理します。

## 写真

ローカル配信する実写写真は Creative Commons ライセンス素材です。詳細は `CREDITS.md` と `/credits/` を参照してください。加工画像には元作品と同じ継承条件が適用されます。
