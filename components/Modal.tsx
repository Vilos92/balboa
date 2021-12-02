import {FC, useCallback, useEffect, useRef, useState} from 'react';
import tw from 'twin.macro';

/*
 * Types.
 */

interface ModalProps {
  closeModal: () => void;
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
  const modalRef = useRef<HTMLDivElement>(null);

  const onClickWindow = useCallback(
    (event: globalThis.MouseEvent) => {
      // We must cast the target to Node as per official rec:
      // https://github.com/Microsoft/TypeScript/issues/15394#issuecomment-297495746
      if (modalRef.current?.contains(event.target as Node)) return;
      closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    window.addEventListener('click', onClickWindow);

    return () => {
      window.removeEventListener('click', onClickWindow);
    };
  }, [onClickWindow]);

  return (
    <StyledOverlayDiv>
      <span ref={modalRef}>{children}</span>
    </StyledOverlayDiv>
  );
};
