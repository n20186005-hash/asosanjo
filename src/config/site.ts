export const SITE = {
  name: '阿蘇山上ガイド',
  shortName: '阿蘇山上',
  description:
    '阿蘇山上広場と阿蘇山上ターミナルの旅案内。中岳火口の規制、阿蘇駅からのバス、駐車場、草千里、周辺ランチをわかりやすく紹介します。',
  defaultTitle: '阿蘇山上広場ガイド｜駐車場・アクセス・火口規制・草千里',
  locale: 'ja_JP',
  language: 'ja',
  gaMeasurementId: 'G-HXM22WWPKP',
  url: import.meta.env.PUBLIC_SITE_URL || 'https://AsoSanjo.com',
  // 単一観光地 SEO 実体バインド（Google マップ最新情報に基づく）
  entity: {
    fullNameEn: 'Aso Sanjo Public Square',
    fullNameJa: '阿蘇山上広場',
    shortNameEn: 'Aso Sanjo',
    cityEn: 'Minamiaso',
    cityJa: '南阿蘇村',
    regionEn: 'Kumamoto',
    regionJa: '熊本県',
    countryEn: 'Japan',
    countryJa: '日本',
    countryCode: 'JP',
    postalCode: '869-2225',
    streetEn: '808 Kurokawa',
    streetJa: '黒川',
    latitude: 32.8799276,
    longitude: 131.07399,
    mapsShareUrl: 'https://maps.app.goo.gl/dAUbfxT5ZBuSqNbR7',
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3350.6897346522032!2d131.07399!3d32.8799276!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3540d8f343ab97f7%3A0xa7d0eb6e3ec8ba2d!2sAso%20Sanjo%20Public%20Square!5e0!3m2!1sja!2sJP!4v1785405959886!5m2!1sja!2sJP',
    nearbyLandmark1: '中岳火口（Nakadake Crater）',
    nearbyLandmark2: '草千里（Kusasenri）',
    govtTourismUrl: 'https://kumamoto.guide/',
    rating: 4.3,
    reviewCount: 1975,
    ratingSyncLabel: '2026年10月',
  },
  address: '熊本県阿蘇郡南阿蘇村黒川',
  coordinates: {
    latitude: 32.8799276,
    longitude: 131.07399,
  },
} as const;

export const NAV_ITEMS = [
  { href: '/', label: '山上広場' },
  { href: '/status/', label: '山の状況' },
  { href: '/access/', label: 'アクセス' },
  { href: '/weather/', label: '天気' },
  { href: '/guide/', label: '見どころ' },
  { href: '/food/', label: '食べる' },
  { href: '/plan/', label: '旅のプラン' },
  { href: '/faq/', label: 'よくある質問' },
] as const;
