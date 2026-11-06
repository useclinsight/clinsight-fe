'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { CurrentCaseItem } from '@/services/doctor';

export default function CurrentCase({ currentCase }: { currentCase?: CurrentCaseItem | null }) {
  if (!currentCase) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl md:rounded-[20px] p-5 md:p-6 shadow-2xs">
        <h3 className="text-base md:text-lg font-bold text-[#111827] mb-4">Current Case</h3>

        {/* Empty State */}
        <div>
          {/* Desktop Empty State */}
          <div className="hidden sm:flex items-center justify-between gap-6 py-2">
            <div className="flex items-center gap-6">
              <Image
                src="/assets/dashboard/empty-illustration.png"
                alt="No Current Case"
                width={56}
                height={56}
                className="w-14 h-14 object-cover"
              />
              <div>
                <h4 className="font-bold text-base md:text-lg text-[#111827]">No Current Case</h4>
                <p className="text-sm text-[#6B7280] max-w-md mt-0.5">
                  You don&apos;t have a case in review yet. Check your assigned cases below and pick
                  one to get started.
                </p>
              </div>
            </div>

            <button
              disabled
              className="bg-[#DBEAFE]/90 text-white font-medium text-sm px-5 py-2.5 rounded-xl cursor-not-allowed inline-flex items-center gap-2 shrink-0 select-none"
            >
              Continue Review
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
            </button>
          </div>

          {/* Mobile Empty State */}
          <div className="flex sm:hidden flex-col items-center text-center py-4">
            <Image
              src="/assets/dashboard/empty-illustration.png"
              alt="No Current Case"
              width={56}
              height={56}
              className="w-14 h-14 object-cover"
            />
            <h4 className="font-bold text-base text-[#111827]">No Current Case</h4>
            <p className="text-sm text-[#6B7280] max-w-xs mx-auto mt-1 mb-5">
              You don&apos;t have a case in review yet. Check your assigned cases below and pick one
              to get started.
            </p>
            <button
              disabled
              className="bg-[#DBEAFE]/90 text-white font-medium text-sm px-6 py-2.5 rounded-xl cursor-not-allowed inline-flex items-center justify-center gap-2 w-full max-w-xs select-none"
            >
              Continue Review
              <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl md:rounded-[20px] p-5 md:p-6 shadow-2xs">
      <h3 className="text-base md:text-lg font-bold text-[#111827] mb-4">Current Case</h3>

      {/* Active State */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center pb-4 border-b border-[#F3F4F6]">
          {/* Patient Name */}
          <div className="flex items-center gap-3">
            <Image
              src={currentCase.avatar || '/assets/dashboard/Chioma.png'}
              alt={currentCase.patientName}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover border border-gray-100"
            />
            <span className="font-semibold text-[#111827] text-base">
              {currentCase.patientName}
            </span>
          </div>

          {/* Assigned */}
          <div>
            <span className="text-xs text-[#6B7280] block mb-1">Assigned</span>
            <span className="font-semibold text-sm text-[#111827]">{currentCase.timeAssigned}</span>
          </div>

          {/* Priority */}
          <div>
            <span className="text-xs text-[#6B7280] block mb-1">Priority</span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                currentCase.priority === 'High'
                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                  : currentCase.priority === 'Low'
                    ? 'bg-[#DCFCE7] text-[#16A34A]'
                    : 'bg-[#FEF3C7] text-[#D97706]'
              }`}
            >
              {currentCase.priority || 'Medium'}
            </span>
          </div>

          {/* Condition */}
          <div>
            <span className="text-xs text-[#6B7280] block mb-1">Condition</span>
            <span className="font-semibold text-sm text-[#111827]">{currentCase.condition}</span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-sm text-[#6B7280]">
            {currentCase.subtext || 'Continue to review the laboratory report.'}
          </p>
          <Link
            href={`/user/case/${currentCase.id}`}
            className="bg-primary-blue hover:bg-primary-blue/90 text-white font-medium text-sm px-6 py-2.5 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            Continue Review
            <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
