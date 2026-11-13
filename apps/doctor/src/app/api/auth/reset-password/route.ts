import { NextResponse } from 'next/server';
import { backendUrl } from '@/lib/backend-url';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body.token;
    const new_password = body.new_password;

    if (typeof token !== 'string' || !token.trim() || typeof new_password !== 'string') {
      return NextResponse.json(
        { error: 'Reset token and new password are required' },
        { status: 400 },
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(backendUrl('/api/v1/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ token, new_password }),
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
