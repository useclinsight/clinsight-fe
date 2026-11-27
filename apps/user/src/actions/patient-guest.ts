'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { guestApi, ensureGuestSession, type GuestCaseDetail } from '@/lib/patient-guest';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

type Result<T = undefined> = { ok: true; data: T } | { ok: false; message: string };

export async function startGuestSessionAction(): Promise<Result<{ id: string }>> {
	const id = await ensureGuestSession();
	return id ? { ok: true, data: { id } } : { ok: false, message: 'Unable to start a guest session.' };
}

const chatSchema = z.string().trim().min(1).max(2000);

export async function guestUploadAction(formData: FormData): Promise<Result<{ caseId: string }>> {
	const file = formData.get('file');
	if (!(file instanceof File) || file.size === 0) return { ok: false, message: 'Choose a lab report to upload.' };
	if (file.size > MAX_BYTES) return { ok: false, message: 'File size limit exceeded. Please upload a file smaller than 10 MB.' };
	if (!ALLOWED.includes(file.type)) return { ok: false, message: 'Upload a JPEG, PNG, WebP or PDF lab report.' };

	const result = await guestApi.upload(file);
	if (!result.ok) return { ok: false, message: result.message };
	revalidatePath('/guest');
	return { ok: true, data: { caseId: result.data.case_id } };
}

export async function guestChatAction(caseId: string, text: string): Promise<Result> {
	const parsed = chatSchema.safeParse(text);
	if (!parsed.success) return { ok: false, message: 'Enter a message of 1–2000 characters.' };
	const result = await guestApi.chat(caseId, parsed.data);
	if (!result.ok) return { ok: false, message: result.message };
	revalidatePath(`/guest/${caseId}`);
	return { ok: true, data: undefined };
}

export async function guestCaseSnapshotAction(caseId: string): Promise<GuestCaseDetail | null> {
	const result = await guestApi.getCaseSnapshot(caseId);
	return result.ok ? result.data : null;
}
