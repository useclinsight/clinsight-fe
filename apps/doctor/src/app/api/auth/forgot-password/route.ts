import { NextResponse } from 'next/server';
import { EMAIL_REGEX } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // 1. Initial Local Input Check
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const FORGOT_PASSWORD_API_URL =
      process.env.NEXT_PUBLIC_AUTH_API_URL ||
      'https://api.staging.useclinsight.com/api/v1/auth/forgot-password';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(FORGOT_PASSWORD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!response.ok) {
        let errorMessage = 'Authentication service failure';
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          try {
            const err = await response.json();
            errorMessage = err.detail || err.message || err.error || JSON.stringify(err);
          } catch {
            errorMessage = await response.text();
          }
        } else {
          errorMessage = await response.text();
        }
        return NextResponse.json({ error: errorMessage }, { status: response.status });
      }

      // Return Success Stream back to Client
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Forgot Password API timeout.');
        return NextResponse.json({ error: 'Network communication timeout' }, { status: 504 });
      }
      throw fetchError;
    }
  } catch (error) {
    const err = error as Error;
    console.error('Proxy routing fallback trace:', err.message);

    if (err.message.includes('fetch') || err.message.includes('network')) {
      return NextResponse.json({ error: 'Unable to reach backend gateway' }, { status: 502 });
    }

    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { error: isDev ? err.message : 'An unexpected error occurred processing your request' },
      { status: 500 },
    );
  }
}
