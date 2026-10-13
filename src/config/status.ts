export type StatusLevel = 'open' | 'limited' | 'closed' | 'check';

export interface MountainStatusItem {
  label: string;
  shortLabel: string;
  level: StatusLevel;
  value: string;
  note: string;
}

/**
 * Update this file when official announcements change.
 * This site intentionally does not scrape external sites at runtime.
 *
 * 重要な原則：中岳火口の規制・阿蘇山公園道路・山上広場へ向かう道路・
 * 火口シャトル・路線バスは、それぞれ別の状況として表示する。
 * 「火口が閉まっているから山上広場にも行けない」と誤解させないこと。
 */
export const MOUNTAIN_STATUS = {
  updatedAt: '2026年10月13日',
  sourceNote:
    '掲載内容は編集時点（2026年10月13日）の案内です。出発前と現地到着時に、阿蘇市・交通事業者・現地係員の最新案内をご確認ください。',
  alert: {
    title: '火口は立入規制中。山上広場までは通行可とする案内',
    body: '中岳第一火口の周辺は立入規制が続いています。一方、阿蘇山公園道路は2026年9月2日の安全確認後、山上広場まで通行可能とする案内が出されています。火口・道路・バスは別々の状況です。火口へ向かう場合は、火口規制と火口シャトルの運行情報を必ず確認してください。',
  },
  items: [
    {
      label: '中岳火口見学',
      shortLabel: '火口',
      level: 'closed',
      value: '立入規制中',
      note: '中岳第一火口の周辺約1kmは立入規制が続いています。噴火警戒・火山ガス・風向きで範囲が変わります。',
    },
    {
      label: '阿蘇山公園道路',
      shortLabel: '公園道路',
      level: 'limited',
      value: '山上広場まで通行可',
      note: '2026年9月2日の安全確認後、山上広場まで通行可能とする案内です。規制区域より先には進めません。',
    },
    {
      label: '山上広場へ向かう道',
      shortLabel: '山上道',
      level: 'check',
      value: '当日確認',
      note: '県道・アクセス道路の通行状況は阿蘇市と交通事業者の案内で確認してください。ナビより現地標識を優先。',
    },
    {
      label: '火口シャトル',
      shortLabel: 'シャトル',
      level: 'closed',
      value: '運休中',
      note: '火口規制に伴い運休します。運行再開の案内は事業者のページでご確認ください。',
    },
    {
      label: '阿蘇登山線',
      shortLabel: '路線バス',
      level: 'check',
      value: '当日確認',
      note: '天候・道路状況・災害の影響で運休・区間変更となる場合があります。',
    },
  ] satisfies MountainStatusItem[],
} as const;

export const OFFICIAL_LINKS = {
  crater: 'https://www.city.aso.kumamoto.jp/tourism/spot/park_road_fee/',
  volcano: 'https://www.aso-volcano.jp/',
  mountain: 'https://www.city.aso.kumamoto.jp/tourism/spot/mt_aso/',
  bus: 'https://www.sankobus.jp/bus/asosen/',
  busTimetable: 'https://www.sankobus.jp/bus/asosen/jikoku/',
} as const;
