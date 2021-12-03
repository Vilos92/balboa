import {Session} from 'next-auth';
import {BuiltInProviderType} from 'next-auth/providers';
import {ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession} from 'next-auth/react';

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

export function useAuthSession(): {session?: Session; status: SessionStatusesEnum} {
  const {data, status} = useSession();

  if (!isSessionStatusesEnum(status)) throw new Error(`Not a valid session status: ${status}`);

  const session = data ?? undefined;

  return {session, status};
}

/*
 * Helpers.
 */

function isSessionStatusesEnum(status: string): status is SessionStatusesEnum {
  return Object.values(SessionStatusesEnum).includes(status as SessionStatusesEnum);
}
