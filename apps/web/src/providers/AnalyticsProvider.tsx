'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics/pixel';
import { initializePostHog } from '@/lib/analytics/posthog';

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
  const lastTrackedMetaPathname = useRef<string | null>(null);

  useEffect(() => {
    if (!shouldTrackPostHog(pathname)) return;
    initializePostHog();
  }, [pathname]);

  useEffect(() => {
    if (!pathname) return;
    if (lastTrackedMetaPathname.current === null) {
      lastTrackedMetaPathname.current = pathname;
      return;
    }
    if (pathname === lastTrackedMetaPathname.current) return;
    lastTrackedMetaPathname.current = pathname;
    trackPageView();
  }, [pathname]);

  return children;
}
