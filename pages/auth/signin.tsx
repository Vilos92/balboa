import {GetServerSideProps, NextPage} from 'next';
import {signIn, useSession} from 'next-auth/react';
import {FC} from 'react';

import {Providers, getAuthProviders} from '../utils/auth';

/*
 * Types.
 */

interface SignInProps {
  providers: Providers;
}

/*
 * Server-side props.
 */

export const getServerSideProps: GetServerSideProps<SignInProps> = async () => {
  const providers = await getAuthProviders();

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
