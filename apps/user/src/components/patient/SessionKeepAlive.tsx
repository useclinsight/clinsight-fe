'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { refreshSessionAction } from '@/actions/patient-session';
import { withSessionLock } from '@/lib/browser-session-lock';

/** Keeps the session alive while a dashboard page stays open. */
export function SessionKeepAlive() {
	const router = useRouter();
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		let active = true;

		const schedule = (delay: number) => {
			if (!active) return;
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => void tick(), delay);
		};

		const tick = async () => {
			const result = await withSessionLock(refreshSessionAction);
			if (!active) return;
			if (result.status === 'ok') {
				schedule(result.refreshInMs);
			} else if (result.status === 'expired') {
				router.replace('/login');
			} else {
				schedule(30_000);
			}
		};

		void tick();

		const onVisible = () => {
			if (document.visibilityState === 'visible') void tick();
		};
		document.addEventListener('visibilitychange', onVisible);

		return () => {
			active = false;
			if (timer.current) clearTimeout(timer.current);
			document.removeEventListener('visibilitychange', onVisible);
		};
	}, [router]);

	return null;
}
