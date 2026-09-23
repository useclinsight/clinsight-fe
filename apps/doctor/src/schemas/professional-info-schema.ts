import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

export const professionalInfoSchema = z.object({
  specialization: z.string().min(1, 'Specialization is required'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  hospitalName: z.string().min(1, 'Practice / Hospital name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  passportPhoto: z
    .any()
    .refine((file) => file instanceof File && file.size > 0, 'Passport photograph is required')
    .refine(
      (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
      'Passport photograph must be less than 10MB',
    )
    .refine(
      (file) => file instanceof File && ALLOWED_MIME_TYPES.includes(file.type),
      'Only PDF, PNG, and JPG files are allowed',
    ),
});

export type ProfessionalInfoInput = z.infer<typeof professionalInfoSchema>;
