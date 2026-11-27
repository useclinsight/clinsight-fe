import Link from 'next/link';
import { PatientAuthHeading } from '@/components/PatientAuthHeading';
import { PatientSignInForm } from '@/components/PatientSignInForm';
import { GoogleAuthButton } from '@/components/patient/GoogleAuthButton';

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
      <div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-gray-200" /> or <span className="h-px flex-1 bg-gray-200" />
      </div>
      <div className="mt-4">
        <GoogleAuthButton label="Sign in with Google" />
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        Don’t have an account?{' '}
        <Link
          href="/signup"
          className="font-semibold text-primary-blue underline underline-offset-2"
        >
          Sign Up
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-slate-600">
        Or{' '}
        <Link href="/guest" className="font-semibold text-primary-blue underline underline-offset-2">
          try a lab report without an account
        </Link>
      </p>
    </>
  );
}
