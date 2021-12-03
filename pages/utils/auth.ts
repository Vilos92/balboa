import {BuiltInProviderType} from 'next-auth/providers';
import {ClientSafeProvider, LiteralUnion, getProviders, signIn} from 'next-auth/react';

/*
 * Types.
 */

export type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
export type ProviderId = LiteralUnion<BuiltInProviderType, string>;

/*
 * Utilities.
 */

export async function getAuthProviders() {
  const providers = await getProviders();

  return providers ?? [];
}

export async function signInWithProvider(providerId: ProviderId) {
  return signIn(providerId);
}
