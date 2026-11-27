'use client';

import { Button, Card, CardContent, Input } from '@clinsight/ui';
import { useState, useTransition } from 'react';
import { updatePatientProfileAction } from '@/actions/patient-profile';

export function ProfileForm({
	firstName,
	lastName,
	email,
}: {
	firstName: string;
	lastName: string;
	email: string;
}) {
	// Edits override server props; after a successful save the new props match the edits.
	const [edits, setEdits] = useState<{ first_name?: string; last_name?: string }>({});
	const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
	const [isPending, startTransition] = useTransition();

	const values = {
		first_name: edits.first_name ?? firstName,
		last_name: edits.last_name ?? lastName,
	};
	const changed = values.first_name !== firstName || values.last_name !== lastName;

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFeedback(null);
		startTransition(async () => {
			try {
				const result = await updatePatientProfileAction(values);
				if (result.success) setFeedback({ kind: 'success', text: result.message });
				else setFeedback({ kind: 'error', text: result.message });
			} catch {
				setFeedback({ kind: 'error', text: 'Please try again in a moment.' });
			}
		});
	}

	return (
		<Card className="rounded-[14px] border-gray-200 shadow-none">
			<CardContent className="p-4 sm:p-6">
				<form onSubmit={handleSubmit} aria-busy={isPending} noValidate className="space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-1.5">
							<label htmlFor="profile-first-name" className="block text-sm font-medium text-gray-900">
								First name
							</label>
							<Input
								id="profile-first-name"
								name="first_name"
								autoComplete="given-name"
								maxLength={100}
								required
								value={values.first_name}
								onChange={(event) =>
									setEdits((current) => ({ ...current, first_name: event.target.value }))
								}
							/>
						</div>
						<div className="space-y-1.5">
							<label htmlFor="profile-last-name" className="block text-sm font-medium text-gray-900">
								Last name
							</label>
							<Input
								id="profile-last-name"
								name="last_name"
								autoComplete="family-name"
								maxLength={100}
								required
								value={values.last_name}
								onChange={(event) =>
									setEdits((current) => ({ ...current, last_name: event.target.value }))
								}
							/>
						</div>
					</div>
					<div className="space-y-1.5">
						<label htmlFor="profile-email" className="block text-sm font-medium text-gray-900">
							Email address
						</label>
						<Input
							id="profile-email"
							type="email"
							value={email}
							disabled
							aria-describedby="profile-email-hint"
							className="bg-gray-50 text-slate-600"
						/>
						<p id="profile-email-hint" className="text-xs text-slate-500">
							Your email address can’t be changed here.
						</p>
					</div>

					{feedback && (
						<p
							role={feedback.kind === 'error' ? 'alert' : 'status'}
							aria-live="polite"
							className={
								feedback.kind === 'error'
									? 'text-sm text-red-700'
									: 'text-sm text-emerald-700'
							}
						>
							{feedback.text}
						</p>
					)}

					<Button type="submit" variant="brand" disabled={isPending || !changed}>
						{isPending ? 'Saving…' : 'Save changes'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
