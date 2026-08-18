'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Cancel01Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { dismissVerificationBanner } from '@/services/doctor/service';

export type VerificationStatus =
  | 'unsuccessful'
  | 'in_progress'
  | 'verified'
  | 'hidden'
  | 'not_submitted'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'error';

export default function VerificationBanner({
  status: initialStatus = 'unsuccessful',
  rejectionReason,
  onResubmit,
  onViewSubmission,
  isError = false,
  onRetry,
}: {
  status?: VerificationStatus;
  rejectionReason?: string | null;
  onResubmit?: () => void;
  onViewSubmission?: () => void;
  isError?: boolean;
  onRetry?: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || initialStatus === 'hidden' || initialStatus === 'approved' || initialStatus === 'verified') {
    // Approved state recedes into background or renders unobtrusively
    if (initialStatus === 'approved' || initialStatus === 'verified') {
      if (dismissed) return null;
      return (
        <div className="bg-[#E9FBF0] border border-[#CFEFDA] rounded-[16px] p-4 md:p-5 shadow-2xs transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
                <Image
                  src="/assets/dashboard/verification_verified.svg"
                  width={24}
                  height={24}
                  alt="Verification Verified"
                />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#111827]">
                  You&apos;re officially verified!
                </h4>
                <p className="text-sm text-[#4B5563] max-w-2xl mt-0.5 leading-relaxed">
                  Your credentials have been approved. You can now begin reviewing patients&apos;
                  laboratory results and going on duty.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Dismiss banner"
              onClick={async () => {
                setDismissed(true);
                await dismissVerificationBanner();
              }}
              className="text-[#10B981] hover:text-[#059669] p-1.5 rounded-lg hover:bg-[#D1FAE5]/60 transition-colors shrink-0 cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  // Error State: Never assume approved on failure; show scoped retry
  if (isError || initialStatus === 'error') {
    return (
      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-[16px] p-4 md:p-5 shadow-2xs transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-amber-800 font-bold text-xs">!</span>
            </div>
            <div>
              <h4 className="font-bold text-base text-[#92400E]">Unable to load verification status</h4>
              <p className="text-sm text-[#B45309] max-w-2xl mt-0.5 leading-relaxed">
                We couldn&apos;t verify your account verification status. Please check your network connection and try again.
              </p>
            </div>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-sm px-4 py-2 rounded-[8px] transition-colors cursor-pointer shrink-0"
            >
              <HugeiconsIcon icon={RefreshIcon} size={16} color="currentColor" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Rejected / Unsuccessful State
  if (initialStatus === 'unsuccessful' || initialStatus === 'rejected') {
    const displayReason =
      rejectionReason && rejectionReason.trim().length > 0
        ? rejectionReason
        : "We couldn't verify your medical license or credentials. Please re-upload clear, valid documentation to continue.";

    return (
      <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[16px] p-4 md:p-5 shadow-2xs transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
              <Image
                src="/assets/dashboard/verification_unsuccessful.svg"
                width={24}
                height={24}
                alt="Verification Unsuccessful"
              />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#111827]">Verification unsuccessful</h4>
              <p className="text-sm text-[#4B5563] max-w-2xl mt-0.5 leading-relaxed">
                {displayReason}
              </p>
            </div>
          </div>

          <div className="mt-1 md:mt-0 shrink-0 max-sm:w-max max-sm:ml-8">
            {onResubmit ? (
              <button
                type="button"
                onClick={onResubmit}
                className="w-full md:w-auto bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white font-semibold text-sm px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer text-center block"
              >
                Resubmit Credentials
              </button>
            ) : (
              <Link
                href="/auth/verification/credentials-verification"
                className="w-full md:w-auto bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white font-semibold text-sm px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer text-center block"
              >
                Resubmit Credentials
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pending / In Progress / Not Submitted State
  if (initialStatus === 'in_progress' || initialStatus === 'pending' || initialStatus === 'not_submitted') {
    const title = initialStatus === 'not_submitted' ? 'Verification required' : 'Verification under review';
    const description =
      initialStatus === 'not_submitted'
        ? 'Please submit your medical credentials to unlock availability settings and patient case reviews.'
        : "We're reviewing your credentials. This usually takes 24–48 hours. You'll be able to start reviewing cases as soon as you're approved.";

    const ctaText = initialStatus === 'not_submitted' ? 'Start Verification' : 'View Submission';

    return (
      <div className="bg-[#F5F5F5] border border-[#BBBBBB] rounded-[16px] p-4 md:p-5 shadow-2xs transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
              <Image
                src="/assets/dashboard/verification_in_progress.svg"
                width={24}
                height={24}
                alt="Verification In Progress"
              />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#111827]">{title}</h4>
              <p className="text-sm text-[#4B5563] max-w-2xl mt-0.5 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-1 md:mt-0 shrink-0 max-sm:w-max max-sm:ml-8">
            {onViewSubmission ? (
              <button
                type="button"
                onClick={onViewSubmission}
                className="w-full md:w-auto bg-primary-blue hover:bg-primary-blue/80 text-white font-semibold text-sm px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer text-center block"
              >
                {ctaText}
              </button>
            ) : (
              <Link
                href="/auth/verification/credentials-verification"
                className="w-full md:w-auto bg-primary-blue hover:bg-primary-blue/80 text-white font-semibold text-sm px-5 py-2.5 rounded-[8px] transition-colors cursor-pointer text-center block"
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
