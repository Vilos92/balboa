import {FC} from 'react';
import tw from 'twin.macro';

import {Handler} from '../types/common';
import {Providers, signInWithProvider} from '../utils/auth';
import {Card} from './Commons';
import {Modal} from './Modal';

/*
 * Props.
 */

interface LoginModalProps {
  providers: Providers;
  closeModal: Handler;
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

/*
 * Component.
 */

export const LoginModal: FC<LoginModalProps> = ({providers, closeModal}) => (
  <Modal closeModal={closeModal}>
    <StyledCard>
      <StyledCardH1>Create your account</StyledCardH1>
      {Object.values(providers).map(provider => (
        <div key={provider.name}>
          <button onClick={() => signInWithProvider(provider.id)}>Sign in with {provider.name}</button>
        </div>
      ))}
    </StyledCard>
  </Modal>
);
