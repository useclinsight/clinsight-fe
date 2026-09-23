'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';

interface EmailFormProps {
  email: string;
  setEmail: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onBackToSignin: () => void;
  errorMsg?: string;
}

export function EmailForm({
  email,
  setEmail,
  onSubmit,
  isLoading,
  onBackToSignin,
  errorMsg,
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={onBackToSignin}
        className="self-start flex items-center gap-1 text-[#5E5E5E] text-sm font-semibold hover:text-primary-blue hover:bg-transparent transition-colors cursor-pointer select-none -mb-1 p-0"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        <span>Go back</span>
      </button>

      <div className="text-center select-none w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1B1B1B] mb-2 leading-tight">
          Forgot Password?
        </h2>
        <p className="text-sm md:text-base text-[#5E5E5E] font-normal">
          Enter your registered email address to receive a password reset code.
        </p>
      </div>

      <div className="w-full flex flex-col gap-2 mt-2">
        <label htmlFor="reset-email" className="text-sm font-medium text-[#1B1B1B]">
          Email Address
        </label>
        <input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full h-12 px-4 rounded-xl border border-[#E0E0E0] bg-transparent text-[#1B1B1B] outline-none focus:border-primary-blue transition-colors text-sm"
        />
        {errorMsg && <p className="text-xs text-red-500 font-medium italic mt-1">{errorMsg}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading || !email}
        className="w-full h-12 mt-4 rounded-xl bg-primary-blue text-white font-medium text-base hover:bg-primary-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? 'Sending code...' : 'Send Reset Code'}
      </button>
    </form>
  );
}
