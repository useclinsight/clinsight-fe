export interface AdminPlatformMetrics {
  totalDoctors: number;
  totalPatients: number;
  pendingVerifications: number;
  activeConsultationsToday: number;
  totalRevenue: number;
}

export interface DoctorVerificationItem {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  licenseNumber: string;
  specialty: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    name: string;
    url: string;
    type: string;
  }[];
  notes?: string;
}

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
  lastLoginAt?: string;
}
