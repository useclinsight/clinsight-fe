import { cookies } from 'next/headers';

export function apiBaseUrl(): string {
	const base =
		process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || process.env.API_BASE_URL?.trim() || '';
	if (!base) throw new Error('API base URL is not configured');
	return base.replace(/\/+$/, '');
}

export async function adminFetch(path: `/${string}`, init: RequestInit = {}): Promise<Response> {
	const jar = await cookies();
	const token = jar.get('admin_access')?.value;
	const headers = new Headers(init.headers);
	if (token) headers.set('Authorization', `Bearer ${token}`);
	return fetch(`${apiBaseUrl()}${path}`, {
		...init,
		headers,
		cache: 'no-store',
	});
}
