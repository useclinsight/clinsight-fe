import AboutHero from '@/components/landing-page/about/Hero';
import AboutMissionVision from '@/components/landing-page/about/MissionVission';
import AboutStory from '@/components/landing-page/about/Story';
import AboutValues from '@/components/landing-page/about/Values';
import AboutTeam from '@/components/landing-page/about/Team';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  'About — Clinsight',
  'Learn about Clinsight, our mission, team, and values.',
  '/about',
);

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <main className="flex-1 flex flex-col items-center overflow-x-hidden text-base text-[#1B1B1B]">
        <AboutHero />
        <AboutStory />
        <AboutMissionVision />
        <AboutValues />
        <AboutTeam />
      </main>
    </div>
  );
}
