import {signOut} from 'next-auth/react';
import {useRouter} from 'next/router';
import React, {FC, MouseEvent, useState} from 'react';
import tw from 'twin.macro';

import {Handler} from '../types/common';
import {Providers, useAuthSession} from '../utils/auth';
import {useClickWindow} from '../utils/hooks';
import {ChromelessButton} from './ChromelessButton';
import {LoginModal} from './LoginModal';
import {Modal} from './Modal';
import {Popover} from './popovers/Popover';
import {GrueSvg} from './svg/GrueSvg';

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

const StyledMenuWrapperDiv = tw.div`
  flex
  flex-col
  justify-center
`;

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
  w-40
  sm:w-auto

  flex
  flex-col

  bg-gray-200

  text-black
  shadow-md
  rounded-2xl
  mr-2
`;

const StyledMenuItemDiv = tw.div`
  first:rounded-t-2xl
  first:pt-3

  last:rounded-b-2xl
  last:pb-3

  not-last:border-b-2
  border-gray-300

  pt-2
  pb-2
  sm:pt-1
  sm:pb-1

  sm:pl-3
  sm:pr-3

  w-full
  h-full
  text-center

  hover:bg-gray-300
`;

const StyledMenuItemButton = tw(ChromelessButton)`
  w-full
  h-full

  text-3xl
  sm:text-xl
  text-gray-600
  active:text-purple-400
  focus:text-purple-400
  hover:text-purple-400
`;

const StyledModalDiv = tw.div`
  sm:invisible
`;

const StyledSvgDiv = tw.div`
  w-full
  pt-2
  pb-1

  flex
  flex-row
  justify-center
`;

/*
 * Components.
 */

export const MenuButton: FC<MenuButtonProps> = ({providers}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    // We want to allow an already open menu to be closed by clicking it.
    if (isMenuVisible) return;

    setIsMenuVisible(true);

    // Prevent the menu from closing due to the click event bubbling to closeMenu.
    event.stopPropagation();
  };
  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  const openLoginModal = () => {
    setIsLoginModalVisible(true);
  };
  const closeLoginModal = () => setIsLoginModalVisible(false);

  return (
    <StyledMenuWrapperDiv>
      <Popover
        placement='bottom-end'
        isVisible={isMenuVisible}
        popoverChildren={<PopoverMenu openLoginModal={openLoginModal} closeMenu={closeMenu} />}
      >
        <StyledMenuButton onClick={openMenu}>
          <StyledHamburgerDiv>
            <StyledHamburgerPattyDiv />
            <StyledHamburgerPattyDiv />
            <StyledHamburgerPattyDiv />
          </StyledHamburgerDiv>
        </StyledMenuButton>
      </Popover>
      {isMenuVisible && <ModalMenu openLoginModal={openLoginModal} closeMenu={() => undefined} />}
      {isLoginModalVisible && providers && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </StyledMenuWrapperDiv>
  );
};

const PopoverMenu: FC<MenuProps> = ({openLoginModal, closeMenu}) => {
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

const ModalMenu: FC<MenuProps> = ({openLoginModal, closeMenu}) => {
  const router = useRouter();
  const {isAuthenticated} = useAuthSession();

  const onClickCreate = () => router.push('/');
  const onClickPlans = () => router.push('/plans/');
  const onClickLogout = () => signOut();

  const menuItems = isAuthenticated
    ? renderAuthenticatedRoutes(onClickPlans, onClickLogout)
    : renderUnauthenticatedRoutes(openLoginModal);

  return (
    <StyledModalDiv>
      <Modal closeModal={closeMenu}>
        <StyledMenuCard>
          <StyledSvgDiv>
            <GrueSvg fill='#6b7280' height='32px' />
          </StyledSvgDiv>
          <StyledMenuItemDiv>
            <StyledMenuItemButton onClick={onClickCreate}>Create</StyledMenuItemButton>
          </StyledMenuItemDiv>
          {menuItems}
        </StyledMenuCard>
      </Modal>
    </StyledModalDiv>
  );
};

/*
 * Helpers.
 */

function renderUnauthenticatedRoutes(openLoginModal?: Handler) {
  if (!openLoginModal) return;

  return (
    <StyledMenuItemDiv>
      <StyledMenuItemButton onClick={openLoginModal}>Log in</StyledMenuItemButton>
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
        <StyledMenuItemButton onClick={onClickLogout}>Log out</StyledMenuItemButton>
      </StyledMenuItemDiv>
    </>
  );
}
