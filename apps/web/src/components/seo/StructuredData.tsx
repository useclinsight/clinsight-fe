import { faqs } from '@/lib/faqs';
import { getPublicSiteUrl } from '@/lib/site-url';

export function StructuredData() {
  const appUrl = getPublicSiteUrl();
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Clinsight',
      url: appUrl,
      description: 'Clear lab-result insights with optional doctor review.',
      logo: appUrl ? `${appUrl}/clinsight-favicon.svg` : undefined,
    },
  ];

  const jsonLd = JSON.stringify(data).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}
