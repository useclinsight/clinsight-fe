import { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.useclinsight.com';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    const response = await fetch(`${BASE_URL}/api/v1/doctors/verification/dismiss`, {
      method: 'POST',
      headers: {
        Authorization: request.headers.get('Authorization') || (token ? `Bearer ${token}` : ''),
        Cookie: request.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
