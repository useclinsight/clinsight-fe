'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputFieldContainer from '@/components/ui/InputFieldContainer';

// ─── Schemas ────────────────────────────────────────────────────────────────────

const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email address.' })
    .email({ message: 'Please enter a valid email address.' }),
});

type EmailValues = z.infer<typeof emailSchema>;

type Step = 'request' | 'sent';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function ForgotPasswordModal({ onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>('request');
  const [submittedEmail, setSubmittedEmail] = useState('');

  return (
    // Backdrop
    <motion.div
      key="forgot-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        key="forgot-panel"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        {step === 'request' ? (
          <RequestStep
            onSuccess={(email) => {
              setSubmittedEmail(email);
              setStep('sent');
            }}
            onClose={onClose}
          />
        ) : (
          <SentStep email={submittedEmail} onClose={onClose} />
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Step 1: Enter email ────────────────────────────────────────────────────────

function RequestStep({
  onSuccess,
  onClose,
}: {
  onSuccess: (email: string) => void;
  onClose: () => void;
}) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema as any),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: EmailValues) => {
    setApiError(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      // Treat both 200 and 404 as success to avoid email enumeration
      if (!res.ok && res.status !== 404) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message ?? 'Something went wrong.');
      }

      onSuccess(data.email);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please check your connection and try again.';
      setApiError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-sans text-2xl font-semibold leading-8 tracking-tight text-text-primary">
          Forgot password?
        </h2>
        <p className="font-sans text-sm font-normal leading-5 text-text-secondary-3">
          Enter the email address linked to your account and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        <InputFieldContainer
          label="Email Address"
          htmlFor="forgot-email"
          error={errors.email?.message ?? apiError ?? undefined}
        >
          <Input
            id="forgot-email"
            {...register('email')}
            type="email"
            placeholder="Enter your email"
            error={!!errors.email || !!apiError}
            autoComplete="email"
          />
        </InputFieldContainer>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'h-12 w-full rounded-xl px-6 py-3 font-sans text-base font-medium leading-6 transition-colors select-none',
              !isSubmitting
                ? 'bg-primary-blue text-white hover:bg-primary-blue/90 cursor-pointer'
                : 'bg-[#F5F5F5] text-text-disabled cursor-not-allowed',
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Sending…
              </span>
            ) : (
              'Send reset link'
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-12 w-full cursor-pointer rounded-xl border border-[#E0E0E0] bg-white font-sans text-base font-medium text-[#313131] transition-colors hover:bg-slate-50"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

// ─── Step 2: Email sent confirmation ───────────────────────────────────────────

function SentStep({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
        <svg
          className="h-8 w-8 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-sans text-2xl font-semibold leading-8 tracking-tight text-text-primary">
          Check your email
        </h2>
        <p className="font-sans text-sm font-normal leading-5 text-text-secondary-3">
          We sent a password reset link to{' '}
          <span className="font-medium text-text-primary">{email}</span>. It expires in 15 minutes.
        </p>
      </div>

      <p className="font-sans text-xs text-text-secondary-3">
        Didn&apos;t receive it?{' '}
        <button
          type="button"
          onClick={onClose}
          className="text-primary-blue underline hover:opacity-80 transition-opacity"
        >
          Try again
        </button>
      </p>

      <Button
        type="button"
        onClick={onClose}
        className="h-12 w-full cursor-pointer rounded-xl bg-primary-blue px-6 py-3 font-sans text-base font-medium leading-6 text-white transition-colors hover:bg-primary-blue/90"
      >
        Back to log in
      </Button>
    </div>
  );
}

// ─── Spinner ────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
