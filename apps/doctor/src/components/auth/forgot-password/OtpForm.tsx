'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { maskEmail } from '@/lib/utils';
interface OtpFormProps {
  email: string;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  timeLeft: number;
  formatTime: () => string;
  onResend: () => void;
  errorMsg: string;
}

export function OtpForm({
  email,
  otp,
  setOtp,
  onSubmit,
  isLoading,
  timeLeft,
  formatTime,
  onResend,
  errorMsg,
}: OtpFormProps) {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-[480px] mx-auto animate-fadeIn">
      <div className="relative size-10 mb-4 md:mb-5 flex items-center justify-center bg-[#D6E3FF] rounded-full">
        <Image
          src="/assets/forgot-password/icon-padlock.svg"
          alt="Lock Identity Verification"
          width={18}
          height={22}
          className="object-contain"
        />
      </div>

      <h1 className="text-center text-[#191C21] text-xl md:text-2xl font-bold font-['Inter'] leading-tight mb-1.5">
        Verify Your Identity
      </h1>

      <div className="text-center mb-4 md:mb-6 flex flex-col items-center justify-center">
        <span className="text-[#424752] text-xs md:text-sm font-medium font-['Inter'] leading-relaxed block">
          We&apos;ve sent a 6-digit verification code to
        </span>
        <span className="text-[#191C21] text-xs md:text-sm font-medium font-['Inter'] leading-relaxed block mt-0.5">
          {maskEmail(email)}
        </span>
      </div>

      <form onSubmit={onSubmit} className="w-full flex flex-col items-center gap-3 md:gap-5">
        <div className="flex justify-between items-center gap-2 sm:gap-4 w-full max-w-[340px]">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              aria-label={`OTP digit ${index + 1} of 6`}
              inputMode="numeric"
              maxLength={1}
              disabled={isLoading}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              value={data}
              onChange={(e) => handleOtpChange(e.target, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              className="w-9 h-11 md:w-11 md:h-12 px-2 py-2 text-center text-[#191C21] text-lg md:text-xl font-medium font-['Inter'] bg-[#F8FAFC] rounded-lg border border-slate-300 focus:border-[#1565C0] focus:ring-2 focus:ring-[#1565C0]/10 outline-none transition-all disabled:opacity-50"
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-red-600 text-sm font-medium animate-slideUp">⚠️ {errorMsg}</p>
        )}

        <div className="w-full text-center mt-2 mb-1">
          <span className="text-[#424752] text-sm font-medium font-['Inter'] leading-4 tracking-tight">
            Didn&apos;t receive the code?{' '}
          </span>
          {timeLeft > 0 ? (
            <span className="text-[#006B5F] text-sm font-medium font-['Inter']">
              Resend code in {formatTime()}
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={isLoading}
              className="text-[#006B5F] text-sm font-bold hover:underline bg-transparent p-0 cursor-pointer disabled:opacity-50"
            >
              Resend code now
            </button>
          )}
        </div>

        <button
          type="submit"
          // disabled={isLoading || otp.join('').length < 6}
          disabled={isLoading}
          className="w-full max-w-[520px] h-14 bg-[#1565C0] hover:bg-[#0D47A1] disabled:opacity-50 text-white font-medium text-base font-['Inter'] leading-6 rounded-xl transition-all duration-200 mt-2"
        >
          {isLoading ? 'Verifying...' : 'Verify Connection'}
        </button>
      </form>
    </div>
  );
}
