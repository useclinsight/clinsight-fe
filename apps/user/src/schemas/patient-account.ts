import { z } from 'zod';
import { patientSignInSchema } from './patient-sign-in';

export const patientEmail = patientSignInSchema.shape.email;
export const passwordHint =
  'Use at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a symbol.';

const symbols = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
export function getPatientPasswordRules(value: string) {
  return [
    { label: 'At least 8 characters', met: value.length >= 8 },
    { label: 'At least one uppercase letter', met: /\p{Uppercase}/u.test(value) },
    { label: 'At least one lowercase letter', met: /\p{Lowercase}/u.test(value) },
    { label: 'At least one number', met: /\p{Decimal_Number}/u.test(value) },
    {
      label: 'At least one special character',
      met: Array.from(value).some((character) => symbols.includes(character)),
    },
  ];
}

const password = z
  .string()
  .min(8, 'Enter at least 8 characters.')
  .max(72, 'Enter 72 characters or fewer.')
  .refine((value) => value === value.trim(), 'Remove spaces from the start and end.')
  .refine((value) => getPatientPasswordRules(value).every(({ met }) => met), passwordHint);
const confirmation = z.string().min(1, 'Confirm your password.');
const name = z
  .string()
  .trim()
  .min(1, 'Enter your name.')
  .max(100, 'Enter 100 characters or fewer.');
const passwordsMatch = { path: ['confirm_password'], message: 'The passwords don’t match.' };

export const signupSchema = z
  .object({
    first_name: name,
    last_name: name,
    email: patientEmail,
    password,
    confirm_password: confirmation,
  })
  .refine((input) => input.password === input.confirm_password, passwordsMatch);
export const recoverySchema = z.object({ email: patientEmail });
export const emailCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the six-digit code from your email.'),
});
export const newPasswordSchema = z
  .object({ new_password: password, confirm_password: confirmation })
  .refine((input) => input.new_password === input.confirm_password, passwordsMatch);
