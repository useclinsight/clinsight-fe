'use client';

import { Button } from '@clinsight/ui';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOut } from '@/actions/patient-session';
import { withSessionLock } from '@/lib/browser-session-lock';

export function PatientSignOutButton({
  appearance = 'button',
}: {
  appearance?: 'button' | 'navigation';
}) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const isNavigation = appearance === 'navigation';

  async function handleSignOut() {
    setPending(true);
    setFailed(false);
    try {
      await withSessionLock(signOut);
    } catch {
      setFailed(true);
      setPending(false);
    }
  }

  return (
    <div className={isNavigation ? 'text-left' : 'text-right'}>
      <Button
        type="button"
        variant={isNavigation ? 'ghost' : 'outline'}
        size="sm"
        disabled={pending}
        onClick={handleSignOut}
        className={
          isNavigation
            ? 'h-11 w-full justify-start gap-2.5 rounded-lg px-2.5 text-slate-600'
            : 'min-h-11 rounded-lg'
        }
      >
        {isNavigation && <LogOut aria-hidden="true" className="size-[18px]" />}
        {pending ? 'Signing out…' : 'Sign out'}
      </Button>
      {failed && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          Please try signing out again.
        </p>
      )}
    </div>
  );
}
