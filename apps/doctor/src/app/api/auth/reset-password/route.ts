import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token || body.reset_token || body.otp;
    const new_password = body.new_password || body.password;

    if (!new_password) {
      return NextResponse.json({ error: 'New password is required' }, { status: 400 });
    }

    const RESET_PASSWORD_API_URL =
      process.env.RESET_PASSWORD_API_URL ||
      process.env.NEXT_PUBLIC_RESET_PASSWORD_API_URL ||
      `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.useclinsight.com'}/api/v1/auth/reset-password`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const payload: Record<string, string> = {
        new_password,
      };
      if (body.email) payload.email = body.email;
      if (token) {
        payload.token = token;
        payload.reset_token = token;
      }

      const response = await fetch(RESET_PASSWORD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let responseData;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = { message: await response.text() };
      }

      if (!response.ok) {
        const errorMessage =
          responseData.message || responseData.error || 'Failed to reset password';
        return NextResponse.json({ error: errorMessage }, { status: response.status });
      }

      return NextResponse.json(responseData, { status: 200 });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Password Reset API timeout:', fetchError.message);
        return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
      }
      throw fetchError;
    }
  } catch (error) {
    const err = error as Error;
    console.error('Password Reset API Route error:', err.message);

    if (err.message.includes('fetch') || err.message.includes('network')) {
      return NextResponse.json({ error: 'Unable to reach backend service' }, { status: 502 });
    }

    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { error: isDev ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
