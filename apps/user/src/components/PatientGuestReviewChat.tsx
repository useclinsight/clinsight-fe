'use client';

import { Button } from '@clinsight/ui';
import { ChevronLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode, type Ref } from 'react';
import { loadGuestChatHistory } from '@/actions/patient-guest';

type History = Awaited<ReturnType<typeof loadGuestChatHistory>>;

export function PatientGuestReviewChat({
  headingRef,
  children,
}: {
  headingRef: Ref<HTMLHeadingElement>;
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
    <section className="flex h-dvh min-h-0 flex-col bg-white" aria-label="Lab review chat">
      <header className="shrink-0 border-b border-gray-200">
        <div className="mx-auto grid h-16 max-w-4xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:px-6">
          <Link
            href="/"
            aria-label="Back to welcome"
            className="grid size-11 place-items-center rounded-lg hover:bg-slate-100"
          >
            <ChevronLeft aria-hidden="true" className="size-6" />
          </Link>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-center text-base font-medium text-gray-900 outline-none sm:text-lg"
          >
            Chat with Flo
          </h1>
          <Link
            href="/signup?from=guest"
            className="justify-self-end rounded text-sm font-semibold text-primary-blue underline underline-offset-2"
          >
            Save results
          </Link>
        </div>
      </header>
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        role="region"
        aria-label="Conversation"
        tabIndex={0}
      >
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-5 sm:px-6 sm:py-8">
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
      </div>
      <footer className="shrink-0 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
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
      </footer>
    </section>
  );
}
