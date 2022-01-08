import {FC} from 'react';
import tw from 'twin.macro';

import {Handler} from '../types/common';
import {useClickWindow} from '../utils/hooks';

/*
 * Types.
 */

interface ModalProps {
  closeModal: Handler;
}

/*
 * Styles.
 */

const StyledOverlayDiv = tw.div`
  fixed
  top-0
  left-0
  w-screen
  h-screen
  z-50
  flex
  items-center
  justify-center
  bg-white
  sm:bg-transparent
  sm:backdrop-blur-md
`;

/*
 * Component.
 */

export const Modal: FC<ModalProps> = ({children, closeModal}) => {
  const modalRef = useClickWindow<HTMLSpanElement>(closeModal);

  return (
    <StyledOverlayDiv>
      <span ref={modalRef}>{children}</span>
    </StyledOverlayDiv>
  );
};
