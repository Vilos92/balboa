import React, {FC} from 'react';
import tw from 'twin.macro';

import {useThemeContext} from '../store/ThemeProvider';
import {Providers, SessionStatusesEnum, useAuthSession} from '../utils/auth';
import {ChromelessButton} from './ChromelessButton';
import {InvitationsMenuButton} from './InvitationsMenuButton';
import {Logo} from './Logo';
import {MenuButton} from './MenuButton';

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

const StyledHeaderSpacerDiv = tw.div`
  flex-grow
  w-full
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

  const {theme, setTheme} = useThemeContext();
  const toggleTheme = () => {
    if (!setTheme) return;
    if (theme === 'light') setTheme('dark');
    if (theme === 'dark') setTheme('light');
  };

  return (
    <>
      <StyledFalseHeaderDiv />
      <StyledHeaderDiv>
        <StyledHeaderSpacerDiv>
          <ChromelessButton onClick={toggleTheme}>Toggle Theme: {theme}</ChromelessButton>
        </StyledHeaderSpacerDiv>
        <Logo />
        <StyledActionsDiv>
          {!isLoadingSessionStatus && isAuthenticated && <InvitationsMenuButton />}
          <MenuButton providers={providers} />
        </StyledActionsDiv>
      </StyledHeaderDiv>
    </>
  );
};
