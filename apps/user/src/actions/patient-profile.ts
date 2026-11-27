'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { clearSessionCookies } from '@/lib/patient-session';
import { getPatientPasswordRules, passwordHint } from '@/schemas/patient-account';
import { patientApi, uploadAvatar } from '@/lib/patient-api';

export type ProfileActionResult = {
	success: boolean;
	message: string;
	avatar_url?: string | null;
};

const nameSchema = z
	.string()
	.trim()
	.min(1, 'Enter your name.')
	.max(100, 'Enter 100 characters or fewer.');

const profileSchema = z
	.object({
		first_name: nameSchema.optional(),
		last_name: nameSchema.optional(),
	})
	.refine((value) => value.first_name !== undefined || value.last_name !== undefined, {
		message: 'Enter a first or last name to save.',
	});

const avatarSchema = z.object({
	name: z.string().min(1).max(255),
	size: z.number().int().positive().max(10 * 1024 * 1024, 'Choose an image smaller than 10 MB.'),
	type: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
		message: 'Choose a JPEG, PNG or WebP image.',
	}),
});

const passwordSchema = z
	.string()
	.min(8, 'Enter at least 8 characters.')
	.max(72, 'Enter 72 characters or fewer.')
	.refine((value) => value === value.trim(), 'Remove spaces from the start and end.')
	.refine((value) => getPatientPasswordRules(value).every(({ met }) => met), passwordHint);

const passwordChangeSchema = z
	.object({
		current_password: z.string().min(1, 'Enter your current password.'),
		new_password: passwordSchema,
		confirm_password: z.string().min(1, 'Confirm your new password.'),
	})
	.refine((value) => value.new_password === value.confirm_password, {
		path: ['confirm_password'],
		message: 'The passwords don’t match.',
	});

const deleteSchema = z.object({
	confirmation: z.string().refine((value) => value === 'DELETE', 'Type DELETE to confirm.'),
});

const unavailable = 'We couldn’t complete that request. Please try again.';

function friendlyMessage(message: string | undefined, status: number | undefined) {
	if (status === 401) return 'Your session has expired. Please sign in again.';
	if (status === 400 || status === 422) return message?.trim() || 'Please check your details and try again.';
	if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
	return message?.trim() || unavailable;
}

export async function updatePatientProfileAction(input: unknown): Promise<ProfileActionResult> {
	const parsed = profileSchema.safeParse(input);
	if (!parsed.success) {
		return {
			success: false,
			message: parsed.error.issues[0]?.message ?? 'Check your details and try again.',
		};
	}

	try {
		const result = await patientApi.updateProfile(parsed.data);
		if (!result.ok) {
			return { success: false, message: friendlyMessage(result.message, result.status) };
		}
		revalidatePath('/profile');
		revalidatePath('/');
		return { success: true, message: 'Your profile has been updated.' };
	} catch {
		return { success: false, message: unavailable };
	}
}

export async function uploadPatientAvatarAction(formData: FormData): Promise<ProfileActionResult> {
	const file = formData.get('avatar');
	if (!file || typeof file === 'string') {
		return { success: false, message: 'Choose an image to upload.' };
	}
	const parsed = avatarSchema.safeParse({ name: file.name, size: file.size, type: file.type });
	if (!parsed.success) {
		return {
			success: false,
			message: parsed.error.issues[0]?.message ?? 'Choose a JPEG, PNG or WebP image under 10 MB.',
		};
	}

	try {
		const result = await uploadAvatar(file);
		if (!result.ok) {
			return { success: false, message: friendlyMessage(result.message, result.status) };
		}
		revalidatePath('/profile');
		revalidatePath('/');
		return { success: true, message: 'Image changed successfully.', avatar_url: result.data?.avatar_url ?? null };
	} catch {
		return { success: false, message: unavailable };
	}
}

export async function updatePatientPasswordAction(input: unknown): Promise<ProfileActionResult> {
	const parsed = passwordChangeSchema.safeParse(input);
	if (!parsed.success) {
		return {
			success: false,
			message: parsed.error.issues[0]?.message ?? 'Check your passwords and try again.',
		};
	}

	let result: Awaited<ReturnType<typeof patientApi.updatePassword>>;
	try {
		result = await patientApi.updatePassword(parsed.data.current_password, parsed.data.new_password);
	} catch {
		return { success: false, message: unavailable };
	}
	if (!result.ok) {
		return { success: false, message: friendlyMessage(result.message, result.status) };
	}

	await clearSessionCookies();
	redirect('/login?password=updated');
}

export async function deletePatientAccountAction(input: unknown): Promise<ProfileActionResult> {
	const parsed = deleteSchema.safeParse(input);
	if (!parsed.success) {
		return { success: false, message: 'Type DELETE to confirm your account deletion.' };
	}

	let result: Awaited<ReturnType<typeof patientApi.deleteAccount>>;
	try {
		result = await patientApi.deleteAccount();
	} catch {
		return { success: false, message: unavailable };
	}
	if (!result.ok) {
		return { success: false, message: friendlyMessage(result.message, result.status) };
	}

	await clearSessionCookies();
	redirect('/login?account=deleted');
}
