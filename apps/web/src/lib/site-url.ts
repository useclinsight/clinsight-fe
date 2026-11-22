const defaultSiteUrl = 'https://www.useclinsight.com';

export function getPublicSiteUrl() {
  const value = process.env.NEXT_PUBLIC_APP_URL?.trim() || defaultSiteUrl;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : defaultSiteUrl;
  } catch {
    return defaultSiteUrl;
  }
}
