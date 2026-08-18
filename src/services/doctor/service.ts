import overviewMock from '@/mocks/doctor/overview.json';

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
    const res = await fetch('/api/doctors/verification/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json.data || json || {};
    return {
      status: data.status ?? 'not_submitted',
      rejectionReason: data.rejection_reason ?? data.rejectionReason ?? null,
      licenseNumber: data.license_number,
      specialty: data.specialty,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    console.error('Failed to fetch verification status:', error);
    return null;
  }
}

export async function fetchDoctorStatistics(): Promise<DoctorStatistics | null> {
  try {
    const res = await fetch('/api/doctors/dashboard/statistics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json.data || {};
    return {
      pendingReviews: data.pending_reviews ?? 0,
      acceptedCases: data.accepted_cases ?? 0,
      completedCases: data.completed_cases ?? 0,
      earnings: data.earnings ?? 0,
      totalCases: data.total_cases ?? 0,
    };
  } catch (error) {
    console.error('Failed to fetch doctor statistics:', error);
    return null;
  }
}

export async function getAvailability(): Promise<DoctorDutyStatus | null> {
  try {
    const res = await fetch('/api/doctors/availability', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = json.data || {};
    return {
      isOnDuty: data.on_duty ?? data.is_on_duty ?? false,
      onDutySince: data.on_duty_since ?? null,
      onDutyExpiresAt: data.on_duty_expires_at ?? null,
      remainingDutySeconds: data.remaining_duty_seconds ?? 0,
    };
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return null;
  }
}

export async function updateDutyStatus(
  isOnDuty: boolean,
): Promise<DoctorDutyStatus | { error: string }> {
  try {
    const res = await fetch('/api/doctors/availability', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ on_duty: isOnDuty }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { error: json.detail || json.message || 'Error updating availability status.' };
    }
    const data = json.data || {};
    return {
      isOnDuty: data.on_duty ?? data.is_on_duty ?? false,
      onDutySince: data.on_duty_since ?? null,
      onDutyExpiresAt: data.on_duty_expires_at ?? null,
      remainingDutySeconds: data.remaining_duty_seconds ?? 0,
    };
  } catch (error) {
    console.error('Failed to update duty status:', error);
    return { error: 'Network error updating duty status.' };
  }
}

export async function dismissVerificationBanner(): Promise<boolean> {
  try {
    const res = await fetch('/api/doctors/verification/dismiss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.ok;
  } catch (error) {
    console.error('Failed to dismiss verification banner:', error);
    return false;
  }
}

export async function getOverview(): Promise<Overview> {
  const {
    caseRequests = [],
    cases = [],
    summary: baseSummary = { earnings: 0, earningsChange: 0 },
  } = overviewMock as Overview;

  const realStats = await fetchDoctorStatistics();
  const verif = await fetchVerificationStatus();

  const newRequests = realStats ? realStats.pendingReviews : caseRequests.length;
  const activeCases = realStats
    ? realStats.acceptedCases
    : cases.filter((c: Case) => c.status === 'Pending').length;
  const completedCases = realStats
    ? realStats.completedCases
    : cases.filter((c: Case) => c.status === 'Completed').length;
  const earnings = realStats ? realStats.earnings : baseSummary.earnings;

  const computed: Overview = {
    ...overviewMock,
    verificationStatus: verif?.status ?? 'not_submitted',
    rejectionReason: verif?.rejectionReason ?? null,
    showVerificationBanner: verif?.status !== 'approved',
    summary: {
      newRequests,
      activeCases,
      completedCases,
      earnings,
      earningsChange: baseSummary.earningsChange,
    },
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
