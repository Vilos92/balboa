import {Session} from 'next-auth';
import {BuiltInProviderType} from 'next-auth/providers';
import {ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession} from 'next-auth/react';

import {UserModel} from '../models/user';

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

/*
 * Hooks.
 */

export function useAuthSession(): {user?: UserModel; status: SessionStatusesEnum} {
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
function computeSessionUser(session: Session): UserModel {
  const user = session.user;
  if (!user) throw new Error('Session is missing user');

  if (!user.email) throw new Error('User is missing email');
  if (!user.name) throw new Error('User is missing name');
  if (!user.image) throw new Error('User is missing image');

  return {
    email: user.email,
    name: user.name,
    image: user.image
  };
}
