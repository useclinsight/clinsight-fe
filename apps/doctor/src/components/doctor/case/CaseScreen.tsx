'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Case } from '@/services/doctor';
import { MOCK_CASE_DATA } from '@/lib/case-data';

type CaseTab = 'lab' | 'summary' | 'note';

const tabs: { id: CaseTab; label: string }[] = [
  { id: 'lab', label: 'Lab Report' },
  { id: 'summary', label: 'AI Interpretation Summary' },
  { id: 'note', label: 'Patient Notes' },
];

function SummarySection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-outline-border bg-[#FAFAFA] p-4">
      <div className="flex items-center justify-between gap-4 border-b border-outline-border pb-3">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <Image src={icon} alt="" width={28} height={28} />
      </div>
      <div className="pt-3 text-sm leading-6 text-[#767676]">{children}</div>
    </section>
  );
}

export default function CaseScreen({
  caseData,
  initialTab = 'lab',
}: {
  caseData: Case;
  initialTab?: CaseTab;
}) {
  const [activeTab, setActiveTab] = useState<CaseTab>(initialTab);
  const patientInfo = [
    { label: 'Age', value: '—' },
    { label: 'Gender', value: '—' },
    { label: 'Location', value: '—' },
    { label: 'Requested Review', value: '—' },
    { label: 'Submitted', value: '—' },
  ];

  return (
    <div className="min-h-screen space-y-4 bg-[#FAFAFA] px-2.5 pb-10 pt-2.5 text-text-primary md:px-4">
      <Link
        href="/user/case"
        className="inline-flex items-center gap-2 rounded-sm text-sm text-primary-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
      >
        <ChevronLeft size={16} aria-hidden="true" /> Back
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Case Details</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Request #{caseData.id} <span aria-hidden="true">•</span> Received{' '}
            {caseData.timeAssigned}
          </p>
          <span className="sr-only">Patient: {caseData.patientName}</span>
        </div>
        <Link
          href={`/user/case/${caseData.id}/diagnostic-review`}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary-blue px-5 text-sm font-medium text-white hover:bg-blue-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
        >
          Begin Diagnostic Review
        </Link>
      </header>

      <section
        className="rounded-xl bg-primary-blue px-5 py-4 text-white"
        aria-label="Patient information"
      >
        <h2 className="text-sm font-semibold">Patient Information</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {patientInfo.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-white/80">{label}</dt>
              <dd className="mt-1 text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="min-h-[600px] rounded-2xl border border-outline-border bg-white p-4 md:p-5">
        <div
          role="tablist"
          aria-label="Case information"
          className="flex gap-2 overflow-x-auto border-b border-outline-border md:gap-5"
        >
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              id={`case-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`case-panel-${id}`}
              onClick={() => setActiveTab(id)}
              className={`shrink-0 border-b-2 px-2 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue ${activeTab === id ? 'border-primary-blue font-medium text-primary-blue' : 'border-transparent text-text-disabled hover:text-text-primary'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          id={`case-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`case-tab-${activeTab}`}
          className="pt-4"
        >
          {activeTab === 'lab' && (
            <div className="flex justify-center overflow-auto">
              <Image
                src="/assets/dashboard-case-assets/preview-large.svg"
                alt="Medical laboratory report"
                width={664}
                height={831}
                className="h-auto w-full max-w-[664px]"
                priority
              />
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4 rounded-2xl border border-outline-border p-4 md:p-5">
              <SummarySection title="Summary" icon="/assets/dashboard-case-assets/report.svg">
                <p>
                  The lab results and reported symptoms suggest a possible hormonal imbalance, which
                  may be affecting menstrual regularity and overall energy levels.
                </p>
                <p className="mt-2">
                  These findings may indicate conditions such as polycystic ovary syndrome (PCOS) or
                  other hormonal disorders. However, this is not conclusive and requires further
                  clinical evaluation.
                </p>
              </SummarySection>
              <SummarySection title="Key Findings" icon="/assets/landing-page-assets/key.svg">
                <p>Irregular hormone levels detected</p>
                <p className="mt-2">
                  Symptoms consistent with endocrine disruption (fatigue, mood changes, irregular
                  cycle)
                </p>
              </SummarySection>
              <SummarySection
                title="Recommendations"
                icon="/assets/landing-page-assets/recommendation.svg"
              >
                <p>Referral to a gynecologist or endocrinologist is advised for:</p>
                <ul className="list-disc pl-5">
                  <li>comprehensive hormonal assessment</li>
                  <li>confirmation of diagnosis</li>
                  <li>appropriate treatment planning</li>
                </ul>
              </SummarySection>
            </div>
          )}

          {activeTab === 'note' && (
            <section className="rounded-xl border border-outline-border p-4 md:p-5">
              <h2 className="border-b border-outline-border pb-4 text-lg font-semibold text-text-primary">
                Patient Note
              </h2>
              <div className="space-y-4 pt-4 text-sm leading-6 text-[#767676]">
                {MOCK_CASE_DATA.patientNote.split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
