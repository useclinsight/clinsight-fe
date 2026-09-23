'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ViewIcon, ViewOffSlashIcon as EyeOffIcon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputFieldContainer from '@/components/ui/InputFieldContainer';
import SuccessModal from '@/components/auth/SuccessModal';

// ─── Schema ────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getFutureTimestamp = (durationMs: number): number => {
  return Date.now() + durationMs;
};

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .regex(EMAIL_REGEX, { message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginValues = z.infer<typeof loginSchema>;

// ─── Google SVG ────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.93 3.28-4.77 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function LoginContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = watch();
  const emailValue = values.email || '';
  const isEmailValid = emailValue ? EMAIL_REGEX.test(emailValue.trim()) : false;
  const isPasswordValid = !!(values.password && values.password.trim().length > 0);

  const isFormValid = isEmailValid && isPasswordValid && !isLockedOut;

  // Lockout effect
  useEffect(() => {
    if (!emailValue) return;

    const checkLockout = () => {
      const stored = localStorage.getItem(`loginLockoutUntil_${emailValue}`);
      if (stored) {
        const lockoutTime = parseInt(stored, 10);
        const now = Date.now();
        if (now < lockoutTime) {
          setIsLockedOut(true);
          const remainingMinutes = Math.ceil((lockoutTime - now) / (60 * 1000));
          const msg = `Too many unsuccessful sign-in attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} or reset your password.`;
          setApiError(msg);
          return true;
        } else {
          localStorage.removeItem(`loginLockoutUntil_${emailValue}`);
          setIsLockedOut(false);
          setFailedAttempts(0);
          setApiError(null);
        }
      } else {
        setIsLockedOut(false);
        setFailedAttempts(0);
        setApiError((prev) =>
          prev && prev.includes('unsuccessful sign-in attempts') ? null : prev,
        );
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
  }, [emailValue, isLockedOut]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error') || params.get('oauth_error');
    const code = params.get('code');
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const state = params.get('state');

    if (!oauthError && !code && !accessToken) return;

    window.history.replaceState(null, '', window.location.pathname);

    if (oauthError) {
      const msg =
        oauthError === 'access_denied'
          ? 'Google sign in was cancelled.'
          : 'Unable to complete Google authentication. Please try again.';

      queueMicrotask(() => setApiError(msg));
      toast.error(msg);
      return;
    }

    const completeGoogleLogin = async () => {
      setApiError(null);

      try {
        const res = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            code,
            access_token: accessToken,
            refresh_token: refreshToken,
            state,
          }),
        });

        const json = await res.json().catch(() => null);
        const redirectUrl = json?.data?.redirect_url;

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }

        if (!res.ok) {
          const msg = mapApiError(res.status, json?.message ?? '');
          setApiError(msg);
          toast.error(msg);
          return;
        }

        // Session is set via HTTP-only cookie by callback API route.

        setShowSuccessModal(true);
      } catch {
        const msg = 'Something went wrong, please check your connection and try again';
        setApiError(msg);
        toast.error(msg);
      }
    };

    void completeGoogleLogin();
  }, []);

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (data: LoginValues) => {
    if (isLockedOut) return;
    setApiError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        if (isInvalidCredentialResponse(res.status)) {
          const nextAttempts = failedAttempts + 1;
          setFailedAttempts(nextAttempts);

          if (nextAttempts >= 5) {
            const lockoutDuration = 15 * 60 * 1000; // 15 minutes lockout
            const lockoutTime = getFutureTimestamp(lockoutDuration);
            localStorage.setItem(`loginLockoutUntil_${data.email}`, lockoutTime.toString());
            setIsLockedOut(true);
            const lockoutMsg =
              'Too many unsuccessful sign-in attempts. Please try again in 15 minutes or reset your password.';
            setApiError(lockoutMsg);
            toast.error(lockoutMsg);
          } else {
            const credentialMsg = "We couldn't verify your email or password. Please try again.";
            setApiError(credentialMsg);
            toast.error(credentialMsg);
          }
          return;
        }

        const msg = mapApiError(res.status, json?.message ?? '');
        if (
          res.status === 429 ||
          msg.toLowerCase().includes('too many') ||
          msg.toLowerCase().includes('unsuccessful')
        ) {
          const lockoutDuration = 15 * 60 * 1000;
          const lockoutTime = getFutureTimestamp(lockoutDuration);
          localStorage.setItem(`loginLockoutUntil_${data.email}`, lockoutTime.toString());
          setIsLockedOut(true);
        }
        setApiError(msg);
        toast.error(msg);

        if (res.status === 403) {
          toast.info('Redirecting to verification page...');
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&resend=true`);
          }, 3000);
        }
        return;
      }

      // Session is set via HTTP-only cookie by login API.

      setFailedAttempts(0);
      localStorage.removeItem(`loginLockoutUntil_${data.email}`);
      setShowSuccessModal(true);
    } catch {
      const msg = 'Something went wrong, please check your connection and try again';
      setApiError(msg);
      toast.error(msg);
    }
  };

  const handleCredentialChange = () => {
    if (apiError) setApiError(null);
    clearErrors(['email', 'password']);
  };

  // ── Google OAuth ────────────────────────────────────────────────────────────

  const handleGoogleLogin = () => {
    try {
      const googleAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_API_URL;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      let url: string | undefined = googleAuthUrl;
      if (!url && apiBaseUrl) {
        url = `${apiBaseUrl.replace(/\/$/, '')}/api/v1/auth/google`;
      }
      if (!url) {
        url = 'https://api.staging.useclinsight.com/api/v1/auth/google';
      }

      if (!url || url.includes('undefined')) {
        throw new Error('Google authentication URL is not configured.');
      }

      const googleUrl = new URL(url);
      googleUrl.searchParams.set('role', 'doctor');
      window.location.href = googleUrl.toString();
    } catch {
      const msg = 'Unable to initiate Google authentication. Please try again.';
      setApiError(msg);
      toast.error(msg);
    }
  };

  // ── Derived state ───────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Split layout ─────────────────────────────────────────────────── */}
      <div className="flex min-h-screen w-full bg-white lg:h-screen lg:overflow-hidden">
        {/* Left — hero image (desktop only) */}
        <div className="relative hidden shrink-0 lg:block lg:w-[45%]">
          <Image
            src="/assets/login-page-assets/young_black_female_doctor.png"
            alt="Doctor smiling in a white coat"
            fill
            className="object-cover object-center"
            priority
          />

          <div className="absolute left-10 top-10 z-10 h-9.75 w-38.5">
            <Image
              src="/assets/signup-page-assets/auth-logo.svg"
              alt="Clinsight"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right — form pane */}
        <div className="flex w-full flex-1 flex-col overflow-y-auto">
          {/* The logo appears over the hero on desktop and above the form on mobile. */}
          <div className="px-8 pb-0 pt-8 lg:hidden">
            <Image
              src="/assets/header-assets/clinsight-logo.svg"
              alt="Clinsight Logo"
              width={140}
              height={36}
              priority
            />
          </div>

          {/* Centered form */}
          <div className="flex flex-1 items-center justify-center px-8 py-10">
            <div className="w-full max-w-105">
              <LoginForm
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                isSubmitting={isSubmitting}
                isValid={isFormValid}
                apiError={apiError}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onSubmit={onSubmit}
                onCredentialChange={handleCredentialChange}
                onGoogleLogin={handleGoogleLogin}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal
            title="Welcome Back!"
            message="You have successfully logged in."
            onComplete={() => {
              setShowSuccessModal(false);
              router.push('/user');
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Error mapper ───────────────────────────────────────────────────────────────

function mapApiError(status: number, message: string): string {
  if (isInvalidCredentialResponse(status))
    return "We couldn't verify your email or password. Please try again.";
  if (status === 403) return 'Please verify your email before logging in.';
  if (status === 429 || message.toLowerCase().includes('too many'))
    return 'Too many unsuccessful sign-in attempts. Please try again in 15 minutes or reset your password.';
  return 'Something went wrong, please check your connection and try again';
  return message || 'Something went wrong. Please try again.';
}

function isInvalidCredentialResponse(status: number): boolean {
  return status === 400 || status === 401 || status === 404 || status === 422;
}

// ─── Inner Form ─────────────────────────────────────────────────────────────────

interface LoginFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  isSubmitting: boolean;
  isValid: boolean;
  apiError: string | null;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onSubmit: (data: LoginValues) => Promise<void>;
  onCredentialChange: () => void;
  onGoogleLogin: () => void;
}

function LoginForm({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  isValid,
  apiError,
  showPassword,
  setShowPassword,
  onSubmit,
  onCredentialChange,
  onGoogleLogin,
}: LoginFormProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-sans text-4xl font-semibold leading-10 tracking-tight text-text-primary">
          Welcome back
        </h1>
        <p className="font-sans text-base font-normal leading-6 text-secondary-3">
          Review patient cases, interpret lab results, and manage your consultations securely.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-8 lg:gap-4"
        noValidate
      >
        {/* Fields */}
        <div className="flex flex-col gap-4 lg:gap-3">
          {/* Email */}
          <InputFieldContainer label="Email Address" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              {...register('email', { onChange: onCredentialChange })}
              type="email"
              placeholder="Enter your email"
              error={!!errors.email}
              autoComplete="email"
            />
          </InputFieldContainer>

          {/* Password */}
          <InputFieldContainer label="Password" htmlFor="password" error={errors.password?.message}>
            <div className="relative w-full">
              <Input
                id="password"
                {...register('password', { onChange: onCredentialChange })}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pr-12"
                error={!!errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-text-disabled transition-colors hover:text-text-primary"
              >
                <HugeiconsIcon icon={showPassword ? EyeOffIcon : ViewIcon} size={18} />
              </button>
            </div>
          </InputFieldContainer>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="font-sans text-sm font-normal text-primary-blue underline leading-5 hover:opacity-80 transition-opacity"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 lg:gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={cn(
              'h-12 w-full rounded-xl px-6 py-3 font-sans text-base font-medium leading-6 transition-colors select-none',
              !isSubmitting && isValid
                ? 'bg-primary-blue text-white hover:bg-primary-blue/90 cursor-pointer'
                : 'bg-[#F5F5F5] text-text-disabled cursor-not-allowed',
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Signing in…
              </span>
            ) : (
              'Sign in'
            )}
          </Button>

          {/* API-level error (non-field) */}
          <AnimatePresence>
            {apiError && !errors.email && !errors.password && (
              <motion.p
                key="api-error"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="text-xs italic font-medium text-red-500 w-full text-center"
              >
                {apiError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="my-1 flex w-full items-center gap-1.5">
            <div className="h-0 flex-1 border-t border-[#F0F0F0]" />
            <span className="font-sans text-sm font-normal leading-5 text-text-disabled">or</span>
            <div className="h-0 flex-1 border-t border-[#F0F0F0]" />
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleLogin}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-[#E0E0E0] bg-white font-sans text-base font-medium text-[#313131] transition-colors hover:bg-slate-50"
          >
            <GoogleIcon />
            Google
          </Button>

          {/* Sign up link */}
          <div className="mt-2 text-center font-sans">
            <span className="text-sm font-normal leading-5 text-secondary-3">
              Don&apos;t have an account?{' '}
            </span>
            <Link
              href="/signup"
              className="text-sm font-normal leading-5 text-primary-blue underline"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Footer terms */}
        <div className="mt-2 flex w-full justify-center p-2.5 lg:mt-0">
          <p className="w-72 text-center font-sans text-xs font-normal leading-4 text-text-primary">
            By continuing, you have read and agreed to Clinsight&apos;s{' '}
            <Link
              href="/terms-and-conditions"
              className="font-medium leading-4 text-primary-blue underline"
            >
              Terms and Conditions.
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

// ─── Spinner ────────────────────────────────────────────────────────────────────

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
