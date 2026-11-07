import Image from 'next/image';
import { PatientSignInForm } from '@/components/PatientSignInForm';

export default async function UserLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ signout?: string }>;
}) {
  const { signout } = await searchParams;
  return (
    <main className="min-h-dvh bg-white lg:grid lg:grid-cols-[45%_1fr]">
      <div className="relative hidden min-h-dvh overflow-hidden bg-slate-100 lg:block">
        <Image
          src="/assets/login-page-assets/patient-reviewing-results.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 45vw, 1px"
          className="object-cover object-center"
        />
        <Image
          src="/assets/header-assets/clinsight-logo.svg"
          alt="Clinsight"
          width={154}
          height={40}
          className="absolute top-10 left-10 h-auto"
        />
      </div>

      <div className="px-5 pt-[30px] pb-12 sm:px-8 lg:flex lg:items-center lg:justify-center lg:py-10">
        <div className="mx-auto w-full max-w-105">
          <Image
            src="/assets/header-assets/clinsight-logo.svg"
            alt="Clinsight"
            width={132}
            height={34}
            className="mb-9 h-auto lg:hidden"
          />
          <h1 className="text-[32px] leading-[1.14] font-bold tracking-tight text-gray-900 lg:text-[38px]">
            Welcome Back
          </h1>
          <p className="mt-2 text-base text-slate-600">Sign in to access your health insights</p>
          {signout === 'local' && (
            <p role="status" className="mt-5 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
              You signed out of this browser. We couldn’t confirm that the server session ended.
            </p>
          )}
          <PatientSignInForm />
        </div>
      </div>
    </main>
  );
}
