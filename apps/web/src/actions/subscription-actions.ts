'use server';

import { headers } from 'next/headers';
import { subscribeSchema } from '@/schemas/subscribe-schema';

type SubscriptionActionResult =
  | { success: true; status: number }
  | { success: false; status: number; error: string };

async function getSubscriptionRouteUrl() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');

  if (origin) {
    try {
      return new URL('/api/v1/subscribe', origin).toString();
    } catch {
      // Fall back to the request host below.
    }
  }

  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  if (!host) return null;

  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http';

  try {
    return new URL(`/api/v1/subscribe`, `${protocol}://${host}`).toString();
  } catch {
    return null;
  }
}

export async function submitSubscriptionAction(input: unknown): Promise<SubscriptionActionResult> {
  const parsedInput = subscribeSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, status: 400, error: 'Valid email required' };
  }

  const routeUrl = await getSubscriptionRouteUrl();
  if (!routeUrl) {
    return { success: false, status: 500, error: 'Subscription is unavailable' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(routeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedInput.data),
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') ?? '';
    let error = 'Something went wrong. Please try again.';

    if (!response.ok) {
      if (contentType.includes('application/json')) {
        try {
          const data = (await response.json()) as { error?: unknown };
          if (typeof data.error === 'string') error = data.error;
        } catch {
          // Keep the safe default error message.
        }
      }

      return { success: false, status: response.status, error };
    }

    return { success: true, status: response.status };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, status: 504, error: 'Request took too long. Please try again.' };
    }

    return { success: false, status: 502, error: 'Something went wrong. Please try again.' };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function submitLeadFormAction(input: { firstName: string; email: string }) {
  return submitSubscriptionAction({
    email: input.email,
    first_name: input.firstName,
    source: 'lead_magnet',
  });
}

export async function submitWaitlistFormAction(input: { firstName: string; email: string }) {
  return submitSubscriptionAction({
    email: input.email,
    first_name: input.firstName,
    source: 'waitlist',
  });
}
