'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { DoctorVerificationBanner } from '@/components/doctor/overview/VerificationBanner';

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: 'Doctor';
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
      <AnimatePresence>
        {isSidebarOpen ? (
          <motion.button
            type="button"
            aria-label="Close sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-slate-950/40 sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          user={user}
          isSidebarOpen={isSidebarOpen}
          onMenuToggle={() => setIsSidebarOpen((state) => !state)}
        />
        <main className="flex-1 overflow-y-auto p-2.5">
          {user === 'Doctor' && <DoctorVerificationBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}
