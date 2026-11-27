import 'server-only';

import { readSessionCookies } from './patient-session';

export type ApiErrors = { field: string; message: string }[] | null;

export type ApiResult<T> =
	| { ok: true; data: T }
	| { ok: false; status: number; message: string; errors?: ApiErrors };

export type MedicalCase = {
	id: string;
	user_id: string | null;
	guest_session_id: string | null;
	title: string | null;
	status: 'pending' | 'processing' | 'complete' | 'failed';
	created_at: string;
	completed_at: string | null;
};

export type LabResult = {
	id: string;
	medical_case_id: string;
	file: { name: string; url: string; mime_type: string };
	ocr_status: 'pending' | 'processing' | 'complete' | 'failed';
	extracted_values: unknown | null;
	ocr_completed_at: string | null;
	created_at: string;
};

export type Interpretation = {
	id: string;
	medical_case_id: string;
	status: 'pending' | 'processing' | 'complete' | 'failed';
	generated_at: string;
	summary: string | null;
	value_breakdown: { metric: string; value: string; unit: string | null; status: string | null }[] | null;
	suggested_questions: string[] | null;
	risk_level: 'low' | 'moderate' | 'high' | null;
	confidence: 'low' | 'medium' | 'high' | null;
};

export type ChatMessage = {
	id: string;
	medical_case_id: string;
	user_id: string | null;
	sender_type: 'patient' | 'ai' | 'file';
	content: Record<string, unknown> | { text?: string };
	file: { name?: string; url?: string; mime_type?: string } | null;
	sent_at: string;
};

export type CaseDetail = {
	case: MedicalCase;
	lab_results: LabResult[];
	interpretation: Interpretation | null;
	chats: ChatMessage[];
};

export type UploadResponse = { case_id: string; lab_result: LabResult };

export type NotificationItem = {
	id: string;
	type: 'interpretation_ready' | 'interpretation_failed';
	title: string;
	message: string | null;
	data: unknown | null;
	medical_case_id: string | null;
	is_read: boolean;
	read_at: string | null;
	delivered_at: string | null;
	created_at: string;
};

export type NotificationPreferences = { notify_on_complete: boolean };

export type PatientProfile = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
	role: string;
	is_email_verified: boolean;
	is_active: boolean;
	avatar_url: string | null;
	created_at: string;
	last_login_at: string | null;
	dashboard?: { total_cases: number; pending_reviews: number; accepted_cases: number; completed_cases: number };
};

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

export async function patientRequest<T>(
	path: `/api/v1/${string}`,
	init: RequestInit = {},
): Promise<ApiResult<T>> {
	const { accessToken } = await readSessionCookies();
	if (!accessToken) {
		return { ok: false, status: 401, message: 'Your session has expired. Please sign in again.' };
	}

	const headers = new Headers(init.headers);
	headers.set('Authorization', `Bearer ${accessToken}`);
	if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');

	let response: Response;
	try {
		response = await fetch(`${apiBaseUrl()}${path}`, {
			...init,
			headers,
			cache: 'no-store',
			redirect: 'error',
			signal: AbortSignal.timeout(20000),
		});
	} catch {
		return { ok: false, status: 502, message: 'Unable to reach the server. Please try again.' };
	}

	if (response.status === 204) return { ok: true, data: undefined as T };

	const text = await response.text();
	type Envelope<T> = { status?: string; message?: string; data?: T; errors?: ApiErrors };
	let body: Envelope<T> | null = null;
	try {
		body = text ? (JSON.parse(text) as Envelope<T>) : null;
	} catch {
		body = null;
	}

	if (!response.ok) {
		return {
			ok: false,
			status: response.status,
			message: body?.message ?? 'Something went wrong. Please try again.',
			errors: body?.errors ?? null,
		};
	}

	if (body && 'data' in body) return { ok: true, data: body.data as T };
	return { ok: true, data: body as T };
}

const json = (method: string, data?: unknown): RequestInit => ({
	method,
	body: data === undefined ? undefined : JSON.stringify(data),
});

export const patientApi = {
	listCases: (offset = 0, limit = 50) =>
		patientRequest<MedicalCase[]>(`/api/v1/cases?offset=${offset}&limit=${limit}`),
	getCase: (id: string) => patientRequest<CaseDetail>(`/api/v1/cases/${id}/full`),
	renameCase: (id: string, title: string) =>
		patientRequest<MedicalCase>(`/api/v1/cases/${id}`, json('PATCH', { title })),
	deleteCase: (id: string) => patientRequest<void>(`/api/v1/cases/${id}`, { method: 'DELETE' }),
	upload: (file: File, note?: string) => {
		const form = new FormData();
		form.set('file', file);
		if (note) form.set('note', note);
		return patientRequest<UploadResponse>('/api/v1/upload', { method: 'POST', body: form });
	},
	listLabResults: (caseId: string) =>
		patientRequest<LabResult[]>(`/api/v1/cases/${caseId}/lab-results`),
	addLabResult: (caseId: string, file: File) => {
		const form = new FormData();
		form.set('file', file);
		return patientRequest<LabResult>(`/api/v1/cases/${caseId}/lab-results`, {
			method: 'POST',
			body: form,
		});
	},
	listChat: (caseId: string) => patientRequest<ChatMessage[]>(`/api/v1/cases/${caseId}/chat`),
	sendChat: (caseId: string, text: string) =>
		patientRequest<ChatMessage>(`/api/v1/cases/${caseId}/chat`, {
			method: 'POST',
			body: JSON.stringify({
				sender_type: 'patient',
				content: { text },
				medical_case_id: caseId,
			}),
		}),
	listNotifications: (unreadOnly = false) =>
		patientRequest<NotificationItem[]>(`/api/v1/notifications?unread_only=${unreadOnly}&limit=100`),
	unreadCount: () => patientRequest<{ unread: number }>('/api/v1/notifications/unread-count'),
	markNotificationRead: (id: string) =>
		patientRequest<NotificationItem>(`/api/v1/notifications/${id}/read`, { method: 'PATCH' }),
	getPreferences: () => patientRequest<NotificationPreferences>('/api/v1/notifications/preferences'),
	updatePreferences: (notify_on_complete: boolean) =>
		patientRequest<NotificationPreferences>('/api/v1/notifications/preferences', {
			method: 'PATCH',
			body: JSON.stringify({ notify_on_complete }),
		}),
	getProfile: () => patientRequest<PatientProfile>('/api/v1/users/me'),
	updateProfile: (data: { first_name?: string; last_name?: string }) =>
		patientRequest<PatientProfile>('/api/v1/users/me', json('PATCH', data)),
	updatePassword: (current_password: string, new_password: string) =>
		patientRequest<null>('/api/v1/users/me/password', json('PATCH', { current_password, new_password })),
	deleteAccount: () => patientRequest<null>('/api/v1/users/me', { method: 'DELETE' }),
};

export async function casePdfResponse(caseId: string): Promise<Response> {
	const { accessToken } = await readSessionCookies();
	if (!accessToken) {
		return Response.json({ message: 'Your session has expired.' }, { status: 401 });
	}
	try {
		return await fetch(`${apiBaseUrl()}/api/v1/cases/${caseId}/export`, {
			headers: { Authorization: `Bearer ${accessToken}` },
			cache: 'no-store',
			signal: AbortSignal.timeout(20000),
		});
	} catch {
		return Response.json({ message: 'Unable to reach the server.' }, { status: 502 });
	}
}

export async function uploadAvatar(file: File) {
	const { accessToken } = await readSessionCookies();
	if (!accessToken) return { ok: false as const, status: 401, message: 'Session expired' };
	const form = new FormData();
	form.set('file', file);
	try {
		const response = await fetch(`${apiBaseUrl()}/api/v1/users/me/avatar`, {
			method: 'PATCH',
			headers: { Authorization: `Bearer ${accessToken}` },
			body: form,
			cache: 'no-store',
			signal: AbortSignal.timeout(20000),
		});
		const body = (await response.json().catch(() => null)) as
			| { message?: string; data?: PatientProfile }
			| null;
		if (!response.ok) {
			return { ok: false as const, status: response.status, message: body?.message ?? 'Upload failed' };
		}
		return { ok: true as const, data: body?.data as PatientProfile };
	} catch {
		return { ok: false as const, status: 502, message: 'Unable to reach the server' };
	}
}
