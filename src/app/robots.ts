import type { MetadataRoute } from 'next';

// /admin is not disallowed here on purpose: crawlers must be able to fetch it to see its noindex tag
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: 'https://www.itscoreye.com/sitemap.xml',
    host: 'https://www.itscoreye.com',
  };
}
