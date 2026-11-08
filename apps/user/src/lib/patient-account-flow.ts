import 'server-only';

import { cookies } from 'next/headers';
import { z } from 'zod';
import { patientEmail } from '@/schemas/patient-account';

export type EmailFlow = 'signup' | 'recovery';
const emailCookie = { signup: 'patient_signup_email', recovery: 'patient_recovery_email' };
const resetCookie = 'patient_password_reset';
const signupGuestCookie = 'patient_signup_guest';
const flowLifetime = 30 * 60;
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;

export const resetGrantSchema = z.object({
  data: z.object({
    reset_token: z.string().min(6).max(512),
    expires_in_seconds: z.number().int().positive(),
  }),
});

export async function readFlowEmail(flow: EmailFlow) {
  const jar = await cookies();
  return patientEmail.safeParse(jar.get(emailCookie[flow])?.value).data;
}

export async function beginEmailFlow(flow: EmailFlow, email: string, guestId?: string | null) {
  const jar = await cookies();
  jar.set(emailCookie[flow], email, { ...options, maxAge: flowLifetime });
  if (flow === 'signup' && guestId !== undefined) {
    jar.set(signupGuestCookie, guestId ?? '', { ...options, maxAge: guestId ? flowLifetime : 0 });
  }
  if (flow === 'recovery') jar.set(resetCookie, '', { ...options, maxAge: 0 });
}

export async function readSignupGuest() {
  const jar = await cookies();
  return z.uuid().safeParse(jar.get(signupGuestCookie)?.value).data;
}

export async function readResetGrant() {
  const jar = await cookies();
  return jar.get(resetCookie)?.value;
}

export async function storeResetGrant(token: string, expiresIn: number) {
  const jar = await cookies();
  jar.set(resetCookie, token, { ...options, maxAge: Math.min(expiresIn, flowLifetime) });
}

export async function clearEmailFlow(flow: EmailFlow) {
  const jar = await cookies();
  jar.set(emailCookie[flow], '', { ...options, maxAge: 0 });
  if (flow === 'signup') jar.set(signupGuestCookie, '', { ...options, maxAge: 0 });
  if (flow === 'recovery') jar.set(resetCookie, '', { ...options, maxAge: 0 });
}
