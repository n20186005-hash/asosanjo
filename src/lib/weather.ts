// 阿蘇山上広場 向け天候アドバイスロジック（サーバー側で実行）
// データソース: Open-Meteo の気象予測モデル。Serverside で取得し、Cloudflare エッジで短期キャッシュする。

export type Category =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunder';

export interface CatInfo {
  category: Category;
  label: string;
  isClear: boolean;
  isPartly: boolean;
  isCloudy: boolean;
  isFog: boolean;
  isDrizzle: boolean;
  isRain: boolean;
  lightRain: boolean;
  heavyRain: boolean;
  isThunder: boolean;
  isSnow: boolean;
}

export interface DayForecast {
  date: string;
  weekday: string;
  isToday: boolean;
  category: Category;
  label: string;
  tMax: number;
  tMin: number;
  precipProb: number;
  windMs: number;
  uv: number;
}

export interface CurrentWeather {
  temp: number;
  code: number;
  category: Category;
  label: string;
  precipProb: number;
  windMs: number;
  humidity: number;
  tMax: number;
  tMin: number;
}

export interface ParsedWeather {
  current: CurrentWeather;
  forecast: DayForecast[];
}

export interface Advice {
  outfit: string[];
  activity: string[];
  items: string[];
  risk: string | null;
}

// WMO weather code -> 日本語ラベル + カテゴリ
export function categorize(code: number): CatInfo {
  const base: CatInfo = {
    category: 'cloudy',
    label: '曇り',
    isClear: false,
    isPartly: false,
    isCloudy: true,
    isFog: false,
    isDrizzle: false,
    isRain: false,
    lightRain: false,
    heavyRain: false,
    isThunder: false,
    isSnow: false,
  };
  if (code === 0) return { ...base, category: 'clear', label: '晴れ', isCloudy: false, isClear: true };
  if (code === 1) return { ...base, category: 'clear', label: '晴れ時々曇り', isCloudy: false, isClear: true };
  if (code === 2) return { ...base, category: 'partly', label: '晴れ時々曇り', isCloudy: false, isPartly: true };
  if (code === 3) return { ...base, category: 'cloudy', label: '曇り' };
  if (code === 45 || code === 48) return { ...base, category: 'fog', label: '霧', isFog: true };
  if (code >= 51 && code <= 57) return { ...base, category: 'drizzle', label: '霧雨', isDrizzle: true };
  if (code >= 71 && code <= 77) return { ...base, category: 'snow', label: '雪', isSnow: true };
  if (code >= 85 && code <= 86) return { ...base, category: 'snow', label: '雪', isSnow: true };
  if (code >= 95) return { ...base, category: 'thunder', label: '雷雨', isThunder: true };
  if (code >= 61 && code <= 67) {
    const heavy = code === 65 || code === 66 || code === 67;
    return { ...base, category: 'rain', label: heavy ? '強い雨' : '雨', isRain: true, heavyRain: heavy, isCloudy: false };
  }
  if (code >= 80 && code <= 82) {
    const heavy = code >= 81;
    return { ...base, category: 'rain', label: heavy ? '強いにわか雨' : 'にわか雨', isRain: true, heavyRain: heavy, isCloudy: false };
  }
  return base;
}

// 風速(m/s) -> ビューフォート階級
export function beaufort(ms: number): { level: number; label: string } {
  if (ms < 0.3) return { level: 0, label: '無風' };
  if (ms < 1.6) return { level: 1, label: '軟風' };
  if (ms < 3.4) return { level: 2, label: '軽風' };
  if (ms < 5.5) return { level: 3, label: '微風' };
  if (ms < 8.0) return { level: 4, label: '和風' };
  if (ms < 10.8) return { level: 5, label: '強風の兆し' };
  if (ms < 13.9) return { level: 6, label: '強風' };
  if (ms < 17.2) return { level: 7, label: '疾風' };
  if (ms < 20.8) return { level: 8, label: '大風' };
  return { level: 9, label: '暴風' };
}

// 観光客向けアドバイス生成（条件に合致するものだけ出力）
export function buildAdvice(
  d: CatInfo & { tMax: number; tMin: number; precipProb: number; windMs: number; uv: number }
): Advice {
  const { isClear, isPartly, isCloudy, isFog, isDrizzle, isRain, lightRain, heavyRain, isThunder, isSnow, tMax, tMin, precipProb, windMs, uv } = d;
  const outfit: string[] = [];
  const activity: string[] = [];
  const items: string[] = [];
  let risk: string | null = null;

  const addRisk = (msg: string) => {
    risk = risk ? `${risk} ${msg}` : msg;
  };

  // 晴 / 曇（ベース）
  if (isClear) {
    outfit.push('天気は良く、屋外散策に適しています。');
    activity.push('景色や夕日・朝日の撮影におすすめです。');
    items.push('日焼け止め');
  } else if (isPartly || isCloudy) {
    outfit.push('光が柔らかく、長時間の屋外でも過ごしやすい日です。');
    activity.push('強い日差しがないので、ゆっくり散策に向いています。');
  }

  // 降水
  if (precipProb >= 60) {
    outfit.push('降水の可能性が高いので、雨具を持参しましょう。');
    activity.push('室内施設を優先し、山歩きや展望は後回しに。');
    items.push('傘 / レインウェア');
  }
  if (isDrizzle) {
    outfit.push('霧雨です。わずかな濡れにも備えて。');
    items.push('折りたたみ傘');
  }
  if (lightRain) {
    outfit.push('小雨です。足元が滑りやすいので注意してください。');
    activity.push('屋外の体験は物足りないかもしれません。');
    items.push('折りたたみ傘');
  }
  if (heavyRain) {
    addRisk('雨が強いので、谷や低い土地を避けて行動してください。');
    activity.push('屋外は控えめに。遊覧施設が運休になることがあります。');
    items.push('レインウェア（長傘は風で差しにくい）');
  }
  if (isThunder) {
    addRisk('雷に注意。登山・水辺・木の下での避雨は避けてください。');
    activity.push('水上のプログラムは休止になりやすいです。');
  }
  if (isSnow) {
    outfit.push('雪道は滑りやすく、視界も悪くなります。');
    items.push('滑りにくい靴', '防寒具');
  }

  // 高温 / 紫外線
  if (tMax >= 32) {
    outfit.push('気温が高いので、正午の外出を避けてください。');
    activity.push('屋外の滞在は短めに。');
    items.push('日焼け止め', '十分な飲み物', '熱中症対策');
  }
  if (uv >= 5) {
    outfit.push('紫外線が強いので日焼け対策を。');
    items.push('日焼け止め', 'サングラス', '帽子');
  }

  // 低温
  if (tMax - tMin > 8) {
    outfit.push('昼夜の寒暖差が大きいので、羽織るものがあると便利です。');
  }
  if (tMax <= 10) {
    outfit.push('気温が低いのでしっかり防寒を。');
    items.push('厚手の上着', 'マフラー');
  }
  if (tMin <= 0) {
    addRisk('未明は氷点下になりやすく、路面の凍結に注意してください。');
  }

  // 風（山上はさらに強くなる）
  const bf = beaufort(windMs);
  if (bf.level >= 5 && bf.level <= 6) {
    outfit.push('風がやや強いので、飛ばされやすい帽子は注意。');
    activity.push('露天の施設が運休になることがあります。');
  } else if (bf.level >= 7) {
    addRisk('強風です。看板や岩場から離れてください。');
    activity.push('屋外のプログラムは休止になりやすいです。');
  }
  if (bf.level >= 5) {
    outfit.push('山頂では風がさらに強くなるため、しっかりとした上着を。');
  }

  // 霧（山上の展望・火口見学に不向き）
  if (isFog) {
    addRisk('視界が悪く、展望や火口見学には向きません。');
    items.push('マスク（飛散・花粉の対策にも）');
  }

  // 火山ガス（風が弱く、雨・雷・霧でない日）
  if (bf.level <= 2 && !isRain && !isThunder && !isFog) {
    activity.push('風が弱い日は火口付近で火山ガスが滞留しやすいため、長居は避けてください。');
  }

  // 重複排除
  return {
    outfit: [...new Set(outfit)],
    activity: [...new Set(activity)],
    items: [...new Set(items)],
    risk,
  };
}

interface OpenMeteoJson {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
    uv_index_max?: number[];
  };
}

export function parseOpenMeteo(json: OpenMeteoJson): ParsedWeather {
  const cur = json.current;
  const d = json.daily;
  const cat = categorize(cur.weather_code);

  const current: CurrentWeather = {
    temp: Math.round(cur.temperature_2m),
    code: cur.weather_code,
    category: cat.category,
    label: cat.label,
    precipProb: d.precipitation_probability_max?.[0] ?? 0,
    windMs: cur.wind_speed_10m,
    humidity: cur.relative_humidity_2m,
    tMax: Math.round(d.temperature_2m_max[0]),
    tMin: Math.round(d.temperature_2m_min[0]),
  };

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const now = new Date();
  const jst = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 9 * 3600000);
  const todayStr = jst.toISOString().slice(0, 10);

  const forecast: DayForecast[] = d.time.map((date, i) => {
    const dt = new Date(`${date}T00:00:00`);
    const c = categorize(d.weather_code[i]);
    return {
      date,
      weekday: weekdays[dt.getDay()],
      isToday: date === todayStr,
      category: c.category,
      label: c.label,
      tMax: Math.round(d.temperature_2m_max[i]),
      tMin: Math.round(d.temperature_2m_min[i]),
      precipProb: d.precipitation_probability_max?.[i] ?? 0,
      windMs: d.wind_speed_10m_max?.[i] ?? 0,
      uv: d.uv_index_max?.[i] ?? 0,
    };
  });

  return { current, forecast };
}

// Cloudflare Workers の fetch は `cf` オプションでエッジキャッシュを制御できる
type CFetchInit = RequestInit & { cf?: { cacheTtl?: number; cacheEverything?: boolean } };

export async function fetchWeather(lat: number, lng: number): Promise<ParsedWeather | null> {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lat}&longitude=${lng}` +
    '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max' +
    '&timezone=Asia%2FTokyo&forecast_days=7';

  const init: CFetchInit = { cf: { cacheTtl: 1800 } };

  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return parseOpenMeteo((await res.json()) as OpenMeteoJson);
  } catch {
    return null;
  }
}

// ---- アイコン（シンプルなライン SVG） ----
export function iconFor(category: Category): string {
  const open = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
  const close = '</svg>';
  const sun = '<circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19"/>';
  const cloud = '<path d="M7 18.5a4 4 0 0 1 .4-7.97A5.5 5.5 0 0 1 18 11.3a3.4 3.4 0 0 1-.4 7.2z" fill="currentColor" stroke="none"/>';
  switch (category) {
    case 'clear':
      return `${open}${sun}${close}`;
    case 'partly':
      return `${open}<circle cx="8.5" cy="8" r="3.1" fill="currentColor" stroke="none"/><path d="M8.5 2.8v1.5M3.6 8H2.1M4.6 4.6l1.1 1.1" /><path d="M9 19.5a3.6 3.6 0 0 1 .4-7.16A5 5 0 0 1 19 12.1a3.2 3.2 0 0 1-.5 7.4z" fill="currentColor" stroke="none"/>${close}`;
    case 'cloudy':
      return `${open}${cloud}${close}`;
    case 'fog':
      return `${open}${cloud}<path d="M4 19.5h11" /><path d="M6 22h9" />${close}`;
    case 'drizzle':
      return `${open}${cloud}<path d="M9 18.5 8.3 20.5M12.5 18.5l-.7 2M16 18.5l-.7 2"/>${close}`;
    case 'rain':
      return `${open}${cloud}<path d="M8.5 18.5 7.5 21M12 18.5l-1 2.5M15.5 18.5l-1 2.5"/>${close}`;
    case 'snow':
      return `${open}${cloud}<path d="M9 19h.01M12 20.5h.01M15 19h.01M10.5 21h.01M13.5 21h.01" stroke-width="2"/>${close}`;
    case 'thunder':
      return `${open}${cloud}<path d="M12.5 15l-2.5 4h2l-1 3.2 3.6-4.6h-2.1z" fill="currentColor" stroke="none"/>${close}`;
    default:
      return `${open}${cloud}${close}`;
  }
}
