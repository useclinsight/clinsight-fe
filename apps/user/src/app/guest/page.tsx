import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Badge, Button, Card, CardContent } from '@clinsight/ui';

import { getGuestId, guestApi } from '@/lib/patient-guest';
import { GuestBootstrap } from '@/components/patient/GuestBootstrap';
import { GuestUpload } from '@/components/patient/GuestUpload';

export default async function GuestHomePage() {
	const guestId = await getGuestId();
	if (!guestId) {
		return (
			<main className="mx-auto max-w-3xl px-5 py-16">
				<GuestBootstrap />
			</main>
		);
	}

	const result = await guestApi.cases();
	const cases = result.ok ? result.data : [];

	return (
		<main className="mx-auto max-w-3xl space-y-6 px-5 py-8 sm:py-12">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">Hello there</h1>
					<p className="mt-1 text-sm text-slate-600">Here’s a quick overview of your lab results.</p>
				</div>
				<Button asChild variant="outline" size="sm">
					<Link href="/login">Already have an account? Login</Link>
				</Button>
			</div>

			<GuestUpload />

			<Card className="rounded-[14px] border-outline-border bg-white shadow-none">
				<CardContent className="space-y-4 p-5 sm:p-6">
					<h2 className="text-sm font-semibold text-gray-900">Get a doctor’s second opinion</h2>
					<p className="text-sm text-slate-600">
						You can request a verified doctor to review your results for an additional fee.
					</p>
				</CardContent>
			</Card>

			<section aria-labelledby="guest-insights-heading" className="space-y-3">
				<h2 id="guest-insights-heading" className="text-lg font-semibold text-gray-900">Recent Insights</h2>
				{cases.length === 0 ? (
					<p role="status" className="rounded-xl border border-outline-border bg-white px-5 py-10 text-center text-sm text-slate-600">
						No insights yet. Upload your first lab report to get started.
					</p>
				) : (
					<ul className="space-y-2">
						{cases.map((item) => (
							<li key={item.id}>
								<Link href={`/guest/${item.id}`} className="flex items-center gap-3 rounded-xl border border-outline-border bg-white px-4 py-3.5 hover:bg-primary-subtle/40">
									<FileText aria-hidden="true" className="size-5 text-primary-blue" />
									<span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900">{item.title ?? 'Lab report'}</span>
									<Badge variant={item.status === 'complete' ? 'success' : 'info'}>{item.status}</Badge>
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}
