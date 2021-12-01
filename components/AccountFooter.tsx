import {FC, useCallback, useEffect, useRef, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {Button} from './Button';
import {Card} from './Commons';

/*
 * Types
 */

interface LoginModalProps {
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

const StyledOverlayDiv = styled.div`
  background: rgba(0, 0, 0, 0.2);

  ${tw`
    fixed
    top-0
    left-0
    w-screen
    h-screen
    z-50
    flex
    items-center
    justify-center
    backdrop-blur-sm
  `};
`;

/*
 * Components.
 */

export const AccountFooter: FC = () => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const openLoginModal = () => setIsLoginModalVisible(true);
  const closeLoginModal = () => setIsLoginModalVisible(false);

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
            <StyledFooterButton>Sign up</StyledFooterButton>
          </StyledFooterButtonDiv>
        </StyledContentDiv>
      </StyledFooterDiv>
      {isLoginModalVisible && <LoginModal closeModal={closeLoginModal} />}
    </>
  );
};

const LoginModal: FC<LoginModalProps> = ({closeModal}) => {
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
      <Card ref={modalRef}>
        <h2>Sign in to Grueplan</h2> <button>Sign in with Google</button> <div>or</div>{' '}
        <input placeholder='email'></input> <button>next</button>
      </Card>
    </StyledOverlayDiv>
  );
};
