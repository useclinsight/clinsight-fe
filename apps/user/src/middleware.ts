import { NextRequest, NextResponse } from 'next/server';

function tokenMaxAge(token: string): number {
	try {
		const payload = token.split('.')[1];
		const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as {
			exp?: number;
		};
		if (decoded.exp) return Math.max(60, decoded.exp - Math.floor(Date.now() / 1000));
	} catch {
		// Invalid payload — the dashboard session check will reject the token.
	}
	return 60 * 60;
}

/**
 * The API's Google OAuth callback redirects to /login with app tokens in the
 * query string. Move them into httpOnly cookies before the page renders.
 */
export function middleware(request: NextRequest) {
	const accessToken = request.nextUrl.searchParams.get('access_token');
	if (!accessToken) return NextResponse.next();

	// Google tokens are role-scoped. Never put a doctor/admin token in patient cookies.
	const role = request.nextUrl.searchParams.get('role');
	if (role && role !== 'patient') {
		const url = request.nextUrl.clone();
		url.pathname = '/login';
		url.search = '';
		url.searchParams.set('oauth_error', 'wrong_role');
		return NextResponse.redirect(url);
	}

	const url = request.nextUrl.clone();
	url.searchParams.delete('access_token');
	url.searchParams.delete('refresh_token');

	const response = NextResponse.redirect(url);
	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
		path: '/',
	};
	response.cookies.set('patient_access', accessToken, {
		...options,
		maxAge: tokenMaxAge(accessToken),
	});
	const refreshToken = request.nextUrl.searchParams.get('refresh_token');
	if (refreshToken) response.cookies.set('patient_refresh', refreshToken, options);
	return response;
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
