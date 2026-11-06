import type { MetadataRoute } from 'next';

// Only the homepage is public; lastModified is the build time, so it updates on every deploy
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.itscoreye.com/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
