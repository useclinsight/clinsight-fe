'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';

interface CaseDetail {
  id: string;
  patientName: string;
  avatar: string;
  timeAssigned: string;
  status: string;
  condition: string;
}

export default function CaseScreen({ caseData }: { caseData: CaseDetail }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-[#F9FAFB] min-h-screen font-['Inter']">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#727783] mb-2">
        <span
          onClick={() => router.push('/user/case')}
          className="cursor-pointer hover:text-primary-blue transition-colors"
        >
          Active Cases
        </span>
        <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
        <span className="text-[#1B1B1B] font-medium">Case Detail</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B1B1B]">
              {caseData.patientName}
            </h1>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={24}
              className="text-[#1B1B1B] cursor-pointer"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[#727783] text-sm">
            <div className="flex items-center gap-1.5">
              <Image
                src="/assets/dashboard-case-assets/finger-print-check.svg"
                alt="Case ID Icon"
                width={16}
                height={16}
              />
              <span>Case ID: #CR-7721</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Image
                src="/assets/dashboard-case-assets/calendar-03.svg"
                alt="Assigned Icon"
                width={16}
                height={16}
              />
              <span>Assigned {caseData.timeAssigned}</span>
            </div>
          </div>
        </div>

        <button className="bg-primary-blue text-white px-6 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-blue-700 transition-all shadow-[0px_4px_12px_rgba(21,101,192,0.2)] whitespace-nowrap">
          Begin Diagnostic Review
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#F0F0F0] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-[#E8F0F9] rounded-xl flex items-center justify-center">
            <Image
              src="/assets/dashboard-case-assets/duration.svg"
              alt="Duration Icon"
              width={24}
              height={24}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1565C0] uppercase tracking-wider mb-0.5">
              Symptom Duration
            </p>
            <p className="text-base font-normal text-[#1B1B1B]">3-4 Weeks</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0F0F0] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-[#FDE3E3] rounded-xl flex items-center justify-center">
            <Image
              src="/assets/dashboard-case-assets/risk.svg"
              alt="Risk Icon"
              width={24}
              height={24}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#8F2929] uppercase tracking-wider mb-0.5">
              Risk Level
            </p>
            <p className="text-base font-normal text-[#1B1B1B]">Moderate</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F0F0F0] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-[#FEF0DA] rounded-xl flex items-center justify-center">
            <Image
              src="/assets/dashboard-case-assets/high-priority.svg"
              alt="Priority Icon"
              width={24}
              height={24}
            />
          </div>
          <div>
            <p className="text-xs font-bold text-[#935F07] uppercase tracking-wider mb-0.5">
              Case Priority
            </p>
            <p className="text-base font-normal text-[#1B1B1B]">Moderate</p>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
        {/* Left Column - AI Interpretation */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[24px] border border-[#F0F0F0] shadow-sm flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/landing-page-assets/ai-scan.svg"
                alt="AI Icon"
                width={20}
                height={20}
              />
              <h2 className="text-xl font-bold text-[#1B1B1B]">AI Interpretation</h2>
            </div>

            {/* Summary Section */}
            <div className="p-6 bg-[#F9FAFB] rounded-2xl border border-[#F0F0F0] relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1B1B1B]">Summary</h3>
                <div className="p-1.5 bg-[#E8F0F9] rounded-full">
                  <Image
                    src="/assets/dashboard-case-assets/report.svg"
                    alt="Report Icon"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              <p className="text-sm text-[#5E5E5E] leading-relaxed">
                The lab results and reported symptoms suggest a possible hormonal imbalance, which
                may be affecting menstrual regularity and overall energy levels.
                <br />
                These findings may indicate conditions such as polycystic ovary syndrome (PCOS) or
                other hormonal disorders. However, this is not conclusive and requires further
                clinical evaluation.
              </p>
            </div>

            {/* Key Findings Section */}
            <div className="p-6 bg-[#F9FAFB] rounded-2xl border border-[#F0F0F0] relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1B1B1B]">Key Findings</h3>
                <div className="rounded-full overflow-hidden">
                  <Image
                    src="/assets/landing-page-assets/key.svg"
                    alt="Key Findings Icon"
                    width={28}
                    height={28}
                  />
                </div>
              </div>
              <ul className="text-sm text-[#5E5E5E] space-y-3">
                <li className="flex items-start gap-2">Irregular hormone levels detected</li>
                <li className="flex items-start gap-2">
                  Symptoms consistent with endocrine disruption (fatigue, mood changes, irregular
                  cycle)
                </li>
              </ul>
            </div>

            {/* Recommendations Section */}
            <div className="p-6 bg-[#F9FAFB] rounded-2xl border border-[#F0F0F0] relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1B1B1B]">Recommendations</h3>
                <div className="rounded-full overflow-hidden">
                  <Image
                    src="/assets/landing-page-assets/recommendation.svg"
                    alt="Recommendation Icon"
                    width={28}
                    height={28}
                  />
                </div>
              </div>
              <p className="text-sm text-[#5E5E5E] mb-3">
                Referral to a gynecologist or endocrinologist is advised for:
              </p>
              <ul className="text-sm text-[#5E5E5E] space-y-2 list-disc pl-4">
                <li>comprehensive hormonal assessment</li>
                <li>confirmation of diagnosis</li>
                <li>appropriate treatment planning</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Lab Result Preview */}
          <div className="bg-white p-4 rounded-[24px] border border-[#F0F0F0] shadow-sm overflow-hidden">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-[#F0F0F0]">
              <Image
                src="/assets/dashboard-case-assets/preview.png"
                alt="Lab Result Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={() => router.push(`/user/case/${caseData.id}/lab-result`)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-blue text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg"
            >
              Preview Lab Result
              <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
            </button>
          </div>

          {/* Patient Note */}
          <div className="bg-white p-8 rounded-[24px] border border-[#F0F0F0] shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/dashboard-case-assets/notes.svg"
                alt="Notes Icon"
                width={20}
                height={20}
              />
              <h2 className="text-xl font-bold text-[#1B1B1B]">Patient Note</h2>
            </div>
            <div className="flex flex-col gap-5 text-[#5E5E5E] text-[15px] leading-[1.6]">
              <p>
                I&apos;ve been feeling unusually tired for the past few weeks, even when I get
                enough rest.
              </p>
              <p>
                My periods have also been irregular lately, and I&apos;ve noticed mood changes that
                I can&apos;t really explain.
              </p>
              <p>I&apos;m starting to get worried because this isn&apos;t normal for me.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
