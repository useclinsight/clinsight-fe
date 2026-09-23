import { NextResponse } from 'next/server';

export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 8; // 8 hours
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 3; // 3 days

export function applyAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string | null,
  accessTokenMaxAge: number = ACCESS_TOKEN_MAX_AGE,
) {
  response.cookies.set('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: accessTokenMaxAge,
  });

  if (refreshToken) {
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  return response;
}

export function readAuthTokens(body: unknown): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  if (!body || typeof body !== 'object') {
    return { accessToken: null, refreshToken: null };
  }

  const record = body as Record<string, unknown>;
  const accessToken =
    (typeof record.access_token === 'string' && record.access_token) ||
    (typeof record.accessToken === 'string' && record.accessToken) ||
    null;
  const refreshToken =
    (typeof record.refresh_token === 'string' && record.refresh_token) ||
    (typeof record.refreshToken === 'string' && record.refreshToken) ||
    null;

  return { accessToken, refreshToken };
}
