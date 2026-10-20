'use client';

import CurrentCase from './CurrentCase';
import AvailableCases from './AvailableCases';
import Summary from './Summary';
import { Overview } from '@/services/doctor/service';

export default function OverviewDashboard({
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
  const currentStatus = overview?.verificationStatus ?? 'not_submitted';
  const isApproved = currentStatus === 'approved' || currentStatus === 'verified';

  const casesList = overview?.caseRequests ?? overview?.cases ?? [];
  const currentCaseData = overview?.currentCase ?? null;

  return (
    <div className="flex flex-col gap-6 pt-2.5 pb-10 px-1.5 md:px-2.5 max-w-7xl mx-auto w-full">
      {/* Summary Cards */}
      <Summary overview={overview} isLoading={isLoading} isError={isError} onRetry={onRetry} />

      {/* Current Case Section */}
      <CurrentCase currentCase={isApproved ? currentCaseData : null} />

      {/* Available Cases Section */}
      <AvailableCases cases={isApproved ? casesList : []} />
    </div>
  );
}
