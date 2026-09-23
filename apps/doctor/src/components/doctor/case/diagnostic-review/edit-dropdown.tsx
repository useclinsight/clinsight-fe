'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { ArrowDown01Icon, PencilEdit01Icon, EyeIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import type { EditorMode } from '@/types/editor-types';

interface EditDropdownProps {
  mode: EditorMode;
  onChange: (mode: EditorMode) => void;
}
export type { EditorMode };

export const EditDropdown = memo(function EditDropdown({ mode, onChange }: EditDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function handleSelect(selectedMode: EditorMode) {
    onChange(selectedMode);
    setOpen(false);
  }

  const isPreview = mode === 'preview';

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium font-['Inter'] text-[#1B1B1B] hover:bg-[#F0F0F0] active:bg-[#EAEAEA] border border-[#E0E0E0] rounded-lg transition-colors select-none bg-white"
      >
        <HugeiconsIcon icon={isPreview ? EyeIcon : PencilEdit01Icon} size={15} color="#1B1B1B" />
        <span className="capitalize">{mode}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={13}
          color="#1B1B1B"
          className={`transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1.5 w-36 bg-white border-[#1B1B1B] rounded-xl shadow-lg overflow-hidden z-30 animate-fadeIn"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect('edit')}
            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left font-['Inter'] transition-colors
              ${
                !isPreview
                  ? 'text-[#1565C0] bg-[#F0F4FF] font-semibold'
                  : 'text-[#1B1B1B] hover:bg-[#F7F7F7]'
              }`}
          >
            <HugeiconsIcon
              icon={PencilEdit01Icon}
              size={14}
              color={!isPreview ? '#1565C0' : '#1B1B1B'}
            />
            Edit
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => handleSelect('preview')}
            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left font-['Inter'] transition-colors
              ${
                isPreview
                  ? 'text-[#1565C0] bg-[#F0F4FF] font-semibold'
                  : 'text-[#1B1B1B] hover:bg-[#F7F7F7]'
              }`}
          >
            <HugeiconsIcon icon={EyeIcon} size={14} color={isPreview ? '#1565C0' : '#1B1B1B'} />
            Preview
          </button>
        </div>
      )}
    </div>
  );
});
