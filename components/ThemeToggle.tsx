import React, {FC} from 'react';
import tw, {styled} from 'twin.macro';

import {useThemeContext} from '../store/ThemeProvider';
import {useIsClient} from '../utils/hooks';
import {ThemesEnum} from '../utils/theme';
import {ChromelessButton} from './ChromelessButton';

/*
 * Styles.
 */

interface StyledToggleDivProps {
  $isActive: boolean;
}
const StyledToggleDiv = styled.div<StyledToggleDivProps>`
  ${tw`
    w-16
    h-10
    bg-gray-200
    rounded-full
    p-1

    flex
    items-center

    transition-colors
    duration-200
    ease-in-out
  `};

  ${({$isActive}) => $isActive && tw`bg-gray-700`}
`;

interface StyledSwitchDivProps {
  $isActive: boolean;
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

  ${({$isActive}) => $isActive && tw`bg-gray-200`}
  ${({$isActive}) => $isActive && tw`translate-x-6`}
`;

/*
 * Component.
 */

export const ThemeToggle: FC = () => {
  const {theme, toggleTheme} = useThemeContext();

  const isClient = useIsClient();
  if (!isClient) return null;

  const isActive = theme === ThemesEnum.DARK;

  return (
    <ChromelessButton onClick={toggleTheme}>
      <StyledToggleDiv $isActive={isActive}>
        <StyledSwitchDiv $isActive={isActive} />
      </StyledToggleDiv>
    </ChromelessButton>
  );
};
