import {signOut} from 'next-auth/react';
import {NextRouter, useRouter} from 'next/router';
import React, {FC, MouseEvent, useState} from 'react';
import tw, {styled} from 'twin.macro';

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

interface HamburgerProps {
  isActive: boolean;
}

interface MenuProps {
  openLoginModal: Handler;
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

const StyledHamburgerPattyDiv = tw.div`
  w-9
  h-0.5
  bg-white
`;

interface StyledHamburgerDivProps {
  $isActive: boolean;
}
const StyledHamburgerDiv = styled.div<StyledHamburgerDivProps>`
  ${tw`
    flex
    flex-col
    justify-center
    gap-2
    mr-2
    cursor-pointer
  `}

  & > div {
    ${({$isActive}) => $isActive && tw`bg-gray-300`}
  }

  &:hover > div {
    ${tw`bg-gray-300`}
  }
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
  sm:text-lg
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
          <Hamburger isActive={isMenuVisible} />
        </StyledMenuButton>
      </Popover>
      {isMenuVisible && <ModalMenu openLoginModal={openLoginModal} closeMenu={() => undefined} />}
      {isLoginModalVisible && providers && <LoginModal providers={providers} closeModal={closeLoginModal} />}
    </StyledMenuWrapperDiv>
  );
};

const Hamburger: FC<HamburgerProps> = ({isActive}) => (
  <StyledHamburgerDiv $isActive={isActive}>
    <StyledHamburgerPattyDiv />
    <StyledHamburgerPattyDiv />
    <StyledHamburgerPattyDiv />
  </StyledHamburgerDiv>
);

const PopoverMenu: FC<MenuProps> = ({openLoginModal, closeMenu}) => {
  const router = useRouter();
  const {isAuthenticated} = useAuthSession();

  const menuRoutes = renderRoutes(router, isAuthenticated, openLoginModal);

  const menuRef = useClickWindow<HTMLDivElement>(closeMenu);

  return <StyledMenuCard ref={menuRef}>{menuRoutes}</StyledMenuCard>;
};

const ModalMenu: FC<MenuProps> = ({openLoginModal, closeMenu}) => {
  const router = useRouter();
  const {isAuthenticated} = useAuthSession();

  const menuRoutes = renderRoutes(router, isAuthenticated, openLoginModal);

  return (
    <StyledModalDiv>
      <Modal closeModal={closeMenu}>
        <StyledMenuCard>
          <StyledSvgDiv>
            <GrueSvg fill='#6b7280' height='32px' />
          </StyledSvgDiv>
          {menuRoutes}
        </StyledMenuCard>
      </Modal>
    </StyledModalDiv>
  );
};

/*
 * Helpers.
 */

function renderRoutes(router: NextRouter, isAuthenticated: boolean, openLoginModal: Handler) {
  const onClickCreate = () => router.push('/');
  const onClickPlans = () => router.push('/plans/');
  const onClickLogout = () => signOut();

  const menuRoutes = isAuthenticated
    ? renderAuthenticatedRoutes(onClickPlans, onClickLogout)
    : renderUnauthenticatedRoutes(openLoginModal);

  return (
    <>
      <StyledMenuItemDiv>
        <StyledMenuItemButton onClick={onClickCreate}>Create</StyledMenuItemButton>
      </StyledMenuItemDiv>
      {menuRoutes}
    </>
  );
}

function renderUnauthenticatedRoutes(openLoginModal: Handler) {
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
