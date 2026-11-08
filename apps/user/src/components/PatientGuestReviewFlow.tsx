'use client';

import { Button } from '@clinsight/ui';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadGuestReview } from '@/actions/patient-guest';
import {
  stageGuestChat,
  takeGuestChat,
  takeGuestReviewFile,
  type GuestReviewFile,
} from '@/lib/guest-review-transfer';
import type { LabReview } from '@/lib/lab-review';
import { uploadGuestReport } from '@/lib/upload-guest-report';
import { PatientLabReview } from './PatientLabReview';

type FlowState = LabReview | { status: 'uploading' } | { status: 'upload-error'; message: string };

export function PatientGuestReviewFlow({ screen }: { screen: 'review' | 'chat' }) {
  const router = useRouter();
  const file = useRef<GuestReviewFile | undefined>(undefined);
  const [state, setState] = useState<FlowState>();
  const [attempt, setAttempt] = useState(0);

  const openChat = useCallback(
    (result: Extract<LabReview, { status: 'ready' }>) => {
      stageGuestChat(result);
      router.replace('/guest/chat');
    },
    [router],
  );

  useEffect(() => {
    if (screen === 'review') router.prefetch('/guest/chat');
  }, [router, screen]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const start = setTimeout(async () => {
      try {
        const stagedReview = screen === 'chat' ? takeGuestChat() : undefined;
        if (screen === 'review') file.current ??= takeGuestReviewFile();
        const draft = screen === 'review' ? file.current : undefined;

        if (draft) setState({ status: 'uploading' });
        const result =
          stagedReview ??
          (draft ? await uploadGuestReport(draft, controller.signal) : await loadGuestReview());
        if (!active) return;
        if (result.status !== 'upload-error') file.current = undefined;
        if (screen === 'chat' && (result.status === 'pending' || result.status === 'unavailable')) {
          router.replace('/guest/review');
          return;
        }
        if (screen === 'review' && result.status === 'ready') {
          openChat(result);
          return;
        }
        setState(result);
      } catch {
        if (active) {
          if (screen === 'chat') router.replace('/guest/review');
          else setState({ status: 'unavailable' });
        }
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(start);
      controller.abort();
    };
  }, [attempt, openChat, router, screen]);

  if (screen === 'chat' && state?.status === 'ready') {
    return (
      <main>
        <PatientLabReview
          initialReview={state}
          loadReviewAction={loadGuestReview}
          guestHeading="h1"
        />
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto grid h-16 max-w-4xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
          <Link
            href="/"
            aria-label="Back to welcome"
            className="grid size-11 place-items-center rounded-lg hover:bg-slate-100"
          >
            <ChevronLeft aria-hidden="true" className="size-6" />
          </Link>
          <p className="text-base font-medium text-gray-900">AI review</p>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-12">
        {!state || state.status === 'uploading' ? (
          <div className="rounded-2xl border border-gray-200 p-6">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
              {state?.status === 'uploading' ? 'Uploading your report' : 'Opening your review'}
            </h1>
            <div role="status" className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <LoaderCircle
                aria-hidden="true"
                className="size-5 text-primary-blue motion-safe:animate-spin"
              />
              {state?.status === 'uploading'
                ? 'Your lab report is being sent.'
                : 'Checking your guest review…'}
            </div>
          </div>
        ) : state.status === 'upload-error' ||
          state.status === 'empty' ||
          state.status === 'expired' ? (
          <div className="rounded-2xl border border-gray-200 p-6">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
              {state.status === 'upload-error'
                ? 'Couldn’t upload your report'
                : 'No guest review to open'}
            </h1>
            <p
              role={state.status === 'upload-error' ? 'alert' : 'status'}
              className="mt-2 text-sm text-slate-600"
            >
              {state.status === 'upload-error'
                ? state.message
                : 'Choose a lab report to start a new review.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {state.status === 'upload-error' && (
                <Button
                  type="button"
                  variant="brand"
                  onClick={() => setAttempt((count) => count + 1)}
                >
                  Try again
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/guest/upload">Choose a file</Link>
              </Button>
            </div>
          </div>
        ) : (
          <PatientLabReview
            initialReview={state}
            loadReviewAction={loadGuestReview}
            guestHeading="h1"
            onGuestReady={openChat}
          />
        )}
      </div>
    </main>
  );
}
