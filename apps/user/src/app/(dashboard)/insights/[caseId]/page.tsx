import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@clinsight/ui';

import { patientApi } from '@/lib/patient-api';
import { getPatientSession } from '@/lib/patient-session';
import { ChatPanel } from '@/components/patient/ChatPanel';
import { ProcessingWatcher } from '@/components/patient/ProcessingWatcher';
import { AddResultForm } from '@/components/patient/AddResultForm';
import { RetryAnalysisButton } from '@/components/patient/RetryAnalysisButton';

export default async function InsightDetailPage({
	params,
	searchParams,
}: {
	params: Promise<{ caseId: string }>;
	searchParams: Promise<{ new?: string }>;
}) {
	const session = await getPatientSession();
	if (session.status !== 'ok') return null;
	const { caseId } = await params;
	const { new: isNew } = await searchParams;
	const result = await patientApi.getCase(caseId);

	if (!result.ok) {
		return (
			<div className="mx-auto max-w-4xl">
				<Card className="border-red-200 bg-red-50 shadow-none">
					<CardContent className="p-5 text-sm text-red-700">{result.message}</CardContent>
				</Card>
			</div>
		);
	}

	const detail = result.data;
	const interpretation = detail.interpretation;
	const failedLab = detail.lab_results.find((lab) => lab.ocr_status === 'failed');
	const hasFailure =
		detail.case.status === 'failed' ||
		interpretation?.status === 'failed' ||
		failedLab !== undefined;
	const isProcessing =
		!hasFailure && (!interpretation || (interpretation.status !== 'complete' && interpretation.status !== 'failed'));

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<Link href="/insights" className="inline-flex items-center gap-1 text-sm text-primary-blue">
						<ArrowLeft aria-hidden="true" className="size-4" /> All insights
					</Link>
					<h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
						{detail.case.title ?? 'Lab report'}
					</h1>
					<p className="mt-1 text-xs text-slate-500">
						Uploaded {new Date(detail.case.created_at).toLocaleString()}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Badge variant={hasFailure ? 'destructive' : detail.case.status === 'complete' ? 'success' : 'info'}>
						{detail.case.status}
					</Badge>
					<Button asChild size="sm" variant="outline" className="gap-2">
						<a href={`/api/cases/${caseId}/export`}>
							<Download aria-hidden="true" className="size-4" /> Download report
						</a>
					</Button>
				</div>
			</div>

			{isProcessing ? (
				<ProcessingWatcher caseId={caseId} initialStage={isNew ? 0 : 1} />
			) : null}

			{hasFailure ? (
				<div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
					<div>
						<p className="text-sm font-semibold text-red-800">We couldn’t finish this analysis</p>
						<p className="mt-0.5 text-sm text-red-700">
							You can retry the same report, or add a clearer image below.
						</p>
					</div>
					{(failedLab ?? detail.lab_results[0]) ? (
						<RetryAnalysisButton
							caseId={caseId}
							labResultId={(failedLab ?? detail.lab_results[0]).id}
						/>
					) : null}
				</div>
			) : null}

			{interpretation?.status === 'complete' ? (
				<Card className="rounded-[14px] border-outline-border bg-white shadow-none">
					<CardHeader>
						<CardTitle className="flex flex-wrap items-center gap-2">
							Detailed Assessment
							{interpretation.risk_level ? (
								<Badge variant={interpretation.risk_level === 'high' ? 'destructive' : 'warning'}>
									{interpretation.risk_level} risk
								</Badge>
							) : null}
							{interpretation.confidence ? <Badge variant="info">{interpretation.confidence} confidence</Badge> : null}
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-5">
						<p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
							{interpretation.summary}
						</p>
						{interpretation.value_breakdown && interpretation.value_breakdown.length > 0 ? (
							<div>
								<h3 className="text-sm font-semibold text-gray-900">What your test values mean</h3>
								<ul className="mt-2 divide-y divide-outline-border rounded-lg border border-outline-border">
									{interpretation.value_breakdown.map((item, index) => (
										<li key={`${item.metric}-${index}`} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
											<span className="font-medium text-gray-800">{item.metric}</span>
											<span className="text-slate-600">
												{item.value} {item.unit ?? ''}{' '}
												{item.status ? <Badge variant="outline">{item.status}</Badge> : null}
											</span>
										</li>
									))}
								</ul>
							</div>
						) : null}
					</CardContent>
				</Card>
			) : null}

			{detail.lab_results.length > 0 || hasFailure ? (
				<section aria-labelledby="reports-heading" className="space-y-3">
					<h2 id="reports-heading" className="text-lg font-semibold text-gray-900">Your reports</h2>
					{detail.lab_results.length > 0 ? (
						<ul className="space-y-2">
						{detail.lab_results.map((lab) => (
							<li key={lab.id} className="flex items-center gap-3 rounded-xl border border-outline-border bg-white px-4 py-3">
								<FileText aria-hidden="true" className="size-5 text-primary-blue" />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-gray-900">{lab.file.name}</p>
									<p className="text-xs text-slate-500">{lab.ocr_status}</p>
								</div>
								<Button asChild size="xs" variant="ghost">
									<a href={lab.file.url} target="_blank" rel="noreferrer">View</a>
								</Button>
							</li>
						))}
						</ul>
					) : null}
					<AddResultForm caseId={caseId} />
				</section>
			) : null}

			<ChatPanel
				caseId={caseId}
				messages={detail.chats}
				suggestedQuestions={interpretation?.suggested_questions ?? []}
			/>
		</div>
	);
}
