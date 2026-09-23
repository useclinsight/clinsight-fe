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
