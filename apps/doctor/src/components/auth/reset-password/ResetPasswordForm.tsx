'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { triggerComingSoonModal } from '@/components/coming-soon';

interface ResetPasswordFormProps {
  onSuccess?: () => void;
  token?: string;
}

export function ResetPasswordForm({}: ResetPasswordFormProps) {
  const router = useRouter();

  const [isLoading] = useState(false);
  const [isSuccessState] = useState(false);
  const [error] = useState<string | null>(null);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [visibility, setVisibility] = useState({ password: false, confirm: false });

  const requirements = useMemo(
    () => [
      { label: 'At least 8 characters', valid: form.password.length >= 8 },
      { label: 'One uppercase letter', valid: /[A-Z]/.test(form.password) },
      { label: 'One number', valid: /[0-9]/.test(form.password) },
      { label: 'One special character', valid: /[^A-Za-z0-9]/.test(form.password) },
    ],
    [form.password],
  );

  const metRulesCount = useMemo(() => requirements.filter((r) => r.valid).length, [requirements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!isFormValid || isLoading) return;

    // setIsLoading(true);
    // setError(null);

    // try {
    //   const res = await fetch('/api/auth/reset-password', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       token: token,
    //       new_password: form.password,
    //     }),
    //   });

    //   if (!res.ok) {
    //     const data = await res.json().catch(() => ({}));
    //     throw new Error(
    //       data.error || 'Failed to update credentials. Please check your link and try again.',
    //     );
    //   }

    //   setIsSuccessState(true);
    //   setTimeout(() => {
    //     onSuccess();
    //   }, 3000);
    // } catch (err) {
    //   setError(
    //     err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
    //   );
    // } finally {
    //   setIsLoading(false);
    // }

    triggerComingSoonModal({
      title: 'Reset password is coming soon',
      description: 'We are still building the secure password reset flow.',
    });
  };

  if (isSuccessState) {
    return (
      <div className="w-full max-w-[440px] mx-auto bg-white rounded-[32px] p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-sm animate-fadeIn">
        <div className="size-14 rounded-full bg-[#CCFBF1] flex items-center justify-center mb-8 shrink-0">
          <div className="relative size-6">
            <Image
              src="/assets/forgot-password/check-icon.svg"
              alt="Success Checkmark"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="text-zinc-900 text-3xl font-bold font-['Inter'] leading-[44px] tracking-wide mb-5">
          Password Reset
          <br />
          Successful
        </h1>
        <p className="text-gray-700 text-sm font-normal font-['Inter'] leading-5 max-w-xs tracking-wide">
          Your security credentials have been updated. You can now securely access your clinical
          dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white rounded-[32px] p-8 sm:p-10 shadow-sm">
      <form onSubmit={handleSubmit} className="w-full h-full flex flex-col justify-start gap-8">
        <div className="w-full flex flex-col items-center text-center">
          <div className="relative size-10 mb-4">
            <Image
              src="/assets/forgot-password/create-icon.svg"
              alt="Secure Icon"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-[#191C21] text-2xl font-bold font-['Inter'] tracking-wide mb-2">
            Set New Password
          </h1>
          <p className="text-[#424752] text-sm font-normal font-['Inter'] leading-normal max-w-[320px]">
            Please create a secure password for your Clinical Lab Insight account.
          </p>
        </div>

        <div className="space-y-5 w-full">
          {(
            [
              {
                id: 'password',
                label: 'New Password',
                val: form.password,
                visible: visibility.password,
                toggle: () => setVisibility((v) => ({ ...v, password: !v.password })),
              },
              {
                id: 'confirmPassword',
                label: 'Confirm Password',
                val: form.confirmPassword,
                visible: visibility.confirm,
                toggle: () => setVisibility((v) => ({ ...v, confirm: !v.confirm })),
              },
            ] as const
          ).map((field) => (
            <div key={field.id} className="w-full flex flex-col gap-2">
              <label
                htmlFor={field.id}
                className="text-[#191C21] text-sm font-semibold font-['Inter']"
              >
                {field.label}
              </label>
              <div className="w-full h-12 px-4 rounded-xl border border-[#CBD5E1] focus-within:border-[#004D99] flex items-center justify-between transition-all bg-white">
                <input
                  id={field.id}
                  type={field.visible ? 'text' : 'password'}
                  value={field.val}
                  onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                  placeholder="**************"
                  className="w-full h-full text-[#191C21] text-sm font-normal font-['Inter'] outline-none bg-transparent placeholder-[#94A3B8] tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={field.toggle}
                  aria-label={field.visible ? `Hide ${field.label}` : `Show ${field.label}`}
                  className="text-[`#94A3B8`] hover:text-[`#424752`] transition-colors ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[`#004D99`] focus-visible:ring-offset-2 rounded"
                >
                  {field.visible ? (
                    <svg
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 014.501-5.132m1.384-1.157A9.801 9.801 0 0112 5c4.478 0 8.268-2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 7c.08 0 .16.003.24.011m0 0L20 16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}

          <div className="w-full flex flex-col gap-2 pt-1">
            <div className="w-full flex justify-between items-center text-sm font-semibold font-['Inter']">
              <span className="text-[#424752]">Password Strength</span>
              <span
                style={{
                  color:
                    form.password.length === 0
                      ? 'transparent'
                      : metRulesCount === 4
                        ? '#006B5F'
                        : '#D44437',
                }}
              >
                {form.password.length === 0 ? '' : metRulesCount === 4 ? 'Strong' : 'Weak'}
              </span>
            </div>
            <div className="w-full h-1.5 flex gap-1.5">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="flex-1 h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      form.password.length === 0
                        ? '#E4E4E7'
                        : index <= metRulesCount
                          ? metRulesCount === 4
                            ? '#006B5F'
                            : '#1565C0'
                          : '#E4E4E7',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="w-full p-5 bg-[#F4F6FB] rounded-xl flex flex-col gap-3.5">
            <span className="text-[#424752] text-sm font-normal font-['Inter']">
              Password must contain:
            </span>
            <div className="flex flex-col gap-3">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div
                    className="size-[18px] rounded-full flex items-center justify-center border transition-all duration-200 shrink-0"
                    style={{
                      borderColor: req.valid ? '#006B5F' : '#006B5F',
                      backgroundColor: req.valid ? 'transparent' : 'transparent',
                    }}
                  >
                    <svg
                      className="size-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={req.valid ? '#006B5F' : 'transparent'}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-[#424752] text-sm font-normal font-['Inter']">
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium font-['Inter'] rounded-lg animate-fadeIn">
            {error}
          </div>
        )}

        <div className="w-full flex flex-col gap-4 shrink-0">
          <button
            type="submit"
            // disabled={!isFormValid || isLoading}
            disabled={isLoading}
            className="w-full h-12 bg-[#004D99] hover:bg-[#003366] text-white rounded-lg font-medium font-['Inter'] text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-[#80A6CC] disabled:cursor-not-allowed"
          >
            <div className="relative size-5 shrink-0">
              <Image
                src="/assets/forgot-password/Icon.svg"
                alt="Action Icon"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
          </button>

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full text-center text-[#004D99] hover:text-[#003366] font-medium font-['Inter'] text-sm transition-colors focus:outline-none"
          >
            Return to Login
          </button>
        </div>
      </form>
    </div>
  );
}
