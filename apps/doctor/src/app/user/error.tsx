'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

export default function DoctorDashboardError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <div
      role="alert"
      className="mx-auto flex min-h-[55vh] w-full max-w-7xl items-center justify-center px-4"
    >
      <div className="flex max-w-md flex-col items-center rounded-2xl border border-[#F0F0F0] bg-white p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-[#FFF1F1] text-[#D53939]">
          <AlertCircle size={25} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-[#1B1B1B]">This page couldn&apos;t load</h1>
        <p className="mt-1 text-sm leading-5 text-[#5E5E5E]">
          Please try again to reload your doctor workspace.
        </p>
        <button
          type="button"
          onClick={unstable_retry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-blue px-4 py-2 text-sm font-medium text-white hover:bg-primary-blue/90"
        >
          <RotateCcw size={16} aria-hidden="true" /> Try again
        </button>
      </div>
    </div>
  );
}
