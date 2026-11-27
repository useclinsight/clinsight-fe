import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@clinsight/ui';

import { patientApi } from '@/lib/patient-api';
import { getPatientSession } from '@/lib/patient-session';
import { InsightsList } from '@/components/patient/InsightsList';
import { UploadCard } from '@/components/patient/UploadCard';

export default async function InsightsPage() {
	const session = await getPatientSession();
	if (session.status !== 'ok') return null;

	const result = await patientApi.listCases();

	return (
		<div className="mx-auto max-w-5xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-gray-900">Insights</h1>
				<p className="mt-1 text-sm text-slate-600">Your lab interpretations and conversations.</p>
			</div>

			{!result.ok ? (
				<Card className="border-red-200 bg-red-50 shadow-none">
					<CardContent className="p-5 text-sm text-red-700">{result.message}</CardContent>
				</Card>
			) : (
				<InsightsList cases={result.data} />
			)}

			<Card className="rounded-[14px] border-outline-border bg-white shadow-none">
				<CardContent className="p-5 sm:p-6">
					<UploadCard compact />
					<Link href="/" className="mt-3 inline-flex items-center gap-1 text-sm text-primary-blue">
						Back to home <ArrowRight aria-hidden="true" className="size-4" />
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}
