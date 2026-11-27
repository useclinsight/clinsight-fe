'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { patientApi, type CaseDetail } from '@/lib/patient-api';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

type ActionResult<T = undefined> =
	| { ok: true; data: T }
	| { ok: false; message: string };

const titleSchema = z.string().trim().min(1).max(50);
const chatSchema = z.string().trim().min(1).max(2000);

function readFile(formData: FormData) {
	const file = formData.get('file');
	if (!(file instanceof File) || file.size === 0) return { error: 'Choose a lab report to upload.' };
	if (file.size > MAX_FILE_BYTES) return { error: 'File size limit exceeded. Please upload a file smaller than 10 MB.' };
	if (!ALLOWED_MIME.includes(file.type)) return { error: 'Upload a JPEG, PNG, WebP or PDF lab report.' };
	return { file };
}

export async function uploadLabAction(formData: FormData): Promise<ActionResult<{ caseId: string }>> {
	const parsed = readFile(formData);
	if (parsed.error) return { ok: false, message: parsed.error };
	const note = typeof formData.get('note') === 'string' ? String(formData.get('note')) : undefined;
	const result = await patientApi.upload(parsed.file!, note);
	if (!result.ok) return { ok: false, message: result.message };
	revalidatePath('/');
	revalidatePath('/insights');
	return { ok: true, data: { caseId: result.data.case_id } };
}

export async function addLabResultAction(
	caseId: string,
	formData: FormData,
): Promise<ActionResult> {
	const parsed = readFile(formData);
	if (parsed.error) return { ok: false, message: parsed.error };
	const result = await patientApi.addLabResult(caseId, parsed.file!);
	if (!result.ok) return { ok: false, message: result.message };
	revalidatePath(`/insights/${caseId}`);
	revalidatePath('/insights');
	return { ok: true, data: undefined };
}

export async function renameCaseAction(caseId: string, title: string): Promise<ActionResult> {
	const parsed = titleSchema.safeParse(title);
	if (!parsed.success) return { ok: false, message: 'Insight names must be 1–50 characters.' };
	const result = await patientApi.renameCase(caseId, parsed.data);
	if (!result.ok) return { ok: false, message: result.message };
	revalidatePath('/insights');
	revalidatePath(`/insights/${caseId}`);
	return { ok: true, data: undefined };
}

export async function deleteCaseAction(caseId: string): Promise<ActionResult> {
	const result = await patientApi.deleteCase(caseId);
	if (!result.ok) return { ok: false, message: result.message };
	revalidatePath('/insights');
	revalidatePath('/');
	return { ok: true, data: undefined };
}

export async function sendChatAction(caseId: string, text: string): Promise<ActionResult> {
	const parsed = chatSchema.safeParse(text);
	if (!parsed.success) return { ok: false, message: 'Enter a message of 1–2000 characters.' };
	const result = await patientApi.sendChat(caseId, parsed.data);
	if (!result.ok) return { ok: false, message: result.message };
	revalidatePath(`/insights/${caseId}`);
	return { ok: true, data: undefined };
}

export async function requestSecondOpinionAction(caseId: string): Promise<ActionResult> {
	const result = await patientApi.sendChat(
		caseId,
		"I'd like a doctor's second opinion on these results. Please review my report.",
	);
	if (!result.ok) return { ok: false, message: result.message };
	revalidatePath(`/insights/${caseId}`);
	return { ok: true, data: undefined };
}

export async function getCaseSnapshotAction(caseId: string): Promise<CaseDetail | null> {
	const result = await patientApi.getCase(caseId);
	return result.ok ? result.data : null;
}
