'use client';

import { Button } from '@clinsight/ui';
import { MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { loadGuestChatHistory } from '@/actions/patient-guest';

type History = Awaited<ReturnType<typeof loadGuestChatHistory>>;

export function PatientGuestReviewChat({
  heading,
  children,
}: {
  heading: ReactNode;
  children: ReactNode;
}) {
  const [history, setHistory] = useState<History>();
  const [request, setRequest] = useState(0);

  useEffect(() => {
    let active = true;
    loadGuestChatHistory().then(
      (result) => {
        if (active) setHistory(result);
      },
      () => {
        if (active) setHistory({ status: 'unavailable' });
      },
    );
    return () => {
      active = false;
    };
  }, [request]);

  return (
    <section className="flex h-[min(70dvh,39rem)] min-h-0 flex-col" aria-label="Lab review chat">
      <div className="flex shrink-0 items-start justify-between gap-3">
        {heading}
        <Link
          href="/signup?from=guest"
          className="mt-1 shrink-0 rounded text-sm font-semibold text-primary-blue underline underline-offset-2"
        >
          Save results
        </Link>
      </div>
      <div
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain rounded-2xl bg-slate-50 p-3 sm:p-4"
        role="region"
        aria-label="Conversation"
        tabIndex={0}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <span className="grid size-8 place-items-center rounded-full bg-primary-subtle text-primary-blue">
            <MessageCircle aria-hidden="true" className="size-4" />
          </span>
          Flo
        </div>
        {children}
        {history?.status === 'ok' && history.messages.length > 0 && (
          <ol aria-label="Follow-up messages" className="grid gap-3">
            {history.messages.map(({ id, sender, text }) => (
              <li
                key={id}
                className={sender === 'patient' ? 'justify-self-end' : 'justify-self-start'}
              >
                <p className="mb-1 text-xs font-medium text-slate-600">
                  {sender === 'patient' ? 'You' : 'Flo'}
                </p>
                <p
                  className={
                    'max-w-xs rounded-xl px-3 py-2 text-sm leading-relaxed wrap-anywhere whitespace-pre-wrap sm:max-w-sm ' +
                    (sender === 'patient'
                      ? 'bg-primary-subtle text-gray-900'
                      : 'border border-gray-200 bg-white text-slate-700')
                  }
                >
                  {text}
                </p>
              </li>
            ))}
          </ol>
        )}
        {history?.status === 'unavailable' && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <p role="status">Chat history couldn’t load.</p>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setHistory(undefined);
                setRequest((count) => count + 1);
              }}
            >
              Check again
            </Button>
          </div>
        )}
      </div>
      <div className="mt-3 shrink-0">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-slate-50 p-2">
          <input
            disabled
            aria-label="Ask about your results"
            aria-describedby="guest-chat-availability"
            placeholder="Ask about your results"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm placeholder:text-slate-500"
          />
          <Button
            type="button"
            size="icon"
            variant="brand"
            disabled
            aria-label="Send question"
            className="rounded-lg"
          >
            <Send aria-hidden="true" className="size-4" />
          </Button>
        </div>
        <p id="guest-chat-availability" className="mt-1.5 text-xs text-slate-600">
          Live follow-up isn’t available on web yet.
        </p>
      </div>
    </section>
  );
}
