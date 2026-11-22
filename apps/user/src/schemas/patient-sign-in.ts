import { z } from 'zod';

export const patientSignInSchema = z.object({
  email: z.string().trim().max(254).email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.').max(72, 'Enter your password.'),
});

export type PatientSignIn = z.infer<typeof patientSignInSchema>;
