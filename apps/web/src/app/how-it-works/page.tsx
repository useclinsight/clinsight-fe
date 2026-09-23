import { HowItWorksHero } from '@/components/landing-page/how-it-works/HowItWorksHero';
import { BentoGrid } from '@/components/landing-page/how-it-works/BentoGrid';
import { ProcessHeader } from '@/components/landing-page/how-it-works/ProcessHeader';
import { ProcessPath } from '@/components/landing-page/how-it-works/ProcessPath';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  'How it works — Clinsight',
  'See how Clinsight turns lab data into clear, actionable insights.',
  '/how-it-works',
);

export default function HowItWorksStandalonePage() {
  return (
    <div className="bg-white flex flex-col w-full">
      {/* The standalone page GETS the Hero */}
      <HowItWorksHero />
      <BentoGrid />
      <ProcessHeader />
      <ProcessPath />
    </div>
  );
}
