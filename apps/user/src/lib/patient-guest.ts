import 'server-only';

import { cookies } from 'next/headers';

const GUEST_COOKIE = 'patient_guest';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Envelope<T> = { status?: string; message?: string; data?: T };
export type GuestResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string };

function apiBaseUrl() {
	const url = new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? '');
	const localDev =
		process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1'].includes(url.hostname);
	if (
		(url.protocol !== 'https:' && !(localDev && url.protocol === 'http:')) ||
		url.username ||
		url.password ||
		url.pathname !== '/' ||
		url.search ||
		url.hash
	) {
		throw new Error('Set NEXT_PUBLIC_API_BASE_URL to the patient API origin.');
	}
	return url.origin;
}

const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
	path: '/',
} as const;

export async function getGuestId() {
	const store = await cookies();
	const value = store.get(GUEST_COOKIE)?.value;
	return value && UUID.test(value) ? value : undefined;
}

export async function setGuestId(id: string) {
	if (!UUID.test(id)) throw new Error('Invalid guest session id');
	const store = await cookies();
	store.set(GUEST_COOKIE, id, { ...cookieOptions, maxAge: 60 * 60 });
}

export async function clearGuestId() {
	const store = await cookies();
	store.set(GUEST_COOKIE, '', { ...cookieOptions, maxAge: 0 });
}

async function guestRequest<T>(path: `/api/v1/${string}`, init: RequestInit = {}): Promise<GuestResult<T>> {
	const guestId = await getGuestId();
	if (!guestId) return { ok: false, status: 401, message: 'Start a guest session first.' };

	const headers = new Headers(init.headers);
	headers.set('X-Guest-Session-Id', guestId);
	if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');

	let response: Response;
	try {
		response = await fetch(`${apiBaseUrl()}${path}`, {
			...init,
			headers,
			cache: 'no-store',
			signal: AbortSignal.timeout(20000),
		});
	} catch {
		return { ok: false, status: 502, message: 'Unable to reach the server. Please try again.' };
	}

	const text = await response.text();
	let body: Envelope<T> | null = null;
	try {
		body = text ? (JSON.parse(text) as Envelope<T>) : null;
	} catch {
		body = null;
	}

	if (!response.ok) {
		return { ok: false, status: response.status, message: body?.message ?? 'Request failed.' };
	}
	return { ok: true, data: (body && 'data' in body ? body.data : body) as T };
}

export async function ensureGuestSession() {
	const existing = await getGuestId();
	if (existing) {
		const check = await guestRequest<{ guest_session_id: string }>('/api/v1/guest-session/me');
		if (check.ok) return existing;
	}

	try {
		const response = await fetch(`${apiBaseUrl()}/api/v1/guest-session`, {
			method: 'POST',
			cache: 'no-store',
			signal: AbortSignal.timeout(15000),
		});
		const body = (await response.json().catch(() => null)) as Envelope<{ guest_session_id: string }> | null;
		if (!response.ok || !body?.data?.guest_session_id) throw new Error('guest session failed');
		await setGuestId(body.data.guest_session_id);
		return body.data.guest_session_id;
	} catch {
		return null;
	}
}

export type GuestCase = {
	id: string;
	title: string | null;
	status: string;
	created_at: string;
};

export type GuestCaseDetail = {
	case: GuestCase;
	lab_results: { id: string; file: { name: string; url: string }; ocr_status: string }[];
	interpretation: {
		status: string;
		summary: string | null;
		value_breakdown: { metric: string; value: string; unit: string | null; status: string | null }[] | null;
		suggested_questions: string[] | null;
		risk_level: string | null;
	} | null;
	chats: { id: string; sender_type: string; content: Record<string, unknown>; sent_at: string }[];
};

export const guestApi = {
	cases: () => guestRequest<GuestCase[]>('/api/v1/guest/cases?limit=50'),
	caseFull: (id: string) => guestRequest<GuestCaseDetail>(`/api/v1/cases/${id}/full`),
	upload: (file: File) => {
		const form = new FormData();
		form.set('file', file);
		return guestRequest<{ case_id: string }>('/api/v1/upload', { method: 'POST', body: form });
	},
	chat: (caseId: string, text: string) =>
		guestRequest<unknown>(`/api/v1/cases/${caseId}/chat`, {
			method: 'POST',
			body: JSON.stringify({ sender_type: 'patient', content: { text }, medical_case_id: caseId }),
		}),
	getCaseSnapshot: (caseId: string) => guestRequest<GuestCaseDetail>(`/api/v1/cases/${caseId}/full`),
};
