export async function getCurrentUser() {
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

export async function getVerificationStatus() {
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
