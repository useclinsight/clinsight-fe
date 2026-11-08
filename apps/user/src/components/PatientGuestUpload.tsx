'use client';

import { Button } from '@clinsight/ui';
import { FileText, Upload, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { loadGuestReview } from '@/actions/patient-guest';
import { stageGuestChat, stageGuestReviewFile } from '@/lib/guest-review-transfer';
import { labFileTypes, maxLabFileSize, type LabReview } from '@/lib/lab-review';

type Selection = { file: File; mimeType: string; preview?: string };

export function PatientGuestUpload({
  initialReview,
  inSheet = false,
  onReviewStart,
}: {
  initialReview?: LabReview;
  inSheet?: boolean;
  onReviewStart?: () => void;
}) {
  const router = useRouter();
  const [review, setReview] = useState(initialReview);
  const [selected, setSelected] = useState<Selection>();
  const [message, setMessage] = useState('');
  const leaving = useRef(false);
  const filePicker = useRef<HTMLInputElement>(null);
  const previewHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (initialReview) return;
    let active = true;
    loadGuestReview().then(
      (result) => {
        if (active) setReview(result);
      },
      () => {
        if (active) setReview({ status: 'unavailable' });
      },
    );
    return () => {
      active = false;
    };
  }, [initialReview]);

  useEffect(() => {
    const preview = selected?.preview;
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    if (inSheet) previewHeading.current?.focus({ preventScroll: true });
    router.prefetch('/guest/review');
  }, [inSheet, router, selected]);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setMessage('');
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const mimeType = Object.hasOwn(labFileTypes, extension) ? labFileTypes[extension] : undefined;
    if (!mimeType || (file.type && file.type !== mimeType)) {
      setMessage('Choose a PDF, JPG, JPEG, or PNG file.');
    } else if (file.size === 0 || file.size > maxLabFileSize) {
      setMessage('Choose a non-empty file that is 10 MB or smaller.');
    } else {
      setSelected({
        file,
        mimeType,
        preview: mimeType.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      });
    }
  }

  function openReview(path: '/guest/review' | '/guest/chat') {
    if (leaving.current) return;
    leaving.current = true;
    onReviewStart?.();
    router.push(path);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || leaving.current) return;
    stageGuestReviewFile({ file: selected.file, mimeType: selected.mimeType });
    openReview('/guest/review');
  }

  function resume() {
    if (review?.status === 'ready') {
      stageGuestChat(review);
      openReview('/guest/chat');
    } else {
      openReview('/guest/review');
    }
  }

  if (!review)
    return (
      <p role="status" className="py-4 text-slate-700">
        Checking your guest session…
      </p>
    );

  const hasReview = ['ready', 'pending', 'failed', 'unavailable'].includes(review.status);
  const Heading = inSheet ? 'h2' : 'h1';
  const fileInputProps = {
    type: 'file',
    accept: '.pdf,.jpg,.jpeg,.png',
    onChange: selectFile,
  } as const;

  if (inSheet && !hasReview && !selected) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Upload your lab result
        </h2>
        <p className="mt-2 text-sm text-slate-700 sm:text-base">
          Upload a lab report to get started
        </p>
        <p id="lab-report-hint" className="mt-2 text-sm text-slate-600">
          JPEG, PDF, and PNG up to 10 MB
        </p>
        <input {...fileInputProps} ref={filePicker} hidden />
        {message && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {message}
          </p>
        )}
        <Button
          type="button"
          variant="brand"
          aria-describedby="lab-report-hint"
          className="mt-5 h-12 gap-2 rounded-xl px-6 text-base"
          onClick={() => filePicker.current?.click()}
        >
          <Upload aria-hidden="true" className="size-5" />
          Upload result
        </Button>
      </div>
    );
  }

  const backLink = !inSheet && (
    <Link
      href="/"
      className="mb-4 inline-block text-sm font-medium text-primary-blue underline underline-offset-2"
    >
      Back to welcome
    </Link>
  );

  if (hasReview) {
    return (
      <div className="mx-auto max-w-md text-center">
        {backLink}
        <Heading className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Your guest review
        </Heading>
        <p className="mt-2 text-sm text-slate-600">Continue where you left off.</p>
        <Button type="button" variant="brand" className="mt-5 h-12 rounded-xl" onClick={resume}>
          Continue to review
        </Button>
      </div>
    );
  }

  if (selected) {
    const format =
      selected.mimeType === 'application/pdf'
        ? 'PDF'
        : selected.mimeType === 'image/png'
          ? 'PNG'
          : 'JPEG';
    const size =
      selected.file.size >= 1024 * 1024
        ? (selected.file.size / (1024 * 1024)).toFixed(2) + ' MB'
        : Math.max(1, Math.round(selected.file.size / 1024)) + ' KB';

    return (
      <>
        {backLink}
        <form method="post" onSubmit={submit} className="grid gap-4">
          <div>
            <Heading
              ref={previewHeading}
              tabIndex={inSheet ? -1 : undefined}
              className="text-2xl font-semibold tracking-tight text-gray-900 outline-none sm:text-3xl"
            >
              File preview
            </Heading>
            <p className="mt-1 text-sm text-slate-600">
              Check that this is the lab report you want to review.
            </p>
          </div>
          <div className="grid min-w-0 gap-3 rounded-2xl border border-gray-200 p-4">
            <div className="min-w-0">
              <p className="font-medium break-all text-gray-900">{selected.file.name}</p>
              <p className="mt-0.5 text-sm text-slate-600">
                {format} · {size}
              </p>
            </div>
            <div className="grid min-h-26 place-items-center rounded-xl bg-slate-50 p-3">
              {selected.preview ? (
                <Image
                  src={selected.preview}
                  alt="Selected lab report preview"
                  width={360}
                  height={240}
                  unoptimized
                  className="h-auto max-h-[min(26dvh,13rem)] w-full object-contain"
                />
              ) : (
                <div className="grid justify-items-center gap-2 py-2 text-sm text-slate-600">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary-subtle text-primary-blue">
                    <FileText aria-hidden="true" className="size-6" />
                  </span>
                  PDF selected
                </div>
              )}
            </div>
          </div>
          {message && (
            <p role="alert" className="text-sm text-red-700">
              {message}
            </p>
          )}

          <input {...fileInputProps} ref={filePicker} hidden />
          <div className="grid gap-2 sm:grid-cols-2">
            <Button type="submit" variant="brand" className="h-12 rounded-xl">
              Get AI review
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-xl"
              onClick={() => filePicker.current?.click()}
            >
              Choose another file
            </Button>
          </div>
        </form>
      </>
    );
  }

  return (
    <>
      {backLink}
      <Heading className="text-3xl font-semibold tracking-tight text-gray-900">
        Upload your lab report
      </Heading>
      <p className="mt-2 text-slate-600">Get a clear explanation with one free guest upload.</p>
      <div className="mt-6 grid justify-items-start gap-2 rounded-2xl border border-gray-200 p-5 sm:p-7">
        <UploadCloud aria-hidden="true" className="size-6 text-primary-blue" />
        <label htmlFor="lab-report" className="font-semibold">
          Choose a lab report
        </label>
        <input
          id="lab-report"
          {...fileInputProps}
          aria-describedby="lab-report-hint"
          className="max-w-full cursor-pointer rounded-md text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-subtle file:px-4 file:py-2.5 file:font-medium file:text-primary-blue"
        />
        <p id="lab-report-hint" className="text-sm text-slate-600">
          PDF, JPG, JPEG, or PNG. Maximum 10 MB.
        </p>
        {message && (
          <p role="alert" className="text-sm text-red-700">
            {message}
          </p>
        )}
      </div>
    </>
  );
}
