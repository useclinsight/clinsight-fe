import type { UserProfile, VerificationStatusResponse } from '@clinsight/types';

export function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof atob === 'function') {
    return atob(base64);
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('binary');
  }
  return '';
}

export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const exp = payload.exp;
    if (!exp) return true;
    return Date.now() / 1000 >= exp - 10;
  } catch {
    return true;
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (!response.ok) return null;
    const result = await response.json();
    return result?.data || null;
  } catch {
    return null;
  }
}

export async function getVerificationStatus(): Promise<VerificationStatusResponse | null> {
  try {
    const response = await fetch('/api/doctors/verification/status', {
      credentials: 'include',
    });

    if (!response.ok) return null;
    const result = await response.json();
    return result?.data || null;
  } catch {
    return null;
  }
}
