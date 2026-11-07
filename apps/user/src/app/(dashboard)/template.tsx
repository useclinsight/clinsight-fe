import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PatientPreviewNotice } from '@/components/PatientPreviewNotice';
import { PatientSignOutButton } from '@/components/PatientSignOutButton';
import { SessionRecovery } from '@/components/SessionRecovery';
import { getPatientSession } from '@/lib/patient-session';

export default async function PatientPageTemplate({ children }: { children: React.ReactNode }) {
  const session = await getPatientSession();
  if (session.status === 'signed-out') redirect('/login');
  if (session.status === 'refresh') return <SessionRecovery />;
  if (session.status === 'unavailable') {
    return (
      <main className="mx-auto max-w-lg space-y-4 px-6 py-16">
        <h1 className="text-2xl font-semibold">Patient portal temporarily unavailable</h1>
        <p role="alert">Please refresh this page to try again.</p>
        <PatientSignOutButton />
      </main>
    );
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="text-lg font-bold text-[#1565c0]">
            Clinsight Patient Portal
          </Link>
          <PatientSignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <PatientPreviewNotice />
        {children}
      </main>
    </>
  );
}
