export function getPublicSiteUrl() {
  const value = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : undefined;
  } catch {
    return undefined;
  }
}
