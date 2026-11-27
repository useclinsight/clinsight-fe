'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Check, X } from 'lucide-react';
import { Button, Input } from '@clinsight/ui';
import { toast } from 'sonner';

export function VerificationActions({ id, name }: { id: string; name: string }) {
	const router = useRouter();
	const [pending, startTransition] = useTransition();
	const [rejecting, setRejecting] = useState(false);
	const [reason, setReason] = useState('');

	const act = (action: 'approve' | 'reject') => {
		startTransition(async () => {
			try {
				const response = await fetch(`/api/admin/doctor-requests/${id}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action, rejection_reason: reason }),
				});
				const data = (await response.json()) as { message?: string };
				if (!response.ok) {
					toast.error(data.message ?? 'Unable to update this request.');
					return;
				}
				toast.success(action === 'approve' ? `${name} approved.` : `${name} rejected.`);
				setRejecting(false);
				setReason('');
				router.refresh();
			} catch {
				toast.error('Unable to reach the API.');
			}
		});
	};

	return (
		<div className="flex w-full flex-col gap-2 lg:w-56">
			{rejecting ? (
				<div className="space-y-2">
					<Input
						value={reason}
						onChange={(event) => setReason(event.target.value)}
						placeholder="Reason for rejection"
						aria-label="Reason for rejection"
					/>
					<Button
						size="sm"
						variant="brand"
						disabled={pending || !reason.trim()}
						className="gap-1.5 bg-red-600 hover:bg-red-700"
						onClick={() => act('reject')}
					>
						<X className="h-4 w-4" /> Confirm rejection
					</Button>
					<Button
						size="sm"
						variant="outline"
						disabled={pending}
						onClick={() => setRejecting(false)}
					>
						Cancel
					</Button>
				</div>
			) : (
				<>
					<Button
						size="sm"
						variant="brand"
						disabled={pending}
						className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
						onClick={() => act('approve')}
					>
						<Check className="h-4 w-4" /> Approve Doctor
					</Button>
					<Button
						size="sm"
						variant="outline"
						disabled={pending}
						className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
						onClick={() => setRejecting(true)}
					>
						<X className="h-4 w-4" /> Reject Submission
					</Button>
				</>
			)}
		</div>
	);
}
