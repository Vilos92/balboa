import {z} from 'zod';

import {computeFieldsSelect} from '../utils/schema';

/*
 * Constants.
 */

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  image: z.string()
});

// Fields in the DB which can be returned to the client.
const userFields = ['id', 'email', 'name', 'image'];
export const userSelect = computeFieldsSelect(userFields);

/*
 * Types.
 */

export interface UserModel {
  id: string;
  email: string;
  name: string;
  image: string;
}
