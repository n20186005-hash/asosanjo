export const SITE = {
  name: '阿蘇山上ガイド',
  shortName: '阿蘇山上',
  description:
    '阿蘇山上広場と阿蘇山上ターミナルの旅案内。中岳火口の規制、阿蘇駅からのバス、駐車場、草千里、周辺ランチをわかりやすく紹介します。',
  defaultTitle: '阿蘇山上広場ガイド｜火口規制・アクセス・草千里',
  locale: 'ja_JP',
  language: 'ja',
  gaMeasurementId: 'G-HXM22WWPKP',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://AsoSanjo.com',
  address: '熊本県阿蘇市黒川1808',
  coordinates: {
    latitude: 32.8799276,
    longitude: 131.07399,
  },
} as const;

export const NAV_ITEMS = [
  { href: '/', label: '山上広場' },
  { href: '/status/', label: '本日の案内' },
  { href: '/access/', label: 'アクセス' },
  { href: '/guide/', label: '見どころ' },
  { href: '/food/', label: '食べる' },
  { href: '/plan/', label: '旅のプラン' },
  { href: '/faq/', label: 'よくある質問' },
] as const;
