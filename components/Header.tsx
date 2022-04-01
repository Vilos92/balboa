import React, {FC} from 'react';
import tw from 'twin.macro';

import {Providers} from '../utils/auth';
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
  w-11
`;

/*
 * Components.
 */

export const Header: FC<HeaderProps> = ({providers}) => {
  return (
    <>
      <StyledFalseHeaderDiv />
      <StyledHeaderDiv>
        <StyledHeaderSpacerDiv />
        <Logo />
        <MenuButton providers={providers} />
      </StyledHeaderDiv>
    </>
  );
};
