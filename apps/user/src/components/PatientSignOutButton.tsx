'use client';

import { Button } from '@clinsight/ui';
import { useState } from 'react';
import { signOut } from '@/actions/patient-session';
import { withSessionLock } from '@/lib/browser-session-lock';

export function PatientSignOutButton() {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

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
    <div className="text-right">
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={handleSignOut}>
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
