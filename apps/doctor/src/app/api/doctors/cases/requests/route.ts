import { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.useclinsight.com';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${BASE_URL}/api/v1/doctors/cases/requests${searchParams ? `?${searchParams}` : ''}`;

    const response = await fetch(targetUrl, {
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
