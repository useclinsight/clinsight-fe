import overviewMock from '@/mocks/doctor/overview.json';
import { apiClient, ApiError } from '@/lib/api-client';

export interface CaseRequest {
  id: string;
  patientName: string;
  avatar: string;
  timeSent: string;
  priority: string;
  condition: string;
}

export interface CurrentCaseItem {
  id: string;
  patientName: string;
  avatar: string;
  timeAssigned: string;
  priority: string;
  condition: string;
  subtext?: string;
}

export interface Case {
  id: string;
  patientName: string;
  avatar: string;
  timeAssigned: string;
  status: string;
  priority?: string;
  condition: string;
}

export interface DoctorStatistics {
  pendingReviews: number;
  acceptedCases: number;
  completedCases: number;
  earnings: number;
  totalCases?: number;
}

export interface DoctorDutyStatus {
  isOnDuty: boolean;
  onDutySince: string | null;
  onDutyExpiresAt: string | null;
  remainingDutySeconds: number;
}

export interface VerificationStatusResponse {
  status:
    | 'not_submitted'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'in_progress'
    | 'unsuccessful'
    | 'verified';
  rejectionReason?: string | null;
  licenseNumber?: string;
  specialty?: string;
  updatedAt?: string;
}

export interface Overview {
  summary: {
    newRequests: number;
    activeCases: number;
    completedCases: number;
    earnings: number;
    earningsChange?: number;
  };
  currentCase?: CurrentCaseItem | null;
  caseRequests: CaseRequest[];
  cases: Case[];
  dutyStatus?: DoctorDutyStatus;
  showVerificationBanner?: boolean;
  isVerificationDismissed?: boolean;
  verificationStatus?: string;
  rejectionReason?: string | null;
}

export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return value.toLocaleString();
}

export async function fetchVerificationStatus(): Promise<VerificationStatusResponse | null> {
  try {
    const json = await apiClient.get<Record<string, unknown>>('/api/doctors/verification/status');
    const data = (json?.data || json || {}) as Record<string, unknown>;
    return {
      status: (data.status as VerificationStatusResponse['status']) ?? 'not_submitted',
      rejectionReason: (data.rejection_reason ?? data.rejectionReason ?? null) as string | null,
      licenseNumber: data.license_number as string | undefined,
      specialty: data.specialty as string | undefined,
      updatedAt: data.updated_at as string | undefined,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      console.warn(
        `[Verification Status] Backend API returned HTTP ${error.status}: ${error.message}`,
      );
    } else {
      console.error('Failed to fetch verification status:', error);
    }
    return null;
  }
}

export async function fetchDoctorStatistics(): Promise<DoctorStatistics | null> {
  try {
    const json = await apiClient.get<Record<string, unknown>>('/api/doctors/dashboard/statistics');
    const data = (json?.data || {}) as Record<string, unknown>;
    return {
      pendingReviews: (data.pending_reviews as number) ?? 0,
      acceptedCases: (data.accepted_cases as number) ?? 0,
      completedCases: (data.completed_cases as number) ?? 0,
      earnings: (data.earnings as number) ?? 0,
      totalCases: (data.total_cases as number) ?? 0,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      console.warn(
        `[Doctor Statistics] Backend API returned HTTP ${error.status}: ${error.message}`,
      );
    } else {
      console.error('Failed to fetch doctor statistics:', error);
    }
    return null;
  }
}

export async function getAvailability(): Promise<DoctorDutyStatus | null> {
  try {
    const json = await apiClient.get<Record<string, unknown>>('/api/doctors/availability');
    const data = (json?.data || {}) as Record<string, unknown>;
    return {
      isOnDuty: (data.on_duty ?? data.is_on_duty ?? false) as boolean,
      onDutySince: (data.on_duty_since ?? null) as string | null,
      onDutyExpiresAt: (data.on_duty_expires_at ?? null) as string | null,
      remainingDutySeconds: (data.remaining_duty_seconds ?? 0) as number,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      console.warn(
        `[Doctor Availability] Backend API returned HTTP ${error.status}: ${error.message}`,
      );
    } else {
      console.error('Failed to fetch availability:', error);
    }
    return null;
  }
}

export async function updateDutyStatus(
  isOnDuty: boolean,
): Promise<DoctorDutyStatus | { error: string }> {
  try {
    const json = await apiClient.patch<Record<string, unknown>>('/api/doctors/availability', {
      on_duty: isOnDuty,
    });
    const data = (json?.data || {}) as Record<string, unknown>;
    return {
      isOnDuty: (data.on_duty ?? data.is_on_duty ?? false) as boolean,
      onDutySince: (data.on_duty_since ?? null) as string | null,
      onDutyExpiresAt: (data.on_duty_expires_at ?? null) as string | null,
      remainingDutySeconds: (data.remaining_duty_seconds ?? 0) as number,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message || 'Error updating availability status.' };
    }
    console.error('Failed to update duty status:', error);
    return { error: 'Network error updating duty status.' };
  }
}

export async function dismissVerificationBanner(): Promise<boolean> {
  try {
    await apiClient.post('/api/doctors/verification/dismiss');
    return true;
  } catch (error) {
    console.error('Failed to dismiss verification banner:', error);
    return false;
  }
}

export async function getOverview(): Promise<Overview> {
  const realStats = await fetchDoctorStatistics();
  const verif = await fetchVerificationStatus();

  const isVerified = verif?.status === 'approved' || verif?.status === 'verified';

  let newRequests = 0;
  let activeCases = 0;
  let completedCases = 0;
  let earnings = 0;

  if (isVerified && realStats) {
    newRequests = realStats.pendingReviews ?? 0;
    activeCases = realStats.acceptedCases ?? 0;
    completedCases = realStats.completedCases ?? 0;
    earnings = realStats.earnings ?? 0;
  }

  const computed: Overview = {
    ...overviewMock,
    verificationStatus: verif?.status ?? 'not_submitted',
    rejectionReason: verif?.rejectionReason ?? null,
    showVerificationBanner: !isVerified,
    summary: {
      newRequests,
      activeCases,
      completedCases,
      earnings,
      earningsChange: isVerified ? (overviewMock.summary.earningsChange ?? 0) : undefined,
    },
    currentCase: null,
    caseRequests: [],
    cases: [],
  };

  return computed;
}

export function getActiveCases(): Promise<Case[]> {
  const { cases = [] } = overviewMock as Overview;
  const active = cases.filter((c: Case) => c.status === 'Pending');
  return new Promise((resolve) => setTimeout(() => resolve(active), 10));
}

export function getCompletedCases(): Promise<Case[]> {
  const { cases = [] } = overviewMock as Overview;
  const completed = cases.filter((c: Case) => c.status === 'Completed');
  return new Promise((resolve) => setTimeout(() => resolve(completed), 10));
}

export function getCaseRequests(): Promise<CaseRequest[]> {
  const { caseRequests = [] } = overviewMock as Overview;
  return new Promise((resolve) => setTimeout(() => resolve(caseRequests), 10));
}

export function getCaseById(id: string): Promise<Case | undefined> {
  const { cases = [] } = overviewMock as Overview;
  const found = cases.find((c: Case) => c.id === id);
  return new Promise((resolve) => setTimeout(() => resolve(found), 10));
}
