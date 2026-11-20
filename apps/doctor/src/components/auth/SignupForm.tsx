'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { signupAction } from '@/actions/auth-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { backendUrl } from '@/lib/backend-url';

const signupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First Name exceeds maximum length.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last Name exceeds maximum length.'),
  email: z.string().trim().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must have one upper case')
    .regex(/[^A-Za-z0-9]/, 'Password must have one special character'),
  confirmPassword: z.string().optional(),
});

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [website, setWebsite] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { ref: passwordRef, onBlur: passwordOnBlur, ...passwordRegister } = register('password');

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = watch();
  const passwordValue = values.password || '';
  const hasMinLength = passwordValue.length >= 8;
  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordValue);
  const mobileReady =
    Boolean(values.firstName?.trim() && values.lastName?.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email?.trim() || '') &&
    hasMinLength &&
    hasUpperCase &&
    hasSpecialChar &&
    values.confirmPassword === passwordValue;
  const onSubmit = async (data: SignupValues) => {
    if (website) return;
    if (isMobile && data.confirmPassword !== data.password) {
      setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    setApiError(null);
    try {
      const result = await signupAction({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: isMobile ? data.confirmPassword || '' : data.password,
      });

      if (result.error) {
        setApiError(result.error);
        toast.error(result.error);
      } else {
        toast.success('Account created successfully! Please verify your email.');
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      }
    } catch (e) {
      const msg = 'Something went wrong. Please check your connection, and try again';
      setApiError(msg);
      toast.error(msg);
      console.error('Signup network failure:', e);
    }
  };

  const handleGoogleSignup = () => {
    try {
      const googleUrl = new URL(backendUrl('/api/v1/auth/google'));
      googleUrl.searchParams.set('role', 'doctor');
      window.location.href = googleUrl.toString();
    } catch {
      const errorMsg = 'Unable to initiate Google authentication. Please try again.';
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const inputClassName =
    'h-[52px] rounded-xl border-[#d0d0d0] bg-[#fffffe] text-sm tracking-[-0.14px] placeholder:text-[#767676] aria-invalid:border-red-500 lg:bg-white lg:text-base lg:tracking-normal lg:placeholder:text-[#a0abba]';
  const passwordChecks = [
    { label: 'At least 8 characters', valid: hasMinLength },
    { label: 'One uppercase letter', valid: hasUpperCase },
    { label: 'One special character', valid: hasSpecialChar },
  ];

  return (
    <div className="flex w-full flex-col gap-5 lg:gap-7">
      <div className="flex flex-col gap-2 lg:gap-2.5">
        <h1 className="text-[24px] font-semibold leading-[31px] tracking-[-0.48px] text-text-primary lg:text-[32px] lg:leading-[normal] lg:tracking-normal">
          Create Account
        </h1>
        <p className="text-sm leading-[21px] tracking-[-0.14px] text-secondary-3 lg:text-[15px] lg:leading-[22px] lg:tracking-normal">
          <span className="lg:hidden">
            Sign up to access your Clinsight doctor dashboard and start reviewing patient cases.
          </span>
          <span className="hidden lg:inline">
            Sign up to access your dashboard and start reviewing cases.
          </span>
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-full flex-col lg:gap-7">
        <input
          tabIndex={-1}
          type="text"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <div className="mb-8 flex flex-col gap-4 lg:mb-0">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-1.5">
              <label
                htmlFor="firstName"
                className="text-sm leading-[21px] tracking-[-0.14px] text-text-primary lg:leading-[17px] lg:tracking-normal"
              >
                First Name
              </label>
              <Input
                id="firstName"
                {...register('firstName')}
                autoComplete="given-name"
                placeholder={isMobile ? 'Enter your name' : 'Chioma'}
                className={inputClassName}
                error={!!errors.firstName}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              {errors.firstName && (
                <span id="firstName-error" className="text-xs text-red-500">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-sm leading-[21px] tracking-[-0.14px] text-text-primary lg:leading-[17px] lg:tracking-normal"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                {...register('lastName')}
                autoComplete="family-name"
                placeholder={isMobile ? 'Enter your name' : 'Okafor-Adeyemi'}
                className={inputClassName}
                error={!!errors.lastName}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
              {errors.lastName && (
                <span id="lastName-error" className="text-xs text-red-500">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm leading-[21px] tracking-[-0.14px] text-text-primary lg:leading-[17px] lg:tracking-normal"
            >
              Email
            </label>
            <Input
              id="email"
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder={isMobile ? 'Enter your email' : 'you@example.com'}
              className={inputClassName}
              error={!!errors.email}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm leading-[21px] tracking-[-0.14px] text-text-primary lg:leading-[17px] lg:tracking-normal"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                {...passwordRegister}
                ref={passwordRef}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={(event) => {
                  passwordOnBlur(event);
                  setIsPasswordFocused(false);
                }}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={isMobile ? 'Enter your password' : 'Create a password'}
                className={cn(inputClassName, 'pr-14')}
                error={!!errors.password}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password
                    ? 'password-error'
                    : isPasswordFocused || passwordValue.length > 0
                      ? 'password-requirements'
                      : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-primary-blue lg:flex"
              >
                <Image src="/assets/signup-design/eye.svg" alt="" width={20} height={20} />
              </button>
            </div>
            {(isPasswordFocused || passwordValue.length > 0) && (
              <ul id="password-requirements" className="mt-1 flex flex-col gap-1 text-xs">
                {passwordChecks.map((check) => (
                  <li
                    key={check.label}
                    className={cn(
                      'flex items-center gap-2',
                      check.valid ? 'text-success-green' : 'text-secondary-3',
                    )}
                  >
                    <span aria-hidden="true">{check.valid ? '✓' : '○'}</span>
                    {check.label}
                  </li>
                ))}
              </ul>
            )}
            {errors.password && (
              <span id="password-error" className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5 lg:hidden">
            <label
              htmlFor="confirmPassword"
              className="text-sm leading-[21px] tracking-[-0.14px] text-text-primary"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              placeholder="Retype your password"
              className={inputClassName}
              error={!!errors.confirmPassword}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            {errors.confirmPassword && (
              <span id="confirmPassword-error" className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
        {apiError && (
          <p role="alert" className="text-sm text-red-500">
            {apiError}
          </p>
        )}
        <div className="mb-5 flex flex-col gap-[17px] lg:mb-0 lg:gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || (isMobile && !mobileReady)}
            className={cn(
              'h-[52px] w-full rounded-xl text-base font-medium',
              isMobile && !mobileReady
                ? 'bg-[#f5f5f5] text-[#767676] cursor-not-allowed'
                : 'bg-primary-blue text-white hover:bg-primary-blue/90',
            )}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Creating account…' : 'Continue'}
          </Button>
          <div
            className="flex h-[22px] items-center justify-center gap-1.5 lg:h-auto lg:gap-2.5"
            aria-hidden="true"
          >
            <div className="h-px flex-1 bg-[#f0f0f0] lg:max-w-[178px] lg:bg-outline-border" />
            <span className="text-sm leading-[21px] tracking-[-0.14px] text-[#767676] lg:leading-[17px] lg:tracking-normal lg:text-secondary-3">
              or
            </span>
            <div className="h-px flex-1 bg-[#f0f0f0] lg:max-w-[178px] lg:bg-outline-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleGoogleSignup}
            className="h-[52px] w-full gap-2 rounded-lg border-[#d0d0d0] bg-[#fffffe] px-6 py-3 text-base font-medium tracking-[-0.16px] text-secondary-3 hover:bg-slate-50 lg:h-12 lg:bg-white"
          >
            <span className="flex size-6 items-center justify-center">
              <Image src="/assets/signup-design/google.svg" alt="" width={20} height={20} />
            </span>
            Google
          </Button>
          <p className="text-center text-sm leading-[21px] tracking-[-0.14px] text-secondary-3 lg:leading-[17px] lg:tracking-normal">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary-blue underline lg:text-secondary-3 lg:no-underline hover:underline focus-visible:underline"
            >
              Log in
            </Link>
          </p>
        </div>
        <div className="flex min-h-14 w-full justify-center p-2.5 lg:min-h-0 lg:p-0">
          <p className="w-[302px] text-center text-xs leading-[18px] tracking-[-0.12px] text-text-primary lg:w-auto lg:tracking-normal lg:text-secondary-3">
            By continuing, you have read and agreed to Clinsight’s{' '}
            <Link
              href="/terms-and-conditions"
              className="text-primary-blue underline lg:text-secondary-3 lg:no-underline hover:underline focus-visible:underline"
            >
              Terms and Conditions.
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
