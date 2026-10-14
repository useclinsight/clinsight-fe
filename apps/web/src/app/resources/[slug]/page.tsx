import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuideHighlights } from '@/components/squeeze/GuideHighlights';
import { SqueezeHeader } from '@/components/squeeze/SqueezeHeader';
import { SqueezeHero } from '@/components/squeeze/SqueezeHero';
import { pageMetadata } from '@/lib/pageMetadata';

const GUIDE_SLUG = '5-lab-values-every-nigerian-should-understand';
const DEMO_SLUG = 'clinsight-userguide';

const RESOURCES = {
  [GUIDE_SLUG]: {
    title: '5 Lab Values Every Nigerian Should Understand — Clinsight',
    description:
      'Download the free guide and decode your lab results before your next doctor visit.',
    heading: undefined,
    highlights: undefined,
  },
  [DEMO_SLUG]: {
    title: 'Clinsight User Guide — Clinsight',
    description: 'A demo resource page for testing the reusable Clinsight guide experience.',
    heading: 'Get more from your Clinsight account',
    highlights: [
      {
        title: 'Upload a lab result',
        description: 'See how Clinsight turns a medical report into a clearer starting point.',
      },
      {
        title: 'Review plain-language insights',
        description: 'Explore the key information surfaced from your report in one focused view.',
      },
      {
        title: 'Prepare for your next visit',
        description: 'Use the guide to organize questions before speaking with your doctor.',
      },
    ],
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
  const resource = RESOURCES[slug as keyof typeof RESOURCES];
  if (!resource) notFound();

  return (
    <div className="bg-white">
      <SqueezeHeader />
      <SqueezeHero title={resource.heading} description={resource.description} />
      <GuideHighlights items={resource.highlights} />
    </div>
  );
}
