import { NextResponse } from 'next/server';
import { subscribeSchema } from '@/schemas/subscribe-schema';

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

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { email, first_name, source } = result.data;
    const destination = subscriptionDestinations[source];

    if (!destination.groupId) {
      console.error(`Missing MailerLite group configuration for subscription source: ${source}`);
      return NextResponse.json({ error: 'Subscription is unavailable' }, { status: 503 });
    }

    const apiBaseUrl = (process.env.API_BASE_URL || 'https://api.staging.useclinsight.com').replace(
      /\/+$/,
      '',
    );
    const SUBSCRIBE_API_URL = `${apiBaseUrl}/api/v1/subscribe`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(SUBSCRIBE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          first_name,
          group_id: destination.groupId,
          tags: destination.tags,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Backend error';
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const rawBody = await response.text();

          try {
            const err = JSON.parse(rawBody);
            errorMessage =
              err.detail || err.message || err.error || JSON.stringify(err) || 'Backend error';
          } catch {
            errorMessage = rawBody || 'Backend error';
          }
        } else {
          errorMessage = await response.text();
        }

        const isDuplicate =
          response.status === 409 ||
          errorMessage.toLowerCase().includes('already') ||
          errorMessage.toLowerCase().includes('exist') ||
          errorMessage.toLowerCase().includes('duplicate');

        if (isDuplicate) {
          return NextResponse.json({ error: 'This email is already subscribed!' }, { status: 409 });
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Subscribe API timeout:', fetchError.message);
        return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
      }
      throw fetchError;
    }
  } catch (error) {
    const err = error as Error;

    console.error('Subscribe API error:', err.message, err.stack);

    if (err.message.includes('timeout') || err.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
    }

    if (err.message.includes('fetch') || err.message.includes('network')) {
      return NextResponse.json({ error: 'Unable to reach backend service' }, { status: 502 });
    }

    const isDev = process.env.NODE_ENV === 'development';
    const errorMessage = isDev ? err.message : 'Failed to subscribe';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
