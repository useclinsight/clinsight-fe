'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ViewIcon,
  ViewOffSlashIcon as EyeOffIcon,
  ArrowLeft02Icon,
  MailAdd01Icon,
} from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { EMAIL_REGEX } from '@/lib/validation';

type FlowStep = 'email' | 'otp' | 'reset';

const requestEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required' })
    .regex(EMAIL_REGEX, { message: 'Enter a valid email address' }),
});
type RequestEmailFormData = z.infer<typeof requestEmailSchema>;

const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: 'Verification code must be 6 digits' })
    .regex(/^\d{6}$/, { message: 'Verification code must be numeric' }),
});
type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

const createNewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: '8 characters minimum' })
      .regex(/[a-zA-Z]/, { message: 'One letter (a-z)' })
      .regex(/[0-9]/, { message: 'One number (0–9)' })
      .regex(/[^a-zA-Z0-9]/, { message: 'One special character' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type CreateNewPasswordFormData = z.infer<typeof createNewPasswordSchema>;

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="12"
        y1="6"
        x2="12"
        y2="2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="1.0"
      />
      <line
        x1="16.24"
        y1="7.76"
        x2="19.07"
        y2="4.93"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.875"
      />
      <line
        x1="18"
        y1="12"
        x2="22"
        y2="12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <line
        x1="16.24"
        y1="16.24"
        x2="19.07"
        y2="19.07"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.625"
      />
      <line
        x1="12"
        y1="18"
        x2="12"
        y2="22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="7.76"
        y1="16.24"
        x2="4.93"
        y2="19.07"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.375"
      />
      <line
        x1="6"
        y1="12"
        x2="2"
        y2="12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.25"
      />
      <line
        x1="7.76"
        y1="7.76"
        x2="4.93"
        y2="4.93"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.125"
      />
    </svg>
  );
}

function parseNetworkError(status: number, fallback: string, dataError?: string): string {
  if (
    status === 0 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    (dataError &&
      (dataError.toLowerCase().includes('network') ||
        dataError.toLowerCase().includes('gateway') ||
        dataError.toLowerCase().includes('timeout') ||
        dataError.toLowerCase().includes('connection') ||
        dataError.toLowerCase().includes('fetch')))
  ) {
    return 'Something went wrong, please check your connection and try again';
  }
  return dataError || fallback;
}

export default function ForgotPasswordContent() {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // OTP Countdown timer
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (!email || step !== 'otp') return;

    const checkLockout = () => {
      const stored = localStorage.getItem(`lockoutUntil_${email.trim()}`);
      if (stored) {
        const lockoutTime = parseInt(stored, 10);
        const now = Date.now();
        if (now < lockoutTime) {
          setIsLockedOut(true);
          const remainingSeconds = Math.ceil((lockoutTime - now) / 1000);
          setApiError(
            `Too many failed attempts. You are temporarily locked out for ${remainingSeconds}s.`,
          );
          return true;
        } else {
          localStorage.removeItem(`lockoutUntil_${email.trim()}`);
          setIsLockedOut(false);
          setFailedAttempts(0);
          setApiError(null);
        }
      } else {
        setIsLockedOut(false);
        setFailedAttempts(0);
      }
      return false;
    };

    const wasLocked = checkLockout();
    let interval: NodeJS.Timeout | null = null;
    if (wasLocked || isLockedOut) {
      interval = setInterval(() => {
        const isStillLocked = checkLockout();
        if (!isStillLocked && interval) {
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [email, step, isLockedOut]);

  const startOtpTimer = () => {
    setTimeLeft(59);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ─── Step 1: Request Reset Code ─────────────────────────────────────────────

  const handleEmailSubmit = async (submittedEmail: string) => {
    setEmail(submittedEmail);
    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submittedEmail.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg =
          data?.error || data?.message || 'Failed to send reset code. Please try again.';
        setApiError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      setStep('otp');
      startOtpTimer();
      toast.success('Verification code sent to your email.');
    } catch {
      const errorMsg = 'Something went wrong, please check your connection and try again';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2: Verify OTP Code ───────────────────────────────────────────────

  const handleOtpSubmit = async (submittedOtp: string) => {
    if (isLockedOut) return;
    if (submittedOtp.length < 6) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: submittedOtp }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg = parseNetworkError(
          res.status,
          'The code you entered was incorrect, check again.',
          data?.error || data?.message,
        );

        const lowerError = errorMsg.toLowerCase();
        if (
          res.status === 429 ||
          lowerError.includes('lockout') ||
          lowerError.includes('locked') ||
          lowerError.includes('too many')
        ) {
          const lockoutTime = Date.now() + 60 * 1000;
          localStorage.setItem(`lockoutUntil_${email.trim()}`, lockoutTime.toString());
          setIsLockedOut(true);
          setApiError('Too many failed attempts. You are temporarily locked out.');
          toast.error('Too many failed attempts. You are temporarily locked out.');
          return;
        }

        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          const lockoutTime = Date.now() + 60 * 1000;
          localStorage.setItem(`lockoutUntil_${email.trim()}`, lockoutTime.toString());
          setIsLockedOut(true);
          setApiError('Too many failed attempts. You are temporarily locked out.');
          toast.error('Too many failed attempts. You are temporarily locked out.');
          return;
        }

        setApiError(errorMsg);
        if (
          res.status === 0 ||
          res.status >= 500 ||
          errorMsg.includes('please check your connection')
        ) {
          toast.error(errorMsg);
        }
        return;
      }

      const tokenFromBackend =
        data?.reset_token ||
        data?.token ||
        data?.access_token ||
        data?.data?.reset_token ||
        data?.data?.token ||
        submittedOtp;
      setResetToken(tokenFromBackend);

      setStep('reset');
      setApiError(null);
      toast.success('Code verified successfully.');
    } catch {
      const errorMsg = 'Something went wrong, please check your connection and try again';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isLockedOut) return;
    if (!email.trim()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg = data?.error || data?.message || 'Failed to resend verification code.';
        setApiError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      setOtp(new Array(6).fill(''));
      startOtpTimer();
      toast.success('New verification code sent to your email.');
    } catch {
      const errorMsg = 'Something went wrong, please check your connection and try again';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 3: Reset Password ─────────────────────────────────────────────────

  const handleResetSubmit = async (submittedNewPassword: string) => {
    setNewPassword(submittedNewPassword);
    setIsLoading(true);
    setApiError(null);

    try {
      const tokenToSend = resetToken || otp.join('');
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          token: tokenToSend,
          reset_token: tokenToSend,
          new_password: submittedNewPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg = parseNetworkError(
          res.status,
          'Failed to update password. Please try again.',
          data?.error || data?.message,
        );
        setApiError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      toast.success('Password updated successfully! Please sign in.');
      router.push('/login');
    } catch {
      const errorMsg = 'Something went wrong, please check your connection and try again';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render Step Views ─────────────────────────────────────────────────────

  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between items-center select-none font-sans">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="w-full max-w-7xl px-8 pt-8 md:px-12 md:pt-10 flex items-center justify-start">
        <Link href="/login" className="relative h-9 w-36 block">
          <Image
            src="/assets/header-assets/clinsight-logo.svg"
            alt="Clinsight Logo"
            width={144}
            height={36}
            priority
            className="object-contain"
          />
        </Link>
      </header>

      {/* ── Main Form Container ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-[440px] px-6 py-8">
        {step === 'email' && (
          <RequestEmailStep
            email={email}
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
            apiError={apiError}
          />
        )}

        {step === 'otp' && (
          <VerifyOtpStep
            email={email}
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            onResend={handleResendOtp}
            isLoading={isLoading}
            isLockedOut={isLockedOut}
            apiError={apiError}
            setApiError={setApiError}
            timeLeft={timeLeft}
            formatTimer={formatTimer}
          />
        )}

        {step === 'reset' && (
          <CreateNewPasswordStep
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            onSubmit={handleResetSubmit}
            isLoading={isLoading}
            apiError={apiError}
          />
        )}
      </div>
    </main>
  );
}

// ─── Step 1 Component: Request Email (Desktop 5 & 6) ───────────────────────────

interface RequestEmailStepProps {
  email: string;
  onSubmit: (email: string) => void;
  isLoading: boolean;
  apiError: string | null;
}

function RequestEmailStep({ email, onSubmit, isLoading, apiError }: RequestEmailStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RequestEmailFormData>({
    resolver: zodResolver(requestEmailSchema as any),
    mode: 'onChange',
    defaultValues: { email },
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-14 h-14 flex items-center justify-center mb-6 p-1">
        <Image
          src="/assets/forgot-password/lock-slash.svg"
          alt="Lock Slash Icon"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      <h1 className="text-3xl font-bold text-[#101828] text-center mb-2 tracking-tight">
        Forgot Password?
      </h1>
      <p className="text-base text-[#475467] text-center mb-8 font-normal leading-6">
        Enter your registered email address and we&apos;ll send you a secure code to reset your
        password.
      </p>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data.email))}
        className="w-full flex flex-col gap-6"
        noValidate
      >
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="reset-email" className="text-sm font-medium text-[#344054]">
            Email address
          </label>
          <div className="relative w-full">
            <HugeiconsIcon
              icon={MailAdd01Icon}
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]"
            />
            <input
              id="reset-email"
              type="email"
              {...register('email')}
              placeholder="example@gmail.com"
              aria-invalid={!!errors.email}
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#D0D5DD] bg-white text-base text-[#101828] placeholder-[#98A2B3] outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] transition-colors"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[#F04438] mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {apiError && (
          <p className="text-xs italic font-medium text-[#F04438] text-center -mt-2">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={`w-full h-12 rounded-xl text-base font-semibold transition-colors flex items-center justify-center gap-2 select-none ${
            isValid && !isLoading
              ? 'bg-[#1565C0] text-white hover:bg-[#1565C0]/90 cursor-pointer'
              : 'bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Sending code…
            </span>
          ) : (
            'Send Reset Code'
          )}
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-[#344054] hover:text-[#101828] transition-colors mt-2"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
          Back to Login
        </Link>
      </form>
    </div>
  );
}

// ─── Step 2 Component: Verify Identity OTP (Desktop 1, 2, 3) ───────────────────

interface VerifyOtpStepProps {
  email: string;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: (otp: string) => void;
  onResend: () => void;
  isLoading: boolean;
  isLockedOut: boolean;
  apiError: string | null;
  setApiError: (err: string | null) => void;
  timeLeft: number;
  formatTimer: (secs: number) => string;
}

function VerifyOtpStep({
  email,
  otp,
  setOtp,
  onSubmit,
  onResend,
  isLoading,
  isLockedOut,
  apiError,
  setApiError,
  timeLeft,
  formatTimer,
}: VerifyOtpStepProps) {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const {
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema as any),
    mode: 'onChange',
    defaultValues: { otp: otp.join('') },
  });

  const updateOtpState = (newOtp: string[]) => {
    setOtp(newOtp);
    setValue('otp', newOtp.join(''), { shouldValidate: true });
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isLockedOut) return;
    if (apiError) setApiError(null);
    const value = element.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    updateOtpState(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (isLockedOut) return;
    if (apiError) setApiError(null);
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isLockedOut) return;
    if (apiError) setApiError(null);
    const pastedData = e.clipboardData
      .getData('text')
      .trim()
      .replace(/[^0-9]/g, '');
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      if (i < pastedData.length) {
        newOtp[i] = pastedData[i];
      }
    }
    updateOtpState(newOtp);

    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-14 h-14 flex items-center justify-center mb-6">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            stroke="#1565C0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 6l-10 7L2 6"
            stroke="#1565C0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-[#101828] text-center mb-2 tracking-tight">
        Verify Your Identity
      </h1>
      <p className="text-base text-[#475467] text-center mb-6 font-normal leading-6">
        We just sent a 6-digit code to the email attached below
        <span className="block font-semibold text-[#101828] mt-1">
          {email || 'example@gmail.com'}
        </span>
      </p>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data.otp))}
        className="w-full flex flex-col items-center gap-6"
      >
        <div className="flex items-center justify-between gap-2.5 w-full my-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${index + 1} of 6`}
              ref={(el) => {
                if (el) inputRefs.current[index] = el;
              }}
              value={digit}
              disabled={isLoading || isLockedOut}
              onChange={(e) => handleOtpChange(e.target, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              onPaste={handleOtpPaste}
              className={`w-12 h-12 rounded-xl border text-center text-xl font-semibold outline-none transition-all ${
                isLockedOut
                  ? 'border-[#D0D5DD] bg-slate-100 text-[#98A2B3] cursor-not-allowed'
                  : apiError
                    ? 'border-[#F04438] text-[#F04438] bg-white'
                    : 'border-[#D0D5DD] bg-white text-[#101828] focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]'
              }`}
            />
          ))}
        </div>

        {apiError && (
          <p className="text-xs text-[#F04438] text-center font-normal -mt-3">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !isValid || isLockedOut}
          className={`w-full h-12 rounded-xl text-base font-semibold transition-colors flex items-center justify-center gap-2 select-none ${
            isValid && !isLoading && !isLockedOut
              ? 'bg-[#1565C0] text-white hover:bg-[#1565C0]/90 cursor-pointer'
              : 'bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Verifying…
            </span>
          ) : (
            'Verify Code'
          )}
        </button>

        <div className="flex items-center gap-1.5 text-sm font-medium">
          {isLockedOut ? (
            <button
              type="button"
              disabled
              className="text-[#98A2B3] opacity-50 cursor-not-allowed no-underline font-semibold"
            >
              Resend code
            </button>
          ) : timeLeft > 0 ? (
            <>
              <span className="text-[#1565C0] underline cursor-default">Resend code</span>
              <span className="text-[#667085]">{formatTimer(timeLeft)}</span>
            </>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={isLoading}
              className="text-[#1565C0] underline font-semibold hover:opacity-80 transition-opacity cursor-pointer"
            >
              Resend code
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Step 3 Component: Create New Password (Desktop 7, 8, 9) ───────────────────

interface CreateNewPasswordStepProps {
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showNewPassword: boolean;
  setShowNewPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  onSubmit: (newPassword: string) => void;
  isLoading: boolean;
  apiError: string | null;
}

function CreateNewPasswordStep({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onSubmit,
  isLoading,
  apiError,
}: CreateNewPasswordStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<CreateNewPasswordFormData>({
    resolver: zodResolver(createNewPasswordSchema as any),
    mode: 'onChange',
    defaultValues: { newPassword, confirmPassword },
  });

  const watchNewPassword = useWatch({ control, name: 'newPassword', defaultValue: newPassword });
  const watchConfirmPassword = useWatch({
    control,
    name: 'confirmPassword',
    defaultValue: confirmPassword,
  });

  useEffect(() => {
    setNewPassword(watchNewPassword || '');
  }, [watchNewPassword, setNewPassword]);

  useEffect(() => {
    setConfirmPassword(watchConfirmPassword || '');
  }, [watchConfirmPassword, setConfirmPassword]);

  const hasMinLength = (watchNewPassword || '').length >= 8;
  const hasLetter = /[a-zA-Z]/.test(watchNewPassword || '');
  const hasNumber = /[0-9]/.test(watchNewPassword || '');
  const hasSpecial = /[^a-zA-Z0-9]/.test(watchNewPassword || '');
  const isTyping = (watchNewPassword || '').length > 0;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-14 h-14 flex items-center justify-center mb-6 p-1">
        <Image
          src="/assets/forgot-password/shield-badge.svg"
          alt="Shield Badge Icon"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      <h1 className="text-3xl font-bold text-[#101828] text-center mb-2 tracking-tight">
        Create new Password
      </h1>
      <p className="text-base text-[#475467] text-center mb-8 font-normal leading-6">
        Please create a secure password for your account.
      </p>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data.newPassword))}
        className="w-full flex flex-col gap-6"
        noValidate
      >
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="new-password" className="text-sm font-medium text-[#344054]">
            New Password
          </label>
          <div className="relative w-full">
            <input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              placeholder="••••••••"
              required
              className="w-full h-12 pl-4 pr-12 rounded-xl border border-[#D0D5DD] bg-white text-base text-[#101828] placeholder-[#98A2B3] outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828] transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={showNewPassword ? EyeOffIcon : ViewIcon} size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <RuleItem label="One letter (a-z)" isMet={hasLetter} isTyping={isTyping} />
            <RuleItem label="One number (0–9)" isMet={hasNumber} isTyping={isTyping} />
            <RuleItem label="One special character" isMet={hasSpecial} isTyping={isTyping} />
            <RuleItem label="8 characters minimum" isMet={hasMinLength} isTyping={isTyping} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="confirm-password" className="text-sm font-medium text-[#344054]">
            Confirm New Password
          </label>
          <div className="relative w-full">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              required
              className="w-full h-12 pl-4 pr-12 rounded-xl border border-[#D0D5DD] bg-white text-base text-[#101828] placeholder-[#98A2B3] outline-none focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828] transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={showConfirmPassword ? EyeOffIcon : ViewIcon} size={18} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-[#F04438] mt-1 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {apiError && (
          <p className="text-xs italic font-medium text-[#F04438] text-center -mt-2">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={`w-full h-12 rounded-xl text-base font-semibold transition-colors flex items-center justify-center gap-2 select-none ${
            isValid && !isLoading
              ? 'bg-[#1565C0] text-white hover:bg-[#1565C0]/90 cursor-pointer'
              : 'bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Updating Password…
            </span>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </div>
  );
}

function RuleItem({
  label,
  isMet,
  isTyping,
}: {
  label: string;
  isMet: boolean;
  isTyping: boolean;
}) {
  if (isMet) {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-[#12B76A]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="8" fill="#12B76A" />
          <path
            d="M5 8l2 2 4-4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{label}</span>
      </div>
    );
  }

  if (isTyping) {
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-[#F04438]">
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="8" fill="#F04438" />
          <path
            d="M5.5 5.5l5 5M10.5 5.5l-5 5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-[#667085]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="7.5" stroke="#667085" />
        <circle cx="8" cy="8" r="3" fill="#667085" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
