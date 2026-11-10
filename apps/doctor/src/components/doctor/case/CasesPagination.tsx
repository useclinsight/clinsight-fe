import { getPaginationRange } from '@/lib/cases-utils';
import { cn } from '@/lib/utils';

import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function CasesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between gap-3 py-4 px-4 md:px-6 border-t border-[#F3F4F6]">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[#9CA3AF]">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                'min-w-9 h-9 rounded-lg text-sm font-semibold transition-colors',
                page === currentPage
                  ? 'bg-[#E8F0F9] text-primary-blue'
                  : 'text-[#6B7280] hover:bg-[#F9FAFB]',
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
      </button>
    </div>
  );
}
