import { casePdfResponse } from '@/lib/patient-api';

export async function GET(_request: Request, { params }: { params: Promise<{ caseId: string }> }) {
	const { caseId } = await params;
	const upstream = await casePdfResponse(caseId);
	if (!upstream.ok) {
		const message = await upstream.text().catch(() => 'Unable to export this report.');
		return Response.json({ message }, { status: upstream.status });
	}

	const bytes = await upstream.arrayBuffer();
	return new Response(bytes, {
		status: 200,
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="clinsight-report-${caseId}.pdf"`,
			'Cache-Control': 'no-store',
		},
	});
}
