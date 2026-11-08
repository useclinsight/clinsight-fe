import { redirect } from 'next/navigation';
import { PatientWelcome } from '@/components/PatientWelcome';
import { guestUploadEnabled } from '@/lib/guest-upload-config';
import { getPatientSession } from '@/lib/patient-session';

export default async function PatientHomePage() {
  const session = await getPatientSession();
  if (session.status !== 'signed-out') redirect('/dashboard');

  return <PatientWelcome guestEnabled={guestUploadEnabled()} />;
}
