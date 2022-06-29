import {FC, PropsWithChildren} from 'react';
import tw from 'twin.macro';

import {Handler} from '../types/common';
import {useClickWindow} from '../utils/hooks';

/*
 * Types.
 */

interface ModalProps extends PropsWithChildren<unknown> {
  className?: string;
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
  sm:bg-black
`;

/*
 * Component.
 */

export const Modal: FC<ModalProps> = ({children, className, closeModal}) => {
  const modalRef = useClickWindow<HTMLSpanElement>(closeModal);

  return (
    <StyledOverlayDiv className={className}>
      <span ref={modalRef}>{children}</span>
    </StyledOverlayDiv>
  );
};
