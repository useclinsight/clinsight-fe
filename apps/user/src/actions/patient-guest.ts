'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import {
  guestApi,
  ensureGuestSession,
  getGuestId,
  type GuestCaseDetail,
} from '@/lib/patient-guest';

import { guestLabFileLimitMb, guestLabTypes } from '@/lib/guest-lab-file';

type Result<T = undefined> = { ok: true; data: T } | { ok: false; message: string };

export async function startGuestSessionAction(): Promise<Result<{ id: string }>> {
  const id = await ensureGuestSession();
  return id
    ? { ok: true, data: { id } }
    : { ok: false, message: 'Unable to start a guest session.' };
}

const chatSchema = z.string().trim().min(1).max(2000);

export async function guestUploadAction(formData: FormData): Promise<Result<{ caseId: string }>> {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, message: 'Choose a lab report to upload.' };
  const maxSizeMb = guestLabFileLimitMb();
  if (file.size > maxSizeMb * 1024 * 1024)
    return {
      ok: false,
      message: `Choose a file that is ${maxSizeMb} MB or smaller.`,
    };
  if (!guestLabTypes.includes(file.type))
    return { ok: false, message: 'Upload a JPEG, PNG, WebP or PDF lab report.' };

  if (!(await getGuestId()) && !(await ensureGuestSession())) {
    return { ok: false, message: 'Unable to start a guest session.' };
  }
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
  revalidatePath(`/guest/${caseId}/chat`);
  return { ok: true, data: undefined };
}

export async function guestCaseSnapshotAction(caseId: string): Promise<GuestCaseDetail | null> {
  const result = await guestApi.getCaseSnapshot(caseId);
  return result.ok ? result.data : null;
}
