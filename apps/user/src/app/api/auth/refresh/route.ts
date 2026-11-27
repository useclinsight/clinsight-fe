import { NextResponse } from 'next/server';

import { readPatient, refreshPatient, revokePatientSession } from '@/lib/patient-auth-api';
import { readSessionCookies } from '@/lib/patient-session';

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
	path: '/',
};

export async function GET(request: Request) {
	const url = new URL(request.url);
	const requested = url.searchParams.get('next') ?? '/';
	const next =
		requested.startsWith('/') &&
		!requested.startsWith('//') &&
		!requested.startsWith('/api/auth/refresh')
			? requested
			: '/';

	const { refreshToken } = await readSessionCookies();
	const expiredResponse = (target = '/login') => {
		const response = NextResponse.redirect(new URL(target, url));
		response.cookies.set('patient_access', '', { ...cookieOptions, maxAge: 0 });
		response.cookies.set('patient_refresh', '', { ...cookieOptions, maxAge: 0 });
		return response;
	};

	if (!refreshToken) return expiredResponse();

	const refreshed = await refreshPatient(refreshToken);
	if (refreshed.status === 'expired') return expiredResponse();
	if (refreshed.status === 'unavailable') return expiredResponse('/login');

	// Refresh tokens are shared across roles; make sure the new token is an active patient.
	const profile = await readPatient(refreshed.tokens.access_token);
	if (profile.status === 'denied' || profile.status === 'expired') {
		await revokePatientSession(refreshed.tokens.access_token, refreshed.tokens.refresh_token);
		return expiredResponse();
	}

	// Set cookies on the redirect response itself — mutating cookies() here does
	// not reliably survive a NextResponse.redirect.
	const response = NextResponse.redirect(new URL(next, url));
	response.cookies.set('patient_access', refreshed.tokens.access_token, {
		...cookieOptions,
		maxAge: refreshed.tokens.expires_in,
	});
	response.cookies.set('patient_refresh', refreshed.tokens.refresh_token, cookieOptions);
	return response;
}
