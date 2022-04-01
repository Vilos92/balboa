import {signOut} from 'next-auth/react';
import {NextRouter, useRouter} from 'next/router';
import React, {FC, MouseEvent, useCallback, useState} from 'react';
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

type OnClickOpenLoginModal = (event: MouseEvent<HTMLButtonElement>) => void;

interface MenuProps {
  onClickOpenLoginModal: OnClickOpenLoginModal;
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

  bg-gray-200

  text-black
  shadow-md
  rounded-2xl

  filter
  drop-shadow-lg
`;

const StyledMenuItemDiv = tw.div`
  first:rounded-t-2xl

  last:rounded-b-2xl
  last:pb-5

  not-last:border-b-2
  border-gray-300

  pt-5
  pb-5
  sm:pt-3
  sm:pb-3

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

  return (
    <StyledMenuWrapperDiv>
      <Popover
        placement='bottom-end'
        isVisible={isMenuVisible}
        popoverChildren={<PopoverMenu onClickOpenLoginModal={onClickOpenLoginModal} closeMenu={closeMenu} />}
      >
        <StyledMenuButton onClick={onClickOpenMenu}>
          <Hamburger isActive={isMenuVisible} />
        </StyledMenuButton>
      </Popover>
      {isMenuVisible && (
        <ModalMenu onClickOpenLoginModal={onClickOpenLoginModal} closeMenu={() => undefined} />
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

  const menuRoutes = renderRoutes(router, isAuthenticated, onClickOpenLoginModal);

  const menuRef = useClickWindow<HTMLDivElement>(closeMenu);

  return <StyledMenuDiv ref={menuRef}>{menuRoutes}</StyledMenuDiv>;
};

const ModalMenu: FC<MenuProps> = ({onClickOpenLoginModal, closeMenu}) => {
  const router = useRouter();
  const {isAuthenticated} = useAuthSession();

  const menuRoutes = renderRoutes(router, isAuthenticated, onClickOpenLoginModal);

  return (
    <StyledModalDiv>
      <Modal closeModal={closeMenu}>
        <StyledMenuDiv>
          <StyledSvgDiv>
            <GrueSvg fill='#6b7280' height='32px' />
          </StyledSvgDiv>
          {menuRoutes}
        </StyledMenuDiv>
      </Modal>
    </StyledModalDiv>
  );
};

/*
 * Helpers.
 */

function renderRoutes(
  router: NextRouter,
  isAuthenticated: boolean,
  onClickOpenLoginModal: OnClickOpenLoginModal
) {
  const onClickCreate = () => router.push('/');
  const onClickPlans = () => router.push('/plans/');
  const onClickLogout = () => signOut();

  const menuRoutes = isAuthenticated
    ? renderAuthenticatedRoutes(onClickPlans, onClickLogout)
    : renderUnauthenticatedRoutes(onClickOpenLoginModal);

  return (
    <>
      <StyledMenuItemDiv>
        <StyledMenuItemButton onClick={onClickCreate}>Create</StyledMenuItemButton>
      </StyledMenuItemDiv>
      {menuRoutes}
    </>
  );
}

function renderUnauthenticatedRoutes(onClickOpenLoginModal: OnClickOpenLoginModal) {
  return (
    <StyledMenuItemDiv>
      <StyledMenuItemButton onClick={onClickOpenLoginModal}>Log in</StyledMenuItemButton>
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
