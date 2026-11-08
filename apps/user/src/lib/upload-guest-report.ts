import { loadGuestReview, prepareGuestUpload } from '@/actions/patient-guest';
import { withSessionLock } from './browser-session-lock';
import type { GuestReviewFile } from './guest-review-transfer';
import type { LabReview } from './lab-review';

const uploadErrors = {
  limited: 'Too many attempts. Please wait a moment and try again.',
  invalid:
    'The upload was rejected. Check the file type and make sure the report is no larger than 10 MB.',
  unavailable: 'We couldn’t start a guest upload. Your selected file is still here.',
  check:
    'We couldn’t confirm the upload. Try again to check for the result before sending another copy.',
};

export async function uploadGuestReport(
  selected: GuestReviewFile,
  signal: AbortSignal,
): Promise<LabReview | { status: 'upload-error'; message: string }> {
  const outcome = await withSessionLock(async () => {
    if (signal.aborted) return 'unavailable';
    const prepared = await prepareGuestUpload();
    if (signal.aborted) return 'unavailable';
    if (prepared.status === 'existing') return 'accepted';
    if (prepared.status === 'limited') return 'limited';
    if (prepared.status !== 'ready') return 'unavailable';

    const form = new FormData();
    form.append('file', new Blob([selected.file], { type: selected.mimeType }), selected.file.name);
    const request = new AbortController();
    const abortRequest = () => request.abort();
    signal.addEventListener('abort', abortRequest, { once: true });
    const timeout = setTimeout(abortRequest, 120000);
    try {
      const response = await fetch(prepared.endpoint, {
        method: 'POST',
        headers: { 'x-guest-session-id': prepared.guestId },
        body: form,
        credentials: 'omit',
        redirect: 'error',
        signal: request.signal,
      });
      if (response.ok) return 'accepted';
      if (response.status === 429) return 'limited';
      if ([400, 413, 422].includes(response.status)) return 'invalid';
      return 'check';
    } catch {
      return 'check';
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener('abort', abortRequest);
    }
  }).catch(() => 'unavailable' as const);

  if (outcome === 'accepted') return { status: 'pending' };
  if (outcome === 'check' && !signal.aborted) {
    const existing = await loadGuestReview().catch(() => ({ status: 'unavailable' }) as const);
    if (
      existing.status === 'pending' ||
      existing.status === 'ready' ||
      existing.status === 'failed'
    ) {
      return existing;
    }
  }
  return { status: 'upload-error', message: uploadErrors[outcome] };
}
