import {z} from 'zod';

/*
 * Constants.
 */

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  image: z.string()
});

/*
 * Types.
 */

export type User = z.infer<typeof userSchema>;
