'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics/pixel';
import { initializePostHog, restoreIdentityFromUrl } from '@/lib/analytics/posthog';

function shouldTrackPostHog(pathname: string | null) {
  if (!pathname) return false;
  return !(
    pathname === '/user' ||
    pathname.startsWith('/user/') ||
    pathname === '/verification' ||
    pathname.startsWith('/verification/')
  );
}

export function AnalyticsProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const hasTrackedInitialMetaPageView = useRef(false);

  useEffect(() => {
    if (!shouldTrackPostHog(pathname)) return;
    initializePostHog();
    restoreIdentityFromUrl();
  }, [pathname, searchParamsKey]);

  useEffect(() => {
    if (!hasTrackedInitialMetaPageView.current) {
      hasTrackedInitialMetaPageView.current = true;
      return;
    }

    trackPageView();
  }, [pathname]);

  return children;
}
