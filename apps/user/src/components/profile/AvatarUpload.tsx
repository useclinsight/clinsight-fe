'use client';

import { Avatar, Card, CardContent, Input } from '@clinsight/ui';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { uploadPatientAvatarAction } from '@/actions/patient-profile';

export function AvatarUpload({
	avatarUrl,
	fallback,
}: {
	avatarUrl: string | null;
	fallback: string;
}) {
	const router = useRouter();
	// undefined means "no upload yet", so server data stays the source of truth.
	const [uploadedUrl, setUploadedUrl] = useState<string | null | undefined>(undefined);
	const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
	const [isPending, startTransition] = useTransition();
	const preview = uploadedUrl === undefined ? avatarUrl : uploadedUrl;

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		event.target.value = '';
		if (!file) return;

		if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
			setFeedback({ kind: 'error', text: 'Choose a JPEG, PNG or WebP image.' });
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			setFeedback({ kind: 'error', text: 'Choose an image smaller than 10 MB.' });
			return;
		}

		const form = new FormData();
		form.set('avatar', file);
		setFeedback(null);
		startTransition(async () => {
			try {
				const result = await uploadPatientAvatarAction(form);
				if (result.success) {
					setUploadedUrl(result.avatar_url ?? null);
					setFeedback({ kind: 'success', text: result.message });
					router.refresh();
				} else {
					setFeedback({ kind: 'error', text: result.message });
				}
			} catch {
				setFeedback({ kind: 'error', text: 'Please try again in a moment.' });
			}
		});
	}

	return (
		<Card className="rounded-[14px] border-gray-200 shadow-none">
			<CardContent className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-6">
				<Avatar
					src={preview ?? undefined}
					alt="Your profile"
					fallback={fallback}
					size="xl"
					aria-label="Profile photo preview"
				/>
				<div className="min-w-0 flex-1 space-y-2">
					<p className="text-sm font-semibold text-gray-900">Profile photo</p>
					<p className="text-xs text-slate-500">JPEG, PNG or WebP, up to 10 MB.</p>
					<label htmlFor="avatar-input" className="sr-only">
						Choose a profile photo
					</label>
					<Input
						id="avatar-input"
						type="file"
						accept="image/jpeg,image/png,image/webp"
						disabled={isPending}
						aria-describedby={feedback && !isPending ? 'avatar-feedback' : undefined}
						onChange={handleChange}
						className="h-auto px-3 py-2 text-xs"
					/>
					{isPending && (
						<p role="status" aria-live="polite" className="text-xs text-slate-600">
							Uploading your photo…
						</p>
					)}
					{feedback && !isPending && (
						<p
							id="avatar-feedback"
							role={feedback.kind === 'error' ? 'alert' : 'status'}
							aria-live="polite"
							className={feedback.kind === 'error' ? 'text-xs text-red-700' : 'text-xs text-emerald-700'}
						>
							{feedback.text}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
