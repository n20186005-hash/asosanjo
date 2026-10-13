import { SITE } from './site';
import { FAQ_ITEMS } from '../data/content';

type JsonLd = Record<string, unknown>;

export function attractionSchema(canonical: string, image: string): JsonLd {
  const e = SITE.entity;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${SITE.url}/#attraction`,
    name: `${e.fullNameJa}（${e.fullNameEn}）`,
    alternateName: [e.fullNameEn, e.shortNameEn, e.fullNameJa],
    description: SITE.description,
    url: canonical,
    image: [image],
    isAccessibleForFree: true,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${e.streetJa}（${e.streetEn}）`,
      addressLocality: `${e.cityJa}（${e.cityEn}）`,
      addressRegion: `${e.regionJa}（${e.regionEn}）`,
      postalCode: e.postalCode,
      addressCountry: e.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: e.latitude,
      longitude: e.longitude,
    },
    hasMap: e.mapsShareUrl,
    sameAs: [e.mapsShareUrl, e.govtTourismUrl],
    touristType: ['自然観光', '火山景観', 'ドライブ', '公共交通旅行'],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: e.rating,
      reviewCount: e.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function faqSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function faqSchemaFor(items: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
