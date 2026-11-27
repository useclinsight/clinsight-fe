import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const response = NextResponse.redirect(new URL('/login?reason=refresh_failed', url));
	for (const name of ['patient_access', 'patient_refresh', 'auth_retry']) {
		response.cookies.set(name, '', { maxAge: 0, path: '/' });
	}
	return response;
}
