import {FC} from 'react';
import tw, {styled} from 'twin.macro';

import {Providers, signInWithProvider} from '../utils/auth';
import {Button} from './Button';
import {Card} from './Commons';
import {Modal} from './Modal';

/*
 * Types
 */

interface AccountFooterProps {
  providers: Providers;
  isLoginModalVisible: boolean;
  setIsLoginModalVisible: (isVisible: boolean) => void;
}

interface LoginModalProps {
  providers: Providers;
  closeModal: () => void;
}

/*
 * Styles.
 */

const StyledFalseFooterDiv = tw.div`
  invisible 
  h-16
  w-full
  mt-6
`;

const StyledFooterDiv = styled.div`
  ${tw`
    bg-purple-900
    text-gray-100
    flex
    justify-center
    h-16
    w-full
    fixed
    bottom-0
  `}
`;

const StyledContentDiv = tw.div`
  flex
  justify-center
  sm:justify-between
  items-center
  pl-8
  pr-8
  max-w-5xl
  w-full
`;

const StyledFooterBlurbDiv = tw.div`
  hidden
  sm:flex
  flex-col
`;

const StyledFooterH2 = tw.h2`
  font-bold
  text-lg
`;

const StyledFooterH3 = tw.h3`
  text-sm
`;

const StyledFooterButtonDiv = tw.div`
  flex
  flex-row
  gap-3
`;

const StyledFooterButton = tw(Button)`
  bg-purple-900
  border-2
  border-gray-200
  h-10
`;

const StyledCard = tw(Card)`
  sm:max-w-md
  p-20
`;

const StyledCardH1 = tw.h1`
  text-2xl
  mb-8
`;

/*
 * Components.
 */

export const AccountFooter: FC<AccountFooterProps> = ({
  providers,
  isLoginModalVisible,
  setIsLoginModalVisible
}) => {
  const openLoginModal = () => {
    setIsLoginModalVisible(true);
  };
  const closeLoginModal = () => setIsLoginModalVisible(false);

  return (
    <>
      <FalseAccountFooter />
      <StyledFooterDiv>
        <StyledContentDiv>
          <StyledFooterBlurbDiv>
            <StyledFooterH2>Stay on top of plans</StyledFooterH2>
            <StyledFooterH3>People on Grueplan stay coordinated</StyledFooterH3>
          </StyledFooterBlurbDiv>
          <StyledFooterButtonDiv>
            <StyledFooterButton onClick={openLoginModal}>Log in</StyledFooterButton>
          </StyledFooterButtonDiv>
        </StyledContentDiv>
      </StyledFooterDiv>
      {isLoginModalVisible && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </>
  );
};

const LoginModal: FC<LoginModalProps> = ({providers, closeModal}) => (
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

/**
 * Invisible footer which is rendered alongside the fixed real footer, to
 * ensure its dimensions are still represented in the DOM.
 */
export const FalseAccountFooter: FC = () => <StyledFalseFooterDiv />;
