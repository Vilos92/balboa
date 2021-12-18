import {NextApiRequest} from 'next';
import {Session} from 'next-auth';
import {BuiltInProviderType} from 'next-auth/providers';
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  getSession,
  signIn,
  useSession
} from 'next-auth/react';

import {User} from '../models/user';

/*
 * Types.
 */

export type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | [];
export type ProviderId = LiteralUnion<BuiltInProviderType, string>;

export enum SessionStatusesEnum {
  LOADING = 'loading',
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated'
}

/*
 * Utilities.
 */

export async function getAuthProviders(): Promise<Providers> {
  const providers = await getProviders();

  return providers ?? [];
}

export async function signInWithProvider(providerId: ProviderId) {
  return signIn(providerId);
}

/**
 * Used by the server to retrieve the current user's session.
 */
export async function getSessionUser(req: NextApiRequest) {
  const session = await getSession({req});
  if (!session || !session.user) return undefined;

  return computeSessionUser(session);
}

/*
 * Hooks.
 */

export function useAuthSession(): {user?: User; status: SessionStatusesEnum} {
  const {data, status} = useSession();

  if (!isSessionStatusesEnum(status)) throw new Error(`Not a valid session status: ${status}`);

  const user = data ? computeSessionUser(data) : undefined;
  return {user, status};
}

/*
 * Helpers.
 */

function isSessionStatusesEnum(status: string): status is SessionStatusesEnum {
  return Object.values(SessionStatusesEnum).includes(status as SessionStatusesEnum);
}

/**
 * Retrieves the UserModel from a Session object, ensuring
 * that all fields are present.
 */
function computeSessionUser(session: Session): User {
  const user = session.user;
  if (!user) throw new Error('Session is missing user');

  // @ts-ignore: id is injected from next-auth adapter.
  if (!user.id) throw new Error('User is missing email');
  if (!user.email) throw new Error('User is missing email');
  if (!user.name) throw new Error('User is missing name');
  if (!user.image) throw new Error('User is missing image');

  return {
    // @ts-ignore: id is injected from next-auth adapter.
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image
  };
}
