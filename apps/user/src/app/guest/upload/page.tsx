import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { connection } from 'next/server';
import { PatientGuestUpload } from '@/components/PatientGuestUpload';
import { PatientLegalLinks } from '@/components/PatientLegalLinks';
import { guestUploadEnabled } from '@/lib/guest-upload-config';
import { readGuestReview } from '@/lib/patient-guest-session';
import { getPatientSession } from '@/lib/patient-session';

export default async function GuestUploadPage() {
  await connection();
  if (!guestUploadEnabled()) notFound();
  if ((await getPatientSession()).status !== 'signed-out') redirect('/dashboard');
  const review = await readGuestReview();

  return (
    <main className="min-h-dvh bg-white px-5 py-7 sm:px-10 lg:py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-block">
          <Image
            src="/assets/header-assets/clinsight-logo.svg"
            alt="Clinsight home"
            width={148}
            height={39}
          />
        </Link>
        <div className="mt-7 sm:mt-12">
          <PatientGuestUpload initialReview={review} />
        </div>
        <PatientLegalLinks />
      </div>
    </main>
  );
}
