import { z } from 'zod';

const MAX_FIRST_NAME_LENGTH = 50;

export const subscribeSchema = z.object({
  email: z.string().trim().email('Valid email required'),
  first_name: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(MAX_FIRST_NAME_LENGTH, 'First name is too long'),
  source: z.enum(['lead_magnet', 'waitlist']),
});
