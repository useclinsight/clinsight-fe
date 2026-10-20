'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { VerificationProvider } from '@/components/verification/VerificationContext';
import VerificationLayoutAnimation from '@/components/verification/VerificationLayoutAnimation';
import VerificationNavbar from '@/components/verification/VerificationNavbar';

export default function Layout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isProfessional = pathname === '/verification/professional-info';
  const isCredentials = pathname === '/verification/credentials-verification';
  const showSteps = isProfessional || isCredentials;

  return (
    <AuthGuard allowedRoles={['doctor']}>
      <VerificationProvider>
        {pathname === '/verification/verification-complete' ? (
          <div className="relative flex min-h-screen w-full items-center justify-center bg-white px-5 py-20">
            <Image
              src="/assets/dashboard/vector-new.svg"
              alt="Clinsight"
              width={116}
              height={40}
              className="absolute left-5 top-6 sm:left-20 sm:top-[60px]"
            />
            <div className="w-full max-w-[650px] lg:translate-x-[25px]">
              <VerificationLayoutAnimation>{children}</VerificationLayoutAnimation>
            </div>
          </div>
        ) : (
          <div className="flex h-screen w-full overflow-hidden bg-white">
            <div className="relative hidden h-screen shrink-0 select-none bg-[#18191B] lg:block lg:w-[46.18%]">
              <Image
                src="/assets/verification-assets/lab.png"
                alt="Clinsight Lab"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute left-10 top-6">
                <Image
                  src="/assets/header-assets/clinsight-logo.svg"
                  alt="Clinsight Logo"
                  width={116}
                  height={36}
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>
            </div>

            <div className="flex h-screen w-full flex-col overflow-y-auto bg-white px-6 sm:px-12 lg:w-[53.82%] lg:px-10 xl:px-16">
              <div className="w-full shrink-0 py-1.5">
                <VerificationNavbar />
              </div>
              <div className="flex flex-1 flex-col justify-center pb-2">
                <div className="mx-auto my-auto w-full max-w-129.75 py-1">
                  {showSteps && (
                    <>
                      <Link
                        href={isProfessional ? '/verification' : '/verification/professional-info'}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-text-primary hover:text-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
                      >
                        <ChevronLeft size={16} aria-hidden="true" /> Back
                      </Link>
                      <div className="mb-6 flex w-full items-center select-none">
                        <span className="flex items-center gap-2 text-base text-primary-blue">
                          <span className="size-4 rounded-full bg-primary-blue" /> Step 1
                        </span>
                        <span
                          className={`mx-3 flex-1 border-t-2 border-dashed ${isCredentials ? 'border-primary-blue' : 'border-slate-300'}`}
                        />
                        <span
                          className={`flex items-center gap-2 text-base ${isCredentials ? 'text-primary-blue' : 'text-[#767676]'}`}
                        >
                          <span
                            className={`size-4 rounded-full ${isCredentials ? 'bg-primary-blue' : 'bg-[#767676]'}`}
                          />{' '}
                          Step 2
                        </span>
                      </div>
                    </>
                  )}
                  <VerificationLayoutAnimation>{children}</VerificationLayoutAnimation>
                </div>
              </div>
            </div>
          </div>
        )}
      </VerificationProvider>
    </AuthGuard>
  );
}
