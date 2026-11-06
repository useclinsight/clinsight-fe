import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.staging.useclinsight.com';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const response = NextResponse.json({ success: true });

  response.cookies.delete('token');
  response.cookies.delete('refresh_token');

  try {
    await fetch(`${BASE_URL}/api/v1/auth/logout`, {
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
