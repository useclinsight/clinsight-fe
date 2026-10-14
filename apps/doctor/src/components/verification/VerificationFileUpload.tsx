'use client';

import React, { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Upload02Icon,
  File02Icon,
  Cancel01Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface VerificationFileUploadProps {
  label: string;
  acceptText: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  error?: string;
}

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

export default function VerificationFileUpload({
  label,
  acceptText,
  onChange,
  value,
  error,
}: VerificationFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const validateAndChange = (file: File | null) => {
    if (!file) {
      onChange(null);
      setLocalError(null);
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      onChange(null);
      setLocalError('Only PDF, PNG, and JPG files are allowed');
      return;
    }

    onChange(file);
    setLocalError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndChange(files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    validateAndChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />

      <div
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'w-full h-[143px] px-3.5 border border-dashed border-[#E2E8F0] rounded-xl bg-white hover:bg-slate-50/50 hover:border-primary-blue/50 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center select-none',
          isDragActive && 'border-primary-blue bg-slate-50',
          displayError && 'border-red-500 hover:border-red-500 bg-red-50/5',
        )}
      >
        {value ? (
          <div className="w-full flex items-center justify-between px-1 py-0.5 max-w-[420px]">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={File02Icon} className="w-4 h-4 text-[#64748B]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate max-w-[200px] sm:max-w-[300px]">
                  {value.name}
                </p>
                <p className="text-[10px] text-[#64748B]">{formatFileSize(value.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-slate-800 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-[#EBEBEB] flex items-center justify-center mb-1">
              <HugeiconsIcon icon={Upload02Icon} className="w-5 h-5 text-[#64748B]" />
            </div>
            <p className="text-xs font-semibold text-slate-800">Click to upload or drag & drop</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              {label} {acceptText}
            </p>
          </>
        )}
      </div>

      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
          <HugeiconsIcon icon={AlertCircleIcon} className="w-3.5 h-3.5" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
