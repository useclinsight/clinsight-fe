'use client';

import React from 'react';
import { Overview, formatLargeNumber } from '@/services/doctor/service';
import {
  ArrowUpRight03Icon,
  Folder03Icon,
  Money01Icon,
  Task01Icon,
  TextCheckIcon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import { cn } from '@/lib/utils';

const MAX_CASE_SLOTS = 5;

type SummaryCardProps = {
  title: string;
  value: React.ReactNode;
  footer?: string;
  icon: IconSvgElement;
  iconBgClass: string;
  iconColor: string;
  badge?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  isMissing?: boolean;
};

function SummaryCardSkeleton({
  title,
  icon,
  iconBgClass,
  iconColor,
}: {
  title: string;
  icon: IconSvgElement;
  iconBgClass: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-xl border border-[#F0F0F0] bg-[#FFFFFE] p-4 lg:p-5 animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm text-secondary-3">{title}</span>
          <div
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-lg',
              iconBgClass,
            )}
          >
            <HugeiconsIcon icon={icon} size={20} color={iconColor} />
          </div>
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-100 rounded mt-1" />
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  footer,
  icon,
  iconBgClass,
  iconColor,
  badge,
  className,
  isLoading = false,
  isMissing = false,
}: SummaryCardProps) {
  if (isLoading) {
    return (
      <SummaryCardSkeleton
        title={title}
        icon={icon}
        iconBgClass={iconBgClass}
        iconColor={iconColor}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-[#F0F0F0] bg-[#FFFFFE] p-4 lg:p-5 transition-all',
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="text-sm text-secondary-3">{title}</span>
          <div
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-lg',
              iconBgClass,
            )}
          >
            <HugeiconsIcon icon={icon} size={20} color={iconColor} />
          </div>
        </div>

        <div className="text-[28px] font-semibold leading-none text-text-primary lg:text-[32px]">
          {isMissing ? <span className="text-gray-400 text-2xl">—</span> : value}
        </div>

        {(footer || badge) && (
          <div className="flex items-center justify-between gap-2">
            {footer ? <span className="text-xs text-text-disabled">{footer}</span> : <span />}
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Summary({
  overview,
  isLoading = false,
  isError = false,
  onRetry,
}: {
  overview: Overview | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}) {
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <HugeiconsIcon icon={AlertCircleIcon} size={24} color="currentColor" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Failed to load statistics</h4>
          <p className="text-xs text-gray-600 mt-1">
            We couldn&apos;t fetch your workload metrics. The rest of your dashboard remains active.
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-semibold bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Retry Loading
          </button>
        )}
      </div>
    );
  }

  const pendingReviewsRaw = overview?.summary?.newRequests;
  const acceptedCasesRaw = overview?.summary?.activeCases;
  const completedCasesRaw = overview?.summary?.completedCases;
  const earningsRaw = overview?.summary?.earnings;
  const earningsChange = overview?.summary?.earningsChange;

  const pendingReviews =
    typeof pendingReviewsRaw === 'number' ? formatLargeNumber(pendingReviewsRaw) : '0';

  const acceptedCases = typeof acceptedCasesRaw === 'number' ? acceptedCasesRaw : 0;

  const completedCases =
    typeof completedCasesRaw === 'number' ? formatLargeNumber(completedCasesRaw) : '0';

  const formattedEarnings =
    typeof earningsRaw === 'number'
      ? new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          maximumFractionDigits: 0,
        }).format(earningsRaw)
      : '₦0';

  const earningsBadge =
    earningsChange !== undefined && earningsChange !== null ? (
      <span className="inline-flex items-center gap-1 rounded-md bg-[#DEF6E7] px-2 py-0.5 text-xs font-medium text-[#147638]">
        <HugeiconsIcon icon={ArrowUpRight03Icon} size={12} color="currentColor" />
        {earningsChange}%
      </span>
    ) : null;

  const slotsUsed = typeof acceptedCases === 'number' ? acceptedCases : 0;

  return (
    <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Pending Reviews"
        value={pendingReviews}
        footer="Awaiting your review"
        icon={Task01Icon}
        iconBgClass="bg-[#FFF4D6]"
        iconColor="#B45309"
        isLoading={isLoading}
        isMissing={pendingReviewsRaw === undefined}
      />

      <SummaryCard
        title="Accepted Cases"
        value={
          typeof acceptedCases === 'number' ? (
            <>
              {formatLargeNumber(acceptedCases)}
              <span className="text-lg font-normal text-text-disabled"> /{MAX_CASE_SLOTS}</span>
            </>
          ) : (
            '0'
          )
        }
        footer={`${slotsUsed} of ${MAX_CASE_SLOTS} slots used`}
        icon={Folder03Icon}
        iconBgClass="bg-primary-subtle"
        iconColor="#1565C0"
        isLoading={isLoading}
        isMissing={acceptedCasesRaw === undefined}
      />

      <SummaryCard
        title="Completed Cases"
        value={completedCases}
        footer="Reviewed today"
        icon={TextCheckIcon}
        iconBgClass="bg-[#DEF6E7]"
        iconColor="#147638"
        isLoading={isLoading}
        isMissing={completedCasesRaw === undefined}
      />

      <SummaryCard
        title="Earnings"
        value={formattedEarnings}
        footer="This shift"
        badge={earningsBadge}
        icon={Money01Icon}
        iconBgClass="bg-[#F3E8FF]"
        iconColor="#9333EA"
        isLoading={isLoading}
        isMissing={earningsRaw === undefined}
      />
    </div>
  );
}
