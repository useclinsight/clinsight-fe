'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

export default function LabResultPreview() {
  const params = useParams();
  const caseId = params.id as string;
  const [activePage, setActivePage] = useState(1);
  const [reportUnavailable, setReportUnavailable] = useState(false);
  const reportSource =
    activePage === 1
      ? '/assets/dashboard-case-assets/preview-large.svg'
      : '/assets/dashboard-case-assets/PAGE 2.svg';

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-[#F9FAFB] min-h-screen font-['Inter'] overflow-hidden">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#727783]">
        <Link
          href={`/user/case/${caseId}`}
          className="rounded-sm hover:text-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue transition-colors"
        >
          Case Detail
        </Link>
        <HugeiconsIcon icon={ArrowRight02Icon} size={14} aria-hidden="true" />
        <span aria-current="page" className="text-[#1B1B1B] font-medium">
          Lab Result
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 overflow-hidden">
        {/* Main Preview Column - Scrollable */}
        <div className="lg:col-span-8 flex flex-col w-full lg:h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pr-2">
          <div className="bg-white rounded-[24px] border border-[#F0F0F0] shadow-sm overflow-hidden w-full shrink-0">
            {reportUnavailable ? (
              <div
                role="alert"
                className="flex min-h-[400px] flex-col items-center justify-center gap-3 p-8 text-center"
              >
                <h1 className="text-lg font-semibold text-[#1B1B1B]">Lab report unavailable</h1>
                <p className="text-sm text-[#727783]">
                  This report page could not be displayed. Try another page or return to the case.
                </p>
                <Link
                  href={`/user/case/${caseId}`}
                  className="rounded-lg text-sm font-semibold text-primary-blue underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                >
                  Back to case detail
                </Link>
              </div>
            ) : (
              <div className="relative w-full h-auto">
                <Image
                  src={reportSource}
                  alt={`Medical laboratory report, page ${activePage}`}
                  width={800}
                  height={1100}
                  className="w-full h-auto"
                  priority
                  onError={() => setReportUnavailable(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Fixed/Sticky on Desktop - Stacked with spacing on Mobile */}
        <div className="lg:col-span-4 flex flex-col justify-between h-auto lg:h-[calc(100vh-140px)] w-full gap-10 lg:gap-0">
          {/* Action Button at top */}
          <div className="w-full flex justify-center lg:justify-end">
            <Link
              href={`/user/case/${caseId}/diagnostic-review`}
              className="bg-primary-blue text-white px-6 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue transition-all shadow-[0px_4px_12px_rgba(21,101,192,0.2)] whitespace-nowrap"
            >
              Begin Diagnostic Review
            </Link>
          </div>

          {/* Report page selectors */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-[340px] mx-auto lg:mx-0">
            {[1, 2].map((page) => (
              <button
                key={page}
                type="button"
                aria-label={`Show lab report page ${page}`}
                aria-pressed={activePage === page}
                onClick={() => {
                  setActivePage(page);
                  setReportUnavailable(false);
                }}
                className="flex flex-col items-center gap-2 md:gap-3 w-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
              >
                <span
                  className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-colors ${activePage === page ? 'border-primary-blue' : 'border-transparent hover:border-[#A9C4F0]'}`}
                >
                  <Image
                    src={`/assets/dashboard-case-assets/PAGE ${page}.svg`}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </span>
                <span className="text-xs md:text-sm font-medium text-[#727783]">Page {page}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
