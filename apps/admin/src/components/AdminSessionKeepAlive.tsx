'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function AdminSessionKeepAlive() {
	const router = useRouter();
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		let active = true;
		const schedule = (ms: number) => {
			if (!active) return;
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => void refresh(), ms);
		};
		const refresh = async () => {
			try {
				const response = await fetch('/api/auth/refresh', { method: 'POST' });
				if (!active) return;
				if (response.ok) schedule(90_000);
				else {
					router.replace('/login');
				}
			} catch {
				schedule(30_000);
			}
		};
		void refresh();
		const onVisible = () => {
			if (document.visibilityState === 'visible') void refresh();
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
