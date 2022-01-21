import {signOut} from 'next-auth/react';
import {useRouter} from 'next/router';
import React, {FC, useState} from 'react';
import tw from 'twin.macro';

import {useAuthSession} from '../utils/auth';
import {useClickWindow} from '../utils/hooks';
import {ChromelessButton} from './ChromelessButton';
import {Card} from './Commons';
import {Popover} from './popovers/Popover';

/*
 * Styles.
 */

const StyledMenuDiv = tw.div`
  flex
  flex-col
  justify-center
`;

const StyledHamburgerDiv = tw.div`
  flex
  flex-col
  justify-center
  gap-2
  mr-2
  cursor-pointer
`;

const StyledHamburgerPattyDiv = tw.div`
  w-9
  h-0.5
  bg-white
`;

const StyledMenuCard = tw(Card)`
  flex
  flex-col
  gap-2
  text-black
`;

const StyledMenuItemDiv = tw.div`
  text-center
  border-b-2
  border-gray-300
  hover:border-purple-400
  pl-1
  pr-1
`;

/*
 * Components.
 */

export const MenuButton: FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const onClick = () => setIsMenuVisible(!isMenuVisible);
  const closeMenu = () => setIsMenuVisible(false);

  const menuRef = useClickWindow<HTMLDivElement>(closeMenu);

  return (
    <StyledMenuDiv onClick={onClick} ref={menuRef}>
      <Popover isVisible={isMenuVisible} popoverChildren={<Menu />}>
        <StyledHamburgerDiv>
          <StyledHamburgerPattyDiv />
          <StyledHamburgerPattyDiv />
          <StyledHamburgerPattyDiv />
        </StyledHamburgerDiv>
      </Popover>
    </StyledMenuDiv>
  );
};

const Menu = () => {
  const router = useRouter();
  const {isAuthenticated} = useAuthSession();

  const onClickPlans = () => router.push('plans/');
  const onClickLogout = () => signOut();

  return (
    <StyledMenuCard>
      {!isAuthenticated && (
        <StyledMenuItemDiv>
          <ChromelessButton>Login</ChromelessButton>
        </StyledMenuItemDiv>
      )}
      {isAuthenticated && (
        <>
          <StyledMenuItemDiv>
            <ChromelessButton onClick={onClickPlans}>Plans</ChromelessButton>
          </StyledMenuItemDiv>
          <StyledMenuItemDiv>
            <ChromelessButton onClick={onClickLogout}>Logout</ChromelessButton>
          </StyledMenuItemDiv>
        </>
      )}
    </StyledMenuCard>
  );
};
