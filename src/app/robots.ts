import type { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  const appUrl = getPublicSiteUrl();
  const canIndex = process.env.NODE_ENV === 'production' && Boolean(appUrl);

  return {
    rules: canIndex
      ? { userAgent: '*', allow: '/', disallow: ['/api/'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: canIndex && appUrl ? `${appUrl}/sitemap.xml` : undefined,
    host: appUrl,
  };
}
