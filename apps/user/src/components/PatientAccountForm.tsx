'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@clinsight/ui';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import {
  useForm,
  useWatch,
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
  getPatientPasswordRules,
  newPasswordSchema,
  passwordHint,
  recoverySchema,
  signupSchema,
} from '@/schemas/patient-account';
import { PatientPasswordInput } from './PatientPasswordInput';

type Field<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: 'email' | 'password';
  autoComplete?: string;
  inputMode?: 'numeric';
  maxLength?: number;
  placeholder?: string;
};
type Feedback = { message: string; success?: boolean };

function AccountForm<T extends FieldValues>({
  resolver,
  defaults,
  fields,
  label,
  action,
  resend,
  passwordFields,
}: {
  resolver: Resolver<T>;
  defaults: DefaultValues<T>;
  fields: Field<T>[];
  label: string;
  action: (input: T) => Promise<Feedback | undefined>;
  resend?: () => Promise<Feedback>;
  passwordFields?: { primary: Path<T>; confirmation: Path<T> };
}) {
  const [resendPending, setResendPending] = useState(false);
  const [notice, setNotice] = useState<Feedback>();
  const {
    control,
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm<T>({ resolver, defaultValues: defaults, mode: 'onChange' });
  const values = useWatch({ control, disabled: !passwordFields });
  const password = passwordFields ? values[passwordFields.primary] : undefined;
  const rules = typeof password === 'string' && password ? getPatientPasswordRules(password) : [];
  const showRules = rules.some(({ met }) => !met);
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
      {fields.map(({ name, label, type, ...input }) => {
        const isPrimaryPassword = name === passwordFields?.primary;
        const hasChecklist = isPrimaryPassword && showRules;
        const error = errors[name]?.message;
        const hasError = typeof error === 'string';
        const showError =
          hasError &&
          !(hasChecklist && (error === passwordHint || error === 'Enter at least 8 characters.'));
        const description = [showError && name + '-error', hasChecklist && name + '-requirements']
          .filter(Boolean)
          .join(' ');
        const inputProps = {
          ...register(name, {
            deps:
              isPrimaryPassword && passwordFields && values[passwordFields.confirmation]
                ? passwordFields.confirmation
                : undefined,
          }),
          ...input,
          id: name,
          required: true,
          error: showError,
          'aria-invalid': hasError,
          'aria-describedby': description || undefined,
          className: 'h-[50px] px-4 text-base placeholder:text-gray-500',
        };
        return (
          <div className="grid gap-1.5" key={name}>
            <label className="text-sm font-medium text-gray-900" htmlFor={name}>
              {label}
            </label>
            {type === 'password' ? (
              <PatientPasswordInput {...inputProps} passwordLabel={label} />
            ) : (
              <Input {...inputProps} type={type} />
            )}
            {showError && (
              <p id={name + '-error'} className="text-sm text-red-700">
                {error}
              </p>
            )}
            {hasChecklist && (
              <ul
                id={name + '-requirements'}
                aria-label="Password requirements"
                className="mt-1 grid gap-1 text-sm"
              >
                {rules.map(({ label: rule, met }) => {
                  const Icon = met ? Check : X;
                  return (
                    <li
                      key={rule}
                      className={
                        'flex items-center gap-1.5 ' + (met ? 'text-emerald-700' : 'text-gray-600')
                      }
                    >
                      <Icon aria-hidden="true" className="size-3.5" />
                      {rule}
                      <span className="sr-only">{met ? ' (met)' : ' (not met)'}</span>
                    </li>
                  );
                })}
              </ul>
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
        className="h-[50px] w-full rounded-xl text-base disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-100"
        disabled={busy || !isValid}
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
      label="Continue"
      passwordFields={{ primary: 'password', confirmation: 'confirm_password' }}
      fields={[
        {
          name: 'first_name',
          label: 'First Name',
          placeholder: 'Enter your name',
          autoComplete: 'given-name',
        },
        {
          name: 'last_name',
          label: 'Last Name',
          placeholder: 'Enter your name',
          autoComplete: 'family-name',
        },
        {
          name: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          type: 'email',
          autoComplete: 'email',
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          autoComplete: 'new-password',
          placeholder: 'Enter your password',
        },
        {
          name: 'confirm_password',
          label: 'Confirm Password',
          placeholder: 'Retype your password',
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
      label="Send OTP"
      fields={[
        {
          name: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          type: 'email',
          autoComplete: 'email',
        },
      ]}
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
      passwordFields={{ primary: 'new_password', confirmation: 'confirm_password' }}
      fields={[
        {
          name: 'new_password',
          label: 'New password',
          type: 'password',
          autoComplete: 'new-password',
          placeholder: 'Enter your new password',
        },
        {
          name: 'confirm_password',
          label: 'Confirm password',
          placeholder: 'Confirm your new password',
          type: 'password',
          autoComplete: 'new-password',
        },
      ]}
    />
  );
}
