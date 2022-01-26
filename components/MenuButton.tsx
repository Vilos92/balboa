import {signOut} from 'next-auth/react';
import {useRouter} from 'next/router';
import React, {FC, forwardRef, useState} from 'react';
import tw from 'twin.macro';

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

const StyledMenuCard = tw.div`
  flex
  flex-col
  gap-2
  p-3
  bg-white
  text-black
  shadow-md
  rounded-2xl
`;

const StyledMenuItemDiv = tw.div`
  w-full
  text-center
  border-b-2
  rounded-t
  border-gray-300
  hover:border-purple-400
  hover:bg-gray-100
  p-1
`;

/*
 * Components.
 */

export const MenuButton: FC<MenuButtonProps> = ({providers}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const onClick = () => setIsMenuVisible(!isMenuVisible);
  const closeMenu = () => setIsMenuVisible(false);

  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const openLoginModal = providers
    ? () => {
        setIsLoginModalVisible(true);
      }
    : undefined;
  const closeLoginModal = () => setIsLoginModalVisible(false);

  return (
    <StyledMenuDiv onClick={onClick}>
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
    </StyledMenuDiv>
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
        <ChromelessButton onClick={onClickCreate}>Create</ChromelessButton>
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
      <ChromelessButton onClick={openLoginModal}>Login</ChromelessButton>
    </StyledMenuItemDiv>
  );
}

function renderAuthenticatedRoutes(onClickPlans: Handler, onClickLogout: Handler) {
  return (
    <>
      <StyledMenuItemDiv>
        <ChromelessButton onClick={onClickPlans}>Plans</ChromelessButton>
      </StyledMenuItemDiv>
      <StyledMenuItemDiv>
        <ChromelessButton onClick={onClickLogout}>Logout</ChromelessButton>
      </StyledMenuItemDiv>
    </>
  );
}
