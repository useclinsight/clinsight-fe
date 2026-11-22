'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
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
      toast.success('If this email belongs to a doctor account, check it for a code.');
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

      const tokenFromBackend = data?.data?.reset_token ?? data?.reset_token;
      if (typeof tokenFromBackend !== 'string' || !tokenFromBackend) {
        const errorMsg = 'The verification response did not include a reset token.';
        setApiError(errorMsg);
        toast.error(errorMsg);
        return;
      }
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
      toast.success('If this email belongs to a doctor account, check it for a new code.');
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
      if (!resetToken) {
        setApiError('Please verify your code before resetting your password.');
        return;
      }
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, new_password: submittedNewPassword }),
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
    <main className="relative min-h-dvh w-full bg-white font-sans">
      <header className="absolute top-[79px] left-4 md:top-[58px] md:left-[max(32px,5.556vw)]">
        <Link
          href="/login"
          className="flex items-center gap-[2.906px] text-[#1565c0] md:gap-[4.087px]"
        >
          <Image
            src="/assets/forgot-password/logo-mark-mobile.svg"
            alt=""
            width={23.4934}
            height={29.1556}
            priority
            className="md:hidden"
          />
          <Image
            src="/assets/forgot-password/logo-mark.svg"
            alt=""
            width={33.0375}
            height={41}
            priority
            className="hidden md:block"
          />
          <span className="w-[58px] text-[14.532px] leading-none tracking-[-0.29px] md:w-[81px] md:text-[20.436px] md:tracking-[-0.4087px]">
            Clinsight
          </span>
        </Link>
      </header>

      <div
        className={`mx-auto w-full max-w-[553px] px-4 pb-12 ${
          step === 'reset'
            ? 'pt-[160px] md:pt-[clamp(160px,19.34vh,198px)]'
            : step === 'otp'
              ? 'pt-[165px] md:pt-[clamp(168px,28.42vh,291px)]'
              : 'pt-[165px] md:pt-[clamp(168px,28.22vh,289px)]'
        }`}
      >
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
    <div className="flex w-full flex-col items-start md:items-center">
      <div className="flex h-[35px] w-[35px] items-center justify-center md:mx-auto md:h-[53px] md:w-[53px]">
        <Image
          src="/assets/forgot-password/lock-slash.svg"
          alt=""
          width={53}
          height={53}
          className="h-[35px] w-[35px] md:h-[53px] md:w-[53px]"
        />
      </div>

      <h1 className="mt-[9px] text-[24px] font-semibold leading-[31px] tracking-[-0.48px] text-[#191c21] md:mt-[22px] md:w-full md:text-center md:text-[32px] md:leading-[42px] md:tracking-[-0.64px]">
        Forgot Password?
      </h1>
      <p className="mt-2 text-[14px] leading-[21px] tracking-[-0.14px] text-[#5e5e5e] md:mt-[14px] md:h-[52px] md:w-full md:text-center md:text-[16px] md:leading-6 md:tracking-[-0.16px] md:text-[#424752]">
        Enter your registered email address and we&apos;ll send <br />
        you a secure code to reset your password.
      </p>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data.email))}
        className="mt-5 flex w-full flex-col md:mt-[31px]"
        noValidate
      >
        <div className="flex w-full flex-col gap-1.5 md:gap-1">
          <label
            htmlFor="reset-email"
            className="text-[14px] leading-[21px] tracking-[-0.14px] text-[#1b1b1b] md:text-[18px] md:leading-[27px] md:tracking-[-0.18px]"
          >
            <span className="md:hidden">Email</span>
            <span className="max-md:hidden">Email address</span>
          </label>
          <div className="relative w-full">
            <Image
              src="/assets/forgot-password/ai-mail-02.svg"
              alt=""
              width={20}
              height={20}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            />
            <input
              id="reset-email"
              type="email"
              {...register('email')}
              placeholder="example@gmail.com"
              aria-invalid={!!errors.email}
              className="h-[56px] w-full rounded-[8px] border border-[#bdc3c3] bg-white pr-4 pl-11 text-[16px] text-[#1a1a1a] outline-none placeholder:text-[14px] placeholder:text-[#8d8d8d] focus:border-[#1565c0] focus:ring-1 focus:ring-[#1565c0] max-md:h-[52px]"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[#F04438] mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {apiError && (
          <p className="mt-2 text-center text-xs font-medium text-[#F04438]">{apiError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={`mt-20 flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-medium tracking-[-0.16px] transition-colors md:mt-[38px] ${
            isValid && !isLoading
              ? 'bg-[#1565C0] text-white hover:bg-[#1565C0]/90 cursor-pointer'
              : 'bg-[#f5f5f5] text-[#767676] cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Sending code…
            </span>
          ) : isValid ? (
            'Send Reset Code'
          ) : (
            'Send reset code'
          )}
        </button>

        <Link
          href="/login"
          className="mt-4 flex items-center justify-center gap-2 text-[14px] leading-5 tracking-[-0.14px] text-black hover:text-[#1565c0]"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={12} />
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
    <div className="flex w-full flex-col items-start md:items-center">
      <div className="flex h-[35px] w-[35px] items-center justify-center md:h-16 md:w-16">
        <Image
          src="/assets/forgot-password/sms-mobile.svg"
          alt=""
          width={35}
          height={35}
          className="md:hidden"
        />
        <Image
          src="/assets/forgot-password/sms.svg"
          alt=""
          width={64}
          height={64}
          className="hidden md:block"
        />
      </div>

      <h1
        className={`mt-[9px] w-full text-[24px] font-semibold leading-[31px] tracking-[-0.48px] text-[#1b1b1b] md:text-center md:text-[32px] md:leading-[42px] md:tracking-[-0.64px] md:text-[#191c21] ${apiError ? 'md:mt-[25px]' : 'md:mt-[29px]'}`}
      >
        <span className="md:hidden">Verify your Identity</span>
        <span className="hidden md:inline">Verify Your Identity</span>
      </h1>
      <p
        className={`mt-2 w-full text-[14px] leading-[21px] tracking-[-0.14px] text-[#5e5e5e] md:text-center md:text-[18px] md:leading-[normal] md:tracking-normal md:text-[#2e2e2e] ${apiError ? 'md:mt-[18px]' : 'md:mt-[14px]'}`}
      >
        <span className="md:hidden">
          If this is a doctor account, check for a 6-digit code at:{' '}
          <span className="font-medium text-[#1b1b1b]">{email || 'example@gmail.com'}</span>
        </span>
        <span className="hidden md:block">
          If this is a doctor account, check for a 6-digit code at
          <span className="mt-2 block font-medium text-[#1a1a1a]">
            {email || 'example@gmail.com'}
          </span>
        </span>
      </p>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data.otp))}
        className="flex w-full flex-col items-center"
      >
        <div className="mt-[31px] flex w-full max-w-[385px] items-center justify-between md:mt-[50px]">
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
              className={`w-[45.36px] min-w-0 rounded-[7px] border text-center text-[16px] font-normal outline-none transition-all md:h-12 md:w-[51px] md:rounded-[8px] ${apiError ? 'h-12' : 'h-[42.7px]'} ${
                isLockedOut
                  ? 'border-[#d5d5d5] bg-slate-100 text-[#767676] cursor-not-allowed'
                  : apiError
                    ? 'border-[#ef4444] text-[#1a1a1a] bg-white'
                    : 'border-[#d5d5d5] bg-white text-[#1a1a1a] focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0]'
              }`}
            />
          ))}
        </div>

        {apiError && (
          <p className="mt-[10px] w-full text-left text-[12px] leading-[18px] text-[#ef4444] md:mt-3 md:max-w-[385px] md:text-[16px] md:leading-6">
            {apiError}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !isValid || isLockedOut}
          className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] tracking-[-0.16px] transition-colors md:relative md:left-[-1px] ${isValid ? 'font-normal' : 'font-medium'} ${apiError ? 'mt-[76px] md:mt-10 md:h-[56px]' : isValid ? 'mt-20 md:mt-[46px] md:h-[56px]' : 'mt-20 md:mt-10'} ${
            isValid && !isLoading && !isLockedOut
              ? 'bg-[#1565C0] text-white hover:bg-[#1565C0]/90 cursor-pointer'
              : 'bg-[#f5f5f5] text-[#767676] cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Verifying…
            </span>
          ) : (
            <>
              <span className="md:hidden">Verify Code</span>
              <span className="hidden md:inline">{isValid ? 'Verify Code' : 'Verify code'}</span>
            </>
          )}
        </button>

        <div
          className={`flex items-center gap-1.5 text-[16px] leading-[19px] ${apiError ? 'mt-4 md:mt-3' : isValid ? 'mt-[42px] md:mt-4' : 'mt-[42px] md:mt-[21px]'}`}
        >
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
              className="cursor-pointer font-normal text-[#1565C0] underline transition-opacity hover:opacity-80"
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
    <div className="flex w-full flex-col items-start md:items-center">
      <div className="flex h-[44px] w-[36px] items-center justify-center md:h-[60px] md:w-[48px]">
        <Image
          src="/assets/forgot-password/shield-mobile.svg"
          alt=""
          width={35.7292}
          height={44.4449}
          className="md:hidden"
        />
        <Image
          src="/assets/forgot-password/shield-badge.svg"
          alt=""
          width={49}
          height={61}
          className="hidden md:block"
        />
      </div>

      <h1 className="mt-[5px] w-full text-[24px] font-semibold leading-[31px] tracking-[-0.48px] text-[#1b1b1b] md:mt-[14px] md:text-center md:text-[32px] md:leading-[42px] md:tracking-[-0.64px] md:text-[#191c21]">
        Create new Password
      </h1>
      <p className="mt-2 w-full text-[14px] leading-[21px] tracking-[-0.14px] text-[#5e5e5e] md:mt-[14px] md:h-[52px] md:text-center md:text-[16px] md:leading-6 md:tracking-[-0.16px] md:text-[#424752]">
        <span className="md:hidden">
          Please create a secure password for your
          <br />
          Clinsight Doctor’s account.
        </span>
        <span className="hidden md:inline">
          Please create a secure password for your
          <br />
          account.
        </span>
      </p>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data.newPassword))}
        className="mt-5 flex w-full flex-col gap-[22px] md:mt-[29px] md:gap-4"
        noValidate
      >
        <div className="flex w-full flex-col gap-1.5 md:relative md:left-[5px] md:gap-1">
          <label
            htmlFor="new-password"
            className="text-[14px] leading-[21px] tracking-[-0.14px] text-[#1b1b1b] md:text-[18px] md:leading-[27px] md:tracking-[-0.18px]"
          >
            New Password
          </label>
          <div className="relative w-full">
            <input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              placeholder="••••••••"
              required
              className="h-[52px] w-full rounded-[12px] border border-[#d0d0d0] bg-white pr-12 pl-5 text-[14px] text-[#2d2f2f] outline-none placeholder:text-[#8d8d8d] focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] md:h-[56px] md:rounded-[10px] md:border-[#d5d5d5] md:pl-4 md:text-[16px] md:text-[#1a1a1a]"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer md:right-4"
            >
              <Image src="/assets/forgot-password/eye-slash.svg" alt="" width={20} height={20} />
            </button>
          </div>
        </div>

        <div className="hidden flex-col gap-1 md:relative md:left-[5px] md:flex">
          <RuleItem label="One letter (a-z)" isMet={hasLetter} isTyping={isTyping} />
          <RuleItem label="One number (0-9)" isMet={hasNumber} isTyping={isTyping} />
          <RuleItem label="One special character" isMet={hasSpecial} isTyping={isTyping} />
          <RuleItem label="8 characters minimum" isMet={hasMinLength} isTyping={isTyping} />
        </div>

        <div className="flex w-full flex-col gap-1.5 md:relative md:left-[5px] md:gap-1">
          <label
            htmlFor="confirm-password"
            className="text-[14px] leading-[21px] tracking-[-0.14px] text-[#1b1b1b] md:text-[18px] md:leading-[27px] md:tracking-[-0.18px]"
          >
            Confirm New Password
          </label>
          <div className="relative w-full">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              required
              className="h-[52px] w-full rounded-[12px] border border-[#d0d0d0] bg-white pr-12 pl-5 text-[14px] text-[#2d2f2f] outline-none placeholder:text-[#8d8d8d] focus:border-[#1565C0] focus:ring-1 focus:ring-[#1565C0] md:h-[56px] md:rounded-[10px] md:border-[#d5d5d5] md:pl-4 md:text-[16px] md:text-[#1a1a1a]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer md:right-4"
            >
              <Image src="/assets/forgot-password/eye-slash.svg" alt="" width={20} height={20} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-[#F04438] mt-1 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {apiError && <p className="text-center text-xs font-medium text-[#F04438]">{apiError}</p>}

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={`mt-[54px] flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-normal tracking-[-0.16px] transition-colors md:mt-[29px] md:h-[56px] ${
            isValid && !isLoading
              ? 'bg-[#1565C0] text-white hover:bg-[#1565C0]/90 cursor-pointer'
              : 'bg-[#f5f5f5] text-[#767676] cursor-not-allowed'
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
      <div className="flex h-[19px] items-center gap-2 text-[12px] font-medium leading-[18px] text-[#26965c]">
        <Image src="/assets/forgot-password/check-circle.svg" alt="" width={19} height={19} />
        <span>{label}</span>
      </div>
    );
  }

  if (isTyping) {
    return (
      <div className="flex h-[19px] items-center gap-2 text-[12px] font-medium leading-[18px] text-[#ef4444]">
        <Image src="/assets/forgot-password/error-circle.svg" alt="" width={19} height={19} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex h-[19px] items-center gap-2 text-[12px] font-medium leading-[18px] text-[#667085]">
      <svg
        width="19"
        height="19"
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
