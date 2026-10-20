'use client';

import Link from 'next/link';
import { CaseInfoPanel } from '@/components/doctor/case/diagnostic-review/case-info-panel';
import { ReportEditor } from '@/components/doctor/case/diagnostic-review/report-editor';

interface DiagnosticReviewScreenProps {
  caseId: string;
}

export default function DiagnosticReviewScreen({ caseId }: DiagnosticReviewScreenProps) {
  return (
    <div className="w-full min-h-screen flex flex-col px-2.5 pt-3 pb-8 bg-[#FAFAFA] box-border">
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-2 pl-2.5 text-sm font-['Inter'] mb-[46px] select-none shrink-0"
      >
        <Link
          href={`/user/case/${caseId}`}
          className="rounded-sm text-[#767676] hover:text-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue transition-colors"
        >
          Case Detail
        </Link>
        <span className="text-[#767676]" aria-hidden="true">
          ›
        </span>
        <span aria-current="page" className="text-[#1B1B1B] font-medium">
          Diagnostic Review
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-5 items-stretch w-full flex-1 min-h-0">
        <div className="w-full lg:w-[400px] flex shrink-0">
          <CaseInfoPanel />
        </div>
        <div className="flex-1 flex min-w-0">
          <ReportEditor caseId={caseId} />
        </div>
      </div>
    </div>
  );
}
