import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PatientAuthHeading } from '@/components/PatientAuthHeading';
import { PatientCodeForm, PatientSignupForm } from '@/components/PatientAccountForm';
import { readFlowEmail } from '@/lib/patient-account-flow';

export default async function PatientSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;
  const email = step === 'verify' ? await readFlowEmail('signup') : undefined;
  if (step === 'verify' && !email) redirect('/signup');

  return (
    <>
      {email ? (
        <>
          <PatientAuthHeading
            title="Verify your email"
            description={`Enter the verification code sent to ${email}.`}
          />
          <PatientCodeForm email={email} flow="signup" />
          <p className="mt-3 text-center text-sm">
            <Link href="/signup" className="text-primary-blue underline">
              Use a different email
            </Link>
          </p>
        </>
      ) : (
        <>
          <PatientAuthHeading
            title="Create your account"
            description="Sign up to access your health insights."
          />
          <PatientSignupForm />
        </>
      )}
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary-blue underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
