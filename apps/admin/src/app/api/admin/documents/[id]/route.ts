import { NextResponse } from 'next/server';

import { adminFetch } from '@/lib/admin-api';

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const response = await adminFetch(`/api/v1/doctors/verification/documents/${id}`);
		const data = (await response.json()) as {
			status?: string;
			message?: string;
			data?: { signed_url: string };
		};
		if (!response.ok || !data.data?.signed_url) {
			return NextResponse.json(
				{ message: data.message ?? 'Document unavailable.' },
				{ status: response.status },
			);
		}
		return NextResponse.redirect(data.data.signed_url);
	} catch {
		return NextResponse.json({ message: 'Unable to reach the API.' }, { status: 503 });
	}
}
