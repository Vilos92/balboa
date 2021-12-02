import {GetServerSideProps, NextPage} from 'next';
import {BuiltInProviderType} from 'next-auth/providers';
import {
  ClientSafeProvider,
  LiteralUnion,
  SessionProvider,
  getProviders,
  signIn,
  useSession
} from 'next-auth/react';
import {FC} from 'react';

/*
 * Types.
 */

type Providers = Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;

interface SignInProps {
  providers: Providers;
}

/*
 * Server-side props.
 */

export const getServerSideProps: GetServerSideProps<SignInProps> = async () => {
  const providers = await getProviders();

  return {
    props: {providers}
  };
};

/*
 * Page.
 */

const SignIn: NextPage<SignInProps> = ({providers}) => {
  const {data: session, status} = useSession();
  console.log('session', session, status);

  return <SignInView providers={providers} />;
};

const SignInView: FC<SignInProps> = ({providers}) => {
  if (!providers) return null;

  return (
    <>
      {Object.values(providers).map(provider => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>Sign in with {provider.name}</button>
        </div>
      ))}
    </>
  );
};

export default SignIn;
