'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@clinsight/ui';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { signIn } from '@/actions/patient-session';
import { withSessionLock } from '@/lib/browser-session-lock';
import { patientSignInSchema, type PatientSignIn } from '@/schemas/patient-sign-in';
import { PatientPasswordInput } from './PatientPasswordInput';

const fieldClass = 'h-[50px] px-4 text-base placeholder:text-gray-500';

export function PatientSignInForm() {
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PatientSignIn>({
    resolver: zodResolver(patientSignInSchema),
    defaultValues: { email: '', password: '' },
  });

  const password = useWatch({ control, name: 'password' });

  const submit = handleSubmit(async (values) => {
    try {
      const result = await withSessionLock(() => signIn(values));
      if ('message' in result) {
        setError('root', { message: result.message });
        return;
      }
      window.location.replace('/');
    } catch {
      setError('root', { message: 'Sign-in is temporarily unavailable. Please try again.' });
    }
  });

  return (
    <form
      method="post"
      onSubmit={submit}
      noValidate
      className="mt-7 grid gap-4"
      aria-busy={isSubmitting}
    >
      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-900">
          Email
        </label>
        <Input
          {...register('email')}
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="username"
          required
          error={!!errors.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={fieldClass}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-900">
          Password
        </label>
        <PatientPasswordInput
          {...register('password')}
          id="password"
          passwordLabel="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          error={!!errors.password}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className={fieldClass}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-red-700">
            {errors.password.message}
          </p>
        )}
      </div>
      <Link
        href="/forgot-password"
        className="justify-self-end text-sm text-primary-blue underline underline-offset-2"
      >
        Forgot Password?
      </Link>
      {errors.root?.message && (
        <p role="alert" className="text-sm text-red-700">
          {errors.root.message}
        </p>
      )}
      <Button
        type="submit"
        variant="brand"
        className="mt-3 h-[50px] w-full rounded-xl text-base font-semibold disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-100"
        disabled={isSubmitting || !password}
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
