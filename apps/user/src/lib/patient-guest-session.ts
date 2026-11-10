import 'server-only';

import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { listLabCases, labApiRequest, readLabReview } from './patient-lab-api';
import type { LabReview } from './lab-review';

const sessionCookie = 'patient_guest_session';
const browserCookie = 'patient_guest_browser';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;

const sessionSchema = z.object({
  data: z.object({ guest_session_id: z.uuid(), expires_in: z.number().int().positive() }),
});

export async function readGuestSession() {
  const store = await cookies();
  return z.uuid().safeParse(store.get(sessionCookie)?.value).data;
}

export async function clearGuestSession() {
  const store = await cookies();
  store.set(sessionCookie, '', { ...cookieOptions, maxAge: 0 });
}

export async function startGuestSession() {
  const store = await cookies();
  const browser = z.uuid().safeParse(store.get(browserCookie)?.value).data ?? randomUUID();
  store.set(browserCookie, browser, { ...cookieOptions, maxAge: 180 * 24 * 60 * 60 });

  const response = await labApiRequest('/guest-session', {
    method: 'POST',
    headers: { 'X-Device-Fingerprint': browser },
  });
  if (response.status === 429) return { status: 'limited' } as const;
  if (!response.ok) return { status: 'unavailable' } as const;
  const parsed = sessionSchema.safeParse(await response.json());
  if (!parsed.success) return { status: 'unavailable' } as const;
  const { guest_session_id: guestId, expires_in: maxAge } = parsed.data.data;
  store.set(sessionCookie, guestId, { ...cookieOptions, maxAge });
  return { status: 'ok', guestId } as const;
}

export async function readGuestCase() {
  const guestId = await readGuestSession();
  if (!guestId) return { status: 'empty' } as const;
  const result = await listLabCases({ guestId });
  if (result.status !== 'ok') return { status: result.status };
  const firstCase = result.cases[0];
  return firstCase
    ? ({ status: 'ok', guestId, caseId: firstCase.id } as const)
    : ({ status: 'empty' } as const);
}

export async function readGuestReview(): Promise<LabReview> {
  const result = await readGuestCase();
  if (result.status !== 'ok') return { status: result.status };
  return readLabReview(result.caseId, { guestId: result.guestId });
}
