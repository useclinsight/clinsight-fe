import { redirect } from 'next/navigation';
import { PatientPreviewNotice } from '@/components/PatientPreviewNotice';
import { PatientSignOutButton } from '@/components/PatientSignOutButton';
import { SessionRecovery } from '@/components/SessionRecovery';
import { UserHeader } from '@/components/UserHeader';
import { UserSidebar } from '@/components/UserSidebar';
import { getPatientSession } from '@/lib/patient-session';

export default async function PatientPageTemplate({ children }: { children: React.ReactNode }) {
  const session = await getPatientSession();
  if (session.status !== 'ok') {
    if (session.status === 'signed-out') redirect('/login');
    if (session.status === 'refresh') return <SessionRecovery />;
    return (
      <main className="mx-auto max-w-lg space-y-4 px-6 py-16">
        <h1 className="text-2xl font-semibold">Patient portal temporarily unavailable</h1>
        <p role="alert">Please refresh this page to try again.</p>
        <PatientSignOutButton />
      </main>
    );
  }

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[250px_minmax(0,1fr)]">
      <UserSidebar />
      <div className="min-w-0">
        <UserHeader firstName={session.patient.first_name} lastName={session.patient.last_name} />
        <main className="px-5 py-6 md:px-10 md:py-9">
          <PatientPreviewNotice />
          {children}
        </main>
      </div>
    </div>
  );
}
