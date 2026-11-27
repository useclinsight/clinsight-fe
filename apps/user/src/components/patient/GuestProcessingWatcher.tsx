'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

import { guestCaseSnapshotAction } from '@/actions/patient-guest';

const STAGES = ['Extracting data from your file…', 'Interpreting lab values…', 'Preparing your results…'];

export function GuestProcessingWatcher({ caseId }: { caseId: string }) {
	const router = useRouter();
	const [stage, setStage] = useState(0);
	const [error, setError] = useState(false);

	useEffect(() => {
		let active = true;
		const poll = async () => {
			const snapshot = await guestCaseSnapshotAction(caseId);
			if (!active) return;
			if (!snapshot) {
				setError(true);
				return;
			}
			if (snapshot.interpretation?.status === 'complete' || snapshot.interpretation?.status === 'failed') {
				router.refresh();
				return;
			}
			setStage((value) => Math.min(value + 1, STAGES.length - 1));
		};
		const timer = setInterval(poll, 4000);
		void poll();
		return () => {
			active = false;
			clearInterval(timer);
		};
	}, [caseId, router]);

	if (error) {
		return <p role="alert" className="rounded-xl bg-red-50 p-5 text-sm text-red-800">There was an issue processing your file. Please try again.</p>;
	}
	return (
		<div role="status" aria-live="polite" className="flex items-center gap-3 rounded-xl border border-outline-border bg-white p-5">
			<LoaderCircle aria-hidden="true" className="size-5 animate-spin text-primary-blue" />
			<div>
				<p className="text-sm font-semibold text-gray-900">AI Review</p>
				<p className="text-sm text-slate-600">{STAGES[stage]}</p>
			</div>
		</div>
	);
}
