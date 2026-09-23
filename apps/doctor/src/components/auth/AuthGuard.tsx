'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { getCurrentUser } from '@/lib/auth';

export type UserRole = 'doctor' | 'admin';

interface AuthGuardProps {
  allowedRoles?: UserRole[];
  loginPath?: string;
  unauthorizedPath?: string;
  children: React.ReactNode;
}

export function AuthGuard({
  allowedRoles,
  loginPath = '/login',
  unauthorizedPath = '/unauthorized',
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      const user = await getCurrentUser();

      if (cancelled) return;

      if (!user) {
        router.replace(loginPath);
        return;
      }

      if (allowedRoles && allowedRoles.length > 0) {
        const hasRole = allowedRoles.includes(user.role as UserRole);
        if (!hasRole) {
          fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch((e) => {
            console.error('Failed to clear session cookies in AuthGuard (unauthorized):', e);
          });
          router.replace(unauthorizedPath);
          return;
        }
      }

      setStatus('authorized');
    }

    verify();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') {
    return <AuthLoadingScreen />;
  }

  if (status === 'unauthorized') {
    // Will redirect — render nothing while navigating
    return null;
  }

  return <>{children}</>;
}

function AuthLoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Checking authentication…"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4">
        <HugeiconsIcon
          icon={Loading03Icon}
          className="h-10 w-10 animate-spin text-primary-blue"
          size={40}
          aria-hidden="true"
        />
        <p className="text-sm text-[#5E5E5E] font-medium select-none">Verifying access…</p>
      </div>
    </div>
  );
}
