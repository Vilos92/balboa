import React, {FC, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {ThemesEnum, useThemeContext} from '../store/ThemeProvider';
import {useInitialEffect, useIsClient} from '../utils/hooks';
import {ChromelessButton} from './ChromelessButton';

/*
 * Styles.
 */

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

/*
 * Component.
 */

export const ThemeToggle: FC = () => {
  const {theme, toggleTheme} = useThemeContext();

  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <ChromelessButton onClick={toggleTheme}>
      <StyledCheckDiv $theme={theme}>
        <StyledSwitchDiv $theme={theme} />
      </StyledCheckDiv>
    </ChromelessButton>
  );
};
