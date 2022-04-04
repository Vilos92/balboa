import {useMediaQuery} from '@react-hook/media-query';
import {signOut} from 'next-auth/react';
import {NextRouter, useRouter} from 'next/router';
import React, {FC, MouseEvent, useCallback, useState} from 'react';
import tw, {styled} from 'twin.macro';

import {AsyncHandler, Handler} from '../types/common';
import {Providers, useAuthSession} from '../utils/auth';
import {useClickWindow} from '../utils/hooks';
import {ChromelessButton} from './ChromelessButton';
import {LoginModal} from './LoginModal';
import {Modal} from './Modal';
import {Popover} from './popover/Popover';
import {GrueSvg} from './svg/GrueSvg';

/*
 * Types.
 */

interface MenuButtonProps {
  providers?: Providers;
}

interface HamburgerProps {
  isActive: boolean;
}

type ButtonMouseEvent = (event: MouseEvent<HTMLButtonElement>) => void;

interface MenuProps {
  onClickOpenLoginModal: ButtonMouseEvent;
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

const StyledMenuDiv = tw.div`
  w-screen
  sm:w-auto
  sm:mr-2

  flex
  flex-col

  box-border
  border
  border-gray-300
  sm:rounded-2xl

  bg-white
  text-black
  shadow-xl
`;

const StyledMenuItemButton = tw(ChromelessButton)`
  first:rounded-t-2xl
  last:rounded-b-2xl

  w-full
  h-full
  text-center
  hover:bg-purple-100

  p-5
  sm:p-3

  border-gray-300
  not-last:border-b-2

  text-3xl
  sm:text-lg

  text-gray-600
  active:text-gray-600
  focus:text-gray-600
  hover:text-gray-600
`;

const StyledModal = tw(Modal)`
  bg-black
`;

const StyledSvgDiv = tw.div`
  w-full
  pt-5

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

  const onClickOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setIsMenuVisible(!isMenuVisible);
    event.stopPropagation();
  };
  const closeMenu = useCallback(() => setIsMenuVisible(false), [setIsMenuVisible]);

  const onClickOpenLoginModal = (event: MouseEvent<HTMLButtonElement>) => {
    setIsLoginModalVisible(true);
    event.stopPropagation();
  };
  const closeLoginModal = useCallback(() => setIsLoginModalVisible(false), [setIsLoginModalVisible]);

  const isScreenSmall = useMediaQuery('only screen and (min-width: 640px)');
  const isScreenMobile = !isScreenSmall;

  return (
    <StyledMenuWrapperDiv>
      <Popover
        placement='bottom-end'
        isVisible={isScreenSmall && isMenuVisible}
        popoverChildren={<PopoverMenu onClickOpenLoginModal={onClickOpenLoginModal} closeMenu={closeMenu} />}
      >
        <StyledMenuButton onClick={onClickOpenMenu}>
          <Hamburger isActive={isMenuVisible} />
        </StyledMenuButton>
      </Popover>
      {isScreenMobile && isMenuVisible && (
        <ModalMenu onClickOpenLoginModal={onClickOpenLoginModal} closeMenu={closeMenu} />
      )}
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

const PopoverMenu: FC<MenuProps> = ({onClickOpenLoginModal, closeMenu}) => {
  const router = useRouter();
  const {isAuthenticated} = useAuthSession();

  const menuRoutes = renderRoutes(router, isAuthenticated, onClickOpenLoginModal, closeMenu);

  const menuRef = useClickWindow<HTMLDivElement>(closeMenu);

  return <StyledMenuDiv ref={menuRef}>{menuRoutes}</StyledMenuDiv>;
};

const ModalMenu: FC<MenuProps> = ({onClickOpenLoginModal, closeMenu}) => {
  const router = useRouter();
  const {isAuthenticated} = useAuthSession();

  const menuRoutes = renderRoutes(router, isAuthenticated, onClickOpenLoginModal, closeMenu);

  return (
    <StyledModal closeModal={closeMenu}>
      <StyledMenuDiv>
        <StyledSvgDiv>
          <GrueSvg fill='#6b7280' height='32px' />
        </StyledSvgDiv>
        {menuRoutes}
      </StyledMenuDiv>
    </StyledModal>
  );
};

/*
 * Helpers.
 */

function renderRoutes(
  router: NextRouter,
  isAuthenticated: boolean,
  onClickOpenLoginModal: ButtonMouseEvent,
  closeMenu: Handler
) {
  const onClickCreate = async () => {
    await router.push('/');
    closeMenu();
  };
  const onClickPlans = async () => {
    await router.push('/plans/');
    closeMenu();
  };
  const onClickLogout = async () => {
    await signOut();
    closeMenu();
  };

  const menuRoutes = isAuthenticated
    ? renderAuthenticatedRoutes(onClickPlans, onClickLogout)
    : renderUnauthenticatedRoutes(onClickOpenLoginModal);

  return (
    <>
      <StyledMenuItemButton onClick={onClickCreate}>Create</StyledMenuItemButton>
      {menuRoutes}
    </>
  );
}

function renderUnauthenticatedRoutes(onClickOpenLoginModal: ButtonMouseEvent) {
  return <StyledMenuItemButton onClick={onClickOpenLoginModal}>Log in</StyledMenuItemButton>;
}

function renderAuthenticatedRoutes(onClickPlans: AsyncHandler, onClickLogout: AsyncHandler) {
  return (
    <>
      <StyledMenuItemButton onClick={onClickPlans}>Plans</StyledMenuItemButton>
      <StyledMenuItemButton onClick={onClickLogout}>Log out</StyledMenuItemButton>
    </>
  );
}
