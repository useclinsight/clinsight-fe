'use client';

import CurrentCase from './CurrentCase';
import AvailableCases from './AvailableCases';
import Summary from './Summary';
import { Overview, CaseRequest, Case } from '@/services/doctor/service';

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
  const firstItem = casesList[0] as (CaseRequest & Case) | undefined;

  const currentCaseData =
    overview?.currentCase ??
    (firstItem
      ? {
          id: firstItem.id,
          patientName: firstItem.patientName,
          avatar: firstItem.avatar,
          timeAssigned: firstItem.timeSent || firstItem.timeAssigned || '10 mins ago',
          priority: firstItem.priority || 'Medium',
          condition: firstItem.condition,
          subtext: 'Continue to review the laboratory report.',
        }
      : null);

  return (
    <div className="flex flex-col gap-6 pt-2.5 pb-10 px-2.5 max-w-7xl mx-auto w-full">
      {/* Summary Cards */}
      <Summary overview={overview} isLoading={isLoading} isError={isError} onRetry={onRetry} />

      {/* Dashboard Sections Gated by Verification Status */}
      {!isApproved ? (
        <div className="relative rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-6 md:p-10 text-center">
          <div className="max-w-md mx-auto flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-primary-blue flex items-center justify-center font-bold text-lg">
              🔒
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Dashboard Content Gated</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your account verification is currently{' '}
              <span className="font-semibold capitalize text-gray-800">
                {currentStatus.replace('_', ' ')}
              </span>
              . Once your medical credentials are approved, active case reviews and match requests
              will be unlocked.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Current Case Section */}
          <CurrentCase currentCase={currentCaseData} />

          {/* Available Cases Section */}
          <AvailableCases cases={casesList} badgeCount="10+" />
        </>
      )}
    </div>
  );
}
