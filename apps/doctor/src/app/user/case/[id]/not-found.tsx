import Link from 'next/link';
import { FolderOpen } from 'lucide-react';

export default function CaseNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-sm flex-col items-center rounded-2xl border border-[#F0F0F0] bg-white p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-[#ECF2FF] text-[#2866E6]">
          <FolderOpen size={28} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-[#1B1B1B]">Case not found</h1>
        <p className="mt-2 text-sm leading-5 text-[#5E5E5E]">
          This case may have been removed or is no longer available to review.
        </p>
        <Link
          href="/user/case"
          className="mt-5 rounded-lg bg-primary-blue px-4 py-2.5 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
        >
          Back to cases
        </Link>
      </div>
    </main>
  );
}
