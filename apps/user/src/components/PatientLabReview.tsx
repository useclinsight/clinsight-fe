'use client';

import { Button } from '@clinsight/ui';
import { Check, Circle, LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { LabReview } from '@/lib/lab-review';
import { PatientGuestReviewChat } from './PatientGuestReviewChat';

const pollInterval = 4000;
const maxPolls = 30;
const slowPollInterval = 10000;

export function PatientLabReview({
  initialReview,
  loadReviewAction,
  guestHeading,
  onGuestReady,
}: {
  initialReview: LabReview;
  loadReviewAction: () => Promise<LabReview>;
  guestHeading?: 'h1' | 'h2';
  onGuestReady?: (review: Extract<LabReview, { status: 'ready' }>) => void;
}) {
  const [review, setReview] = useState(initialReview);
  const [pollRun, setPollRun] = useState(0);
  const [paused, setPaused] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (review.status === 'ready') onGuestReady?.(review);
  }, [onGuestReady, review]);

  useEffect(() => {
    if (guestHeading) headingRef.current?.focus({ preventScroll: true });
  }, [guestHeading, review.status]);

  useEffect(() => {
    if (review.status !== 'pending') return;
    let active = true;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    async function check() {
      let result: LabReview;
      try {
        result = await loadReviewAction();
      } catch {
        result = { status: 'unavailable' };
      }
      if (!active) return;
      if (result.status !== 'pending' && result.status !== 'unavailable') {
        setReview(result);
        return;
      }
      if (result.status === 'pending' && result.phase) setReview(result);
      if (++attempts >= maxPolls) {
        setPaused(true);
        if (!guestHeading) return;
      }
      timer = setTimeout(check, attempts >= maxPolls ? slowPollInterval : pollInterval);
    }

    timer = setTimeout(check, guestHeading || pollRun ? 0 : pollInterval);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [review.status, loadReviewAction, pollRun, guestHeading]);

  function retry() {
    setReview((current) => (current.status === 'pending' ? current : { status: 'pending' }));
    setPaused(false);
    setPollRun((run) => run + 1);
  }

  const GuestHeading = guestHeading;
  const SectionHeading = guestHeading === 'h2' ? 'h3' : 'h2';
  const title = (text: string) =>
    GuestHeading && (
      <GuestHeading
        ref={headingRef}
        tabIndex={-1}
        className="mb-4 text-2xl font-semibold tracking-tight text-gray-900 outline-none sm:text-3xl"
      >
        {text}
      </GuestHeading>
    );

  if (review.status === 'ready') {
    if (onGuestReady)
      return (
        <p role="status" className="text-sm text-slate-700">
          Opening chat…
        </p>
      );
    const explanation = (
      <article className="grid gap-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        {guestHeading && (
          <SectionHeading className="text-xl font-semibold">Flo’s review</SectionHeading>
        )}
        {review.summary && (
          <div className={guestHeading ? 'rounded-xl bg-primary-subtle p-4' : undefined}>
            <SectionHeading className="text-lg font-semibold">
              {guestHeading ? 'Key takeaway' : 'Summary'}
            </SectionHeading>
            <p className="mt-2 leading-relaxed wrap-anywhere whitespace-pre-wrap text-slate-700">
              {review.summary}
            </p>
          </div>
        )}
        {review.values.length > 0 && (
          <div>
            <SectionHeading className="text-lg font-semibold">Your lab values</SectionHeading>
            <dl className="mt-2 divide-y divide-gray-200">
              {review.values.map(({ metric, value, unit, status }, index) => (
                <div
                  key={metric + index}
                  className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-3 text-sm"
                >
                  <dt className="min-w-0 font-medium wrap-anywhere">{metric}</dt>
                  <dd className="min-w-0 wrap-anywhere text-slate-700">
                    {[value, unit, status]
                      .filter((item) => item != null && item !== '')
                      .join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {guestHeading && review.questions.length > 0 && (
          <div>
            <SectionHeading className="text-lg font-semibold">
              Suggested follow-up questions
            </SectionHeading>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed wrap-anywhere text-slate-700">
              {review.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="rounded-xl bg-primary-subtle p-4 text-sm text-slate-700">
          This AI explanation is for information only. Discuss your results with a healthcare
          professional.
        </p>
      </article>
    );

    if (!guestHeading) return explanation;
    return <PatientGuestReviewChat headingRef={headingRef}>{explanation}</PatientGuestReviewChat>;
  }

  if (review.status === 'failed') {
    return (
      <>
        {title('We couldn’t process this report')}
        <p role="alert" className="rounded-xl border border-gray-200 p-4">
          {guestHeading
            ? 'We couldn’t generate an explanation for this report.'
            : 'We couldn’t process this report. Check that the values are legible.'}
        </p>
      </>
    );
  }
  if (review.status === 'expired' || review.status === 'empty') {
    return (
      <>
        {title('Result unavailable')}
        <p role="status" className="rounded-xl border border-gray-200 p-4">
          This result is no longer available in this session.
        </p>
      </>
    );
  }

  const waiting = review.status === 'pending' && !paused;
  if (guestHeading && waiting) {
    return (
      <>
        {title('Analysing your results')}
        <GuestReviewProgress phase={review.phase} />
      </>
    );
  }

  return (
    <>
      {title(
        review.status === 'unavailable'
          ? 'Couldn’t load your explanation'
          : 'Still analysing your results',
      )}
      <div className="grid gap-3 rounded-xl border border-gray-200 p-5">
        <p role="status" className="text-slate-700">
          {waiting
            ? 'We’re preparing your lab explanation…'
            : review.status === 'unavailable'
              ? 'We couldn’t load your lab explanation.'
              : guestHeading
                ? 'Your report is taking longer than expected. We’ll keep checking for it here.'
                : 'Your report is taking longer than expected. You can check again without uploading it again.'}
        </p>
        {!waiting && (
          <Button type="button" variant="outline" className="justify-self-start" onClick={retry}>
            Check again
          </Button>
        )}
      </div>
    </>
  );
}

function GuestReviewProgress({ phase }: { phase?: 'reading' | 'explaining' }) {
  const steps = [
    { label: 'Report received', state: 'complete' },
    {
      label: 'Reading your report',
      state: phase === 'explaining' ? 'complete' : phase === 'reading' ? 'active' : 'waiting',
    },
    { label: 'Preparing your explanation', state: phase === 'explaining' ? 'active' : 'waiting' },
  ];
  const status =
    phase === 'explaining'
      ? 'We’re preparing your lab explanation…'
      : phase === 'reading'
        ? 'We’re reading the values in your report…'
        : 'Your report is in the queue.';

  return (
    <div className="rounded-2xl border border-gray-200 p-4 sm:p-5">
      <p role="status" className="text-sm text-slate-700">
        {status}
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map(({ label, state }) => {
          const Icon = state === 'complete' ? Check : state === 'active' ? LoaderCircle : Circle;
          return (
            <li
              key={label}
              aria-current={state === 'active' ? 'step' : undefined}
              className="flex items-center gap-3 text-sm"
            >
              <span
                className={
                  'grid size-8 shrink-0 place-items-center rounded-full ' +
                  (state === 'waiting'
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-primary-subtle text-primary-blue')
                }
              >
                <Icon
                  aria-hidden="true"
                  className={state === 'active' ? 'size-4 motion-safe:animate-spin' : 'size-4'}
                />
              </span>
              <span
                className={state === 'waiting' ? 'text-slate-600' : 'font-medium text-slate-900'}
              >
                {label}
                <span className="sr-only">
                  {state === 'complete'
                    ? ', complete'
                    : state === 'active'
                      ? ', in progress'
                      : ', waiting'}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-sm text-slate-600">
        To check your result later, return to the welcome page and select Continue as guest.
      </p>
    </div>
  );
}
