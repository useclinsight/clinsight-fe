import { NextRequest } from 'next/server';

import { backendUrl } from '@/lib/backend-url';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    const response = await fetch(backendUrl('/api/v1/doctors/dashboard'), {
      headers: {
        Authorization: request.headers.get('Authorization') || (token ? `Bearer ${token}` : ''),
        Cookie: request.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json().catch(() => null);
    return Response.json(data, { status: response.status });
  } catch {
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
