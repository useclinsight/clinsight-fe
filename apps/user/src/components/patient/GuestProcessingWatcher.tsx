'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

import { guestCaseSnapshotAction } from '@/actions/patient-guest';

export function GuestProcessingWatcher({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState('Extracting data from your file…');

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      const snapshot = await guestCaseSnapshotAction(caseId).catch(() => null);
      if (!active) return;

      const interpretationStatus = snapshot?.interpretation?.status;
      if (
        interpretationStatus === 'complete' ||
        interpretationStatus === 'failed' ||
        snapshot?.case.status === 'failed'
      ) {
        router.refresh();
        return;
      }

      setStatus(
        !snapshot
          ? 'We’re still checking for your results…'
          : interpretationStatus === 'processing'
            ? 'Interpreting lab values…'
            : 'Extracting data from your file…',
      );
      timer = setTimeout(poll, 4000);
    }
    void poll();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [caseId, router]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 rounded-xl border border-outline-border bg-white p-5"
    >
      <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-primary-blue" />
      <div>
        <p className="text-sm font-semibold text-gray-900">AI Review</p>
        <p className="text-sm text-slate-600">{status}</p>
      </div>
    </div>
  );
}
