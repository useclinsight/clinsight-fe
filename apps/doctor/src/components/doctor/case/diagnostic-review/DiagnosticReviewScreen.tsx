'use client';

import { useRouter } from 'next/navigation';
import { CaseInfoPanel } from '@/components/doctor/case/diagnostic-review/case-info-panel';
import { ReportEditor } from '@/components/doctor/case/diagnostic-review/report-editor';

interface DiagnosticReviewScreenProps {
  caseId: string;
}

export default function DiagnosticReviewScreen({ caseId }: DiagnosticReviewScreenProps) {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col px-4 md:px-8 pt-6 pb-8 bg-[#FAFAFA] box-border">
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-2 text-sm font-['Inter'] mb-5 select-none shrink-0"
      >
        <span
          onClick={() => router.back()}
          className="text-[#767676] hover:text-primary-blue cursor-pointer transition-colors"
        >
          Case Detail
        </span>
        <span className="text-[#767676]" aria-hidden="true">
          ›
        </span>
        <span className="text-[#1B1B1B] font-medium">Diagnostic Review</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full flex-1 min-h-0">
        <div className="w-full lg:w-[380px] flex shrink-0">
          <CaseInfoPanel caseId={caseId} />
        </div>
        <div className="flex-1 flex min-w-0">
          <ReportEditor caseId={caseId} />
        </div>
      </div>
    </div>
  );
}
