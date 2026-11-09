import type { DoctorCasePreviewItem, MedicalCaseDetailResponse } from '@/services/doctor/service';

export type CasePriority = 'High' | 'Medium' | 'Low';

export type CasesEmptyStateType = 'none' | 'search' | 'filter';

export type CaseDetailTab = 'lab-report' | 'ai-summary' | 'patient-notes';

export interface CaseListItem {
  id: string;
  patientName: string;
  avatar: string;
  timeSent: string;
  priority: CasePriority;
  condition: string;
}

export interface CaseFilters {
  priority: CasePriority | 'All';
  condition: string;
}

export interface AiInterpretationSection {
  summary: string;
  keyFindings: string[];
  recommendationsIntro: string;
  recommendations: string[];
}

export interface LabReportMetric {
  name: string;
  result: string;
  referenceRange?: string;
  interpretation: 'Low' | 'Normal' | 'High';
}

export interface LabReportSection {
  title: string;
  columns: ('reference' | 'interpretation')[];
  metrics: LabReportMetric[];
}

export interface CaseDetailData {
  id: string;
  requestId: string;
  patientName: string;
  avatar: string;
  receivedAt: string;
  submittedAt: string;
  age: number;
  gender: string;
  location: string;
  requestedReview: string;
  patientNote: string;
  aiInterpretation: AiInterpretationSection;
  labReport: {
    hospital: string;
    patientId: string;
    ageSex: string;
    dateOfTest: string;
    referringPhysician: string;
    clinicalIndications: string;
    sections: LabReportSection[];
  };
}

export const CASES_PAGE_SIZE = 10;

export const DEFAULT_CASE_FILTERS: CaseFilters = {
  priority: 'All',
  condition: '',
};

export const CASE_DETAIL_TABS: { id: CaseDetailTab; label: string }[] = [
  { id: 'lab-report', label: 'Lab Report' },
  { id: 'ai-summary', label: 'AI Interpretation Summary' },
  { id: 'patient-notes', label: 'Patient Notes' },
];

export function searchCases(cases: CaseListItem[], query: string): CaseListItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return cases;

  return cases.filter((item) => {
    const haystack = [item.patientName, item.condition, item.id, item.priority]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function filterCases(cases: CaseListItem[], filters: CaseFilters): CaseListItem[] {
  return cases.filter((item) => {
    const matchesPriority = filters.priority === 'All' || item.priority === filters.priority;
    const matchesCondition =
      !filters.condition.trim() ||
      item.condition.toLowerCase().includes(filters.condition.trim().toLowerCase());

    return matchesPriority && matchesCondition;
  });
}

export function getFilteredCases(
  cases: CaseListItem[],
  searchQuery: string,
  filters: CaseFilters,
): CaseListItem[] {
  return filterCases(searchCases(cases, searchQuery), filters);
}

export function paginateCases<T>(items: T[], page: number, pageSize = CASES_PAGE_SIZE): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getTotalPages(totalItems: number, pageSize = CASES_PAGE_SIZE): number {
  if (totalItems <= 0) return 1;
  return Math.ceil(totalItems / pageSize);
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, 2, totalPages - 1, totalPages]);

  if (currentPage <= 3) {
    pages.add(3);
  } else if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 2);
  } else {
    pages.add(currentPage - 1);
    pages.add(currentPage);
    pages.add(currentPage + 1);
  }

  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
  const range: Array<number | 'ellipsis'> = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) {
      range.push('ellipsis');
    }
    range.push(page);
  });

  return range;
}

export function hasActiveFilters(filters: CaseFilters): boolean {
  return filters.priority !== 'All' || filters.condition.trim().length > 0;
}

export function resolveEmptyState({
  totalCases,
  filteredCount,
  searchQuery,
  filters,
}: {
  totalCases: number;
  filteredCount: number;
  searchQuery: string;
  filters: CaseFilters;
}): CasesEmptyStateType | null {
  if (filteredCount > 0) return null;
  if (totalCases === 0) return 'none';
  if (searchQuery.trim()) return 'search';
  if (hasActiveFilters(filters)) return 'filter';
  return 'none';
}

export function getPriorityBadgeClasses(priority: CasePriority | string): string {
  switch (priority) {
    case 'High':
      return 'bg-[#FEE2E2] text-[#DC2626]';
    case 'Low':
      return 'bg-[#DCFCE7] text-[#16A34A]';
    default:
      return 'bg-[#FEF3C7] text-[#D97706]';
  }
}

export function getInterpretationClasses(status: LabReportMetric['interpretation']): string {
  switch (status) {
    case 'Low':
      return 'text-[#DC2626]';
    case 'High':
      return 'text-[#DC2626]';
    default:
      return 'text-[#16A34A]';
  }
}

export function clampPage(page: number, totalPages: number): number {
  return Math.min(Math.max(1, page), Math.max(1, totalPages));
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export function mapApiCaseToListItem(item: DoctorCasePreviewItem): CaseListItem {
  return {
    id: String(item.case_id),
    patientName: item.patient_name || 'Patient',
    avatar: item.patient_avatar_url || '/assets/dashboard/Chioma.png',
    timeSent: formatRelativeTime(item.received_at),
    priority: 'Medium',
    condition: item.requested_review || 'General Medical Case',
  };
}

export function mapApiDetailToCaseData(detail: MedicalCaseDetailResponse): CaseDetailData {
  const { case: medicalCase, lab_results = [], interpretation, chats = [] } = detail;

  const firstPatientChat = chats.find((c) => c.sender === 'user' || c.sender === 'patient');
  const patientNote = firstPatientChat?.message || 'No additional patient notes provided.';

  const aiInterp: AiInterpretationSection = {
    summary:
      interpretation?.summary ||
      'AI interpretation preliminary review is in progress or awaiting clinician verification.',
    keyFindings: interpretation?.value_breakdown?.map(
      (vb) =>
        `${vb.metric}: ${vb.value}${vb.unit ? ` ${vb.unit}` : ''} (${vb.status || 'Reviewed'})`,
    ) || [
      'Comprehensive biochemical assessment completed.',
      'Metabolic and hormonal indicators reviewed.',
    ],
    recommendationsIntro: 'Based on automated preliminary screening and AI analysis:',
    recommendations: interpretation?.suggested_questions || [
      'Conduct complete clinical history review with patient.',
      'Correlate laboratory findings with patient-reported symptoms.',
      'Recommend confirmatory diagnostic review if symptoms persist.',
    ],
  };

  const labSections: LabReportSection[] = lab_results.map((lr, idx) => {
    const extracted = lr.extracted_values as Record<string, unknown> | null;
    const testMetrics: LabReportMetric[] = [];

    if (extracted && typeof extracted === 'object') {
      Object.entries(extracted).forEach(([key, val]) => {
        if (typeof val === 'object' && val !== null) {
          const v = val as Record<string, unknown>;
          const rawInterp = String(v.interpretation || '');
          const interp: LabReportMetric['interpretation'] =
            rawInterp === 'High' || rawInterp === 'Low' ? rawInterp : 'Normal';

          testMetrics.push({
            name: key,
            result: String(v.result ?? v.value ?? 'Recorded'),
            referenceRange: (v.reference_range ?? v.range) as string | undefined,
            interpretation: interp,
          });
        } else {
          testMetrics.push({
            name: key,
            result: String(val),
            referenceRange: '—',
            interpretation: 'Normal',
          });
        }
      });
    }

    if (testMetrics.length === 0) {
      testMetrics.push({
        name: lr.file?.name || `Lab Document #${idx + 1}`,
        result: lr.ocr_status === 'completed' ? 'Processed' : 'Uploaded (Pending Review)',
        referenceRange: 'Standard',
        interpretation: 'Normal',
      });
    }

    return {
      title: lr.file?.name ? `Lab Results: ${lr.file.name}` : `Laboratory Evaluation #${idx + 1}`,
      columns: ['reference', 'interpretation'],
      metrics: testMetrics,
    };
  });

  return {
    id: String(medicalCase.id),
    requestId: String(medicalCase.id).slice(0, 8).toUpperCase(),
    patientName: 'Patient Record',
    avatar: '/assets/dashboard/Chioma.png',
    receivedAt: formatRelativeTime(medicalCase.created_at),
    submittedAt: formatRelativeTime(medicalCase.created_at),
    age: 32,
    gender: 'Female',
    location: 'Lagos, Nigeria',
    requestedReview: medicalCase.title || 'Laboratory & Clinical Review',
    patientNote,
    aiInterpretation: aiInterp,
    labReport: {
      hospital: 'Clinical Support Partner Laboratory',
      patientId: `PT-${String(medicalCase.id).slice(0, 6).toUpperCase()}`,
      ageSex: '32 / F',
      dateOfTest: formatRelativeTime(medicalCase.created_at),
      referringPhysician: 'Attending Physician',
      clinicalIndications: medicalCase.title || 'Diagnostic Evaluation',
      sections:
        labSections.length > 0
          ? labSections
          : [
              {
                title: 'Laboratory Summary',
                columns: ['reference', 'interpretation'],
                metrics: [
                  {
                    name: 'General Lab Screen',
                    result: 'Awaiting laboratory document processing',
                    referenceRange: 'Standard',
                    interpretation: 'Normal',
                  },
                ],
              },
            ],
    },
  };
}
