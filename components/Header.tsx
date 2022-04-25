import React, {FC, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {ThemesEnum, useThemeContext} from '../store/ThemeProvider';
import {Providers, SessionStatusesEnum, useAuthSession} from '../utils/auth';
import {useInitialEffect} from '../utils/hooks';
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

interface StyledCheckDivProps {
  $theme: ThemesEnum;
}
const StyledCheckDiv = styled.div<StyledCheckDivProps>`
  ${tw`
    w-16
    h-10
    bg-gray-200
    rounded-full
    p-1

    flex
    items-center

    duration-200
    ease-in-out
  `};

  ${({$theme}) => $theme === ThemesEnum.LIGHT && tw`bg-gray-700`}
`;

interface StyledSwitchDivProps {
  $theme: ThemesEnum;
}
const StyledSwitchDiv = styled.div<StyledSwitchDivProps>`
  ${tw`
    bg-gray-700
    w-8
    h-8
    rounded-full
    shadow-md
    duration-200
    ease-in-out
  `}

  ${({$theme}) => $theme === ThemesEnum.LIGHT && tw`bg-gray-200`}
  ${({$theme}) => $theme === ThemesEnum.DARK && tw`translate-x-6`}
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

const ThemeToggle: FC = () => {
  const {theme, toggleTheme} = useThemeContext();

  const [isClient, setIsClient] = useState(false);
  useInitialEffect(() => {
    setIsClient(typeof window !== 'undefined');
  });

  if (!isClient) return null;

  return (
    <ChromelessButton onClick={toggleTheme}>
      <StyledCheckDiv $theme={theme}>
        <StyledSwitchDiv $theme={theme} />
      </StyledCheckDiv>
    </ChromelessButton>
  );
};
