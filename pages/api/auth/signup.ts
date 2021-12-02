import {NextApiRequest, NextApiResponse} from 'next';
import {ZodError, z} from 'zod';

import {UserModel, saveUser, userDraftSchema} from '../../../models/user';
import {netPost} from '../../../utils/net';

/*
 * Constants.
 */

const signUpUrl = '/api/auth/signup';

// Schema used to validate users posted to this endpoint.
const postSignupSchema = userDraftSchema.extend({});

/*
 * Types.
 */

type PostSignupSchema = z.infer<typeof postSignupSchema>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserModel>) {
  try {
    switch (req.method) {
      case 'POST':
        await postHandler(req, res);
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function postHandler(req: NextApiRequest, res: NextApiResponse<UserModel>) {
  const {email, password} = req.body;

  const userBlob = {email, password};
  const userDraft = decodePostUser(userBlob);

  const {user, error} = await saveUser(userDraft);
  if (!user || error) throw error;

  res.status(200).json(user);
}

/*
 * Client.
 */

export function postUser(userBlob: PostSignupSchema) {
  return netPost<PostSignupSchema, UserModel>(signUpUrl, userBlob);
}

/*
 * Helpers.
 */

/**
 * Used by the server to decode a user from the client.
 * Does not handle any exceptions thrown by the parser.
 */
function decodePostUser(userBlob: unknown): PostSignupSchema {
  return postSignupSchema.parse(userBlob);
}

/**
 * Used by the client to validate a user before submission.
 * If any errors are encountered they are returned.
 */
export function validatePostUser(userBlob: PostSignupSchema): ZodError<PostSignupSchema> | undefined {
  try {
    postSignupSchema.parse(userBlob);
    return undefined;
  } catch (error) {
    return error;
  }
}
