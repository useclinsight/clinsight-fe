import type { Metadata } from 'next';
import { getPublicSiteUrl } from '@/lib/site-url';

export function pageMetadata(title: string, description: string, endpoint: string): Metadata {
  const appUrl = getPublicSiteUrl();
  const url = appUrl ? `${appUrl}${endpoint}` : undefined;
  const fullTitle = title.includes('Clinsight') ? title : `${title} · Clinsight`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: endpoint },
    openGraph: {
      type: 'website',
      title: fullTitle,
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
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/og-image.png'],
    },
  };
}
