import { z } from 'zod';

export const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine((value) => /\d/.test(value) && /[a-zA-Z]/.test(value), {
    message: 'Password must contain at least one letter and one number',
  });

export const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object ID" });