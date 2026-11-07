'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { restoreSession } from '@/actions/patient-session';
import { withSessionLock } from '@/lib/browser-session-lock';

export function SessionRecovery() {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const pending = useRef<ReturnType<typeof restoreSession> | null>(null);

  useEffect(() => {
    let active = true;
    const request = (pending.current ??= withSessionLock(restoreSession));

    request.then(
      (result) => {
        if (!active) return;
        if (result === 'restored') router.refresh();
        else if (result === 'expired') router.replace('/login');
        else setFailed(true);
      },
      () => {
        if (active) setFailed(true);
      },
    );

    return () => {
      active = false;
    };
  }, [attempt, router]);

  return (
    <main className="mx-auto max-w-lg space-y-4 px-6 py-16">
      <h1 className="text-2xl font-semibold text-gray-900">Patient portal</h1>
      {failed ? (
        <>
          <p role="alert" className="text-gray-700">
            We couldn’t reconnect your session. Please try again.
          </p>
          <button
            type="button"
            className="text-sm font-semibold text-blue-700 underline"
            onClick={() => {
              pending.current = null;
              setFailed(false);
              setAttempt((current) => current + 1);
            }}
          >
            Try again
          </button>
          <Link href="/login" className="ml-4 text-sm font-semibold text-blue-700 underline">
            Sign in
          </Link>
        </>
      ) : (
        <p role="status" className="text-gray-700">
          Restoring your session…
        </p>
      )}
    </main>
  );
}
