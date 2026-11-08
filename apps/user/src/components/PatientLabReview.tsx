'use client';

import { Button } from '@clinsight/ui';
import { useEffect, useState } from 'react';
import type { LabReview } from '@/lib/lab-review';

const pollInterval = 4000;
const maxPolls = 30;

export function PatientLabReview({
  initialReview,
  loadReviewAction,
}: {
  initialReview: LabReview;
  loadReviewAction: () => Promise<LabReview>;
}) {
  const [review, setReview] = useState(initialReview);
  const [pollRun, setPollRun] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (review.status !== 'pending' || paused) return;
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
      if (!['pending', 'unavailable'].includes(result.status)) {
        setReview(result);
      } else if (++attempts >= maxPolls) {
        setPaused(true);
      } else {
        timer = setTimeout(check, pollInterval);
      }
    }

    timer = setTimeout(check, pollRun ? 0 : pollInterval);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [review.status, loadReviewAction, pollRun, paused]);

  function retry() {
    setReview({ status: 'pending' });
    setPaused(false);
    setPollRun((run) => run + 1);
  }

  if (review.status === 'ready') {
    return (
      <article className="grid gap-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
        {review.summary && (
          <div>
            <h2 className="text-lg font-semibold">Summary</h2>
            <p className="mt-2 leading-relaxed whitespace-pre-wrap text-slate-700">
              {review.summary}
            </p>
          </div>
        )}
        {review.values.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Your lab values</h2>
            <dl className="mt-2 divide-y divide-gray-200">
              {review.values.map(({ metric, value, unit, status }, index) => (
                <div
                  key={metric + index}
                  className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 py-3 text-sm"
                >
                  <dt className="font-medium">{metric}</dt>
                  <dd className="text-slate-700">
                    {[value, unit, status]
                      .filter((item) => item != null && item !== '')
                      .join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <p className="rounded-xl bg-primary-subtle p-4 text-sm text-slate-700">
          This AI explanation is for information only. Discuss your results with a healthcare
          professional.
        </p>
      </article>
    );
  }

  if (review.status === 'failed') {
    return (
      <p role="alert" className="rounded-xl border border-gray-200 p-4">
        We couldn’t process this report. Check that the values are legible.
      </p>
    );
  }
  if (review.status === 'expired' || review.status === 'empty') {
    return (
      <p role="status" className="rounded-xl border border-gray-200 p-4">
        This result is no longer available in this session.
      </p>
    );
  }

  const waiting = review.status === 'pending' && !paused;
  return (
    <div className="grid gap-3 rounded-xl border border-gray-200 p-5">
      <p role="status" className="text-slate-700">
        {waiting
          ? 'We’re preparing your lab explanation…'
          : review.status === 'unavailable'
            ? 'We couldn’t load your lab explanation.'
            : 'Your report is taking longer than expected. You can check again without uploading it again.'}
      </p>
      {!waiting && (
        <Button type="button" variant="outline" className="justify-self-start" onClick={retry}>
          Check again
        </Button>
      )}
    </div>
  );
}
