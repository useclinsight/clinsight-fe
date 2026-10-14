import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

export const credentialsVerificationSchema = z.object({
  nin: z
    .string()
    .min(11, 'NIN must be exactly 11 digits')
    .max(11, 'NIN must be exactly 11 digits')
    .regex(/^\d+$/, 'NIN must contain only numbers'),
  medicalDegree: z
    .any()
    .refine(
      (file) => file instanceof File && file.size > 0,
      'Medical degree certificate is required',
    )
    .refine(
      (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
      'Medical degree certificate must be less than 10MB',
    )
    .refine(
      (file) => file instanceof File && ALLOWED_MIME_TYPES.includes(file.type),
      'Only PDF, PNG, and JPG files are allowed',
    ),
  mdcnLicense: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, 'MDCN license is required')
    .refine(
      (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
      'MDCN license must be less than 10MB',
    )
    .refine(
      (file) => file instanceof File && ALLOWED_MIME_TYPES.includes(file.type),
      'Only PDF, PNG, and JPG files are allowed',
    ),
});

export type CredentialsVerificationInput = z.infer<typeof credentialsVerificationSchema>;
