import { NextResponse } from 'next/server';
import { EMAIL_REGEX } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const BACKEND_URL =
      process.env.NEXT_PUBLIC_RESEND_OTP_API_URL ||
      'https://api.staging.useclinsight.com/api/v1/auth/resend-otp';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(BACKEND_URL, {
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
        let errorMessage = 'Failed to resend code';
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          const err = await response.json();

          if (response.status === 422 && Array.isArray(err.detail) && err.detail.length > 0) {
            errorMessage = err.detail[0].msg;
          } else {
            errorMessage = err.message || err.error || JSON.stringify(err);
          }
        } else {
          errorMessage = await response.text();
        }

        return NextResponse.json({ error: errorMessage }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json({ error: 'Connection timeout occurred' }, { status: 504 });
      }

      throw fetchError;
    }
  } catch (error) {
    const err = error as Error;
    console.error('Resend OTP proxy trace error:', err.message);
    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { error: isDev ? err.message : 'Internal proxy failure' },
      { status: 500 },
    );
  }
}
