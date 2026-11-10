import { notFound, redirect } from 'next/navigation';
import { connection } from 'next/server';
import { guestUploadEnabled } from '@/lib/guest-upload-config';
import { getPatientSession } from '@/lib/patient-session';

export default async function GuestReviewLayout({ children }: { children: React.ReactNode }) {
  await connection();
  if (!guestUploadEnabled()) notFound();
  if ((await getPatientSession()).status !== 'signed-out') redirect('/dashboard');
  return children;
}
