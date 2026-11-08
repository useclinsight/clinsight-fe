'use server';

import { guestUploadEnabled } from '@/lib/guest-upload-config';
import { apiBaseUrl } from '@/lib/patient-auth-api';
import { readGuestReview, readGuestSession, startGuestSession } from '@/lib/patient-guest-session';
import { listLabCases, readLabReview } from '@/lib/patient-lab-api';
import { getPatientSession, readSessionCookies } from '@/lib/patient-session';
import type { LabReview } from '@/lib/lab-review';

export async function prepareGuestUpload() {
  if (!guestUploadEnabled() || (await getPatientSession()).status !== 'signed-out') {
    return { status: 'unavailable' } as const;
  }

  try {
    let guestId = await readGuestSession();
    if (guestId) {
      const result = await listLabCases({ guestId });
      if (result.status === 'ok') {
        if (result.cases.length) return { status: 'existing' } as const;
      } else if (result.status === 'expired') {
        guestId = undefined;
      } else {
        return { status: 'unavailable' } as const;
      }
    }
    if (!guestId) {
      const session = await startGuestSession();
      if (session.status !== 'ok') return session;
      guestId = session.guestId;
      const result = await listLabCases({ guestId });
      if (result.status !== 'ok') return { status: 'unavailable' } as const;
      if (result.cases.length) return { status: 'existing' } as const;
    }

    // The existing upload API requires this guest-only credential on the browser request.
    return { status: 'ready', endpoint: apiBaseUrl() + '/api/v1/upload', guestId } as const;
  } catch {
    return { status: 'unavailable' } as const;
  }
}

export async function loadGuestReview(): Promise<LabReview> {
  if (!guestUploadEnabled() || (await getPatientSession()).status !== 'signed-out') {
    return { status: 'unavailable' };
  }
  return readGuestReview();
}

export async function loadPatientReview(caseId: string): Promise<LabReview> {
  if (!guestUploadEnabled() || (await getPatientSession()).status !== 'ok') {
    return { status: 'expired' };
  }
  const { accessToken } = await readSessionCookies();
  if (!accessToken) return { status: 'expired' };
  return readLabReview(caseId, { accessToken });
}
