'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type LogoutStep = 'confirm' | 'loading';

interface LogoutModalProps {
  onClose: () => void;
}

export default function LogoutModal({ onClose }: LogoutModalProps) {
  const [step, setStep] = useState<LogoutStep>('confirm');
  const router = useRouter();

  const handleLogout = async () => {
    setStep('loading');

    // 1. Revoke Google OAuth token if present
    const googleToken = localStorage.getItem('googleToken');
    if (googleToken) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${googleToken}`, {
          method: 'POST',
        });
      } catch {
        // non-blocking — continue regardless
      }
      localStorage.removeItem('googleToken');
    }

    // 2. Clear local session immediately (offline-safe)
    localStorage.removeItem('accessToken');

    // 3. Call logout endpoint
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Logout request failed with status ${res.status}`);
      }
    } catch {
      // Already cleared locally — server sync will happen when back online
      localStorage.setItem('pendingLogoutSync', 'true');
      toast.error('Something went wrong. Please check your connection and try again.');
      setStep('confirm');
      return;
    }

    // 4. Redirect — back navigation disabled via replace
    router.replace('/login');
  };

  return (
    <motion.div
      key="logout-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => step === 'confirm' && e.target === e.currentTarget && onClose()}
    >
      <AnimatePresence mode="wait">
        {step === 'confirm' ? (
          <motion.div
            key="confirm-panel"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="font-sans text-xl font-semibold leading-7 tracking-tight text-text-primary">
                  Logout From Clinsight?
                </h2>
                <p className="font-sans text-sm font-normal leading-5 text-text-secondary-3">
                  You will be signed out of your account and redirected to the login screen.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={handleLogout}
                  className="h-12 w-full cursor-pointer rounded-xl bg-primary-blue px-6 py-3 font-sans text-base font-medium leading-6 text-white transition-colors hover:bg-primary-blue/90"
                >
                  Logout
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="h-12 w-full cursor-pointer rounded-xl border border-[#E0E0E0] bg-white font-sans text-base font-medium text-[#313131] transition-colors hover:bg-slate-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loading-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white p-10 text-center shadow-xl"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="h-8 w-8 animate-spin text-primary-blue"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="font-sans text-xl font-semibold leading-7 tracking-tight text-text-primary">
                Logging out…
              </h2>
              <p className="font-sans text-sm font-normal leading-5 text-text-secondary-3">
                Please wait while we securely sign you out.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
