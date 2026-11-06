'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { triggerComingSoonModal } from '@/components/coming-soon';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!email) return;

    // setIsLoading(true);
    // try {
    //   console.log('Submitting reset code request for:', email);
    // } catch (error) {
    //   console.error('Error sending reset code:', error);
    // } finally {
    //   setIsLoading(false);
    // }

    triggerComingSoonModal({
      title: 'Password reset is coming soon',
      description: 'We are still building the password reset request flow.',
    });
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-start justify-start overflow-x-hidden bg-[#FFFFFE]">
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image
          src="/assets/forgot-password/BG.png"
          alt="Lab Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />
      </div>

      <header className="relative z-10 flex items-center gap-3 pl-8 pt-8 md:pl-12 md:pt-12 select-none">
        <div className="relative size-8 flex items-center justify-center">
          <Image
            src="/assets/forgot-password/Subtract.svg"
            alt="Clinsights Logo Icon"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-white text-3xl font-medium font-['Playfair_Display'] leading-8 tracking-wide">
          Clinsights
        </span>
      </header>

      <div className="relative z-10 flex-1 w-full flex items-center justify-center px-4 py-12 lg:py-6">
        <div className="w-full max-w-[661px] min-h-[780px] bg-white rounded-[32px] shadow-[0px_24px_64px_rgba(0,0,0,0.15)] px-6 py-10 sm:px-16 flex flex-col items-center justify-between transform transition-all duration-300">
          <div className="w-full flex flex-col items-center flex-1 justify-center max-w-[521px]">
            <div className="relative size-14 mb-6 flex items-center justify-center bg-[#F0F7FF] rounded-full">
              <Image
                src="/assets/forgot-password/Icon.svg"
                alt="Forgot Password Status Indicator"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>

            <h1 className="text-center text-[#191C21] text-3xl sm:text-4xl font-bold font-['Inter'] leading-[48px] sm:leading-[52px] tracking-tight mb-3">
              Forgot Password?
            </h1>

            <p className="text-center text-[#424752] text-sm sm:text-base font-medium font-['Inter'] leading-6 mb-8 max-w-[480px]">
              Enter your registered email address and we&apos;ll send you a secure link to reset
              your password.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <label
                  htmlFor="email"
                  className="text-[#1B1B1B] text-base sm:text-lg font-normal font-['Inter'] leading-7"
                >
                  Email address
                </label>

                <div className="w-full h-14 px-4 py-2.5 rounded-lg border border-[#BDC3C3] bg-white flex items-center gap-3 focus-within:border-[#1565C0] focus-within:ring-2 focus-within:ring-[#1565C0]/10 transition-all duration-200">
                  <div className="size-5 relative shrink-0">
                    <Image
                      src="/assets/forgot-password/ai-mail-02.svg"
                      alt="Mail Icon"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="chioma@gmail.com"
                    className="flex-1 h-full bg-transparent text-[#1B1B1B] placeholder-[#2D2F2F] placeholder:opacity-100 text-sm sm:text-base font-normal font-['Inter'] outline-none border-none p-0 focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-5 mt-2">
                <div className="w-full flex flex-col gap-2"></div>
                <button
                  type="submit"
                  // disabled={isLoading}
                  className="w-full h-14 bg-[#1565C0] hover:bg-[#0D47A1] disabled:bg-[#1565C0]/50 text-white font-medium text-base font-['Inter'] rounded-xl transition-all duration-200 shadow-[0px_4px_12px_rgba(21,101,192,0.2)] flex items-center justify-center gap-2"
                >
                  {/* {isLoading ? 'Sending...' : 'Send Reset Code'} */}
                  Send Reset Code
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="w-full flex items-center justify-center gap-2 py-2 text-[#006B5F] hover:text-[#004D44] text-sm sm:text-base font-medium font-['Inter'] transition-colors duration-150 group"
                >
                  <div className="transition-transform duration-200 group-hover:-translate-x-1 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={ArrowLeft02Icon}
                      size={18}
                      color="currentColor"
                      strokeWidth={2}
                    />
                  </div>
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>

          <footer className="w-full max-w-[521px] pt-6 border-t border-[#E1E2EA] flex items-center justify-center mt-10">
            <div className="text-center text-[#424752] text-sm sm:text-base font-medium font-['Inter'] leading-6">
              Need immediate assistance?
              <br />
              Contact{' '}
              <Link
                href="/contact"
                className="text-[#1565C0] hover:text-[#0D47A1] font-semibold underline underline-offset-4 transition-colors duration-150"
              >
                Lab Support
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
