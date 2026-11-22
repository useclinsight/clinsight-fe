'use server';

import { redirect } from 'next/navigation';
import { patientSignInSchema, type PatientSignIn } from '@/schemas/patient-sign-in';
import {
  loginPatient,
  readPatient,
  refreshPatient,
  revokePatientSession,
} from '@/lib/patient-auth-api';
import {
  clearSessionCookies,
  readSessionCookies,
  writeSessionCookies,
} from '@/lib/patient-session';

export async function signIn(input: PatientSignIn) {
  const parsed = patientSignInSchema.safeParse(input);
  if (!parsed.success) return { message: 'Enter a valid email address and password.' };

  const result = await loginPatient(parsed.data);
  if (result.status === 'invalid') {
    return { message: 'Check your email and password and make sure your email is verified.' };
  }
  if (result.status === 'limited') {
    return { message: 'Too many sign-in attempts. Please wait before trying again.' };
  }
  if (result.status === 'unavailable') {
    return { message: 'Sign-in is temporarily unavailable. Please try again.' };
  }

  await writeSessionCookies(result.tokens);
  return { success: true } as const;
}

export async function restoreSession(): Promise<'restored' | 'expired' | 'unavailable'> {
  const { accessToken, refreshToken } = await readSessionCookies();
  if (accessToken) {
    const profile = await readPatient(accessToken);
    if (profile.status === 'ok') return 'restored';
    if (profile.status === 'unavailable') return 'unavailable';
    if (profile.status === 'denied') {
      await clearSessionCookies();
      return 'expired';
    }
  }
  if (!refreshToken) return 'expired';

  const result = await refreshPatient(refreshToken);
  if (result.status === 'unavailable') return 'unavailable';
  if (result.status === 'expired') {
    await clearSessionCookies();
    return 'expired';
  }

  // Refresh is shared across roles, so confirm the replacement belongs to an active patient.
  const profile = await readPatient(result.tokens.access_token);
  if (profile.status === 'denied' || profile.status === 'expired') {
    await revokePatientSession(result.tokens.access_token, result.tokens.refresh_token);
    await clearSessionCookies();
    return 'expired';
  }

  // Persist the rotated pair even if the profile check temporarily failed.
  await writeSessionCookies(result.tokens);
  return profile.status === 'ok' ? 'restored' : 'unavailable';
}

export async function signOut() {
  const { accessToken, refreshToken } = await readSessionCookies();
  let result: 'ok' | 'expired' | 'unavailable' = 'ok';

  if (refreshToken) {
    result = accessToken ? await revokePatientSession(accessToken, refreshToken) : 'expired';
    if (result === 'expired') {
      const refreshed = await refreshPatient(refreshToken);
      if (refreshed.status === 'ok') {
        result = await revokePatientSession(
          refreshed.tokens.access_token,
          refreshed.tokens.refresh_token,
        );
      } else {
        result = refreshed.status;
      }
    }
  } else if (accessToken) {
    result = 'unavailable';
  }

  await clearSessionCookies();
  redirect(result === 'unavailable' ? '/login?signout=local' : '/login');
}
