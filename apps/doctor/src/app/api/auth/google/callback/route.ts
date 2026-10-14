import { NextRequest, NextResponse } from 'next/server';

import { applyAuthCookies, readAuthTokens } from '@/lib/auth-session';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.useclinsight.com';

function buildApiGoogleCallbackUrl(code: string, state: string | null) {
  const callbackUrl = new URL(`${BASE_URL.replace(/\/$/, '')}/api/v1/auth/google/callback`);
  callbackUrl.searchParams.set('code', code);
  if (state) {
    callbackUrl.searchParams.set('state', state);
  }
  return callbackUrl.toString();
}

function establishSessionFromTokens(accessToken: string, refreshToken: string | null) {
  const response = NextResponse.json({
    status: 'success',
    message: 'Session established.',
  });
  applyAuthCookies(response, accessToken, refreshToken);
  return response;
}

/** Fallback when FRONTEND_AUTH_CALLBACK_URL still points at this route. */
export async function GET(request: NextRequest) {
  const accessToken = request.nextUrl.searchParams.get('access_token');
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      if (key !== 'access_token' && key !== 'refresh_token') {
        loginUrl.searchParams.set(key, value);
      }
    });
    return NextResponse.redirect(loginUrl);
  }

  const refreshToken = request.nextUrl.searchParams.get('refresh_token');
  const response = NextResponse.redirect(new URL('/user', request.url));
  applyAuthCookies(response, accessToken, refreshToken);
  return response;
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const { accessToken, refreshToken } = readAuthTokens(body);
    const code = typeof body?.code === 'string' ? body.code : null;
    const state = typeof body?.state === 'string' ? body.state : null;

    if (accessToken) {
      return establishSessionFromTokens(accessToken, refreshToken);
    }

    if (code) {
      return NextResponse.json({
        status: 'success',
        message: 'Redirect to API OAuth callback.',
        data: { redirect_url: buildApiGoogleCallbackUrl(code, state) },
      });
    }

    return NextResponse.json({ message: 'Missing OAuth credentials.' }, { status: 400 });
  } catch {
    return NextResponse.json(
      { message: 'Unable to complete Google authentication. Please try again.' },
      { status: 500 },
    );
  }
}
