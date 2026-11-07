'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@clinsight/ui';
import { useState } from 'react';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
} from 'react-hook-form';
import {
  requestPatientReset,
  resendPatientCode,
  setPatientPassword,
  signUpPatient,
  verifyPatientEmail,
  verifyPatientReset,
} from '@/actions/patient-account';
import { withSessionLock } from '@/lib/browser-session-lock';
import {
  emailCodeSchema,
  newPasswordSchema,
  passwordHint,
  recoverySchema,
  signupSchema,
} from '@/schemas/patient-account';

type Field<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: 'email' | 'password';
  autoComplete?: string;
  inputMode?: 'numeric';
  maxLength?: number;
  hint?: string;
};
type Feedback = { message: string; success?: boolean };

function AccountForm<T extends FieldValues>({
  resolver,
  defaults,
  fields,
  label,
  action,
  resend,
}: {
  resolver: Resolver<T>;
  defaults: DefaultValues<T>;
  fields: Field<T>[];
  label: string;
  action: (input: T) => Promise<Feedback | undefined>;
  resend?: () => Promise<Feedback>;
}) {
  const [resendPending, setResendPending] = useState(false);
  const [notice, setNotice] = useState<Feedback>();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<T>({ resolver, defaultValues: defaults });
  const busy = isSubmitting || resendPending;

  const submit = handleSubmit(async (input) => {
    setNotice(undefined);
    try {
      const result = await withSessionLock(() => action(input));
      if (result) setError('root', { message: result.message });
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' });
    }
  });

  async function handleResend() {
    if (!resend || busy) return;
    setResendPending(true);
    clearErrors('root');
    try {
      setNotice(await withSessionLock(resend));
    } catch {
      setNotice({ message: 'We couldn’t send another code. Please try again.' });
    } finally {
      setResendPending(false);
    }
  }

  return (
    <form method="post" noValidate onSubmit={submit} className="mt-7 grid gap-4" aria-busy={busy}>
      {fields.map(({ name, label, hint, ...input }) => {
        const error = errors[name]?.message;
        const hasError = typeof error === 'string';
        const description = hasError ? name + '-error' : hint ? name + '-hint' : undefined;
        return (
          <div className="grid gap-1.5" key={name}>
            <label className="text-sm font-medium text-gray-900" htmlFor={name}>
              {label}
            </label>
            <Input
              {...register(name)}
              {...input}
              id={name}
              required
              error={hasError}
              aria-invalid={hasError}
              aria-describedby={description}
              className="h-[50px] px-4 text-base"
            />
            {hasError ? (
              <p id={name + '-error'} className="text-sm text-red-700">
                {error}
              </p>
            ) : (
              hint && (
                <p id={name + '-hint'} className="text-sm text-slate-600">
                  {hint}
                </p>
              )
            )}
          </div>
        );
      })}
      {errors.root?.message && (
        <p role="alert" className="text-sm text-red-700">
          {errors.root.message}
        </p>
      )}
      {notice && (
        <p
          role={notice.success ? 'status' : 'alert'}
          className={notice.success ? 'text-sm text-slate-700' : 'text-sm text-red-700'}
        >
          {notice.message}
        </p>
      )}
      <Button
        type="submit"
        variant="brand"
        className="h-[50px] w-full rounded-xl text-base"
        disabled={busy}
      >
        {isSubmitting ? 'Please wait…' : label}
      </Button>
      {resend && (
        <Button
          type="button"
          variant="link"
          className="justify-self-center text-primary-blue"
          disabled={busy}
          onClick={handleResend}
        >
          {resendPending ? 'Sending…' : 'Resend code'}
        </Button>
      )}
    </form>
  );
}

export function PatientSignupForm() {
  return (
    <AccountForm
      action={signUpPatient}
      resolver={zodResolver(signupSchema)}
      defaults={{ first_name: '', last_name: '', email: '', password: '', confirm_password: '' }}
      label="Sign Up"
      fields={[
        { name: 'first_name', label: 'First name', autoComplete: 'given-name' },
        { name: 'last_name', label: 'Last name', autoComplete: 'family-name' },
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          autoComplete: 'new-password',
          hint: passwordHint,
        },
        {
          name: 'confirm_password',
          label: 'Confirm password',
          type: 'password',
          autoComplete: 'new-password',
        },
      ]}
    />
  );
}

export function PatientRecoveryForm() {
  return (
    <AccountForm
      action={requestPatientReset}
      resolver={zodResolver(recoverySchema)}
      defaults={{ email: '' }}
      label="Send reset code"
      fields={[{ name: 'email', label: 'Email', type: 'email', autoComplete: 'email' }]}
    />
  );
}

export function PatientCodeForm({ email, flow }: { email: string; flow: 'signup' | 'recovery' }) {
  return (
    <AccountForm
      action={(input) =>
        flow === 'signup' ? verifyPatientEmail(input, email) : verifyPatientReset(input, email)
      }
      resend={() => resendPatientCode(flow, email)}
      resolver={zodResolver(emailCodeSchema)}
      defaults={{ code: '' }}
      label="Verify code"
      fields={[
        {
          name: 'code',
          label: 'Verification code',
          autoComplete: 'one-time-code',
          inputMode: 'numeric',
          maxLength: 6,
        },
      ]}
    />
  );
}

export function PatientNewPasswordForm({ email }: { email: string }) {
  return (
    <AccountForm
      action={(input) => setPatientPassword(input, email)}
      resolver={zodResolver(newPasswordSchema)}
      defaults={{ new_password: '', confirm_password: '' }}
      label="Reset password"
      fields={[
        {
          name: 'new_password',
          label: 'New password',
          type: 'password',
          autoComplete: 'new-password',
          hint: passwordHint,
        },
        {
          name: 'confirm_password',
          label: 'Confirm password',
          type: 'password',
          autoComplete: 'new-password',
        },
      ]}
    />
  );
}
