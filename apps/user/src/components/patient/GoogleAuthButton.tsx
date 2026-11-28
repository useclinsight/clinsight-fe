'use client';

function googleAuthUrl(): string {
	const configured = process.env.NEXT_PUBLIC_GOOGLE_AUTH_API_URL;
	const base =
		configured || `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}/api/v1/auth/google`;
	const url = new URL(base);
	url.searchParams.set('role', 'patient');
	url.searchParams.set('platform', 'web');
	const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
	if (appUrl) url.searchParams.set('return_url', `${appUrl.replace(/\/+$/, '')}/login`);
	return url.toString();
}

export function GoogleAuthButton({ label = 'Continue with Google' }: { label?: string }) {
	return (
		<a
			href={googleAuthUrl()}
			className="flex h-[50px] w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 transition hover:bg-gray-50"
		>
			<svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
				<path fill="#4285F4" d="M21.6 12.23c0-.68-.06-1.36-.18-2.02H12v3.82h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.74 2.98-4.31 2.98-7.32Z" />
				<path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.13H3.06v2.58A10 10 0 0 0 12 22Z" />
				<path fill="#FBBC05" d="M6.41 13.9a6 6 0 0 1 0-3.8V7.52H3.06a10 10 0 0 0 0 8.96l3.35-2.58Z" />
				<path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.83 1.51l2.87-2.87C16.95 2.92 14.7 2 12 2A10 10 0 0 0 3.06 7.52l3.35 2.58C7.2 7.73 9.4 5.98 12 5.98Z" />
			</svg>
			{label}
		</a>
	);
}
