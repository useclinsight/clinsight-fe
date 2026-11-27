import { NextResponse } from 'next/server';

import { readPatient, refreshPatient, revokePatientSession } from '@/lib/patient-auth-api';
import { clearSessionCookies, readSessionCookies, writeSessionCookies } from '@/lib/patient-session';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const requested = url.searchParams.get('next') ?? '/';
	const next = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/';

	const { refreshToken } = await readSessionCookies();
	if (!refreshToken) {
		await clearSessionCookies();
		return NextResponse.redirect(new URL('/login', url));
	}

	const refreshed = await refreshPatient(refreshToken);
	if (refreshed.status === 'expired') {
		await clearSessionCookies();
		return NextResponse.redirect(new URL('/login', url));
	}
	if (refreshed.status === 'unavailable') {
		return NextResponse.redirect(new URL('/login', url));
	}

	// Refresh tokens are shared across roles; make sure the new token is an active patient.
	const profile = await readPatient(refreshed.tokens.access_token);
	if (profile.status === 'denied' || profile.status === 'expired') {
		await revokePatientSession(refreshed.tokens.access_token, refreshed.tokens.refresh_token);
		await clearSessionCookies();
		return NextResponse.redirect(new URL('/login', url));
	}

	await writeSessionCookies(refreshed.tokens);
	return NextResponse.redirect(new URL(next, url));
}
