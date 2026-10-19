'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FolderOpen, Search, SlidersHorizontal } from 'lucide-react';
import { Case } from '@/services/doctor';

const PAGE_SIZE = 10;

function PriorityBadge({ priority }: { priority?: string }) {
  if (!priority) return <span className="text-sm text-[#767676]">—</span>;
  const colors =
    priority.toLowerCase() === 'high'
      ? 'bg-[#FDE7E7] text-[#B42318]'
      : priority.toLowerCase() === 'low'
        ? 'bg-[#DFF7E8] text-[#16803C]'
        : 'bg-[#FFF0D9] text-[#986000]';
  return <span className={`rounded-full px-2 py-1 text-xs ${colors}`}>{priority}</span>;
}

function EmptyCases({
  filtered,
  query,
  onClear,
}: {
  filtered: boolean;
  query?: string;
  onClear?: () => void;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-5 text-center ${filtered ? 'min-h-[350px]' : 'min-h-[65vh]'}`}
    >
      <div
        className={`flex flex-col items-center bg-white ${filtered ? '' : 'max-w-[360px] rounded-2xl border border-[#F0F0F0] px-6 py-8'}`}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-[#ECF2FF] text-[#2866E6]">
          <FolderOpen size={29} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <h2 className="mt-3 text-base font-medium text-[#1B1B1B]">
          {filtered
            ? query
              ? 'No matching cases found'
              : 'No cases match your filters'
            : 'No Available Cases'}
        </h2>
        <p className="mt-1 max-w-[310px] text-sm leading-5 text-[#5E5E5E]">
          {filtered
            ? query
              ? "We couldn't find any cases matching your search. Try a different patient name, case ID, or keyword."
              : 'Try adjusting or clearing your filters to see more assigned cases.'
            : "There are no cases in the queue right now. New patient cases will appear here once you're verified."}
        </p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="mt-4 rounded-lg bg-primary-blue px-4 py-2 text-sm font-medium text-white"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default function CaseList({ cases }: { cases: Case[] }) {
  const [query, setQuery] = useState('');
  const [priority, setPriority] = useState('all');
  const [page, setPage] = useState(1);
  const filteredCases = useMemo(() => {
    const search = query.trim().toLowerCase();
    return cases.filter(
      (item) =>
        (!search ||
          [item.patientName, item.id, item.condition].some((value) =>
            value.toLowerCase().includes(search),
          )) &&
        (priority === 'all' || item.priority?.toLowerCase() === priority),
    );
  }, [cases, query, priority]);
  const pageCount = Math.max(1, Math.ceil(filteredCases.length / PAGE_SIZE));
  const visibleCases = filteredCases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const clearFilters = () => {
    setQuery('');
    setPriority('all');
    setPage(1);
  };

  if (cases.length === 0) return <EmptyCases filtered={false} />;

  return (
    <section className="min-h-[65vh] overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white">
      <div className="flex flex-col gap-4 border-b border-[#F0F0F0] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <h1 className="text-xl font-medium text-[#1B1B1B]">Cases</h1>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <label className="relative block sm:w-64 lg:w-[255px]">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]"
              aria-hidden="true"
            />
            <span className="sr-only">Search cases</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="h-11 w-full rounded-lg border border-[#ECECEC] bg-white pl-10 pr-3 text-sm text-[#1B1B1B] outline-none focus:border-primary-blue"
            />
          </label>
          <label className="relative">
            <SlidersHorizontal
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#444]"
              aria-hidden="true"
            />
            <span className="sr-only">Filter by priority</span>
            <select
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                setPage(1);
              }}
              className="h-11 w-full appearance-none rounded-lg border border-[#ECECEC] bg-white pl-9 pr-5 text-sm text-[#5E5E5E] outline-none focus:border-primary-blue sm:w-auto"
            >
              <option value="all">Filter</option>
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
          </label>
        </div>
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#FAFAFA] text-xs font-normal uppercase text-[#5E5E5E]">
            <tr>
              <th scope="col" className="px-5 py-4 font-normal">
                Patients
              </th>
              <th scope="col" className="px-5 py-4 font-normal">
                Time sent
              </th>
              <th scope="col" className="px-5 py-4 font-normal">
                Priority
              </th>
              <th scope="col" className="px-5 py-4 font-normal">
                Condition
              </th>
              <th scope="col" className="px-5 py-4 text-right font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleCases.map((item) => (
              <tr key={item.id} className="border-t border-[#F0F0F0] hover:bg-[#FAFAFA]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={item.avatar}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover"
                    />
                    <span className="text-[#1B1B1B]">{item.patientName}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#5E5E5E]">{item.timeAssigned}</td>
                <td className="px-5 py-3">
                  <PriorityBadge priority={item.priority} />
                </td>
                <td className="px-5 py-3 text-[#1B1B1B]">{item.condition}</td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/user/case/${item.id}`}
                    className="inline-flex rounded-lg border border-[#BFD7FF] px-3 py-1.5 text-xs font-medium text-primary-blue hover:bg-[#F0F7FF]"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-[#F0F0F0] md:hidden">
        {visibleCases.map((item) => (
          <article key={item.id} className="space-y-3 p-4">
            <div className="flex items-center gap-3">
              <Image
                src={item.avatar}
                alt=""
                width={36}
                height={36}
                className="size-9 rounded-full object-cover"
              />
              <div>
                <h2 className="text-sm font-medium text-[#1B1B1B]">{item.patientName}</h2>
                <p className="text-xs text-[#767676]">{item.timeAssigned}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#5E5E5E]">{item.condition}</span>
              <PriorityBadge priority={item.priority} />
            </div>
            <Link
              href={`/user/case/${item.id}`}
              className="inline-flex rounded-lg border border-[#BFD7FF] px-3 py-2 text-xs font-medium text-primary-blue"
            >
              View Case
            </Link>
          </article>
        ))}
      </div>
      {filteredCases.length === 0 && (
        <EmptyCases filtered query={query.trim()} onClear={clearFilters} />
      )}
      {filteredCases.length > 0 && (
        <nav
          aria-label="Case pages"
          className="flex items-center justify-between border-t border-[#F0F0F0] p-4 text-sm"
        >
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-[#ECECEC] px-3 py-2 text-[#5E5E5E] disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Prev
          </button>
          <span aria-live="polite" className="text-[#1B1B1B]">
            {page} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount, page + 1))}
            disabled={page === pageCount}
            className="inline-flex items-center gap-2 rounded-lg border border-[#ECECEC] px-3 py-2 text-[#5E5E5E] disabled:opacity-40"
          >
            Next <ArrowRight size={16} />
          </button>
        </nav>
      )}
    </section>
  );
}
