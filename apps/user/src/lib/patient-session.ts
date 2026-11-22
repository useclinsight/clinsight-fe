import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { readPatient, tokenSchema, type PatientTokens } from './patient-auth-api';

const accessCookie = 'patient_access';
const refreshCookie = 'patient_refresh';
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;

export async function readSessionCookies() {
  const store = await cookies();
  return {
    accessToken: tokenSchema.safeParse(store.get(accessCookie)?.value).data,
    refreshToken: tokenSchema.safeParse(store.get(refreshCookie)?.value).data,
  };
}

export async function writeSessionCookies(tokens: PatientTokens) {
  const store = await cookies();
  store.set(accessCookie, tokens.access_token, { ...cookieOptions, maxAge: tokens.expires_in });
  store.set(refreshCookie, tokens.refresh_token, cookieOptions);
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.set(accessCookie, '', { ...cookieOptions, maxAge: 0 });
  store.set(refreshCookie, '', { ...cookieOptions, maxAge: 0 });
}

export const getPatientSession = cache(async () => {
  const { accessToken, refreshToken } = await readSessionCookies();
  const expired = refreshToken ? ('refresh' as const) : ('signed-out' as const);
  if (!accessToken) return { status: expired };

  const profile = await readPatient(accessToken);
  if (profile.status === 'ok') return profile;
  if (profile.status === 'expired') return { status: expired };
  if (profile.status === 'unavailable') return profile;
  return { status: 'signed-out' } as const;
});
