'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { patientApi } from '@/lib/patient-api';

export type NotificationActionResult = {
	success: boolean;
	message: string;
};

const idSchema = z
	.string()
	.trim()
	.min(1, 'That notification could not be found.')
	.max(200, 'That notification could not be found.')
	.regex(/^[A-Za-z0-9_-]+$/, 'That notification could not be found.');

const idsSchema = z.array(idSchema).max(200, 'Too many notifications selected.');

const preferencesSchema = z.object({
	notify_on_complete: z.boolean(),
});

const unavailable = 'We couldn’t complete that request. Please try again.';

function friendlyMessage(message: string | undefined, status: number | undefined) {
	if (status === 401) return 'Your session has expired. Please sign in again.';
	if (status === 429) return 'Too many requests. Please wait a moment and try again.';
	return message?.trim() || unavailable;
}

function invalidInput() {
	return { success: false, message: 'Please check your selection and try again.' };
}

export async function markNotificationReadAction(input: unknown): Promise<NotificationActionResult> {
	const parsed = idSchema.safeParse(input);
	if (!parsed.success) return invalidInput();

	try {
		const result = await patientApi.markNotificationRead(parsed.data);
		if (!result.ok) return { success: false, message: friendlyMessage(result.message, result.status) };
		revalidatePath('/notifications');
		return { success: true, message: 'Notification marked as read.' };
	} catch {
		return { success: false, message: unavailable };
	}
}

export async function markAllNotificationsReadAction(input: unknown): Promise<NotificationActionResult> {
	const parsed = idsSchema.safeParse(input);
	if (!parsed.success) return invalidInput();

	try {
		const failures: string[] = [];
		for (const id of parsed.data) {
			const result = await patientApi.markNotificationRead(id);
			if (!result.ok) failures.push(result.message);
		}
		if (failures.length > 0) {
			revalidatePath('/notifications');
			return {
				success: false,
				message: 'Some notifications could not be marked as read. Please try again.',
			};
		}
		revalidatePath('/notifications');
		return { success: true, message: 'Your notifications are now up to date.' };
	} catch {
		return { success: false, message: unavailable };
	}
}

export async function updateNotificationPreferenceAction(
	input: unknown,
): Promise<NotificationActionResult> {
	const parsed = preferencesSchema.safeParse(input);
	if (!parsed.success) return invalidInput();

	try {
		const result = await patientApi.updatePreferences(parsed.data.notify_on_complete);
		if (!result.ok) return { success: false, message: friendlyMessage(result.message, result.status) };
		revalidatePath('/notifications');
		return {
			success: true,
			message: parsed.data.notify_on_complete
				? 'You’ll be notified when an analysis is ready.'
				: 'Analysis-ready notifications have been turned off.',
		};
	} catch {
		return { success: false, message: unavailable };
	}
}
