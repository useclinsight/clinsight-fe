import { NextResponse } from 'next/server';
import { applyAuthCookies } from '@/lib/auth-session';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.useclinsight.com';

function getAccessToken(data: unknown) {
  if (!data || typeof data !== 'object') return null;

  const response = data as {
    access_token?: string;
    accessToken?: string;
    data?: {
      access_token?: string;
      accessToken?: string;
    };
  };

  return (
    response.data?.access_token ??
    response.data?.accessToken ??
    response.access_token ??
    response.accessToken ??
    null
  );
}

function getRefreshToken(data: unknown) {
  if (!data || typeof data !== 'object') return null;

  const response = data as {
    refresh_token?: string;
    refreshToken?: string;
    data?: {
      refresh_token?: string;
      refreshToken?: string;
    };
  };

  return (
    response.data?.refresh_token ??
    response.data?.refreshToken ??
    response.refresh_token ??
    response.refreshToken ??
    null
  );
}

function getExpiresIn(data: unknown) {
  if (!data || typeof data !== 'object') return undefined;

  const response = data as {
    expires_in?: number;
    data?: {
      expires_in?: number;
    };
  };

  return response.data?.expires_in ?? response.expires_in;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/api/v1/auth/doctor/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) return Response.json(await response.json(), { status: response.status });

    const data = await response.json();
    const nextResponse = NextResponse.json(data);
    const accessToken = getAccessToken(data);
    const refreshToken = getRefreshToken(data);

    if (accessToken) {
      applyAuthCookies(nextResponse, accessToken, refreshToken, getExpiresIn(data));
    }

    return nextResponse;
  } catch {
    return Response.json(
      { message: "We couldn't sign you in right now. Please check your connection and try again." },
      { status: 500 },
    );
  }
}
