import 'server-only';

import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { PatientSignIn } from '@/schemas/patient-sign-in';

const patientSchema = z.object({
  id: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: z.literal('patient'),
  is_active: z.literal(true),
  is_email_verified: z.literal(true),
});

export const tokenSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_.-]+$/)
  .max(3800);
const tokensSchema = z.object({
  access_token: tokenSchema,
  refresh_token: tokenSchema,
  expires_in: z.number().int().positive(),
});

export const patientSessionResponseSchema = z.object({
  data: tokensSchema.extend({ user: patientSchema }),
});
const refreshResponseSchema = z.object({ data: tokensSchema });
const profileResponseSchema = z.object({ data: patientSchema });

export type Patient = z.infer<typeof patientSchema>;
export type PatientTokens = z.infer<typeof tokensSchema>;

export function apiBaseUrl() {
  const url = new URL(process.env.API_BASE_URL ?? '');
  const isLocalDevelopment =
    process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1'].includes(url.hostname);

  if (
    (url.protocol !== 'https:' && !(isLocalDevelopment && url.protocol === 'http:')) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error('Set API_BASE_URL to the patient API origin.');
  }

  return url.origin;
}

export function authRequest(
  endpoint:
    | 'login'
    | 'me'
    | 'refresh'
    | 'logout'
    | 'signup'
    | 'verify-otp'
    | 'resend-otp'
    | 'forgot-password'
    | 'verify-reset-otp'
    | 'reset-password',
  init?: RequestInit,
): Promise<Response> {
  return fetch(`${apiBaseUrl()}/api/v1/auth/${endpoint}`, {
    ...init,
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(8000),
  });
}

const jsonHeaders = { 'Content-Type': 'application/json' };

export async function loginPatient(input: PatientSignIn) {
  try {
    const response = await authRequest('login', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify({ ...input, platform: 'web', device_id: randomUUID() }),
    });

    if ([400, 401, 403, 404, 422].includes(response.status)) {
      return { status: 'invalid' } as const;
    }
    if (response.status === 429) return { status: 'limited' } as const;
    if (!response.ok) return { status: 'unavailable' } as const;

    const parsed = patientSessionResponseSchema.safeParse(await response.json());
    if (!parsed.success) return { status: 'unavailable' } as const;
    return { status: 'ok', tokens: parsed.data.data } as const;
  } catch {
    return { status: 'unavailable' } as const;
  }
}

export async function readPatient(accessToken: string) {
  try {
    const response = await authRequest('me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status === 401) return { status: 'expired' } as const;
    if (response.status === 403 || response.status === 404) {
      return { status: 'denied' } as const;
    }
    if (!response.ok) return { status: 'unavailable' } as const;

    const parsed = profileResponseSchema.safeParse(await response.json());
    if (!parsed.success) return { status: 'denied' } as const;
    return { status: 'ok', patient: parsed.data.data } as const;
  } catch {
    return { status: 'unavailable' } as const;
  }
}

export async function refreshPatient(refreshToken: string) {
  try {
    const response = await authRequest('refresh', {
      method: 'POST',
      headers: { Cookie: `refresh_token=${refreshToken}` },
    });
    if ([400, 401, 403].includes(response.status)) return { status: 'expired' } as const;
    if (!response.ok) return { status: 'unavailable' } as const;

    const parsed = refreshResponseSchema.safeParse(await response.json());
    if (!parsed.success) return { status: 'unavailable' } as const;
    return { status: 'ok', tokens: parsed.data.data } as const;
  } catch {
    return { status: 'unavailable' } as const;
  }
}

export async function revokePatientSession(accessToken: string, refreshToken: string) {
  try {
    const response = await authRequest('logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `refresh_token=${refreshToken}`,
      },
    });
    if (response.status === 401) return 'expired';
    return response.ok ? 'ok' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}
