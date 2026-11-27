import Link from 'next/link';
import { ArrowRight, Bell, FileText } from 'lucide-react';
import { Badge, Card, CardContent } from '@clinsight/ui';

import { getPatientSession } from '@/lib/patient-session';
import { patientApi } from '@/lib/patient-api';
import { UploadCard } from '@/components/patient/UploadCard';

function relativeDate(value: string) {
	const diff = Date.now() - new Date(value).getTime();
	const minutes = Math.max(0, Math.round(diff / 60000));
	if (minutes < 2) return 'just now';
	if (minutes < 60) return `${minutes} mins ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
	const days = Math.round(hours / 24);
	return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default async function PatientHomePage() {
	const session = await getPatientSession();
	if (session.status !== 'ok') return null;

	const [casesResult, unreadResult] = await Promise.all([
		patientApi.listCases(),
		patientApi.unreadCount(),
	]);
	const cases = casesResult.ok ? casesResult.data : [];
	const unread = unreadResult.ok ? unreadResult.data.unread : 0;

	return (
		<div className="mx-auto max-w-5xl space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-gray-900">
						Hello, {session.patient.first_name}
					</h1>
					<p className="mt-1 text-sm text-slate-600">
						Here’s a quick overview of your lab results.
					</p>
				</div>
				<Link
					href="/notifications"
					aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
					className="relative grid size-10 place-items-center rounded-full border border-outline-border bg-white text-slate-600 hover:text-primary-blue"
				>
					<Bell aria-hidden="true" className="size-5" />
					{unread > 0 ? (
						<span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary-blue text-[10px] font-semibold text-white">
							{unread > 9 ? '9+' : unread}
						</span>
					) : null}
				</Link>
			</div>

			{!casesResult.ok ? (
				<p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
					{casesResult.message}
				</p>
			) : null}

			<UploadCard compact />

			<section aria-labelledby="recent-insights-heading" className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 id="recent-insights-heading" className="text-lg font-semibold text-gray-900">
						Recent Insights
					</h2>
					<Link href="/insights" className="inline-flex items-center gap-1 text-sm font-medium text-primary-blue">
						View All <ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				</div>

				{cases.length === 0 ? (
					<Card className="rounded-[14px] border-outline-border bg-white shadow-none">
						<CardContent className="p-6 text-sm text-slate-600">
							No insights yet. Upload your first lab report to get started.
						</CardContent>
					</Card>
				) : (
					<ul className="space-y-2">
						{cases.slice(0, 5).map((item) => (
							<li key={item.id}>
								<Link
									href={`/insights/${item.id}`}
									className="flex items-center gap-3 rounded-xl border border-outline-border bg-white px-4 py-3.5 hover:bg-primary-subtle/40"
								>
									<FileText aria-hidden="true" className="size-5 shrink-0 text-primary-blue" />
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-semibold text-gray-900">
											{item.title ?? 'Lab report'}
										</span>
										<span className="block text-xs text-slate-500">{relativeDate(item.created_at)}</span>
									</span>
									<Badge variant={item.status === 'complete' ? 'success' : 'info'}>{item.status}</Badge>
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
