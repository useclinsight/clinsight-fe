'use client';

import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

export default function LabResultPreview() {
  const router = useRouter();
  const params = useParams();
  const caseId = params?.id as string | undefined;

  const handleBeginDiagnosticReview = () => {
    if (caseId) {
      router.push(`/user/case/${caseId}/diagnostic-review`);
    } else {
      console.warn('Case ID parameter could not be recovered from active context.');
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-[#F9FAFB] min-h-screen font-['Inter'] overflow-hidden">
      <nav className="flex items-center gap-2 text-sm text-[#727783]">
        <span
          onClick={() => router.back()}
          className="cursor-pointer hover:text-primary-blue transition-colors"
        >
          Case Detail
        </span>
        <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
        <span className="text-[#1B1B1B] font-medium">Lab Result</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 overflow-hidden">
        {/* Main Preview Column - Scrollable */}
        <div className="lg:col-span-8 flex flex-col w-full lg:h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pr-2">
          <div className="bg-white rounded-[24px] border border-[#F0F0F0] shadow-sm overflow-hidden w-full shrink-0">
            <div className="relative w-full h-auto">
              <Image
                src="/assets/dashboard-case-assets/preview-large.svg"
                alt="Medical Laboratory Report"
                width={800}
                height={1100}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>

        {/* Sidebar: Fixed/Sticky on Desktop - Stacked with spacing on Mobile */}
        <div className="lg:col-span-4 flex flex-col justify-between h-auto lg:h-[calc(100vh-140px)] w-full gap-10 lg:gap-0">
          {/* Action Button at top */}
          <div className="w-full flex justify-center lg:justify-end">
            <button
              onClick={handleBeginDiagnosticReview}
              className="bg-primary-blue text-white px-6 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-blue-700 transition-all shadow-[0px_4px_12px_rgba(21,101,192,0.2)] whitespace-nowrap"
            >
              Begin Diagnostic Review
            </button>
          </div>

          {/* Page Selectors at bottom - Re-applied Grid Fix */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-[340px] mx-auto lg:mx-0">
            {/* Page 1 */}
            <div className="flex flex-col items-center gap-2 md:gap-3 w-full">
              <div className="relative w-full aspect-[3/4] cursor-pointer hover:opacity-80 transition-all rounded-2xl overflow-hidden">
                <Image
                  src="/assets/dashboard-case-assets/PAGE 1.svg"
                  alt="Page 1"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-[#727783]">Page 1</span>
            </div>

            {/* Page 2 */}
            <div className="flex flex-col items-center gap-2 md:gap-3 w-full">
              <div className="relative w-full aspect-[3/4] cursor-pointer hover:opacity-80 transition-all rounded-2xl overflow-hidden">
                <Image
                  src="/assets/dashboard-case-assets/PAGE 2.svg"
                  alt="Page 2"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-[#727783]">Page 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
