import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PatientAuthHeading } from '@/components/PatientAuthHeading';
import { PatientCodeForm, PatientSignupForm } from '@/components/PatientAccountForm';
import { guestUploadEnabled } from '@/lib/guest-upload-config';
import { readFlowEmail } from '@/lib/patient-account-flow';

export default async function PatientSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string; from?: string }>;
}) {
  const { step, from } = await searchParams;
  const fromGuest = from === 'guest' && guestUploadEnabled();
  const signupPath = fromGuest ? '/signup?from=guest' : '/signup';
  const email = step === 'verify' ? await readFlowEmail('signup') : undefined;
  if (step === 'verify' && !email) redirect(signupPath);

  return (
    <>
      {email ? (
        <>
          <PatientAuthHeading
            title="Verify your email"
            description={`Enter the verification code sent to ${email}.`}
          />
          <PatientCodeForm email={email} flow="signup" fromGuest={fromGuest} />
          <p className="mt-3 text-center text-sm">
            <Link href={signupPath} className="text-primary-blue underline">
              Use a different email
            </Link>
          </p>
        </>
      ) : (
        <>
          <PatientAuthHeading
            title="Create Account"
            description={
              fromGuest
                ? 'Create an account and verify your email to keep your guest lab report.'
                : 'Create your account to get started in minutes'
            }
          />
          <PatientSignupForm fromGuest={fromGuest} />
        </>
      )}
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary-blue underline">
          Login
        </Link>
      </p>
    </>
  );
}
