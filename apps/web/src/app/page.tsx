import { Hero } from '@/components/landing-page/Hero';
import { Features } from '@/components/landing-page/Features';
import { FeaturesGrid } from '@/components/landing-page/FeaturesGrid';
import { HowItWorks } from '@/components/landing-page/HowItWorks';
import { FAQ } from '@/components/landing-page/FAQ';
import { MedicalProfessional } from '@/components/landing-page/MedicalProfessional';
import { pageMetadata } from '@/lib/pageMetadata';
import { StructuredData } from '@/components/seo/StructuredData';

export const metadata = pageMetadata(
  'Clinsight | Understand Your Lab Results in Minutes',
  'Clinsight uses AI to explain complex lab results in plain language, helping you better understand your health before speaking with your doctor.',
  '/',
);

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <StructuredData />
      <Hero />
      <Features />
      <FeaturesGrid />
      <HowItWorks />
      <FAQ />
      <MedicalProfessional />
    </div>
  );
}
