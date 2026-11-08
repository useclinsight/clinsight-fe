'use server';

import { z } from 'zod';
import { guestUploadEnabled } from '@/lib/guest-upload-config';
import { apiBaseUrl } from '@/lib/patient-auth-api';
import {
  readGuestCase,
  readGuestReview,
  readGuestSession,
  startGuestSession,
} from '@/lib/patient-guest-session';
import { labApiRequest, listLabCases, readLabReview } from '@/lib/patient-lab-api';
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

const chatHistorySchema = z.object({
  data: z.array(
    z.object({
      id: z.uuid(),
      sender_type: z.enum(['patient', 'ai', 'file']),
      content: z.object({
        message: z.string().optional(),
        text: z.string().optional(),
        body: z.string().optional(),
      }),
    }),
  ),
});

export async function loadGuestChatHistory() {
  if (!guestUploadEnabled() || (await getPatientSession()).status !== 'signed-out') {
    return { status: 'expired' } as const;
  }

  try {
    const result = await readGuestCase();
    if (result.status !== 'ok') return { status: result.status };
    const response = await labApiRequest('/cases/' + result.caseId + '/chat', {
      headers: { 'x-guest-session-id': result.guestId },
    });
    if ([401, 403, 404, 410].includes(response.status)) return { status: 'expired' } as const;
    if (!response.ok) return { status: 'unavailable' } as const;

    const parsed = chatHistorySchema.safeParse(await response.json());
    if (!parsed.success) return { status: 'unavailable' } as const;
    const messages = parsed.data.data.flatMap(({ id, sender_type: sender, content }) => {
      const text = (content.message ?? content.text ?? content.body)?.trim();
      return sender !== 'file' && text ? [{ id, sender, text }] : [];
    });
    return { status: 'ok', messages } as const;
  } catch {
    return { status: 'unavailable' } as const;
  }
}
