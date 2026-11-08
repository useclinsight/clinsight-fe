'use server';

import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import {
  beginEmailFlow,
  clearEmailFlow,
  readFlowEmail,
  readResetGrant,
  resetGrantSchema,
  storeResetGrant,
  type EmailFlow,
} from '@/lib/patient-account-flow';
import { authRequest, patientSessionResponseSchema } from '@/lib/patient-auth-api';
import { writeSessionCookies } from '@/lib/patient-session';
import {
  emailCodeSchema,
  newPasswordSchema,
  recoverySchema,
  signupSchema,
} from '@/schemas/patient-account';

type AccountEndpoint =
  | 'signup'
  | 'verify-otp'
  | 'resend-otp'
  | 'forgot-password'
  | 'verify-reset-otp'
  | 'reset-password';
const unavailable = { message: 'Something went wrong. Please try again.' };
const expired = { message: 'This step has expired. Please start again.' };
const invalidCode = {
  message: 'That code is incorrect or expired. Try again or request a new code.',
};

async function submit(endpoint: AccountEndpoint, body: object) {
  try {
    return await authRequest(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return null;
  }
}

function failure(response: Response | null, invalid: { message: string }) {
  if (response?.status === 429) return { message: 'Too many attempts. Please wait and try again.' };
  return response && [400, 401, 403, 404, 409, 410, 422].includes(response.status)
    ? invalid
    : unavailable;
}

export async function signUpPatient(input: unknown) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return { message: 'Check the account details and password requirements.' };
  const response = await submit('signup', parsed.data);
  if (response?.status === 409) {
    return { message: 'An account already exists for this email. Sign in or reset your password.' };
  }
  if (!response?.ok)
    return failure(response, { message: 'Check the account details and try again.' });

  await beginEmailFlow('signup', parsed.data.email);
  redirect('/signup?step=verify');
}

export async function verifyPatientEmail(input: unknown, expectedEmail: string) {
  const email = await readFlowEmail('signup');
  if (!email || email !== expectedEmail) return expired;
  const parsed = emailCodeSchema.safeParse(input);
  if (!parsed.success) return invalidCode;

  const response = await submit('verify-otp', {
    email,
    code: parsed.data.code,
    purpose: 'email_verification',
    role: 'patient',
    platform: 'web',
    device_id: randomUUID(),
  });
  if (!response?.ok) return failure(response, invalidCode);
  const session = patientSessionResponseSchema.safeParse(await response.json().catch(() => null));
  if (!session.success) return unavailable;

  await writeSessionCookies(session.data.data);
  await clearEmailFlow('signup');
  redirect('/');
}

export async function requestPatientReset(input: unknown) {
  const parsed = recoverySchema.safeParse(input);
  if (!parsed.success) return { message: 'Enter a valid email address.' };
  const { email } = parsed.data;
  const response = await submit('forgot-password', { email, role: 'patient' });
  if (!response?.ok)
    return failure(response, { message: 'Check your email address and try again.' });

  await beginEmailFlow('recovery', email);
  redirect('/forgot-password?step=verify');
}

export async function resendPatientCode(flow: EmailFlow, expectedEmail: string) {
  if (flow !== 'signup' && flow !== 'recovery') return expired;
  const email = await readFlowEmail(flow);
  if (!email || email !== expectedEmail) return expired;
  const response = await submit(flow === 'signup' ? 'resend-otp' : 'forgot-password', {
    email,
    role: 'patient',
  });
  if (!response?.ok)
    return failure(response, { message: 'We couldn’t send a code. Start again or sign in.' });

  await beginEmailFlow(flow, email);
  return {
    success: true,
    message:
      flow === 'signup'
        ? 'Check your email for a new verification code.'
        : 'If this email is registered, you’ll receive a new reset code.',
  };
}

export async function verifyPatientReset(input: unknown, expectedEmail: string) {
  const email = await readFlowEmail('recovery');
  if (!email || email !== expectedEmail) return expired;
  const parsed = emailCodeSchema.safeParse(input);
  if (!parsed.success) return invalidCode;

  const response = await submit('verify-reset-otp', {
    email,
    code: parsed.data.code,
    role: 'patient',
  });
  if (!response?.ok) return failure(response, invalidCode);
  const grant = resetGrantSchema.safeParse(await response.json().catch(() => null));
  if (!grant.success) return unavailable;

  await storeResetGrant(grant.data.data.reset_token, grant.data.data.expires_in_seconds);
  redirect('/forgot-password?step=password');
}

export async function setPatientPassword(input: unknown, expectedEmail: string) {
  const email = await readFlowEmail('recovery');
  const token = await readResetGrant();
  if (!email || email !== expectedEmail || !token) return expired;
  const parsed = newPasswordSchema.safeParse(input);
  if (!parsed.success)
    return { message: 'Check that both passwords match and meet the requirements.' };

  const response = await submit('reset-password', {
    token,
    new_password: parsed.data.new_password,
  });
  if (response?.status === 401 || response?.status === 410) {
    await clearEmailFlow('recovery');
    redirect('/forgot-password?expired=1');
  }
  if (!response?.ok)
    return failure(response, { message: 'Check the new password requirements and try again.' });

  await clearEmailFlow('recovery');
  redirect('/login?password=updated');
}
