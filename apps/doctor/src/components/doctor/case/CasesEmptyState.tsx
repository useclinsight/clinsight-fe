import Image from 'next/image';
import type { CasesEmptyStateType } from '@/lib/cases-utils';

const EMPTY_STATE_COPY: Record<
  CasesEmptyStateType,
  { title: string; description: string; showClearFilters?: boolean }
> = {
  none: {
    title: 'No Available Cases',
    description:
      "There are no cases in the queue right now. New patient cases will appear here once you're verified.",
  },
  search: {
    title: 'No matching cases found',
    description:
      "We couldn't find any cases matching your search. Try a different patient name, case ID, or keyword.",
  },
  filter: {
    title: 'No cases match your filters',
    description: 'Try adjusting or clearing your filters to see more assigned cases.',
    showClearFilters: true,
  },
};

export default function CasesEmptyState({
  type,
  onClearFilters,
}: {
  type: CasesEmptyStateType;
  onClearFilters?: () => void;
}) {
  const copy = EMPTY_STATE_COPY[type];

  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <Image
        src="/assets/dashboard/empty-illustration.png"
        alt="No Cases"
        width={56}
        height={56}
        className="w-14 h-14 object-contain mb-4"
      />
      <h4 className="font-bold text-base md:text-lg text-[#111827]">{copy.title}</h4>
      <p className="text-sm text-[#6B7280] max-w-md mx-auto mt-2">{copy.description}</p>
      {copy.showClearFilters && onClearFilters ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 bg-primary-blue text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1255A8] transition-colors"
        >
          Clear Filters
        </button>
      ) : null}
    </div>
  );
}
