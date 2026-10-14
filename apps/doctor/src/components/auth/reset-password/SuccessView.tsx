'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function SuccessView() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col justify-center items-center text-center flex-1 py-4 animate-fadeIn">
      <div className="size-24 bg-teal-50 rounded-full flex items-center justify-center mb-6">
        <div className="relative size-12">
          <svg
            className="w-full h-full"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 24L20 34L38 14"
              stroke="#006B5F"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-zinc-900 text-3xl md:text-4xl font-bold font-['Inter'] leading-[48px] md:leading-[52px] mb-4">
        Password Reset
        <br />
        Successful
      </h1>

      <p className="w-full max-w-sm text-gray-700 text-sm md:text-base font-normal font-['Inter'] leading-6 mb-10">
        Your security credentials have been updated. You can now securely access your clinical
        dashboard.
      </p>

      <button
        type="button"
        onClick={() => router.push('/login')}
        className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium font-['Inter'] text-sm tracking-tight transition-all flex items-center justify-center gap-2"
      >
        <div className="relative size-4">
          <Image
            src="/assets/forgot-password/login-Icon.svg"
            alt="Access Key Icon"
            fill
            className="object-contain brightness-0 invert"
          />
        </div>
        <span>Back to Login</span>
      </button>
    </div>
  );
}
