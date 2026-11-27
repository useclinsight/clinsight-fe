import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@clinsight/ui';

import { getGuestId, guestApi } from '@/lib/patient-guest';
import { GuestBootstrap } from '@/components/patient/GuestBootstrap';
import { GuestChat } from '@/components/patient/GuestChat';
import { GuestProcessingWatcher } from '@/components/patient/GuestProcessingWatcher';

export default async function GuestCasePage({
	params,
	searchParams,
}: {
	params: Promise<{ caseId: string }>;
	searchParams: Promise<{ new?: string }>;
}) {
	const guestId = await getGuestId();
	if (!guestId) {
		return <main className="mx-auto max-w-3xl px-5 py-16"><GuestBootstrap /></main>;
	}
	const { caseId } = await params;
	const { new: isNew } = await searchParams;
	const result = await guestApi.caseFull(caseId);

	if (!result.ok) {
		return (
			<main className="mx-auto max-w-3xl px-5 py-12">
				<Card className="border-red-200 bg-red-50 shadow-none">
					<CardContent className="space-y-3 p-5">
						<p className="text-sm text-red-700">{result.message}</p>
						<Button asChild size="sm" variant="outline"><Link href="/guest">Start again</Link></Button>
					</CardContent>
				</Card>
			</main>
		);
	}

	const detail = result.data;
	const interpretation = detail.interpretation;
	const processing = !interpretation || interpretation.status === 'pending' || interpretation.status === 'processing';

	return (
		<main className="mx-auto max-w-3xl space-y-6 px-5 py-8 sm:py-10">
			<div>
				<Link href="/guest" className="inline-flex items-center gap-1 text-sm text-primary-blue">
					<ArrowLeft aria-hidden="true" className="size-4" /> Back to home
				</Link>
				<h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{detail.case.title ?? 'Lab report'}</h1>
				<p className="mt-1 text-xs text-slate-500">Uploaded {new Date(detail.case.created_at).toLocaleString()}</p>
			</div>

			{processing ? <GuestProcessingWatcher caseId={caseId} /> : null}

			{interpretation?.status === 'complete' ? (
				<Card className="rounded-[14px] border-outline-border bg-white shadow-none">
					<CardHeader><CardTitle>Detailed Assessment</CardTitle></CardHeader>
					<CardContent className="space-y-4">
						<p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{interpretation.summary}</p>
						{interpretation.value_breakdown && interpretation.value_breakdown.length > 0 ? (
							<ul className="divide-y divide-outline-border rounded-lg border border-outline-border">
								{interpretation.value_breakdown.map((item, index) => (
									<li key={`${item.metric}-${index}`} className="flex flex-wrap justify-between gap-2 px-3 py-2 text-sm">
										<span className="font-medium text-gray-800">{item.metric}</span>
										<span className="text-slate-600">{item.value} {item.unit ?? ''} {item.status ?? ''}</span>
									</li>
								))}
							</ul>
						) : null}
						{interpretation.risk_level ? <Badge variant="warning">{interpretation.risk_level} risk</Badge> : null}
					</CardContent>
				</Card>
			) : null}

			{detail.lab_results.length > 0 ? (
				<ul className="space-y-2">
					{detail.lab_results.map((lab) => (
						<li key={lab.id} className="flex items-center gap-3 rounded-xl border border-outline-border bg-white px-4 py-3">
							<FileText aria-hidden="true" className="size-5 text-primary-blue" />
							<span className="min-w-0 flex-1 truncate text-sm">{lab.file.name}</span>
							<Badge variant="outline">{lab.ocr_status}</Badge>
						</li>
					))}
				</ul>
			) : null}

			<GuestChat
				caseId={caseId}
				messages={detail.chats}
				questions={interpretation?.suggested_questions ?? []}
			/>

			<Card className="rounded-[14px] border-primary-blue bg-primary-subtle shadow-none">
				<CardContent className="space-y-3 p-5">
					<h2 className="text-base font-semibold text-gray-900">Continue your conversation</h2>
					<p className="text-sm text-slate-700">
						Create an account to keep chatting with Chris and save your health insights securely.
					</p>
					<Button asChild variant="brand" size="sm">
						<Link href="/signup?guest=1">Create Account</Link>
					</Button>
					<p className="text-xs text-slate-600">Already have an account? <Link href="/login" className="font-semibold underline">Login</Link></p>
				</CardContent>
			</Card>
			{isNew ? <p className="text-xs text-slate-500">Guest sessions expire after one hour.</p> : null}
		</main>
	);
}
