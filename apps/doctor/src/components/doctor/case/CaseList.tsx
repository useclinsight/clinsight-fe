'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FilterHorizontalIcon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import CasesEmptyState from './CasesEmptyState';
import CasesFilterPanel from './CasesFilterPanel';
import CasesPagination from './CasesPagination';
import PriorityBadge from './PriorityBadge';
import {
  CASES_PAGE_SIZE,
  clampPage,
  DEFAULT_CASE_FILTERS,
  getFilteredCases,
  getTotalPages,
  hasActiveFilters,
  paginateCases,
  resolveEmptyState,
  type CaseFilters,
  type CaseListItem,
} from '@/lib/cases-utils';
import { cn } from '@/lib/utils';

export default function CaseList({ cases }: { cases: CaseListItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CaseFilters>(DEFAULT_CASE_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredCases = useMemo(
    () => getFilteredCases(cases, searchQuery, filters),
    [cases, searchQuery, filters],
  );

  const totalPages = getTotalPages(filteredCases.length, CASES_PAGE_SIZE);
  const safePage = clampPage(currentPage, totalPages);
  const paginatedCases = paginateCases(filteredCases, safePage, CASES_PAGE_SIZE);

  const emptyState = resolveEmptyState({
    totalCases: cases.length,
    filteredCount: filteredCases.length,
    searchQuery,
    filters,
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFiltersApply = (nextFilters: CaseFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_CASE_FILTERS);
    setCurrentPage(1);
  };

  const filtersActive = hasActiveFilters(filters);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl md:rounded-[20px] shadow-2xs overflow-hidden flex flex-col min-h-[720px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6">
        <h3 className="text-base md:text-lg font-bold text-[#111827]">Cases</h3>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFilterOpen((open) => !open)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors whitespace-nowrap',
                isFilterOpen || filtersActive
                  ? 'border-primary-blue text-primary-blue bg-[#F0F7FF]'
                  : 'border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]',
              )}
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} size={18} className="shrink-0" />
              Filter
            </button>
            <CasesFilterPanel
              filters={filters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={handleFiltersApply}
              onClear={handleClearFilters}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col flex-1 overflow-x-auto min-h-[580px]">
        <table className="w-full text-left border-collapse table-fixed min-w-[720px]">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[18%]" />
            <col className="w-[16%]" />
            <col className="w-[24%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-y border-[#F3F4F6] text-[11px] font-bold tracking-wider text-[#6B7280] uppercase">
              <th className="py-3.5 px-5 md:px-6 w-[30%]">Patients</th>
              <th className="py-3.5 px-5 md:px-6 w-[18%]">Time Sent</th>
              <th className="py-3.5 px-5 md:px-6 w-[16%]">Priority</th>
              <th className="py-3.5 px-5 md:px-6 w-[24%]">Condition</th>
              <th className="py-3.5 px-5 md:px-6 w-[12%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {emptyState !== null ? (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <CasesEmptyState type={emptyState} onClearFilters={handleClearFilters} />
                </td>
              </tr>
            ) : (
              paginatedCases.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-4 px-5 md:px-6 truncate">
                    <div className="flex items-center gap-3">
                      <Image
                        src={item.avatar || '/assets/dashboard/Chioma.png'}
                        alt={item.patientName}
                        width={38}
                        height={38}
                        className="w-9.5 h-9.5 rounded-full object-cover border border-gray-100 shrink-0"
                      />
                      <span className="font-semibold text-sm text-[#111827] truncate">
                        {item.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 md:px-6 text-sm text-[#6B7280]">{item.timeSent}</td>
                  <td className="py-4 px-5 md:px-6">
                    <PriorityBadge priority={item.priority} />
                  </td>
                  <td className="py-4 px-5 md:px-6 text-sm font-semibold text-[#111827] truncate">
                    {item.condition}
                  </td>
                  <td className="py-4 px-5 md:px-6 text-right">
                    <Link
                      href={`/user/case/${item.id}`}
                      className="inline-flex items-center justify-center border border-[#DBEAFE] text-primary-blue hover:bg-[#F0F7FF] active:bg-[#E0EEFE] px-4 py-1.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden px-4 pb-4 flex flex-col gap-3 flex-1 min-h-[420px]">
        {emptyState !== null ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <CasesEmptyState type={emptyState} onClearFilters={handleClearFilters} />
          </div>
        ) : (
          paginatedCases.map((item) => (
            <div
              key={item.id}
              className="border border-[#E5E7EB] rounded-2xl p-4 bg-white shadow-2xs flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={item.avatar || '/assets/dashboard/Chioma.png'}
                    alt={item.patientName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#111827]">{item.patientName}</h4>
                    <span className="text-xs text-[#6B7280]">Sent {item.timeSent}</span>
                  </div>
                </div>
                <PriorityBadge priority={item.priority} isMobile />
              </div>
              <div className="border-t border-[#F3F4F6]" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#6B7280] block">Condition</span>
                  <span className="font-bold text-sm text-[#111827]">{item.condition}</span>
                </div>
                <Link
                  href={`/user/case/${item.id}`}
                  className="inline-flex items-center justify-center border border-[#DBEAFE] text-primary-blue hover:bg-[#F0F7FF] px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {emptyState === null ? (
        <div className="mt-auto">
          <CasesPagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : null}
    </div>
  );
}
