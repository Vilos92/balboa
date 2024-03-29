import {z} from 'zod';

/*
 * Zod.
 */

export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string(),
  image: z.string()
});

/*
 * Types.
 */

export type User = z.infer<typeof userSchema>;
