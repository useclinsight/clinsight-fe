'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import CaseAiSummaryTab from './CaseAiSummaryTab';
import CaseLabReportTab from './CaseLabReportTab';
import CasePatientNotesTab from './CasePatientNotesTab';
import { CASE_DETAIL_TABS, type CaseDetailData, type CaseDetailTab } from '@/lib/cases-utils';
import { cn } from '@/lib/utils';

export default function CaseScreen({ caseData }: { caseData: CaseDetailData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CaseDetailTab>('lab-report');

  const handleBeginReview = () => {
    router.push(`/user/case/${caseData.id}/diagnostic-review`);
  };

  return (
    <div className="flex flex-col gap-5 pt-2.5 pb-10 px-2.5 max-w-6xl">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => router.push('/user/case')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-blue hover:text-[#1255A8] transition-colors w-fit"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#111827]">Case Details</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Request #{caseData.requestId} · Received {caseData.receivedAt}
            </p>
          </div>

          <button
            type="button"
            onClick={handleBeginReview}
            className="bg-primary-blue text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1255A8] transition-colors whitespace-nowrap shadow-[0px_4px_12px_rgba(21,101,192,0.2)]"
          >
            Begin Diagnostic Review
          </button>
        </div>
      </div>

      <div className="bg-primary-blue rounded-2xl px-5 md:px-8 py-5">
        <p className="text-sm font-semibold text-white mb-4">Patient Information</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          <InfoItem label="Age" value={`${caseData.age} years`} />
          <InfoItem label="Gender" value={caseData.gender} />
          <InfoItem label="Location" value={caseData.location} />
          <InfoItem label="Requested Review" value={caseData.requestedReview} />
          <InfoItem
            label="Submitted"
            value={caseData.submittedAt}
            className="col-span-2 md:col-span-1"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-2xs overflow-hidden">
        <div className="flex overflow-x-auto border-b border-[#F3F4F6]">
          {CASE_DETAIL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-5 md:px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'lab-report' ? (
          <CaseLabReportTab labReport={caseData.labReport} patientName={caseData.patientName} />
        ) : null}
        {activeTab === 'ai-summary' ? (
          <CaseAiSummaryTab aiInterpretation={caseData.aiInterpretation} />
        ) : null}
        {activeTab === 'patient-notes' ? (
          <CasePatientNotesTab patientNote={caseData.patientNote} />
        ) : null}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-white/70 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
