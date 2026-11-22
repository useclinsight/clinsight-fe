import type { ReactNode } from 'react';
import Image from 'next/image';
import type { CaseDetailData } from '@/lib/cases-utils';

export default function CaseAiSummaryTab({
  aiInterpretation,
}: {
  aiInterpretation: CaseDetailData['aiInterpretation'];
}) {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-5">
      <SummaryCard
        title="Summary"
        iconSrc="/assets/dashboard-case-assets/report.svg"
        iconBg="bg-[#E8F0F9]"
      >
        <p className="text-sm text-[#5E5E5E] leading-relaxed whitespace-pre-line">
          {aiInterpretation.summary}
        </p>
      </SummaryCard>

      <SummaryCard
        title="Key Findings"
        iconSrc="/assets/landing-page-assets/key.svg"
        iconBg="bg-[#FEF3C7]"
      >
        <ul className="text-sm text-[#5E5E5E] space-y-2">
          {aiInterpretation.keyFindings.map((finding) => (
            <li key={finding}>{finding}</li>
          ))}
        </ul>
      </SummaryCard>

      <SummaryCard
        title="Recommendations"
        iconSrc="/assets/landing-page-assets/recommendation.svg"
        iconBg="bg-[#DCFCE7]"
      >
        <p className="text-sm text-[#5E5E5E] mb-3">{aiInterpretation.recommendationsIntro}</p>
        <ul className="text-sm text-[#5E5E5E] space-y-2 list-disc pl-4">
          {aiInterpretation.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SummaryCard>
    </div>
  );
}

function SummaryCard({
  title,
  iconSrc,
  iconBg,
  children,
}: {
  title: string;
  iconSrc: string;
  iconBg: string;
  children: ReactNode;
}) {
  return (
    <div className="p-5 md:p-6 bg-white rounded-2xl border border-[#F0F0F0]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1B1B1B]">{title}</h3>
        <div className={`p-1.5 rounded-full ${iconBg}`}>
          <Image src={iconSrc} alt="" width={20} height={20} />
        </div>
      </div>
      {children}
    </div>
  );
}
