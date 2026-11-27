import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { apiBaseUrl } from '@/lib/admin-api';

export async function POST() {
	const jar = await cookies();
	const refreshToken = jar.get('admin_refresh')?.value;
	const response = NextResponse.json({ ok: true });
	response.cookies.set('admin_access', '', { maxAge: 0, path: '/' });
	response.cookies.set('admin_refresh', '', { maxAge: 0, path: '/' });

	if (refreshToken) {
		try {
			await fetch(`${apiBaseUrl()}/api/v1/auth/logout`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh_token: refreshToken }),
				cache: 'no-store',
			});
		} catch {
			// Clearing local cookies is enough to sign out of this browser.
		}
	}
	return response;
}
