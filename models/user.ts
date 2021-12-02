import {z} from 'zod';

import {makeSupabaseClient} from '../utils/supabase';

/*
 * Constants.
 */

// Schema for users in the database.
const dbUserSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  email: z.string(),
  password: z.string()
});

// Schema for users used by the server and client.
const userSchema = dbUserSchema.omit({created_at: true}).extend({createdAt: z.string()});

// Schema for user drafts. This is used to validate data
// received from the API, and has stricter requirements.
export const userDraftSchema = z.object({
  email: z.string().min(5).max(30),
  password: z.string().min(5).max(30)
});

/*
 * Types.
 */

type DbUserModel = z.infer<typeof dbUserSchema>;
export type UserModel = z.infer<typeof userSchema>;
export type UserDraft = z.infer<typeof userDraftSchema>;

/*
 * Database operations.
 */

export async function saveUser(userDraft: UserDraft) {
  const supabase = makeSupabaseClient();

  // TODO: This is bad, you need to salt + hash the password for real version.
  const {data, error} = await supabase.from<UserModel>('user').insert(userDraft);

  if (error) return {error};

  const dbUser = decodeDbUser(data?.[0]);
  const user = encodeUser(dbUser);

  return {user, error};
}

/*
 * Runtime decoding/encoding.
 */

/**
 * Used by the server to decode a user from the database.
 * Does not handle any exceptions thrown by the parser.
 */
function decodeDbUser(userRow: unknown): DbUserModel {
  return dbUserSchema.parse(userRow);
}

/**
 * Used by the server to encode a user from
 * the database to be sent to the client.
 */
function encodeUser(userRow: DbUserModel): UserModel {
  const userBlob = {
    id: userRow.id,
    createdAt: userRow.created_at,
    email: userRow.email,
    password: userRow.password
  };

  return userSchema.parse(userBlob);
}
