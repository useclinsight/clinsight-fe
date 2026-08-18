import posthog from 'posthog-js';

declare global {
  interface Window {
    __clinsightPostHogInitialized?: boolean;
  }
}

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// The Clinsight PostHog project is hosted in the EU region. Keep this
// configurable so each deployment can use the host shown in Project Settings.
const posthogHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com').replace(
  /\/$/,
  '',
);
const inMemoryAnalyticsIds = new Map<string, string>();

function getOpaqueAnalyticsId(kind: 'lead' | 'user') {
  const storageKey = `clinsight_${kind}_analytics_id`;
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

  const id = `${kind}_${crypto.randomUUID()}`;
  inMemoryAnalyticsIds.set(storageKey, id);

  try {
    window.localStorage.setItem(storageKey, id);
  } catch {
    // Continue with the in-memory ID when persistent storage is unavailable.
  }

  return id;
}

export function initializePostHog(): boolean {
  if (!posthogKey || typeof window === 'undefined') return false;
  if (window.__clinsightPostHogInitialized) return true;

  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: false,
    defaults: '2026-05-30',
    persistence: 'localStorage+cookie',
  });
  window.__clinsightPostHogInitialized = true;
  return true;
}

export function capturePageView() {
  if (!initializePostHog() || typeof window === 'undefined') return;

  posthog.capture('$pageview', {
    $current_url: window.location.href,
  });
}

export function restoreIdentityFromUrl() {
  if (!initializePostHog() || typeof window === 'undefined') return;

  const distinctId = new URLSearchParams(window.location.search).get('distinct_id')?.trim();
  if (!distinctId || distinctId.length > 200) return;

  posthog.identify(distinctId);
}

export function identifyLead() {
  if (!initializePostHog() || typeof window === 'undefined') return;
  posthog.identify(getOpaqueAnalyticsId('lead'));
}

export function identifyUser(userId: string, properties?: Record<string, string>) {
  if (!initializePostHog()) return;
  posthog.identify(userId, properties);
}

export function captureLead(source: 'guide' | 'waitlist') {
  if (!initializePostHog()) return;
  posthog.capture('lead_captured', { source });
}

export function captureRegistration() {
  if (!initializePostHog() || typeof window === 'undefined') return;
  const userId = getOpaqueAnalyticsId('user');
  const previousId = posthog.get_distinct_id();
  posthog.identify(userId);
  if (previousId !== userId) posthog.alias(userId, previousId);
  posthog.capture('registration_completed');
}

export function captureGuestEvent(event: string, properties?: Record<string, string>) {
  if (!initializePostHog()) return;
  posthog.capture(event, properties);
}

export function resetPostHog() {
  if (!initializePostHog()) return;
  posthog.reset();
}
