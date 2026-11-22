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

export function buildDemoCaseList(seed: CaseListItem[], total = 50): CaseListItem[] {
  if (seed.length >= total) return seed.slice(0, total);

  const filler = seed[seed.length - 1] ?? {
    id: 'case_1',
    patientName: 'Chidinma Okeke',
    avatar: '/assets/dashboard/Chioma.png',
    timeSent: '10 mins ago',
    priority: 'Medium' as const,
    condition: 'Hormonal Imbalance',
  };

  const extra = Array.from({ length: total - seed.length }, (_, index) => ({
    ...filler,
    id: `case_${seed.length + index + 1}`,
  }));

  return [...seed, ...extra];
}

export function resolveCaseDetail(
  id: string,
  list: CaseListItem[],
  details: Record<string, CaseDetailData>,
): CaseDetailData | undefined {
  if (details[id]) return details[id];

  const listItem = list.find((item) => item.id === id);
  const template = details.case_1 ?? Object.values(details)[0];
  if (!listItem || !template) return undefined;

  return {
    ...template,
    id: listItem.id,
    patientName: listItem.patientName,
    avatar: listItem.avatar,
    receivedAt: listItem.timeSent,
    requestedReview: listItem.condition,
  };
}
