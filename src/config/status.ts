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
 */
export const MOUNTAIN_STATUS = {
  sourceNote: '掲載内容は編集時点の案内です。出発前と現地到着時に、阿蘇市・交通事業者・現地係員の最新案内をご確認ください。',
  alert: {
    title: '現在、火口見学はできません',
    body: '阿蘇山公園道路の閉鎖に伴い、中岳火口の一般見学と火口シャトルは休止しています。阿蘇山上広場や草千里を訪れる場合も、道路・バス・天候の案内を確認してください。',
  },
  items: [
    {
      label: '中岳火口見学',
      shortLabel: '火口',
      level: 'closed',
      value: '見学不可',
      note: '阿蘇山公園道路の閉鎖中は火口へ入れません。',
    },
    {
      label: '阿蘇山公園道路',
      shortLabel: '道路',
      level: 'closed',
      value: '閉鎖中',
      note: 'ナビの案内より現地の規制標識を優先してください。',
    },
    {
      label: '火口シャトル',
      shortLabel: 'シャトル',
      level: 'closed',
      value: '運休中',
      note: '火口周辺の規制時は運休します。',
    },
    {
      label: '阿蘇登山線',
      shortLabel: '路線バス',
      level: 'check',
      value: '当日確認',
      note: '天候・道路状況・災害の影響で変更される場合があります。',
    },
  ] satisfies MountainStatusItem[],
} as const;

export const OFFICIAL_LINKS = {
  crater: 'https://www.city.aso.kumamoto.jp/tourism/spot/park_road_fee/',
  mountain: 'https://www.city.aso.kumamoto.jp/tourism/spot/mt_aso/',
  bus: 'https://www.sankobus.jp/bus/asosen/',
  busTimetable: 'https://www.sankobus.jp/bus/asosen/jikoku/',
} as const;
