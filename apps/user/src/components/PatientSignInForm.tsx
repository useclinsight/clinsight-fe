'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@clinsight/ui';
import { useForm } from 'react-hook-form';
import { signIn } from '@/actions/patient-session';
import { withSessionLock } from '@/lib/browser-session-lock';
import { patientSignInSchema, type PatientSignIn } from '@/schemas/patient-sign-in';

export function PatientSignInForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PatientSignIn>({
    resolver: zodResolver(patientSignInSchema),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    try {
      const result = await withSessionLock(() => signIn(values));
      if (result) setError('root', { message: result.message });
    } catch {
      setError('root', { message: 'Sign-in is temporarily unavailable. Please try again.' });
    }
  });

  return (
    <form method="post" onSubmit={submit} noValidate className="space-y-4" aria-busy={isSubmitting}>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input
          {...register('email')}
          id="email"
          type="email"
          autoComplete="username"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="mt-1"
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          {...register('password')}
          id="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className="mt-1"
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-sm text-red-700">
            {errors.password.message}
          </p>
        )}
      </div>
      {errors.root?.message && (
        <p role="alert" className="text-sm text-red-700">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" variant="brand" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
