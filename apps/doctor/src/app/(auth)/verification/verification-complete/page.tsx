'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { HourglassIcon, Loading03Icon } from '@hugeicons/core-free-icons';
import { getVerificationStatus } from '@/lib/auth';

interface VerificationRecord {
  id: string;
  created_at: string;
  [key: string]: unknown;
}

export default function VerificationCompletePage() {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<VerificationRecord | null>(null);

  useEffect(() => {
    let active = true;
    async function loadData() {
      const data = await getVerificationStatus();
      if (active) {
        setRecord(data);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center py-16 select-none"
        role="status"
        aria-label="Loading verification details…"
      >
        <HugeiconsIcon
          icon={Loading03Icon}
          className="h-10 w-10 animate-spin text-primary-blue"
          size={40}
        />
        <p className="text-sm text-[#5E5E5E] font-medium mt-4">Loading application details…</p>
      </div>
    );
  }

  const submissionDate = record ? new Date(record.created_at) : new Date();
  const dateStr = submissionDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = submissionDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const formattedDate = `${dateStr} at ${timeStr}`;
  const referenceId = record ? record.id : 'CLN-DRV-2026-000245';
  // const referenceId = record ? record.id : 'N/A';

  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      <div className="w-full bg-white border border-[#EBEBEB] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col items-center">
        {/* Blue Hourglass Icon with flip animation (no bg or border) */}
        <div className="mb-3 flex items-center justify-center">
          <div className="animate-hourglass flex items-center justify-center">
            <HugeiconsIcon icon={HourglassIcon} size={44} className="text-primary-blue" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl md:text-[28px] font-bold text-center text-text-primary leading-[130%] tracking-tight">
          Your application is under review
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-secondary-3 text-center leading-[150%] mt-2 max-w-120">
          We have received your application, and our team is reviewing your documents. You&apos;ll
          receive an email with an update once the review is complete or if we need any additional
          information.
        </p>

        {/* Details Table */}
        <div className="w-full flex flex-col gap-3 border-t border-slate-100 pt-4 mt-4">
          <div className="flex justify-between items-center text-sm md:text-base">
            <span className="text-secondary-3 font-medium">Reference ID</span>
            <span className="text-text-primary font-semibold font-mono text-[13px] md:text-sm text-right break-all">
              {referenceId}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm md:text-base">
            <span className="text-secondary-3 font-medium">Submitted On</span>
            <span
              className="text-text-primary font-semibold text-[13px] md:text-sm text-right"
              suppressHydrationWarning
            >
              {formattedDate}
            </span>
          </div>
          <div className="flex justify-between items-start text-sm md:text-base">
            <span className="text-secondary-3 font-medium shrink-0">What happens next?</span>
            <div className="text-text-primary font-semibold text-left text-[13px] md:text-sm leading-normal flex flex-col items-start">
              <span>We will review your application</span>
              <span>within 2 weeks.</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/user"
          className="w-full mt-5 py-3.5 bg-primary-blue hover:bg-blue-1 text-white font-semibold text-center rounded-xl transition-all duration-200 cursor-pointer shadow-sm shadow-primary-blue/10 flex items-center justify-center text-sm md:text-base"
        >
          Continue to Dashboard
        </Link>
      </div>
    </div>
  );
}
