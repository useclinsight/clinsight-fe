'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import LogoutModal from '@/components/auth/LogoutModal';
import { Button } from '@/components/ui/button';
import { LogoutIcon } from '@/components/icons/LogoutIcon';

export default function LogoutSection() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <section className="flex justify-end border-t border-outline-border pt-8">
        <Button
          type="button"
          onClick={() => setShowLogout(true)}
          className="h-12 cursor-pointer rounded-xl bg-red-600 px-6 py-3 font-sans text-base font-medium leading-6 text-white transition-colors hover:bg-red-700"
        >
          <span className="flex items-center gap-2">
            <LogoutIcon />
            Logout
          </span>
        </Button>
      </section>

      <AnimatePresence>
        {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}
      </AnimatePresence>
    </>
  );
}
