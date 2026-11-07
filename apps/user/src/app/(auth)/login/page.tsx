import Link from 'next/link';
import { PatientAuthHeading } from '@/components/PatientAuthHeading';
import { PatientSignInForm } from '@/components/PatientSignInForm';

export default async function UserLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ signout?: string; password?: string }>;
}) {
  const { signout, password } = await searchParams;
  return (
    <>
      <PatientAuthHeading
        title="Welcome Back"
        description="Sign in to access your health insights"
      />
      {signout === 'local' && (
        <p role="status" className="mt-5 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          You signed out of this browser. We couldn’t confirm that the server session ended.
        </p>
      )}
      {password === 'updated' && (
        <p role="status" className="mt-5 rounded-md bg-primary-subtle p-3 text-sm text-slate-700">
          Your password was updated. Sign in with your new password.
        </p>
      )}
      <PatientSignInForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        Don’t have an account?{' '}
        <Link
          href="/signup"
          className="font-semibold text-primary-blue underline underline-offset-2"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
}
