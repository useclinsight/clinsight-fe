import { z } from 'zod';

export const leadFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  email: z.string().trim().email('Enter a valid email address'),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
