import React, {FC} from 'react';
import tw from 'twin.macro';

import {Invitation} from '../models/invitation';
import {Handler} from '../types/common';
import {Providers, useAuthSession} from '../utils/auth';
import {InvitationsButton} from './InvitationsButton';
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
  gap-3
`;

/*
 * Components.
 */

export const Header: FC<HeaderProps> = ({providers}) => {
  const {isAuthenticated} = useAuthSession();

  return (
    <>
      <StyledFalseHeaderDiv />
      <StyledHeaderDiv>
        <StyledHeaderSpacerDiv />
        <Logo />
        <StyledActionsDiv>
          {isAuthenticated && <InvitationsButton />}
          <MenuButton providers={providers} />
        </StyledActionsDiv>
      </StyledHeaderDiv>
    </>
  );
};
