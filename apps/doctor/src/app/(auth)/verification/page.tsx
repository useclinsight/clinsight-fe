import { Metadata } from 'next';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationCircleIcon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata: Metadata = pageMetadata(
  'Verification — Clinsight',
  'Complete your verification to access personalized lab insights and doctor consultations.',
  '/verification',
);

const VERIFICATION_REQUIREMENTS = [
  'Specialization',
  'Years of Experience',
  'Current Practice Details',
  'Passport Photograph',
  'National Identification Number (NIN)',
  'Medical Degree Certificate',
  'MDCN Practising Licence',
];

export default function VerificationPage() {
  return (
    <div className="w-full flex flex-col justify-start items-start">
      {/* Title & Subtitle */}
      <h1 className="text-[32px] md:text-[36px] font-semibold text-[#1b1b1b] leading-[120%] tracking-tight">
        Verify Your Identity
      </h1>
      <p className="text-sm md:text-base text-[#5e5e5e] leading-[150%] mt-3">
        Complete your identity and license verification to provide medical opinions on Clinsight.
      </p>

      {/* Alert Banner */}
      <div className="w-full flex items-center gap-3 bg-[#FFF9F0] border border-[#FFE8CC]/40 px-4 py-3.5 rounded-xl mt-6">
        <HugeiconsIcon icon={InformationCircleIcon} className="w-5 h-5 text-[#D97706] shrink-0" />
        <span className="text-xs md:text-sm font-medium text-[#D97706]">
          Verification usually takes up to 14 days.
        </span>
      </div>

      {/* Requirements List */}
      <div className="w-full flex flex-col gap-4 mt-8">
        {VERIFICATION_REQUIREMENTS.map((requirement, index) => (
          <div key={index} className="flex items-center gap-3">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="w-5 h-5 text-[#979C9C]/80 shrink-0"
            />
            <span className="text-sm md:text-base font-medium text-[#494949]">{requirement}</span>
          </div>
        ))}
      </div>

      {/* Start Button */}
      <Link
        href="/verification/professional-info"
        className="w-full mt-8 py-3.5 bg-primary-blue hover:bg-blue-1 text-white font-semibold text-center rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-primary-blue/10 flex items-center justify-center text-sm md:text-base"
      >
        Start Verification
      </Link>
    </div>
  );
}
