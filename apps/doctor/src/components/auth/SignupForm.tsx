'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { signupAction } from '@/actions/auth-actions';
import { EMAIL_REGEX } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { ViewIcon, ViewOffSlashIcon as EyeOffIcon } from '@hugeicons/core-free-icons';
import { toast } from 'sonner';
import { trackSignup } from '@/lib/analytics/ga';
import { trackRegistration } from '@/lib/analytics/pixel';
import { captureRegistration } from '@/lib/analytics/posthog';
import { runAnalyticsSafely } from '@/lib/analytics/safe';

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'First name is required' })
      .max(50, { message: 'First Name exceeds maximum length.' }),
    lastName: z
      .string()
      .min(1, { message: 'Last name is required' })
      .max(50, { message: 'Last Name exceeds maximum length.' }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must have one upper case' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must have one special character' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [website, setWebsite] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema as any),
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
  const isPasswordValid = hasMinLength && hasUpperCase && hasSpecialChar;

  const isEmailValid = values.email ? EMAIL_REGEX.test(values.email.trim()) : false;

  const isFirstNameValid = !!(values.firstName && values.firstName.length <= 50);
  const isLastNameValid = !!(values.lastName && values.lastName.length <= 50);

  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    values.password &&
    isPasswordValid &&
    values.confirmPassword &&
    values.password === values.confirmPassword;

  const onSubmit = async (data: SignupValues) => {
    if (website) return;
    setApiError(null);
    try {
      const result = await signupAction({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (result.error) {
        setApiError(result.error);
        toast.error(result.error);
      } else {
        runAnalyticsSafely(captureRegistration, trackRegistration, trackSignup);
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
      const errorMsg = 'Unable to initiate Google authentication. Please try again.';
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="w-full flex flex-col justify-start items-start gap-5">
      {/* Mobile Logo */}
      <div className="lg:hidden mb-4 self-start">
        <div className="relative w-[140px] h-[36px]">
          <Image
            src="/assets/header-assets/clinsight-logo.svg"
            alt="Clinsight Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Header */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4 lg:gap-2 mb-2 lg:mb-0">
        <h1 className="self-stretch text-text-primary text-4xl font-semibold leading-10 font-sans tracking-tight">
          Create Account
        </h1>
        <p className="self-stretch text-text-secondary-3 text-base font-normal leading-6 font-sans">
          Sign up to access your Clinsight doctor dashboard and start reviewing patient cases.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="self-stretch flex flex-col justify-start items-end gap-8 lg:gap-4 w-full"
        noValidate
      >
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
        {/* Form Inputs Container */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4 lg:gap-3 overflow-hidden w-full">
          {/* First Name & Last Name */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4 lg:gap-3 w-full">
            {/* First Name */}
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5 w-full">
              <label
                htmlFor="firstName"
                className="self-stretch text-text-primary text-sm font-normal leading-5 font-sans"
              >
                First Name
              </label>
              <Input
                id="firstName"
                {...register('firstName')}
                type="text"
                placeholder="Enter your name"
                error={!!errors.firstName}
              />
              {errors.firstName && (
                <span className="text-xs text-red-500 mt-1 font-sans">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5 w-full">
              <label
                htmlFor="lastName"
                className="self-stretch text-text-primary text-sm font-normal leading-5 font-sans"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                {...register('lastName')}
                type="text"
                placeholder="Enter your name"
                error={!!errors.lastName}
              />
              {errors.lastName && (
                <span className="text-xs text-red-500 mt-1 font-sans">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="self-stretch flex flex-col justify-start items-start gap-6 lg:gap-3 w-full">
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5 w-full">
              <label
                htmlFor="email"
                className="self-stretch text-text-primary text-sm font-normal leading-5 font-sans"
              >
                Email
              </label>
              <Input
                id="email"
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                error={!!errors.email}
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 font-sans">{errors.email.message}</span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="self-stretch flex flex-col justify-start items-start gap-6 lg:gap-3 w-full">
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5 w-full">
              <label
                htmlFor="password"
                className="self-stretch text-text-primary text-sm font-normal leading-5 font-sans"
              >
                Password
              </label>
              <div className="relative w-full">
                <Input
                  id="password"
                  {...passwordRegister}
                  ref={(e) => {
                    passwordRef(e);
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={(e) => {
                    passwordOnBlur(e);
                    setIsPasswordFocused(false);
                  }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pr-12"
                  error={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-primary transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={showPassword ? EyeOffIcon : ViewIcon} size={18} />
                </button>
              </div>

              {/* Password Validation checklist */}
              {(isPasswordFocused || passwordValue.length > 0) && (
                <div className="flex flex-col gap-1.5 mt-1.5">
                  <div className="flex items-center gap-2">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={cn(
                        'size-3.5 flex-shrink-0 transition-colors',
                        hasMinLength ? 'text-success-green' : 'text-text-disabled',
                      )}
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={cn(
                        'text-xs font-normal font-sans transition-colors',
                        hasMinLength ? 'text-success-green' : 'text-text-disabled',
                      )}
                    >
                      Password must have 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={cn(
                        'size-3.5 flex-shrink-0 transition-colors',
                        hasUpperCase ? 'text-success-green' : 'text-text-disabled',
                      )}
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={cn(
                        'text-xs font-normal font-sans transition-colors',
                        hasUpperCase ? 'text-success-green' : 'text-text-disabled',
                      )}
                    >
                      Password must have one upper case
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={cn(
                        'size-3.5 flex-shrink-0 transition-colors',
                        hasSpecialChar ? 'text-success-green' : 'text-text-disabled',
                      )}
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      className={cn(
                        'text-xs font-normal font-sans transition-colors',
                        hasSpecialChar ? 'text-success-green' : 'text-text-disabled',
                      )}
                    >
                      Password must have one special character
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="self-stretch flex flex-col justify-start items-start gap-6 lg:gap-3 w-full">
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5 w-full">
              <label
                htmlFor="confirmPassword"
                className="self-stretch text-text-primary text-sm font-normal leading-5 font-sans"
              >
                Confirm Password
              </label>
              <div className="relative w-full">
                <Input
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Retype your password"
                  className="pr-12"
                  error={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-primary transition-colors cursor-pointer"
                >
                  <HugeiconsIcon icon={showConfirmPassword ? EyeOffIcon : ViewIcon} size={18} />
                </button>
              </div>
              {errors.confirmPassword ? (
                <span className="text-xs text-red-500 mt-1 font-sans">
                  {errors.confirmPassword.message}
                </span>
              ) : (
                values.confirmPassword &&
                passwordValue !== values.confirmPassword && (
                  <span className="text-xs text-red-500 mt-1 font-sans">
                    Passwords do not match
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Buttons and Divider Section */}
        <div className="self-stretch flex flex-col justify-center items-center gap-4 lg:gap-3 w-full">
          {apiError && (
            <div className="self-stretch text-red-500 text-xs font-sans text-left mt-1">
              {apiError}
            </div>
          )}
          {/* Submit/Continue Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={cn(
              'self-stretch h-12 px-6 py-3 rounded-xl inline-flex justify-center items-center gap-2 text-base font-medium leading-6 transition-colors font-sans w-full select-none cursor-pointer border-transparent',
              isFormValid && !isSubmitting
                ? 'bg-primary-blue text-white hover:bg-primary-blue/90'
                : 'bg-[#F5F5F5] text-text-disabled cursor-not-allowed',
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
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
                <span>Creating account</span>
              </div>
            ) : (
              'Continue'
            )}
          </Button>

          {/* Divider */}
          <div className="self-stretch h-5 relative my-1">
            <div className="w-full flex justify-center items-center gap-1.5">
              <div className="flex-1 h-0 border-t border-[#F0F0F0]" />
              <span className="text-text-disabled text-sm font-normal leading-5 font-sans">or</span>
              <div className="flex-1 h-0 border-t border-[#F0F0F0]" />
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#E0E0E0] bg-white text-base font-medium text-[#313131] transition-colors hover:bg-slate-50 font-sans cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.3 3.28-8.19 3.28-8.09z"
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
            Google
          </Button>

          {/* Login Link */}
          <div className="text-center mt-2 font-sans">
            <span className="text-text-secondary-3 text-sm font-normal leading-5">
              Already have an account?{' '}
            </span>
            <Link
              href="/login"
              className="text-primary-blue text-sm font-normal underline leading-5"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Footer Terms */}
        <div className="self-stretch p-2.5 flex justify-center items-center w-full mt-2 lg:mt-0">
          <div className="w-72 text-center text-xs font-normal text-text-primary leading-4 font-sans">
            By continuing, you have read and agreed to Clinsight’s{' '}
            <Link
              href="/terms-and-conditions"
              className="text-primary-blue font-medium underline leading-4"
            >
              Terms and Conditions.
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
