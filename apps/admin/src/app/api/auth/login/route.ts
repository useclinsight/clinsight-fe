import { NextResponse } from 'next/server';

import { apiBaseUrl } from '@/lib/admin-api';

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
	path: '/',
};

export async function POST(request: Request) {
	let email: string;
	let password: string;
	try {
		const body = (await request.json()) as { email?: string; password?: string };
		email = body.email ?? '';
		password = body.password ?? '';
	} catch {
		return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
	}

	if (!email || !password) {
		return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
	}

	try {
		const response = await fetch(`${apiBaseUrl()}/api/v1/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, platform: 'web', device_id: 'admin-web' }),
			cache: 'no-store',
		});
		const data = (await response.json()) as {
			status?: string;
			message?: string;
			data?: {
				access_token: string;
				refresh_token: string;
				expires_in: number;
				user?: { role?: string };
			};
		};

		if (!response.ok || data.status !== 'success' || !data.data) {
			return NextResponse.json(
				{ message: data.message ?? 'Invalid email or password.' },
				{ status: 401 },
			);
		}

		if (data.data.user?.role !== 'admin') {
			return NextResponse.json(
				{ message: 'Administrator access is required for this portal.' },
				{ status: 403 },
			);
		}

		const result = NextResponse.json({ ok: true });
		result.cookies.set('admin_access', data.data.access_token, {
			...cookieOptions,
			maxAge: data.data.expires_in,
		});
		result.cookies.set('admin_refresh', data.data.refresh_token, cookieOptions);
		return result;
	} catch {
		return NextResponse.json({ message: 'Unable to reach the authentication service.' }, { status: 503 });
	}
}
