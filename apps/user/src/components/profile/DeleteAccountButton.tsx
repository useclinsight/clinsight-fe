'use client';

import { Button, Card, CardContent, Input } from '@clinsight/ui';
import { AlertTriangle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deletePatientAccountAction } from '@/actions/patient-profile';

export function DeleteAccountButton() {
	const [confirmation, setConfirmation] = useState('');
	const [feedback, setFeedback] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFeedback(null);
		startTransition(async () => {
			try {
				const result = await deletePatientAccountAction({ confirmation });
				if (!result.success) setFeedback(result.message);
			} catch {
				setFeedback('Please try again in a moment.');
			}
		});
	}

	return (
		<Card className="rounded-[14px] border-red-200 shadow-none">
			<CardContent className="p-4 sm:p-6">
				<div className="flex items-start gap-3">
					<AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-600" />
					<div className="min-w-0 flex-1">
						<h3 className="font-semibold text-gray-900">Delete Account</h3>
						<p className="mt-1 text-sm text-slate-600">
							Deleting your account will permanently erase your medical insights, history, and saved
							records. This action cannot be undone.
						</p>
						<form onSubmit={handleSubmit} aria-busy={isPending} className="mt-4 space-y-3">
							<label htmlFor="delete-confirmation" className="block text-sm font-medium text-gray-900">
								Type <span className="font-mono font-bold">DELETE</span> to confirm
							</label>
							<Input
								id="delete-confirmation"
								name="confirmation"
								autoComplete="off"
								spellCheck={false}
								required
								value={confirmation}
								aria-describedby={feedback ? 'delete-feedback' : undefined}
								onChange={(event) => setConfirmation(event.target.value)}
								className="max-w-xs"
							/>
							{feedback && (
								<p id="delete-feedback" role="alert" className="text-sm text-red-700">
									{feedback}
								</p>
							)}
							<Button
								type="submit"
								variant="destructive"
								disabled={isPending || confirmation !== 'DELETE'}
							>
								{isPending ? 'Deleting your account…' : 'Permanently delete account'}
							</Button>
						</form>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
