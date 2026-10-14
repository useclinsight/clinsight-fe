'use client';

import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  NoteEditIcon,
  LayoutTableIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  Link01Icon,
  ImageUpload01Icon,
  Copy01Icon,
  ListViewIcon,
  LeftToRightListBulletIcon,
  TextIndentIcon,
} from '@hugeicons/core-free-icons';
import { EditDropdown, type EditorMode } from './edit-dropdown';
import type { FormatState, EditorBlock } from '@/types/editor-types';

interface EditorToolbarProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  format: FormatState;
  onFormat: (key: keyof Omit<FormatState, 'fontSize'>) => void;
  onFontSize: (delta: 1 | -1) => void;
  onInsertImportantNote: () => void;
  onInsertTable: () => void;
  blocks?: EditorBlock[];
}

export function EditorToolbar({
  mode,
  onModeChange,
  format,
  onFormat,
  onFontSize,
  onInsertImportantNote,
  onInsertTable,
  blocks = [],
}: EditorToolbarProps) {
  const isEditable = mode === 'edit';

  const handleCopyContent = async () => {
    if (blocks.length === 0) {
      toast.error('There is no content to copy yet.');
      return;
    }

    try {
      const compiledText = blocks
        .map((block) => {
          if (block.type === 'paragraph' || block.type === 'important-note') {
            const plainText = block.text
              .replace(/<[^>]*>/g, '')
              .replace(/&nbsp;/g, ' ')
              .trim();

            return block.type === 'important-note' ? `[IMPORTANT NOTE]\n${plainText}` : plainText;
          }

          if (block.type === 'table') {
            const headerRow = `| ${block.headers.join(' | ')} |`;
            const separator = `| ${block.headers.map(() => '---').join(' | ')} |`;
            const dataRows = block.rows
              .map((row) => `| ${row.cells.map((c) => c || '--').join(' | ')} |`)
              .join('\n');

            return `[TABLE]\n${headerRow}\n${separator}\n${dataRows}`;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n\n');

      if (!compiledText.trim()) {
        toast.error('The document text is currently empty.');
        return;
      }
      if (!navigator?.clipboard?.writeText) {
        toast.error('Clipboard copying is not supported in your browser.');
        return;
      }
      await navigator.clipboard.writeText(compiledText);
      toast.success('Document text copied to clipboard successfully!');
    } catch (err: unknown) {
      console.error('Clipboard write error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Failed to copy text automatically: ${errorMessage}`);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col shrink-0 select-none border-b border-[#E8E8E8]">
      <div
        className={cn(
          'flex items-center px-6 py-3.5 border-b border-[#FAF9F9]',
          isEditable ? 'justify-between' : 'justify-end',
        )}
      >
        {isEditable && (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium font-['Inter'] text-[#1B1B1B] bg-[#FAF9F9] rounded-xl opacity-35 cursor-not-allowed"
            >
              <HugeiconsIcon icon={LayoutTableIcon} size={16} />
              Template
            </button>

            <button
              type="button"
              onClick={onInsertImportantNote}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium font-['Inter'] text-[#1B1B1B] bg-[#FAF9F9] hover:bg-[#F2F1F1] rounded-xl transition-all"
            >
              <HugeiconsIcon icon={NoteEditIcon} size={16} color="#1565C0" />
              Important Note
            </button>

            <button
              type="button"
              onClick={onInsertTable}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium font-['Inter'] text-[#1B1B1B] bg-[#FAF9F9] hover:bg-[#F2F1F1] rounded-xl transition-all"
            >
              <HugeiconsIcon icon={LayoutTableIcon} size={16} />
              Table
            </button>
          </div>
        )}

        <div>
          <EditDropdown mode={mode} onChange={onModeChange} />
        </div>
      </div>

      {isEditable && (
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-white min-h-[48px] overflow-x-auto">
          <div className="flex items-center gap-1 bg-[#FAF9F9] rounded-lg p-0.5 border border-[#E8E8E8]/30">
            <button
              type="button"
              onClick={() => onFontSize(-1)}
              className="w-7 h-7 flex items-center justify-center text-base font-bold text-[#494949] hover:bg-white rounded transition-colors"
            >
              −
            </button>
            <div className="w-9 text-center text-xs font-semibold font-['Inter'] text-[#1B1B1B]">
              {format.fontSize}
            </div>
            <button
              type="button"
              onClick={() => onFontSize(1)}
              className="w-7 h-7 flex items-center justify-center text-base font-bold text-[#494949] hover:bg-white rounded transition-colors"
            >
              +
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#E8E8E8] mx-1" />

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onFormat('bold')}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                format.bold
                  ? 'bg-[#1565C0]/10 text-[#1565C0]'
                  : 'text-[#494949] hover:bg-[#FAF9F9]',
              )}
            >
              <HugeiconsIcon icon={TextBoldIcon} size={18} />
            </button>
            <button
              type="button"
              onClick={() => onFormat('underline')}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                format.underline
                  ? 'bg-[#1565C0]/10 text-[#1565C0]'
                  : 'text-[#494949] hover:bg-[#FAF9F9]',
              )}
            >
              <HugeiconsIcon icon={TextUnderlineIcon} size={18} />
            </button>
            <button
              type="button"
              onClick={() => onFormat('italic')}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                format.italic
                  ? 'bg-[#1565C0]/10 text-[#1565C0]'
                  : 'text-[#494949] hover:bg-[#FAF9F9]',
              )}
            >
              <HugeiconsIcon icon={TextItalicIcon} size={18} />
            </button>

            <button
              type="button"
              disabled
              className="w-8 h-8 flex flex-col items-center justify-center rounded-lg text-[#494949] opacity-35 cursor-not-allowed relative"
            >
              <span className="text-sm font-bold leading-none mt-0.5">A</span>
              <div className="w-3.5 h-[3px] bg-[#1B1B1B] rounded-full mt-0.5" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#E8E8E8] mx-1" />

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#494949] opacity-35 cursor-not-allowed"
            >
              <HugeiconsIcon icon={Link01Icon} size={18} />
            </button>

            <button
              type="button"
              disabled
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#494949] opacity-35 cursor-not-allowed"
            >
              <HugeiconsIcon icon={ImageUpload01Icon} size={18} />
            </button>

            <button
              type="button"
              onClick={handleCopyContent}
              title="Copy Document Text"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#494949] hover:bg-[#FAF9F9] active:text-[#1565C0] transition-colors"
            >
              <HugeiconsIcon icon={Copy01Icon} size={18} />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#E8E8E8] mx-1" />

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#494949] opacity-35 cursor-not-allowed"
            >
              <HugeiconsIcon icon={TextIndentIcon} size={18} />
            </button>
            <button
              type="button"
              disabled
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#494949] opacity-35 cursor-not-allowed"
            >
              <HugeiconsIcon icon={ListViewIcon} size={18} />
            </button>
            <button
              type="button"
              disabled
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#494949] opacity-35 cursor-not-allowed"
            >
              <HugeiconsIcon icon={LeftToRightListBulletIcon} size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
