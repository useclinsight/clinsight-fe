import { NextResponse, type NextProxy } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.useclinsight.com';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const PROTECTED_PREFIXES = ['/user', '/verification'];
const AUTH_ONLY_PREFIXES = ['/login', '/signup', '/forgot-password', '/reset-password'];
const DOCTOR_HOME = '/user';
const LOGIN_PAGE = '/login';

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const exp = payload.exp;
    if (!exp) return true;
    // 10-second buffer
    return Date.now() / 1000 >= exp - 10;
  } catch {
    return true;
  }
}

async function refreshSession(
  refreshToken: string,
): Promise<{ token: string; refreshToken?: string; expiresIn: number } | null> {
  try {
    const res = await fetch(`${BASE_URL.replace(/\/$/, '')}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const payload = await res.json();
      const data = payload?.data || payload;
      const newAccessToken = data?.access_token || data?.accessToken;
      const newRefreshToken = data?.refresh_token || data?.refreshToken;
      const expiresIn = data?.expires_in || data?.expires_in_seconds || 28800; // default 8 hours

      if (newAccessToken) {
        return { token: newAccessToken, refreshToken: newRefreshToken, expiresIn };
      }
    }
  } catch (e) {
    console.error('Silent token refresh failed in proxy:', e);
  }
  return null;
}

function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
) {
  response.cookies.set('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: expiresIn || 28800,
  });

  if (refreshToken) {
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 3, // 3 days
    });
  }
}

/**
 * Matches a pathname against a prefix exactly or when followed immediately by
 * a slash — preventing false positives like /user-settings matching /user.
 */
function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(prefix + '/');
}

/** Stamps x-request-id and all SECURITY_HEADERS onto any response. */
function applyCommonHeaders(response: NextResponse, requestId: string): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  response.headers.set('x-request-id', requestId);
  return response;
}

/**
 * Validates the session by calling /api/auth/me with the active token.
 * Returns true only when the server responds with 2xx.
 */
async function validateSession(activeToken: string): Promise<boolean> {
  try {
    const url = `${BASE_URL.replace(/\/$/, '')}/api/v1/auth/me`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${activeToken}`,
      },
      // Short timeout so a slow API doesn't stall the proxy
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    // Network error, timeout, or misconfigured API — treat as unauthenticated
    return false;
  }
}

export const proxy: NextProxy = async (request) => {
  const { pathname } = request.nextUrl;
  let token = request.cookies.get('token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  let didRefresh = false;
  let newAccessToken = '';
  let newRefreshToken = '';
  let expiresIn = 28800;

  // Perform token refresh if missing/expired but refresh_token exists
  if ((!token || isTokenExpired(token)) && refreshToken) {
    console.log('isrefreshing');
    const refreshResult = await refreshSession(refreshToken);
    if (refreshResult) {
      token = refreshResult.token;
      newAccessToken = refreshResult.token;
      newRefreshToken = refreshResult.refreshToken || '';
      expiresIn = refreshResult.expiresIn;
      didRefresh = true;
    }
  }

  // Hoist requestId so every response branch — including redirects — carries it
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();

  // Fast-path: no cookie at all → definitely unauthenticated
  const hasCookie = Boolean(token);

  const isProtected = PROTECTED_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
  const isAuthOnly = AUTH_ONLY_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));

  if (isProtected || isAuthOnly) {
    // If we just did a successful refresh, trust the new token directly —
    // calling validateSession again would race against the browser not yet
    // having the new cookie, causing a false-negative redirect to /login.
    const isAuthenticated = didRefresh ? true : hasCookie ? await validateSession(token!) : false;
    console.log('isAuthenticated', isAuthenticated);

    if (isProtected && !isAuthenticated) {
      const loginUrl = new URL(LOGIN_PAGE, request.url);
      loginUrl.searchParams.set('from', pathname);
      const redirect = NextResponse.redirect(loginUrl);

      // Clear a stale/invalid token cookie so the browser doesn't loop
      if (hasCookie && !didRefresh) {
        redirect.cookies.delete('token');
      }

      return applyCommonHeaders(redirect, requestId);
    }

    if (isAuthOnly && isAuthenticated) {
      const redirect = NextResponse.redirect(new URL(DOCTOR_HOME, request.url));
      // Always write the refreshed cookies onto the redirect so the
      // destination page receives the updated token immediately.
      if (didRefresh) {
        setAuthCookies(redirect, newAccessToken, newRefreshToken, expiresIn);
      }
      return applyCommonHeaders(redirect, requestId);
    }

    // Protected route + freshly refreshed: let the request through and
    // write the new cookies so the browser is updated.
    if (isProtected && didRefresh && isAuthenticated) {
      const response = NextResponse.next({
        request: { headers: new Headers(request.headers) },
      });
      setAuthCookies(response, newAccessToken, newRefreshToken, expiresIn);
      return applyCommonHeaders(response, requestId);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);
  if (didRefresh) {
    requestHeaders.set('Authorization', `Bearer ${newAccessToken}`);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (didRefresh) {
    setAuthCookies(response, newAccessToken, newRefreshToken, expiresIn);
  }

  return applyCommonHeaders(response, requestId);
};

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
};
