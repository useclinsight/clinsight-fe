'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics/pixel';
import { capturePageView, initializePostHog, restoreIdentityFromUrl } from '@/lib/analytics/posthog';

function shouldTrackPostHog(pathname: string | null) {
  if (!pathname) return false;
  return !pathname.startsWith('/user') && !pathname.startsWith('/verification');
}

export function AnalyticsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const hasTrackedInitialMetaPageView = useRef(false);

  useEffect(() => {
    if (!shouldTrackPostHog(pathname)) return;
    initializePostHog();
    restoreIdentityFromUrl();
  }, [pathname]);

  useEffect(() => {
    if (!shouldTrackPostHog(pathname)) return;
    capturePageView();
  }, [pathname]);

  useEffect(() => {
    if (!hasTrackedInitialMetaPageView.current) {
      hasTrackedInitialMetaPageView.current = true;
      return;
    }

    trackPageView();
  }, [pathname]);

  return children;
}
