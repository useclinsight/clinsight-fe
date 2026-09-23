import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .max(50, 'First Name cannot exceed 50 characters'),

  email: z.string().email('Please enter a valid email address').min(1, 'This field is required'),

  subject: z.enum(['General', 'Support', 'Partnership', 'Press'], {
    message: 'Please select a subject',
  }),

  message: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .min(10, 'Message should be at least 10 characters long')
    .max(500, 'Message cannot exceed 500 characters'),

  termsAgreement: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms to continue',
  }),
});

export type ContactFormDataType = z.infer<typeof contactSchema>;
