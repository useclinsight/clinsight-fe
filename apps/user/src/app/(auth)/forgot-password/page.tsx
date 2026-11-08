import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PatientAuthHeading } from '@/components/PatientAuthHeading';
import {
  PatientCodeForm,
  PatientNewPasswordForm,
  PatientRecoveryForm,
} from '@/components/PatientAccountForm';
import { readFlowEmail, readResetGrant } from '@/lib/patient-account-flow';

export default async function PatientRecoveryPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; expired?: string }>;
}) {
  const { step, expired } = await searchParams;
  const email =
    step === 'verify' || step === 'password' ? await readFlowEmail('recovery') : undefined;
  if ((step === 'verify' || step === 'password') && !email) redirect('/forgot-password?expired=1');
  if (step === 'password' && !(await readResetGrant())) redirect('/forgot-password?expired=1');

  return (
    <>
      {email && step === 'password' ? (
        <>
          <PatientAuthHeading
            title="Create New Password"
            description="Choose a new password for your Clinsight account."
          />
          <PatientNewPasswordForm email={email} />
        </>
      ) : email ? (
        <>
          <PatientAuthHeading
            title="Enter your reset code"
            description={`If ${email} is registered, a reset code will arrive shortly.`}
          />
          <PatientCodeForm email={email} flow="recovery" />
          <p className="mt-3 text-center text-sm">
            <Link href="/forgot-password" className="text-primary-blue underline">
              Use a different email
            </Link>
          </p>
        </>
      ) : (
        <>
          <Link
            href="/login"
            aria-label="Back to sign in"
            className="-ml-2 mb-3 inline-flex size-11 items-center justify-center rounded-lg text-gray-900 hover:bg-gray-100"
          >
            <ChevronLeft aria-hidden="true" className="size-6" />
          </Link>
          <PatientAuthHeading
            title="Forgot Password"
            description="Enter your email and we will send you an OTP."
          />
          {expired === '1' && (
            <p role="status" className="mt-5 text-sm text-slate-700">
              That reset link or code has expired. Request a new code to continue.
            </p>
          )}
          <PatientRecoveryForm />
        </>
      )}
      <p className="mt-6 text-center text-sm text-slate-600">
        Remember your password?{' '}
        <Link href="/login" className="font-semibold text-primary-blue underline">
          Log In
        </Link>
      </p>
    </>
  );
}
