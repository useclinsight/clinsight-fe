import Image from 'next/image';
import { Suspense } from 'react';
import { VerifyOtpForm } from '@/components/auth/VerifyOtpForm';
import { pageMetadata } from '@/lib/pageMetadata';

export const metadata = pageMetadata(
  'Verify OTP — Clinsight',
  'Enter the one-time password sent to your email to verify your account.',
  '/verify-otp',
);

export default function VerifyOtpPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start bg-white p-4">
      {/* Logo - Top Left */}
      <div className="absolute top-6 left-6 md:top-10 md:left-12 z-20">
        <div className="relative w-35 h-10 md:w-38.5 md:h-9.75">
          <Image
            src="/assets/signup-page-assets/auth-logo-blue.svg"
            alt="Clinsights Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* OTP Verification Form */}
      <div className="relative z-10 w-full max-w-120 flex justify-center pt-21.25 md:pt-18.75 pb-12">
        <Suspense fallback={null}>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </div>
  );
}
