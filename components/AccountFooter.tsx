import {FC, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {Providers} from '../utils/auth';
import {Button} from './Button';
import {LoginModal} from './LoginModal';

/*
 * Types.
 */

interface AccountFooterProps {
  isAuthenticated: boolean;
  providers: Providers;
}

/*
 * Styles.
 */

const StyledFalseFooterDiv = tw.div`
  invisible 
  h-16
  w-full
`;

const StyledFooterSpacerDiv = tw.div`
  invisible
  h-0
  w-full
`;

const StyledFooterDiv = styled.div`
  ${tw`
    z-10
    bg-purple-900
    opacity-95
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

/*
 * Components.
 */

export const AccountFooter: FC<AccountFooterProps> = ({isAuthenticated, providers}) => {
  if (isAuthenticated) return <StyledFooterSpacerDiv />;

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalVisible(true);
  };
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
          </StyledFooterButtonDiv>
        </StyledContentDiv>
      </StyledFooterDiv>
      {isLoginModalVisible && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </>
  );
};
