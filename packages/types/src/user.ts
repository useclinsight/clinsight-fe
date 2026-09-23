export interface PatientConsultation {
  id: string;
  doctorName: string;
  doctorAvatar?: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'in_progress';
  summary?: string;
  notes?: string;
}

export interface PatientRecord {
  id: string;
  title: string;
  type: 'prescription' | 'lab_report' | 'diagnosis' | 'referral';
  doctorName: string;
  issuedAt: string;
  fileUrl?: string;
  description?: string;
}

export interface PatientMetrics {
  upcomingAppointments: number;
  activePrescriptions: number;
  completedConsultations: number;
  unreadMessages: number;
}
