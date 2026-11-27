import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { MobileNav } from '@/components/patient/MobileNav';
import { SessionKeepAlive } from '@/components/patient/SessionKeepAlive';
import { UserHeader } from '@/components/UserHeader';
import { UserSidebar } from '@/components/UserSidebar';
import { getPatientSession } from '@/lib/patient-session';

export default async function PatientPageTemplate({ children }: { children: React.ReactNode }) {
  const session = await getPatientSession();
  if (session.status !== 'ok') {
    if (session.status === 'signed-out') redirect('/login');
    const pathname = (await headers()).get('x-matched-path') ?? '/';
    redirect(`/api/auth/refresh?next=${encodeURIComponent(pathname)}`);
  }

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[250px_minmax(0,1fr)]">
      <SessionKeepAlive />
      <UserSidebar />
      <div className="min-w-0">
        <UserHeader firstName={session.patient.first_name} lastName={session.patient.last_name} />
        <main className="px-5 pb-24 py-6 md:px-10 md:pb-9 md:py-9">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
