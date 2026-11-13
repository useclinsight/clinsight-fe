'use server';

import { subscribeSchema } from '@/schemas/subscribe-schema';
import { backendUrl } from '@/lib/backend-url';

type SubscriptionActionResult =
  | { success: true; status: number }
  | { success: false; status: number; error: string };

const subscriptionDestinations = {
  lead_magnet: {
    groupId: process.env.MAILERLITE_LEAD_MAGNET_GROUP_ID?.trim(),
    tags: ['lead_magnet_guide'],
  },
  waitlist: {
    groupId: process.env.MAILERLITE_WAITLIST_GROUP_ID?.trim(),
    tags: ['waitlist'],
  },
} as const;

export async function submitSubscriptionAction(input: unknown): Promise<SubscriptionActionResult> {
  const parsedInput = subscribeSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, status: 400, error: 'Valid email required' };
  }

  const { email, first_name, source } = parsedInput.data;
  const destination = subscriptionDestinations[source];
  if (!destination.groupId) {
    return { success: false, status: 503, error: 'Subscription is unavailable' };
  }

  try {
    const response = await fetch(backendUrl('/api/v1/subscribe'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        first_name,
        group_id: destination.groupId,
        tags: destination.tags,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) return { success: true, status: response.status };

    const body = await response.json().catch(() => null);
    const detail = body?.detail ?? body?.message ?? body?.error;
    const message = typeof detail === 'string' ? detail : 'Something went wrong. Please try again.';
    const isDuplicate = response.status === 409 || /already|exist|duplicate/i.test(message);

    return isDuplicate
      ? { success: false, status: 409, error: 'This email is already subscribed!' }
      : { success: false, status: response.status, error: message };
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      return { success: false, status: 504, error: 'Request took too long. Please try again.' };
    }
    return { success: false, status: 502, error: 'Something went wrong. Please try again.' };
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
