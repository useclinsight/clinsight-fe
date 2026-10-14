'use client';

import React from 'react';

interface FailedViewProps {
  onRetry: () => void;
  onContactSupport: () => void;
  isLoading?: boolean;
}

export function FailedView({ onRetry, onContactSupport, isLoading = false }: FailedViewProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center max-w-[480px] mx-auto animate-fadeIn">
      <div className="w-full bg-[#EF44440D] rounded-[24px] p-6 sm:p-8 flex flex-col items-center mb-8 border border-red-500/5">
        <div className="size-20 mb-6 flex items-center justify-center bg-[#EF44441F] rounded-full">
          <div className="size-10 bg-[#EF444426] rounded-full flex items-center justify-center">
            <div className="size-3 bg-[#EF4444] rounded-full" />
          </div>
        </div>

        <h1 className="text-center text-[#191C21] text-3xl font-bold font-['Inter'] leading-10 mb-2">
          Verification Failed
        </h1>
        <p className="text-center text-[#424752] text-sm font-medium font-['Inter'] leading-5 mb-8">
          Your OTP verification was unsuccessful
        </p>

        <div className="w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-[0px_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-3">
          <span className="text-[#8A92A6] text-xs font-bold font-['Inter'] tracking-wider uppercase mb-1">
            Possible Issues
          </span>

          <div className="w-full py-3.5 px-4 bg-[#EAECEF] text-[#191C21] text-sm font-medium font-['Inter'] rounded-xl">
            Wrong OTP inputted
          </div>

          <div className="w-full py-3.5 px-4 bg-[#EAECEF] text-[#191C21] text-sm font-medium font-['Inter'] rounded-xl uppercase">
            OTP expired
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <button
          type="button"
          onClick={onRetry}
          disabled={isLoading}
          className="w-full h-14 bg-[#1565C0] hover:bg-[#0D47A1] text-white font-medium text-base font-['Inter'] leading-6 rounded-xl transition-all duration-200 shadow-[0px_4px_12px_rgba(21,101,192,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing Request...' : 'Request new OTP'}
        </button>

        <button
          type="button"
          onClick={onContactSupport}
          disabled={isLoading}
          className="w-full h-14 bg-white border border-[#BDC3C3] hover:bg-slate-50 text-[#424752] font-medium text-base font-['Inter'] leading-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Contact support
        </button>
      </div>
    </div>
  );
}
