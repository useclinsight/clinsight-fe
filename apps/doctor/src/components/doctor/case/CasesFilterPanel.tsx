'use client';

import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { DEFAULT_CASE_FILTERS, type CaseFilters, type CasePriority } from '@/lib/cases-utils';

const PRIORITY_OPTIONS: Array<CasePriority | 'All'> = ['All', 'High', 'Medium', 'Low'];

export default function CasesFilterPanel({
  filters,
  isOpen,
  onClose,
  onApply,
  onClear,
}: {
  filters: CaseFilters;
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: CaseFilters) => void;
  onClear: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close filter panel"
        className="fixed inset-0 z-40 bg-slate-950/20"
        onClick={onClose}
      />
      <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-[#111827]">Filter Cases</h4>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
              Priority
            </span>
            <select
              value={filters.priority}
              onChange={(event) =>
                onApply({ ...filters, priority: event.target.value as CaseFilters['priority'] })
              }
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? 'All priorities' : option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
              Condition
            </span>
            <input
              type="text"
              value={filters.condition}
              placeholder="e.g. Hormonal Imbalance"
              onChange={(event) => onApply({ ...filters, condition: event.target.value })}
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#F3F4F6]">
          <button
            type="button"
            onClick={() => {
              onApply(DEFAULT_CASE_FILTERS);
              onClear();
            }}
            className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-primary-blue text-white text-sm font-semibold hover:bg-[#1255A8] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}
