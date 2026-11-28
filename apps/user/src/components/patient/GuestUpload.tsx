'use client';

import { useEffect, useRef, useState, useTransition, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FileText, LoaderCircle, UploadCloud } from 'lucide-react';
import { Button } from '@clinsight/ui';

import { guestUploadAction } from '@/actions/patient-guest';
import { guestLabTypes } from '@/lib/guest-lab-file';

type Selection = { file: File; preview?: string };

export function GuestUpload({
  maxSizeMb,
  inSheet = false,
  onUploaded,
}: {
  maxSizeMb: number;
  inSheet?: boolean;
  onUploaded?: () => void;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const [selection, setSelection] = useState<Selection>();
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();
  const preview = selection?.preview;

  useEffect(() => {
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [preview]);

  useEffect(() => {
    if (selection && inSheet) previewHeading.current?.focus();
  }, [inSheet, selection]);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    if (!guestLabTypes.includes(file.type)) {
      setMessage('Choose a JPEG, PNG, WebP, or PDF file.');
      return;
    }
    if (!file.size || file.size > maxSizeMb * 1024 * 1024) {
      setMessage(`Choose a non-empty file that is ${maxSizeMb} MB or smaller.`);
      return;
    }

    setMessage('');
    setSelection({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    });
  }

  function requestReview() {
    if (!selection || pending) return;
    setMessage('');
    const form = new FormData();
    form.set('file', selection.file);
    startTransition(async () => {
      try {
        const result = await guestUploadAction(form);
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        onUploaded?.();
        router.push(`/guest/${encodeURIComponent(result.data.caseId)}?new=1`);
      } catch {
        setMessage('We couldn’t upload this report. Please try again.');
      }
    });
  }

  return (
    <section
      className={
        inSheet
          ? 'mx-auto max-w-md py-2'
          : 'rounded-[14px] border border-outline-border bg-white p-5 sm:p-6'
      }
      aria-busy={pending}
    >
      <input
        ref={fileInput}
        type="file"
        accept={guestLabTypes.join(',')}
        aria-label="Choose a lab report file"
        hidden
        onChange={chooseFile}
      />
      {selection ? (
        <div className="grid gap-4">
          <h2 ref={previewHeading} tabIndex={-1} className="text-xl font-semibold text-gray-900">
            File preview
          </h2>
          <div className="grid gap-3 rounded-xl border border-outline-border p-4">
            <p className="break-all text-sm font-medium">{selection.file.name}</p>
            <div className="grid min-h-24 place-items-center rounded-lg bg-slate-50 p-3">
              {preview ? (
                <Image
                  src={preview}
                  alt="Selected lab report"
                  width={360}
                  height={240}
                  unoptimized
                  className="h-auto max-h-[min(26dvh,13rem)] w-full object-contain"
                />
              ) : (
                <div className="grid justify-items-center gap-2 text-sm text-slate-600">
                  <FileText aria-hidden="true" className="size-6 text-primary-blue" />
                  PDF selected
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="brand" disabled={pending} onClick={requestReview}>
              {pending && <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
              {pending ? 'Uploading…' : 'Get AI review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => fileInput.current?.click()}
            >
              Choose another file
            </Button>
          </div>
        </div>
      ) : (
        <div className={inSheet ? 'text-center' : undefined}>
          <h2 className="text-xl font-semibold text-gray-900">Upload your lab result</h2>
          <p className="mt-2 text-sm text-slate-600">
            JPEG, PNG, WebP, and PDF files up to {maxSizeMb} MB.
          </p>
          <Button
            type="button"
            variant="brand"
            className="mt-5 gap-2"
            onClick={() => fileInput.current?.click()}
          >
            <UploadCloud aria-hidden="true" className="size-4" />
            Upload result
          </Button>
        </div>
      )}
      {message && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {message}
        </p>
      )}
    </section>
  );
}
