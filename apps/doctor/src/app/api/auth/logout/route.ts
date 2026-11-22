import { NextRequest, NextResponse } from 'next/server';

import { backendUrl } from '@/lib/backend-url';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const response = NextResponse.json({ success: true });

  response.cookies.delete('token');
  response.cookies.delete('refresh_token');

  try {
    await fetch(backendUrl('/api/v1/auth/doctor/logout'), {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    return response;
  } catch {
    return response;
  }
}
