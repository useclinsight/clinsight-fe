'use client';

import { Button, Card, CardContent } from '@clinsight/ui';
import { Check, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { updatePatientPasswordAction } from '@/actions/patient-profile';
import { PatientPasswordInput } from '@/components/PatientPasswordInput';
import { getPatientPasswordRules, passwordHint } from '@/schemas/patient-account';

export function PasswordForm() {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
	const [isPending, startTransition] = useTransition();

	const rules = getPatientPasswordRules(newPassword);
	const rulesMet = rules.every(({ met }) => met);
	const showRules = newPassword.length > 0;

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFeedback(null);
		startTransition(async () => {
			try {
				const result = await updatePatientPasswordAction({
					current_password: currentPassword,
					new_password: newPassword,
					confirm_password: confirmPassword,
				});
				if (result.success) {
					setFeedback({ kind: 'success', text: result.message });
					setCurrentPassword('');
					setNewPassword('');
					setConfirmPassword('');
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
			<CardContent className="p-4 sm:p-6">
				<form onSubmit={handleSubmit} aria-busy={isPending} noValidate className="space-y-5">
					<div className="space-y-1.5">
						<label htmlFor="current-password" className="block text-sm font-medium text-gray-900">
							Current password
						</label>
						<PatientPasswordInput
							id="current-password"
							passwordLabel="current password"
							autoComplete="current-password"
							required
							value={currentPassword}
							onChange={(event) => setCurrentPassword(event.target.value)}
						/>
					</div>

					<div className="space-y-1.5">
						<label htmlFor="new-password" className="block text-sm font-medium text-gray-900">
							New password
						</label>
						<PatientPasswordInput
							id="new-password"
							passwordLabel="new password"
							autoComplete="new-password"
							required
							value={newPassword}
							aria-describedby={showRules ? 'password-requirements' : 'password-hint'}
							onChange={(event) => setNewPassword(event.target.value)}
						/>
						{showRules ? (
							<ul
								id="password-requirements"
								aria-label="Password requirements"
								className="grid gap-1 text-sm"
							>
								{rules.map(({ label, met }) => {
									const Icon = met ? Check : X;
									return (
										<li
											key={label}
											className={met ? 'flex items-center gap-1.5 text-emerald-700' : 'flex items-center gap-1.5 text-slate-600'}
										>
											<Icon aria-hidden="true" className="size-3.5 shrink-0" />
											{label}
											<span className="sr-only">{met ? ' (met)' : ' (not met)'}</span>
										</li>
									);
								})}
							</ul>
						) : (
							<p id="password-hint" className="text-xs text-slate-500">
								{passwordHint}
							</p>
						)}
					</div>

					<div className="space-y-1.5">
						<label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
							Confirm new password
						</label>
						<PatientPasswordInput
							id="confirm-password"
							passwordLabel="confirm new password"
							autoComplete="new-password"
							required
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
						/>
						{confirmPassword.length > 0 && confirmPassword !== newPassword && (
							<p role="alert" className="text-sm text-red-700">
								The passwords don’t match.
							</p>
						)}
					</div>

					{feedback && (
						<p
							role={feedback.kind === 'error' ? 'alert' : 'status'}
							aria-live="polite"
							className={
								feedback.kind === 'error' ? 'text-sm text-red-700' : 'text-sm text-emerald-700'
							}
						>
							{feedback.text}
						</p>
					)}

					<Button type="submit" variant="brand" disabled={isPending || !rulesMet}>
						{isPending ? 'Updating password…' : 'Change password'}
					</Button>
					<p className="text-xs text-slate-500">
						You’ll be signed out and asked to sign in again with your new password.
					</p>
				</form>
			</CardContent>
		</Card>
	);
}
