'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';

const COMING_SOON_EVENT = 'clinsight:coming-soon';

type ComingSoonEventDetail = {
  title?: string;
  description?: string;
};

export function triggerComingSoonModal(detail: ComingSoonEventDetail = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(COMING_SOON_EVENT, { detail }));
}

export function ComingSoonProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<Required<ComingSoonEventDetail>>({
    title: 'Coming Soon',
    description: 'This experience is still being polished and will be available soon.',
  });

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const customEvent = event as CustomEvent<ComingSoonEventDetail>;

      setContent({
        title: customEvent.detail?.title ?? 'Coming Soon',
        description:
          customEvent.detail?.description ??
          'This experience is still being polished and will be available soon.',
      });
      setIsOpen(true);
    };

    window.addEventListener(COMING_SOON_EVENT, handleOpen);

    return () => {
      window.removeEventListener(COMING_SOON_EVENT, handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {children}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="coming-soon-title"
              aria-describedby="coming-soon-description"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1565C0] via-[#F59E0B] to-[#10B981]" />
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#1565C0]">
                    Clinsight update
                  </p>
                  <h2 id="coming-soon-title" className="mt-2 text-2xl font-bold text-slate-900">
                    {content.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  aria-label="Close modal"
                >
                  <span className="text-2xl leading-none">&times;</span>
                </button>
              </div>

              <div className="space-y-6 px-6 py-6 sm:px-8">
                <div className="rounded-[22px] bg-[#F8FBFF] p-5 ring-1 ring-inset ring-[#D8E6F8]">
                  <p
                    id="coming-soon-description"
                    className="text-sm leading-6 text-slate-600 sm:text-base"
                  >
                    {content.description}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <p className="text-sm text-slate-500">
                    We are opening this feature in a future release.
                  </p>
                  <Button
                    variant="brand"
                    onClick={() => setIsOpen(false)}
                    className="h-11 rounded-full px-5 text-sm font-bold text-white"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
