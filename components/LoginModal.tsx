import {FC} from 'react';
import tw, {styled} from 'twin.macro';

import {Handler} from '../types/common';
import {Providers, signInWithProvider} from '../utils/auth';
import {Button} from './Button';
import {Card} from './Commons';
import {Modal} from './Modal';

/*
 * Props.
 */

interface LoginModalProps {
  providers: Providers;
  closeModal: Handler;
}

interface LoginButtonProps {
  providerId: string;
  providerName: string;
}

/*
 * Styles.
 */

const StyledCard = tw(Card)`
  sm:max-w-md
  p-20
`;

const StyledCardH1 = tw.h1`
  text-2xl
  mb-8
`;

const StyledLoginButton = styled(Button)`
  ${tw`
    bg-purple-900
    w-full
  `}
`;

/*
 * Components.
 */

export const LoginModal: FC<LoginModalProps> = ({providers, closeModal}) => (
  <Modal closeModal={closeModal}>
    <StyledCard>
      <StyledCardH1>Create your account</StyledCardH1>
      {Object.values(providers).map(provider => (
        <LoginButton key={provider.id} providerId={provider.id} providerName={provider.name} />
      ))}
    </StyledCard>
  </Modal>
);

const LoginButton: FC<LoginButtonProps> = ({providerId, providerName}) => (
  <StyledLoginButton onClick={() => signInWithProvider(providerId)}>
    Sign in with {providerName}
  </StyledLoginButton>
);
