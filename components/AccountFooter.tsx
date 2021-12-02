import {FC, useCallback, useEffect, useRef, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {Button} from './Button';
import {Card} from './Commons';
import {TextInput} from './Inputs';

/*
 * Types
 */

interface LoginModalProps {
  closeModal: () => void;
  openSignUpModal: () => void;
}

interface SignUpModalProps {
  closeModal: () => void;
  openLoginModal: () => void;
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

const StyledOverlayDiv = tw.div`
  fixed
  top-0
  left-0
  w-screen
  h-screen
  z-50
  flex
  items-center
  justify-center
  bg-white
  sm:bg-transparent
  sm:backdrop-blur-sm
`;

const StyledCard = tw(Card)`
  sm:max-w-md
  p-20
`;

const StyledCardH1 = tw.h1`
  text-2xl
  mb-8
`;

const StyledModalButton = tw(Button)`
  bg-purple-900
  w-full
`;

const StyledModalTextInput = tw(TextInput)`
  mb-4
`;

const StyledModalFooterP = tw.p`
  mt-8
  text-sm
`;

/*
 * Components.
 */

export const AccountFooter: FC = () => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isSignUpModalVisible, setIsSignUpModalVisible] = useState(false);

  const openLoginModal = () => {
    setIsSignUpModalVisible(false);
    setIsLoginModalVisible(true);
  };
  const closeLoginModal = () => setIsLoginModalVisible(false);

  const openSignUpModal = () => {
    setIsLoginModalVisible(false);
    setIsSignUpModalVisible(true);
  };
  const closeSignUpModal = () => setIsSignUpModalVisible(false);

  return (
    <>
      <StyledFalseFooterDiv />
      <StyledFooterDiv>
        <StyledContentDiv>
          <StyledFooterBlurbDiv>
            <StyledFooterH2>Stay on top of plans</StyledFooterH2>
            <StyledFooterH3>People on Grueplan stay coordinated</StyledFooterH3>
          </StyledFooterBlurbDiv>
          <StyledFooterButtonDiv>
            <StyledFooterButton onClick={openLoginModal}>Log in</StyledFooterButton>
            <StyledFooterButton onClick={openSignUpModal}>Sign up</StyledFooterButton>
          </StyledFooterButtonDiv>
        </StyledContentDiv>
      </StyledFooterDiv>
      {isLoginModalVisible && <LoginModal closeModal={closeLoginModal} openSignUpModal={openSignUpModal} />}
      {isSignUpModalVisible && <SignUpModal closeModal={closeSignUpModal} openLoginModal={openLoginModal} />}
    </>
  );
};

const LoginModal: FC<LoginModalProps> = ({closeModal, openSignUpModal}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const onClickWindow = useCallback(
    (event: globalThis.MouseEvent) => {
      // We must cast the target to Node as per official rec:
      // https://github.com/Microsoft/TypeScript/issues/15394#issuecomment-297495746
      if (modalRef.current?.contains(event.target as Node)) return;
      closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    window.addEventListener('click', onClickWindow);

    return () => {
      window.removeEventListener('click', onClickWindow);
    };
  }, [onClickWindow]);

  return (
    <StyledOverlayDiv>
      <StyledCard ref={modalRef}>
        <StyledCardH1>Sign in to Grueplan</StyledCardH1>
        <StyledModalTextInput label='Email'></StyledModalTextInput>
        <StyledModalButton>Next</StyledModalButton>
        <StyledModalFooterP>
          Don't have an account? <button onClick={openSignUpModal}>Sign up</button>
        </StyledModalFooterP>
      </StyledCard>
    </StyledOverlayDiv>
  );
};

const SignUpModal: FC<SignUpModalProps> = ({closeModal, openLoginModal}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const onClickWindow = useCallback(
    (event: globalThis.MouseEvent) => {
      // We must cast the target to Node as per official rec:
      // https://github.com/Microsoft/TypeScript/issues/15394#issuecomment-297495746
      if (modalRef.current?.contains(event.target as Node)) return;
      closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    window.addEventListener('click', onClickWindow);

    return () => {
      window.removeEventListener('click', onClickWindow);
    };
  }, [onClickWindow]);

  return (
    <StyledOverlayDiv>
      <StyledCard ref={modalRef}>
        <StyledCardH1>Create your account</StyledCardH1>
        <StyledModalTextInput label='Email'></StyledModalTextInput>
        <StyledModalTextInput label='Password'></StyledModalTextInput>
        <StyledModalButton>Next</StyledModalButton>
        <StyledModalFooterP>
          Already have an account? <button onClick={openLoginModal}>Log in</button>
        </StyledModalFooterP>
      </StyledCard>
    </StyledOverlayDiv>
  );
};
