export function backendUrl(path: `/${string}`): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '');

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not configured');
  }

  return `${baseUrl}${path}`;
}
