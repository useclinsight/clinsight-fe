'use client';

import Image from 'next/image';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupContent() {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* Left panel - Image (Desktop only, lg and up) */}
      <div className="hidden lg:block lg:w-[40%] xl:w-[665px] h-screen relative select-none flex-shrink-0">
        <Image
          src="/assets/signup-page-assets/Doc-left.svg"
          alt="Clinsight Doctor"
          fill
          className="object-cover object-right"
          priority
        />
        {/* Figma linear gradient overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(46deg,rgba(0,0,0,0.9)_0%,rgba(120,113,108,0)_71%,rgba(120,113,108,0)_100%)]" />

        {/* Logo overlay on top left */}
        <div className="absolute top-10 left-10 z-10">
          <div className="relative w-[154px] h-[39px]">
            <Image
              src="/assets/signup-page-assets/auth-logo.svg"
              alt="Clinsight Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right panel - Form (Full width on mobile, right side on desktop) */}
      <div className="flex-1 h-screen overflow-y-auto px-6 sm:px-12 md:px-20 lg:px-0 bg-white">
        <div className="w-full max-w-[519px] mx-auto pt-6 lg:pt-[36px] pb-6">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
