'use client';

import { Button } from '@clinsight/ui';
import { FileText, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { loadGuestReview, prepareGuestUpload } from '@/actions/patient-guest';
import { withSessionLock } from '@/lib/browser-session-lock';
import { labFileTypes, maxLabFileSize, type LabReview } from '@/lib/lab-review';
import { PatientLabReview } from './PatientLabReview';

type Selection = { file: File; mimeType: string; preview?: string };

export function PatientGuestUpload({ initialReview }: { initialReview: LabReview }) {
  const [review, setReview] = useState(initialReview);
  const [selected, setSelected] = useState<Selection>();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const uploading = useRef(false);

  useEffect(() => {
    const preview = selected?.preview;
    if (preview) return () => URL.revokeObjectURL(preview);
  }, [selected]);

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setSelected(undefined);
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || uploading.current) return;
    uploading.current = true;
    setBusy(true);
    setMessage('');
    try {
      const outcome = await withSessionLock(async () => {
        const prepared = await prepareGuestUpload();
        if (prepared.status === 'existing') return 'accepted';
        if (prepared.status === 'limited') return 'limited';
        if (prepared.status !== 'ready') return 'unavailable';

        const form = new FormData();
        form.append(
          'file',
          new Blob([selected.file], { type: selected.mimeType }),
          selected.file.name,
        );
        try {
          const response = await fetch(prepared.endpoint, {
            method: 'POST',
            headers: { 'x-guest-session-id': prepared.guestId },
            body: form,
            credentials: 'omit',
            redirect: 'error',
            signal: AbortSignal.timeout(120000),
          });
          if (response.ok) return 'accepted';
          if (response.status === 429) return 'limited';
          if (response.status === 400 || response.status === 413 || response.status === 422)
            return 'invalid';
          return 'check';
        } catch {
          return 'check';
        }
      });
      if (outcome === 'accepted') {
        setSelected(undefined);
        setReview({ status: 'pending' });
        return;
      }
      if (outcome === 'check') {
        const existing = await loadGuestReview();
        if (['pending', 'ready', 'failed'].includes(existing.status)) {
          setSelected(undefined);
          setReview(existing);
          return;
        }
      }
      const errors = {
        limited: 'Too many attempts. Please wait a moment and try again.',
        invalid:
          'The upload was rejected. Check that your report is a supported file and no larger than 10 MB.',
        unavailable: 'We couldn’t start a guest upload. Your selected file is still here.',
        check:
          'We couldn’t confirm the upload. Try again to check for the result before sending another copy.',
      };
      setMessage(errors[outcome]);
    } catch {
      setMessage(
        'We couldn’t upload your report. Your selected file is still here. Please try again.',
      );
    } finally {
      uploading.current = false;
      setBusy(false);
    }
  }

  const hasReview = ['ready', 'pending', 'failed', 'unavailable'].includes(review.status);

  return (
    <>
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm font-medium text-primary-blue underline underline-offset-2"
        >
          Back to welcome
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
          {hasReview ? 'Your lab explanation' : 'Upload your lab report'}
        </h1>
        {!hasReview && (
          <p className="mt-2 text-slate-600">Get a clear explanation with one free guest upload.</p>
        )}
      </div>
      {hasReview ? (
        <>
          <PatientLabReview initialReview={review} loadReviewAction={loadGuestReview} />
          {['pending', 'ready'].includes(review.status) && (
            <div className="mt-5 rounded-2xl border border-gray-200 p-5">
              <p className="font-medium">Keep this result in your account</p>
              <p className="mt-1 text-sm text-slate-600">
                Create a free Clinsight account to save your report and its explanation.
              </p>
              <Button asChild variant="brand" className="mt-4 rounded-xl">
                <Link href="/signup?from=guest">Create an account</Link>
              </Button>
            </div>
          )}
        </>
      ) : (
        <form
          method="post"
          onSubmit={submit}
          aria-busy={busy}
          className="grid gap-4 rounded-2xl border border-gray-200 p-5 sm:p-7"
        >
          <div className="grid justify-items-start gap-2">
            <UploadCloud aria-hidden="true" className="size-6 text-primary-blue" />
            <label htmlFor="lab-report" className="font-semibold">
              Choose a lab report
            </label>
            <input
              id="lab-report"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              aria-describedby="lab-report-hint"
              disabled={busy}
              onChange={selectFile}
              className="max-w-full cursor-pointer rounded-md text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-subtle file:px-4 file:py-2.5 file:font-medium file:text-primary-blue"
            />
            <p id="lab-report-hint" className="text-sm text-slate-600">
              PDF, JPG, JPEG, or PNG. Maximum 10 MB.
            </p>
          </div>
          {selected && (
            <div className="grid gap-3 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <FileText aria-hidden="true" className="size-5 shrink-0 text-primary-blue" />
                <div className="min-w-0">
                  <p className="font-medium break-all">{selected.file.name}</p>
                  <p className="text-sm text-slate-600">
                    {(selected.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {selected.preview && (
                <Image
                  src={selected.preview}
                  alt="Selected lab report preview"
                  width={360}
                  height={240}
                  unoptimized
                  className="max-h-60 w-full object-contain"
                />
              )}
            </div>
          )}
          {message && (
            <p role="alert" className="text-sm text-red-700">
              {message}
            </p>
          )}
          {busy && (
            <p role="status" className="text-sm text-slate-700">
              Uploading your report…
            </p>
          )}
          <Button
            type="submit"
            variant="brand"
            className="h-12 rounded-xl"
            disabled={!selected || busy}
          >
            Upload and get explanation
          </Button>
        </form>
      )}
    </>
  );
}
