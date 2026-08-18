import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideHighlights } from '@/components/squeeze/GuideHighlights';
import { SqueezeHeader } from '@/components/squeeze/SqueezeHeader';
import { SqueezeHero } from '@/components/squeeze/SqueezeHero';
import { pageMetadata } from '@/lib/pageMetadata';

const GUIDE_SLUG = '5-lab-values-every-nigerian-should-understand';

const RESOURCES = {
  [GUIDE_SLUG]: {
    title: '5 Lab Values Every Nigerian Should Understand — Clinsight',
    description:
      'Download the free guide and decode your lab results before your next doctor visit.',
  },
} as const;

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(RESOURCES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = RESOURCES[slug as keyof typeof RESOURCES];

  if (!resource) return {};

  return pageMetadata(resource.title, resource.description, `/resources/${slug}`);
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  if (!RESOURCES[slug as keyof typeof RESOURCES]) notFound();

  return (
    <div className="bg-white">
      <SqueezeHeader />
      <SqueezeHero />
      <GuideHighlights />
    </div>
  );
}
