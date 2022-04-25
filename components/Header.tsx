import React, {FC} from 'react';
import tw, {styled} from 'twin.macro';

import {ThemesEnum} from '../store/ThemeProvider';
import {Providers, SessionStatusesEnum, useAuthSession} from '../utils/auth';
import {InvitationsMenuButton} from './InvitationsMenuButton';
import {Logo} from './Logo';
import {MenuButton} from './MenuButton';
import {ThemeToggle} from './ThemeToggle';

/*
 * Props.
 */

interface HeaderProps {
  providers?: Providers;
}

/*
 * Styles.
 */

const StyledFalseHeaderDiv = tw.div`
  invisible 
  h-16
  w-full
`;

const StyledHeaderDiv = tw.div`
  box-border
  border-t
  border-b
  border-gray-50

  z-20
  bg-gray-800
  w-full
  h-16
  flex
  justify-between
  fixed
  top-0
`;

const StyledThemeSwitchDiv = styled.div`
  ${tw`
    flex-grow
    w-full

    flex
  `}

  & > * {
    ${tw`
      ml-5
    `}
  }
`;

const StyledActionsDiv = tw.div`
  flex-grow
  w-full

  flex
  flex-row
  justify-end
  items-center
  gap-5
`;

/*
 * Components.
 */

export const Header: FC<HeaderProps> = ({providers}) => {
  const {status, isAuthenticated} = useAuthSession();
  const isLoadingSessionStatus = status === SessionStatusesEnum.LOADING;

  return (
    <>
      <StyledFalseHeaderDiv />
      <StyledHeaderDiv>
        <StyledThemeSwitchDiv>
          <ThemeToggle />
        </StyledThemeSwitchDiv>
        <Logo />
        <StyledActionsDiv>
          {!isLoadingSessionStatus && isAuthenticated && <InvitationsMenuButton />}
          <MenuButton providers={providers} />
        </StyledActionsDiv>
      </StyledHeaderDiv>
    </>
  );
};
