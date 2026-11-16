import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/site-url';

const publicPages = [
  '/',
  '/about',
  '/how-it-works',
  '/faqs',
  '/contact',
  '/waitlist',
  '/resources/5-lab-values-every-nigerian-should-understand',
  '/privacy-policy',
  '/terms-and-conditions',
  '/delete-account',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getPublicSiteUrl();
  return publicPages.map((path) => ({ url: new URL(path, siteUrl).toString() }));
}
