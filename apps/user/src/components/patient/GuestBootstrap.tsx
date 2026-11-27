'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

import { startGuestSessionAction } from '@/actions/patient-guest';

export function GuestBootstrap() {
	const router = useRouter();
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		let active = true;
		void (async () => {
			const result = await startGuestSessionAction();
			if (!active) return;
			if (!result.ok) {
				setFailed(true);
				return;
			}
			router.refresh();
		})();
		return () => {
			active = false;
		};
	}, [router]);

	if (failed) {
		return (
			<p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
				We couldn’t start a guest session. Please{' '}
				<a href="/login" className="font-semibold underline">sign in</a> instead.
			</p>
		);
	}

	return (
		<p role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-slate-600">
			<LoaderCircle aria-hidden="true" className="size-4 animate-spin text-primary-blue" />
			Preparing your guest session…
		</p>
	);
}
