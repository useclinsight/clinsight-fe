'use client';

import VerificationLayoutAnimation from '@/components/verification/VerificationLayoutAnimation';
import VerificationNavbar from '@/components/verification/VerificationNavbar';
import Image from 'next/image';
import React, { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { VerificationProvider } from '@/components/verification/VerificationContext';
import { cn } from '@/lib/utils';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const showStepProgress =
    pathname === '/verification/professional-info' ||
    pathname === '/verification/credentials-verification' ||
    pathname === '/verification/verification-complete';

  const renderStepProgress = () => {
    if (!showStepProgress) return null;

    const isStep2 =
      pathname === '/verification/credentials-verification' ||
      pathname === '/verification/verification-complete';
    const isStep3 = pathname === '/verification/verification-complete';

    return (
      <div className="w-full flex items-center justify-between mb-4 select-none">
        {/* Step 1 */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-blue"></span>
          <span className="text-xs font-semibold text-primary-blue">Step 1</span>
        </div>

        {/* Connector 1 */}
        <div
          className={cn(
            'flex-1 mx-3 border-t',
            isStep2 ? 'border-solid border-primary-blue' : 'border-dashed border-slate-300',
          )}
        ></div>

        {/* Step 2 */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn('w-1.5 h-1.5 rounded-full', isStep2 ? 'bg-primary-blue' : 'bg-[#94A3B8]')}
          ></span>
          <span
            className={cn(
              'text-xs',
              isStep2 ? 'font-semibold text-primary-blue' : 'font-medium text-[#94A3B8]',
            )}
          >
            Step 2
          </span>
        </div>

        {/* Connector 2 */}
        <div
          className={cn(
            'flex-1 mx-3 border-t',
            isStep3 ? 'border-solid border-primary-blue' : 'border-dashed border-slate-300',
          )}
        ></div>

        {/* Step 3 */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn('w-1.5 h-1.5 rounded-full', isStep3 ? 'bg-primary-blue' : 'bg-[#94A3B8]')}
          ></span>
          <span
            className={cn(
              'text-xs',
              isStep3 ? 'font-semibold text-primary-blue' : 'font-medium text-[#94A3B8]',
            )}
          >
            Step 3
          </span>
        </div>
      </div>
    );
  };

  return (
    <AuthGuard allowedRoles={['doctor']}>
      <VerificationProvider>
        <div className="h-screen w-full flex overflow-hidden bg-white">
          {/* Left panel - Image (Desktop only, lg and up) */}
          <div className="hidden lg:block lg:w-1/2 h-screen relative select-none shrink-0 bg-[#18191B]">
            <Image
              src="/assets/verification-assets/lab.png"
              alt="Clinsight Lab"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Logo overlay on image */}
            <div className="absolute top-10 left-10">
              <Image
                src="/assets/header-assets/clinsight-logo.svg"
                alt="Clinsight Logo"
                width={140}
                height={36}
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          </div>

          {/* Right panel - Form & Navbar */}
          <div className="w-full lg:w-1/2 h-screen overflow-y-auto bg-white flex flex-col px-6 sm:px-12 lg:px-10 xl:px-16">
            {/* Navbar */}
            <div className="w-full py-1.5 shrink-0">
              <VerificationNavbar />
            </div>

            {/* Form Container */}
            <div className="flex-1 pb-2 flex flex-col justify-center">
              <div className="w-full max-w-129.75 mx-auto my-auto py-1">
                {renderStepProgress()}
                <VerificationLayoutAnimation>{children}</VerificationLayoutAnimation>
              </div>
            </div>
          </div>
        </div>
      </VerificationProvider>
    </AuthGuard>
  );
}
