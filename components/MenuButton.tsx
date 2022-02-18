import {signOut} from 'next-auth/react';
import {useRouter} from 'next/router';
import React, {FC, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {Handler} from '../types/common';
import {Providers, useAuthSession} from '../utils/auth';
import {useClickWindow} from '../utils/hooks';
import {ChromelessButton} from './ChromelessButton';
import {LoginModal} from './LoginModal';
import {Popover} from './popovers/Popover';

/*
 * Props
 */

interface MenuButtonProps {
  providers?: Providers;
}

interface MenuProps {
  openLoginModal?: Handler;
  closeMenu: Handler;
}

/*
 * Styles.
 */

const StyledMenuButton = tw(ChromelessButton)`
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

const StyledMenuCard = tw.div`
  flex
  flex-col
  bg-white
  text-black
  shadow-md
  rounded-2xl
`;

const StyledMenuItemDiv = tw.div`
  first:rounded-t-2xl
  first:pt-3

  last:rounded-b-2xl
  last:pb-3

  not-last:border-b-2
  border-gray-200

  pt-1
  pb-1
  pl-3
  pr-3

  w-full
  h-full
  text-center
  hover:bg-gray-100
`;

const StyledMenuItemButton = tw(ChromelessButton)`
  w-full
  h-full
  text-gray-500
  active:text-purple-400
  focus:text-purple-400
  hover:text-purple-400
`;

/*
 * Components.
 */

export const MenuButton: FC<MenuButtonProps> = ({providers}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const openMenu = () => {
    // Handle onClick after closeMenu in the scenario where closeMenu is already mapped to the window.
    setTimeout(() => setIsMenuVisible(true));
  };
  const closeMenu = () => {
    if (isLoginModalVisible) return;
    setIsMenuVisible(false);
  };

  const openLoginModal = () => {
    // Handle onClick after closeLoginModal in the scenario where closeMenu is already mapped to the window.
    setTimeout(() => setIsLoginModalVisible(true));
  };
  const closeLoginModal = () => setIsLoginModalVisible(false);

  return (
    <StyledMenuButton onClick={openMenu}>
      <Popover
        placement='bottom-end'
        isVisible={isMenuVisible}
        popoverChildren={<Menu openLoginModal={openLoginModal} closeMenu={closeMenu} />}
      >
        <StyledHamburgerDiv>
          <StyledHamburgerPattyDiv />
          <StyledHamburgerPattyDiv />
          <StyledHamburgerPattyDiv />
        </StyledHamburgerDiv>
      </Popover>
      {isLoginModalVisible && providers && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </StyledMenuButton>
  );
};

const Menu: FC<MenuProps> = ({openLoginModal, closeMenu}) => {
  const router = useRouter();
  const {isAuthenticated} = useAuthSession();

  const menuRef = useClickWindow<HTMLDivElement>(closeMenu);

  const onClickCreate = () => router.push('/');
  const onClickPlans = () => router.push('/plans/');
  const onClickLogout = () => signOut();

  const menuItems = isAuthenticated
    ? renderAuthenticatedRoutes(onClickPlans, onClickLogout)
    : renderUnauthenticatedRoutes(openLoginModal);

  return (
    <StyledMenuCard ref={menuRef}>
      <StyledMenuItemDiv>
        <StyledMenuItemButton onClick={onClickCreate}>Create</StyledMenuItemButton>
      </StyledMenuItemDiv>
      {menuItems}
    </StyledMenuCard>
  );
};

/*
 * Helpers.
 */

function renderUnauthenticatedRoutes(openLoginModal?: Handler) {
  if (!openLoginModal) return;

  return (
    <StyledMenuItemDiv>
      <StyledMenuItemButton onClick={openLoginModal}>Login</StyledMenuItemButton>
    </StyledMenuItemDiv>
  );
}

function renderAuthenticatedRoutes(onClickPlans: Handler, onClickLogout: Handler) {
  return (
    <>
      <StyledMenuItemDiv>
        <StyledMenuItemButton onClick={onClickPlans}>Plans</StyledMenuItemButton>
      </StyledMenuItemDiv>
      <StyledMenuItemDiv>
        <StyledMenuItemButton onClick={onClickLogout}>Logout</StyledMenuItemButton>
      </StyledMenuItemDiv>
    </>
  );
}
