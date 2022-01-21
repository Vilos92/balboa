import React, {FC} from 'react';
import tw from 'twin.macro';

import {Logo} from './Logo';
import {MenuButton} from './MenuButton';

/*
 * Styles.
 */

const StyledFalseHeaderDiv = tw.div`
  invisible 
  h-16
  w-full
`;

const StyledHeaderDiv = tw.div`
  z-10
  bg-purple-900
  opacity-95
  w-full
  h-16
  flex
  justify-between
  fixed
  top-0
`;

const StyledHeaderSpacerDiv = tw.div`
  w-11
`;

/*
 * Components.
 */

export const Header: FC = () => {
  return (
    <>
      <StyledFalseHeaderDiv />
      <StyledHeaderDiv>
        <StyledHeaderSpacerDiv />
        <Logo />
        <MenuButton />
      </StyledHeaderDiv>
    </>
  );
};
