import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadPatientReview } from '@/actions/patient-guest';
import { PatientLabReview } from '@/components/PatientLabReview';
import { guestUploadEnabled } from '@/lib/guest-upload-config';
import { readLabReview } from '@/lib/patient-lab-api';
import { getPatientSession, readSessionCookies } from '@/lib/patient-session';

export default async function LabResultPage({ params }: { params: Promise<{ caseId: string }> }) {
  if (!guestUploadEnabled()) notFound();
  if ((await getPatientSession()).status !== 'ok') return null;
  const { accessToken } = await readSessionCookies();
  if (!accessToken) return null;
  const { caseId } = await params;
  const review = await readLabReview(caseId, { accessToken });
  if (review.status === 'empty') notFound();

  return (
    <section className="max-w-3xl space-y-4">
      <Link
        href="/records"
        className="text-sm font-medium text-primary-blue underline underline-offset-2"
      >
        Back to lab records
      </Link>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Lab explanation</h2>
      <PatientLabReview
        key={caseId}
        initialReview={review}
        loadReviewAction={loadPatientReview.bind(null, caseId)}
      />
    </section>
  );
}
