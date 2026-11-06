'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { verifyOtpAction, resendOtpAction } from '@/actions/auth-actions';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const maskEmail = (emailStr: string) => {
  if (!emailStr) return '';
  const parts = emailStr.split('@');
  if (parts.length !== 2) return emailStr;
  const [username, domain] = parts;
  if (username.length <= 2) {
    return `${username}***@${domain}`;
  }
  return `${username.substring(0, 2)}***@${domain}`;
};

const getCurrentTime = (): number => Date.now();

const getFutureTimestamp = (durationMs: number): number => {
  return getCurrentTime() + durationMs;
};

export function VerifyOtpForm() {
  const RESEND_COOLDOWN_SEC = 30; // 30 seconds resend cooldown
  const CODE_VALIDITY_SEC = 600; // 600 seconds otp code validity
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Target Expiration Timestamps
  const [resendExpiry, setResendExpiry] = useState(
    () => getCurrentTime() + RESEND_COOLDOWN_SEC * 1000,
  );
  const [codeExpiry, setCodeExpiry] = useState(() => getCurrentTime() + CODE_VALIDITY_SEC * 1000);

  const [timeLeft, setTimeLeft] = useState(RESEND_COOLDOWN_SEC);
  const [codeValidity, setCodeValidity] = useState(CODE_VALIDITY_SEC);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  // Timer and CodeValidity Effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = getCurrentTime();

      // Calculate remaining seconds based on real clock time
      const remainingResend = Math.max(0, Math.ceil((resendExpiry - now) / 1000));
      const remainingCode = Math.max(0, Math.ceil((codeExpiry - now) / 1000));

      setTimeLeft(remainingResend);
      setCodeValidity(remainingCode);

      // Stop ticking once both expire
      if (remainingResend === 0 && remainingCode === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resendExpiry, codeExpiry]);

  // Lockout persist & expiration check
  useEffect(() => {
    if (!email) return;

    const checkLockout = () => {
      const stored = localStorage.getItem(`lockoutUntil_${email}`);
      if (stored) {
        const lockoutTime = parseInt(stored, 10);
        const now = getCurrentTime();
        if (now < lockoutTime) {
          setIsLockedOut(true);
          const remainingSeconds = Math.ceil((lockoutTime - now) / 1000);
          setApiError(
            `Too many failed attempts. You are temporarily locked out for ${remainingSeconds}s.`,
          );
          return true;
        } else {
          // Expired
          localStorage.removeItem(`lockoutUntil_${email}`);
          setIsLockedOut(false);
          setFailedAttempts(0);
          setApiError(null);
        }
      } else {
        // No stored lockout for this email - clear stale lockout state
        setIsLockedOut(false);
        setFailedAttempts(0);
        setApiError((prev) => (prev && prev.includes('locked out') ? null : prev));
      }
      return false;
    };

    // Initial check on mount/email change
    const wasLocked = checkLockout();

    // If locked, set up a timer to decrement the remaining seconds and unlock when ready
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
  }, [email, isLockedOut]);

  const handleChange = (index: number, value: string) => {
    if (isLockedOut) return;
    if (!/^\d*$/.test(value)) return;

    if (apiError) setApiError(null);

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLockedOut) return;
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (isLockedOut) return;
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    if (apiError) setApiError(null);

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    if (isLockedOut) return;

    // Block verification if code has expired
    if (codeValidity <= 0) {
      const errorMsg = 'This code has expired. Please request a new one.';
      setApiError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    setIsVerifying(true);
    setApiError(null);
    setResendSuccess(false);

    try {
      const result = await verifyOtpAction(email, otpString);
      if (result.error) {
        let errorMsg = result.error;
        const lowerError = errorMsg.toLowerCase();

        // Check if server returned a lockout message
        if (
          lowerError.includes('lockout') ||
          lowerError.includes('locked') ||
          lowerError.includes('too many')
        ) {
          let duration = 60 * 1000; // default 60 seconds
          const match = lowerError.match(/(\d+)\s*(second|sec|minute|min|hour)/i);
          if (match) {
            const amount = parseInt(match[1], 10);
            const unit = match[2].toLowerCase();
            if (unit.startsWith('min')) {
              duration = amount * 60 * 1000;
            } else if (unit.startsWith('hour')) {
              duration = amount * 60 * 60 * 1000;
            } else {
              duration = amount * 1000;
            }
          }
          const lockoutTime = getFutureTimestamp(duration);
          localStorage.setItem(`lockoutUntil_${email}`, lockoutTime.toString());
          setIsLockedOut(true);
          setApiError(errorMsg);
          toast.error(errorMsg);
          return;
        }

        // Only count incorrect OTP responses as failed attempts
        const isIncorrectCode =
          lowerError.includes('invalid') ||
          lowerError.includes('incorrect') ||
          lowerError.includes('wrong');

        if (isIncorrectCode) {
          errorMsg = 'The code you entered is incorrect. Please try again.';
          setApiError(errorMsg);
          toast.error(errorMsg);

          // Enforce lockouts locally after 5 failed attempts
          const nextAttempts = failedAttempts + 1;
          setFailedAttempts(nextAttempts);
          if (nextAttempts >= 5) {
            const duration = 60 * 1000; // 60 seconds local lockout
            const lockoutTime = getFutureTimestamp(duration);
            localStorage.setItem(`lockoutUntil_${email}`, lockoutTime.toString());
            setIsLockedOut(true);
            const lockoutMsg = 'Too many failed attempts. You are temporarily locked out.';
            setApiError(lockoutMsg);
            toast.error(lockoutMsg);
          }
        } else {
          // Map other general errors
          if (lowerError.includes('expired')) {
            errorMsg = 'This code has expired. Please request a new one.';
          }
          setApiError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        toast.success('Email verified successfully!');
        router.push('/verification');
      }
    } catch (e) {
      const errorMsg = 'Something went wrong, please check your connection and try again';
      setApiError(errorMsg);
      toast.error(errorMsg);
      console.error('OTP verification network failure:', e);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (isLockedOut) return;
    if (!email) {
      const errorMsg = 'Email not found. Please try signing up again.';
      setApiError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsResending(true);
    setApiError(null);
    setResendSuccess(false);

    try {
      const result = await resendOtpAction(email);
      if (result.error) {
        const lowerError = result.error.toLowerCase();
        if (
          lowerError.includes('lockout') ||
          lowerError.includes('locked') ||
          lowerError.includes('too many')
        ) {
          let duration = 60 * 1000; // default 60s
          const match = lowerError.match(/(\d+)\s*(second|sec|minute|min|hour)/i);
          if (match) {
            const amount = parseInt(match[1], 10);
            const unit = match[2].toLowerCase();
            if (unit.startsWith('min')) {
              duration = amount * 60 * 1000;
            } else if (unit.startsWith('hour')) {
              duration = amount * 60 * 60 * 1000;
            } else {
              duration = amount * 1000;
            }
          }
          const lockoutTime = getFutureTimestamp(duration);
          localStorage.setItem(`lockoutUntil_${email}`, lockoutTime.toString());
          setIsLockedOut(true);
        }
        setApiError(result.error);
        toast.error(result.error);
      } else {
        setResendSuccess(true);
        toast.success('OTP code resent successfully!');

        // Update target expiration timestamps (restarts the single timer effect)
        const now = getCurrentTime();
        setResendExpiry(now + RESEND_COOLDOWN_SEC * 1000);
        setCodeExpiry(now + CODE_VALIDITY_SEC * 1000);
        setTimeLeft(RESEND_COOLDOWN_SEC);
        setCodeValidity(CODE_VALIDITY_SEC);

        setOtp(['', '', '', '', '', '']); // Clear digits
        setFailedAttempts(0); // Reset failed attempts counter for new code
        setIsLockedOut(false); // Reset lockout state
        localStorage.removeItem(`lockoutUntil_${email}`); // Clear lockout storage
        setApiError(null); // Clear error message
        inputRefs.current[0]?.focus(); // Refocus first input
      }
    } catch {
      const errorMsg = 'Something went wrong, please check your connection and try again';
      setApiError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsResending(false);
    }
  }, [email, isLockedOut]);

  useEffect(() => {
    const autoResend = searchParams.get('resend') === 'true';
    if (!autoResend || !email) return;

    let active = true;

    // Clean up the parameter from URL to prevent resending again on refresh
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete('resend');
    const newSearch = newParams.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    window.history.replaceState(null, '', newUrl);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleResend().finally(() => {
      // no-op if unmounted/stale — active guard prevents state updates below
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, [email, searchParams, handleResend]);

  const isOtpComplete = otp.every((digit) => digit !== '');

  // Turn borders red only if it's an actual incorrect/invalid code error from the server (not network timeouts or missing fields)
  const isCodeError =
    apiError && !/reach|server|network|timeout|gateway|connect|email/i.test(apiError);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-84.5 flex flex-col items-center gap-5 md:gap-6 font-sans"
    >
      {/* Go Back Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => router.back()}
        className="self-start flex items-center gap-1 text-[#5E5E5E] text-sm font-semibold hover:text-primary-blue hover:bg-transparent transition-colors cursor-pointer select-none -mb-3 p-0 h-auto"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        <span>Go back</span>
      </Button>

      {/* Headings */}
      <div className="text-center select-none">
        <h1 className="text-2xl md:text-[32px] font-bold text-[#1B1B1B] mb-2 leading-tight">
          Verify Your Email
        </h1>
        <p className="text-sm md:text-base text-[#5E5E5E] font-normal max-w-100 mx-auto">
          Enter the 6 digit code we sent to{' '}
          <span className="font-semibold text-[#1B1B1B]">{maskEmail(email) || 'your email'}</span>
        </p>
      </div>

      {/* Input Boxes and Alerts */}
      <div className="flex flex-col items-center w-full">
        <div className="flex gap-2.5 justify-center w-full" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={isVerifying || isResending || isLockedOut}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              aria-label={`Digit ${index + 1} of 6`}
              className={cn(
                'w-12 h-12 text-center text-xl font-bold rounded-lg border border-[#E0E0E0] bg-transparent text-[#1B1B1B] outline-none transition-all',
                'focus:border-primary-blue focus:ring-1 focus:ring-primary-blue',
                digit && 'border-primary-blue',
                isCodeError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                isLockedOut && 'opacity-60 cursor-not-allowed bg-slate-50',
              )}
            />
          ))}
        </div>

        {/* Inline Feedback Alerts */}
        {apiError && (
          <div className="text-red-500 text-[11px] md:text-xs font-medium text-left w-full mt-2.5">
            {apiError}
          </div>
        )}

        {resendSuccess && (
          <div className="text-green-600 text-[11px] md:text-xs font-medium text-left w-full mt-2.5">
            OTP code resent successfully!
          </div>
        )}
      </div>

      {/* Verify Button & Resend Link */}
      <div className="w-full flex flex-col items-center gap-4">
        <Button
          type="button"
          onClick={handleVerify}
          disabled={!isOtpComplete || isVerifying || isResending || isLockedOut}
          className={cn(
            'h-14 w-full rounded-2xl text-base font-bold transition-colors select-none flex items-center justify-center gap-2 border-transparent',
            isOtpComplete && !isVerifying && !isResending && !isLockedOut
              ? 'bg-primary-blue text-white hover:bg-primary-blue/90 cursor-pointer'
              : 'bg-[#F5F5F5] text-text-disabled cursor-not-allowed',
          )}
        >
          {isVerifying ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-primary-blue"
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
              <span>verifying email...</span>
            </>
          ) : (
            'Verify Email'
          )}
        </Button>

        <div className="text-sm md:text-base text-[#5E5E5E] mt-2 select-none text-center flex flex-col gap-1.5">
          {/* Expiration Timer */}
          {codeValidity > 0 ? (
            <p>
              Code expires in{' '}
              <span className="font-semibold text-[#1B1B1B]">
                {Math.floor(codeValidity / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(codeValidity % 60).toString().padStart(2, '0')}
              </span>
            </p>
          ) : (
            <p className="text-red-500 font-semibold text-xs md:text-sm">
              Code has expired. Please request a new one.
            </p>
          )}

          {/* Resend Action */}
          <p>
            <span>{"Didn't receive the code? "}</span>
            {isLockedOut ? (
              <Button
                type="button"
                variant="link"
                disabled
                className="p-0 text-sm md:text-base h-auto font-medium text-gray-400 opacity-50 cursor-not-allowed no-underline"
              >
                Resend Code
              </Button>
            ) : timeLeft > 0 ? (
              <span className="font-semibold text-primary-blue">Resend in {timeLeft}s</span>
            ) : (
              <Button
                type="button"
                variant="link"
                onClick={handleResend}
                disabled={isVerifying || isResending || timeLeft > 0}
                className="p-0 text-sm md:text-base h-auto font-medium text-[#1565C0] underline hover:text-[#1565C0]/80 cursor-pointer inline"
              >
                {isResending ? 'Resending...' : 'Resend Code'}
              </Button>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
