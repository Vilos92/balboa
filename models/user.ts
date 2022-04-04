import {z} from 'zod';

/*
 * Zods.
 */

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  image: z.string()
});

/*
 * Types.
 */

export type User = z.infer<typeof userSchema>;
