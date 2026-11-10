import { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.useclinsight.com';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = request.cookies.get('token')?.value;

    const response = await fetch(`${BASE_URL}/api/v1/cases/${id}/full`, {
      headers: {
        Authorization: request.headers.get('Authorization') || (token ? `Bearer ${token}` : ''),
        Cookie: request.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => null);
    return Response.json(data, { status: response.status });
  } catch {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
