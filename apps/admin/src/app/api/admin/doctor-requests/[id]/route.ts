import { NextResponse } from 'next/server';

import { adminFetch } from '@/lib/admin-api';

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	let action: string;
	let rejectionReason: string;
	try {
		const body = (await request.json()) as { action?: string; rejection_reason?: string };
		action = body.action ?? '';
		rejectionReason = body.rejection_reason ?? '';
	} catch {
		return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
	}

	if (!['approve', 'reject'].includes(action)) {
		return NextResponse.json({ message: 'Unknown action.' }, { status: 400 });
	}
	if (action === 'reject' && !rejectionReason.trim()) {
		return NextResponse.json({ message: 'A rejection reason is required.' }, { status: 400 });
	}

	try {
		const response = await adminFetch(`/api/v1/admin/doctor-requests/${id}/${action}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: action === 'reject' ? JSON.stringify({ rejection_reason: rejectionReason }) : undefined,
		});
		const data = (await response.json()) as { message?: string; status?: string };
		if (!response.ok) {
			return NextResponse.json({ message: data.message ?? 'Request failed.' }, { status: response.status });
		}
		return NextResponse.json({ ok: true, message: data.message ?? 'Request updated.' });
	} catch {
		return NextResponse.json({ message: 'Unable to reach the API.' }, { status: 503 });
	}
}
