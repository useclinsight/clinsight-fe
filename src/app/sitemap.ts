import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = getPublicSiteUrl();
  if (!appUrl) return [];

  const pages = [
    '',
    '/about',
    '/contact',
    '/faqs',
    '/how-it-works',
    '/resources/5-lab-values-every-nigerian-should-understand',
    '/waitlist',
  ];

  return pages.map((path, index) => ({
    url: `${appUrl}${path}`,
    changeFrequency: 'weekly',
    priority: index === 0 ? 1 : 0.8,
  }));
}
