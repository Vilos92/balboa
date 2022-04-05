import {ClientSafeProvider} from 'next-auth/react';
import {FC} from 'react';
import tw, {styled} from 'twin.macro';

import GoogleSvg from '../public/google.svg';
import {Handler} from '../types/common';
import {Providers, signInWithProvider} from '../utils/auth';
import {Button} from './Button';
import {Card} from './Card';
import {Modal} from './Modal';

/*
 * Props.
 */

interface LoginModalProps {
  providers: Providers;
  closeModal: Handler;
}

interface LoginButtonProps {
  provider: ClientSafeProvider;
}

/*
 * Styles.
 */

const StyledCard = tw(Card)`
  p-20
  shadow-none
  sm:max-w-md
`;

const StyledCardH1 = tw.h1`
  text-2xl
  mb-8
`;

const StyledLoginButton = styled(Button)`
  ${tw`
    bg-purple-900
    w-full
    gap-1
  `}
`;

/*
 * Components.
 */

export const LoginModal: FC<LoginModalProps> = ({providers, closeModal}) => {
  const googleProvider = Object.values(providers).find(provider => provider.id === 'google');
  if (!googleProvider) return null;

  return (
    <Modal closeModal={closeModal}>
      <StyledCard>
        <StyledCardH1>Create your account</StyledCardH1>
        <GoogleLoginButton key={googleProvider.id} provider={googleProvider} />
      </StyledCard>
    </Modal>
  );
};

const GoogleLoginButton: FC<LoginButtonProps> = ({provider}) => (
  <StyledLoginButton onClick={() => signInWithProvider(provider.id)}>
    <GoogleSvg width={24} height={24} viewBox='0 0 48 48' />
    Sign in with {provider.name}
  </StyledLoginButton>
);
