'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

import { getCaseSnapshotAction } from '@/actions/patient-data';

const STAGES = ['Extracting data from your file…', 'Interpreting lab values…', 'Preparing your results…'];

export function ProcessingWatcher({ caseId, initialStage = 0 }: { caseId: string; initialStage?: number }) {
	const router = useRouter();
	const [stage, setStage] = useState(initialStage);
	const [error, setError] = useState(false);

	useEffect(() => {
		let active = true;
		const poll = async () => {
			try {
				const snapshot = await getCaseSnapshotAction(caseId);
				if (!active) return;
				if (!snapshot) {
					setError(true);
					return;
				}
				if (snapshot.interpretation?.status === 'complete') {
					router.refresh();
					return;
				}
				if (snapshot.interpretation?.status === 'failed' || snapshot.case.status === 'failed') {
					router.refresh();
					return;
				}
				setStage((current) => Math.min(current + 1, STAGES.length - 1));
			} catch {
				if (active) setError(true);
			}
		};
		const timer = setInterval(poll, 4000);
		void poll();
		return () => {
			active = false;
			clearInterval(timer);
		};
	}, [caseId, router]);

	if (error) {
		return (
			<div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
				There was an issue processing your file. Please try again.
			</div>
		);
	}

	return (
		<div role="status" aria-live="polite" className="flex items-center gap-3 rounded-xl border border-outline-border bg-white p-5">
			<LoaderCircle aria-hidden="true" className="size-5 animate-spin text-primary-blue" />
			<div>
				<p className="text-sm font-semibold text-gray-900">AI Review</p>
				<p className="mt-0.5 text-sm text-slate-600">{STAGES[stage]}</p>
			</div>
		</div>
	);
}
