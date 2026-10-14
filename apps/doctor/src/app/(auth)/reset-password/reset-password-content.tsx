'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ResetPasswordForm } from '@/components/auth/reset-password/ResetPasswordForm';
import { SuccessView } from '@/components/auth/reset-password/SuccessView';
import { useRouter } from 'next/navigation';
import { createAuthBackHandlers } from '@/lib/auth-navigation';

type ResetStep = 'form' | 'success';

export default function ResetPasswordContent() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>('form');
  const { handleBack } = createAuthBackHandlers(router);

  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-y-auto bg-[#FFFFFE]">
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src="/assets/forgot-password/BG.png"
          alt="Lab Background Frame"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <header
        onClick={handleBack}
        role="button"
        tabIndex={0}
        aria-label="Go back"
        className="absolute top-10 left-8 md:left-20 z-20 flex items-center gap-2.5 select-none"
      >
        <div className="relative size-8 md:size-10">
          <Image
            src="/assets/forgot-password/Subtract.svg"
            alt="Clinsights Icon"
            fill
            className="object-contain cursor-pointer"
          />
        </div>
        <span className="text-white text-2xl md:text-3xl font-medium font-['Playfair_Display'] tracking-tight leading-8">
          Clinsights
        </span>
      </header>

      {/* Reduced pt to push it up visually. Removed the white card styling from the inner div. */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="w-full flex justify-center transition-all duration-300">
          {step === 'form' ? (
            <ResetPasswordForm onSuccess={() => setStep('success')} />
          ) : (
            <SuccessView />
          )}
        </div>
      </div>
    </main>
  );
}
