'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  SquareArrowExpand01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { MOCK_CASE_DATA } from '@/lib/case-data';

interface CaseInfoPanelProps {
  caseId: string;
}

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

export function CaseInfoPanel({ caseId }: CaseInfoPanelProps) {
  const router = useRouter();
  const [aiOpen, setAiOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(true);
  const [labOpen, setLabOpen] = useState(true);

  const { aiInsights, patientNote } = MOCK_CASE_DATA;

  const handleViewFullScreenLab = () => {
    if (caseId) {
      router.push(`/user/case/${caseId}/lab-result`);
    }
  };

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
              onClick={handleViewFullScreenLab}
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
    </div>
  );
}
