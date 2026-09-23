import type { Metadata } from 'next';
import { getPublicSiteUrl } from '@/lib/site-url';

export function pageMetadata(title: string, description: string, endpoint: string): Metadata {
  const appUrl = getPublicSiteUrl();
  const url = appUrl ? `${appUrl}${endpoint}` : undefined;

  return {
    title: endpoint === '/' ? { absolute: title } : title,
    description,
    alternates: { canonical: endpoint },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      images: [
        {
          url: appUrl ? `${appUrl}/og-image.png` : '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Clinsight - Understand your lab results',
        },
      ],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  };
}
