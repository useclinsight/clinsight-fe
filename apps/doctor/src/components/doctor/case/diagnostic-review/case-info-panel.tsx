'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  SquareArrowExpand01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { MOCK_CASE_DATA } from '@/lib/case-data';

interface AccordionRowProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

function AccordionRow({ title, isOpen, onToggle, children }: AccordionRowProps) {
  return (
    <div className="border-b border-[#E8E8E8] pb-4 shrink-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-1 text-left"
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-[#1B1B1B] text-base font-medium font-['Inter'] leading-7">
          {title}
        </span>
        <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          <HugeiconsIcon
            icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
            size={16}
            color="#1B1B1B"
          />
        </span>
      </button>

      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function CaseInfoPanel() {
  const [aiOpen, setAiOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(true);
  const [labOpen, setLabOpen] = useState(true);
  const [labPreviewOpen, setLabPreviewOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { aiInsights, patientNote } = MOCK_CASE_DATA;

  useEffect(() => {
    if (!labPreviewOpen) return;
    closeButtonRef.current?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLabPreviewOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [labPreviewOpen]);

  return (
    <div className="w-full h-full max-w-sm xl:max-w-md flex-shrink-0 bg-white rounded-2xl border border-[#E8E8E8] flex flex-col shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        <AccordionRow title="AI Insights" isOpen={aiOpen} onToggle={() => setAiOpen((v) => !v)}>
          <div className="p-4 bg-[#F7F7F7] rounded-xl">
            <p className="text-[#767676] text-sm font-['Inter'] leading-6">{aiInsights}</p>
          </div>
        </AccordionRow>
        <AccordionRow
          title="Patient Note"
          isOpen={noteOpen}
          onToggle={() => setNoteOpen((v) => !v)}
        >
          <div className="p-4 bg-[#F7F7F7] rounded-xl flex flex-col gap-3">
            {patientNote.split('\n\n').map((para) => (
              <p
                key={para.slice(0, 50)}
                className="text-[#767676] text-base font-medium font-['Inter'] leading-7"
              >
                {para}
              </p>
            ))}
          </div>
        </AccordionRow>
        <div className="shrink-0">
          <div className="flex items-center justify-between gap-4 py-1">
            <button
              type="button"
              onClick={() => setLabOpen((v) => !v)}
              className="flex-1 text-left text-[#1B1B1B] text-base font-medium font-['Inter'] leading-7"
              aria-expanded={labOpen}
            >
              Lab Result
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setLabPreviewOpen(true);
              }}
              aria-label="Open lab result in full screen"
              className="w-6 h-6 flex items-center justify-center hover:bg-[#F0F0F0] rounded transition-colors flex-shrink-0"
            >
              <HugeiconsIcon icon={SquareArrowExpand01Icon} size={18} color="#1B1B1B" />
            </button>
          </div>

          {labOpen && (
            <div className="mt-3 rounded-xl border border-[#E8E8E8] overflow-hidden">
              <Image
                src="/assets/diagnostic-review-assets/Rectangle34624404.png"
                alt="Patient lab result report"
                width={344}
                height={296}
                className="w-full h-auto"
                priority
              />
            </div>
          )}
        </div>
      </div>
      {labPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen lab report"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#1B1B1B]/30 p-4 sm:px-10 sm:pb-0 sm:pt-24"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setLabPreviewOpen(false)}
            aria-label="Close lab report"
            className="fixed left-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white text-[#1B1B1B] shadow-sm sm:left-10 sm:top-10"
          >
            <X size={26} />
          </button>
          <div
            className="origin-top bg-white px-2 py-2 shadow-lg sm:px-0"
            style={{ width: `min(${664 * zoom}px, 100%)` }}
          >
            <Image
              src="/assets/dashboard-case-assets/preview-large.svg"
              alt="Patient medical laboratory report"
              width={664}
              height={831}
              className="h-auto w-full"
              priority
            />
          </div>
          <div className="fixed bottom-10 right-4 z-10 flex flex-col gap-2 sm:right-10">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(1.5, value + 0.1))}
              aria-label="Zoom in"
              className="flex size-10 items-center justify-center rounded-[10px] bg-white text-[#1B1B1B] shadow-sm"
            >
              <Plus size={24} />
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(0.7, value - 0.1))}
              aria-label="Zoom out"
              className="flex size-10 items-center justify-center rounded-[10px] bg-white text-[#1B1B1B] shadow-sm"
            >
              <Minus size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
