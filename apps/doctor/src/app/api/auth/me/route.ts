import { NextRequest } from 'next/server';

import { backendUrl } from '@/lib/backend-url';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    const response = await fetch(backendUrl('/api/v1/auth/me'), {
      headers: {
        // Forward the auth header from the client
        Authorization: request.headers.get('Authorization') || (token ? `Bearer ${token}` : ''),
        Cookie: request.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) return Response.json(null, { status: response.status });

    const data = await response.json();
    return Response.json(data);
  } catch {
    return Response.json(null, { status: 500 });
  }
}
