import posthog, { type CaptureResult } from 'posthog-js';

declare global {
  interface Window {
    __clinsightPostHogInitialized?: boolean;
  }
}

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// The Clinsight PostHog project is hosted in the EU region. Keep this
// configurable so each deployment can use the host shown in Project Settings.
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim().replace(/\/+$/, '');
const inMemoryAnalyticsIds = new Map<string, string>();

function isExcludedPath(pathname: string) {
  return (
    pathname === '/user' ||
    pathname.startsWith('/user/') ||
    pathname === '/verification' ||
    pathname.startsWith('/verification/')
  );
}

function canTrackCurrentRoute() {
  return typeof window !== 'undefined' && !isExcludedPath(window.location.pathname);
}

function sanitizeUrl(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    url.searchParams.delete('distinct_id');
    return url.toString();
  } catch {
    return value;
  }
}

function filterExcludedRouteEvents(capture: CaptureResult | null) {
  if (!capture) return capture;
  if (typeof window !== 'undefined' && isExcludedPath(window.location.pathname)) return null;

  const currentUrl = capture.properties?.$current_url;
  if (typeof currentUrl === 'string') {
    try {
      if (isExcludedPath(new URL(currentUrl).pathname)) return null;
    } catch {
      // Keep events with malformed custom URLs unchanged.
    }
    capture.properties.$current_url = sanitizeUrl(currentUrl);
  }

  return capture;
}

function getOpaqueAnalyticsId() {
  const storageKey = 'clinsight_lead_analytics_id';
  const inMemoryId = inMemoryAnalyticsIds.get(storageKey);
  if (inMemoryId) return inMemoryId;

  try {
    const existingId = window.localStorage.getItem(storageKey);
    if (existingId) {
      inMemoryAnalyticsIds.set(storageKey, existingId);
      return existingId;
    }
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }

  const id = `lead_${crypto.randomUUID()}`;
  inMemoryAnalyticsIds.set(storageKey, id);

  try {
    window.localStorage.setItem(storageKey, id);
  } catch {
    // Continue with the in-memory ID when persistent storage is unavailable.
  }

  return id;
}

export function initializePostHog(): boolean {
  if (!posthogKey || !posthogHost || !canTrackCurrentRoute()) return false;
  if (window.__clinsightPostHogInitialized) return true;

  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: 'history_change',
    defaults: '2026-05-30',
    persistence: 'localStorage+cookie',
    before_send: filterExcludedRouteEvents,
  });
  window.__clinsightPostHogInitialized = true;
  return true;
}

export function identifyLead() {
  if (!initializePostHog() || !canTrackCurrentRoute()) return;
  posthog.identify(getOpaqueAnalyticsId());
}

export function captureLead(source: 'guide' | 'waitlist') {
  if (!initializePostHog() || !canTrackCurrentRoute()) return;
  posthog.capture('lead_captured', { source });
}

export function captureGuestEvent(event: string, properties?: Record<string, string>) {
  if (!initializePostHog() || !canTrackCurrentRoute()) return;
  posthog.capture(event, properties);
}
