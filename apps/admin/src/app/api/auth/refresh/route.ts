import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { apiBaseUrl } from '@/lib/admin-api';

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
	path: '/',
};

export async function POST() {
	const jar = await cookies();
	const refreshToken = jar.get('admin_refresh')?.value;
	if (!refreshToken) return NextResponse.json({ message: 'Session expired.' }, { status: 401 });

	try {
		const response = await fetch(`${apiBaseUrl()}/api/v1/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken }),
			cache: 'no-store',
		});
		const data = (await response.json()) as {
			status?: string;
			data?: { access_token: string; refresh_token: string; expires_in: number };
		};
		if (!response.ok || data.status !== 'success' || !data.data) {
			return NextResponse.json({ message: 'Session expired.' }, { status: 401 });
		}

		const result = NextResponse.json({ ok: true });
		result.cookies.set('admin_access', data.data.access_token, {
			...cookieOptions,
			maxAge: data.data.expires_in,
		});
		result.cookies.set('admin_refresh', data.data.refresh_token, cookieOptions);
		return result;
	} catch {
		return NextResponse.json({ message: 'Unable to refresh session.' }, { status: 503 });
	}
}
