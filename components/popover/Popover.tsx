import {Placement} from '@popperjs/core';
import {FC, MouseEventHandler, PropsWithChildren, ReactNode, useRef, useState} from 'react';
import {usePopper} from 'react-popper';
import tw, {styled} from 'twin.macro';

import {Handler} from '../../types/common';
import {useInitialEffect} from '../../utils/hooks';

/*
 * Types.
 */

type PopoverPlacement = Placement;

export interface PopoverProps extends PropsWithChildren<unknown> {
  popoverChildren: ReactNode;
  isVisible: boolean;
  placement?: PopoverPlacement;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: Handler;
  onMouseLeave?: Handler;
  className?: string;
}

/*
 * Styles.
 */

interface StyledPopoverDivProps {
  $isVisible: boolean;
}
const StyledPopoverDiv = styled.div<StyledPopoverDivProps>`
  ${tw`
    z-50
    max-w-xs
    text-left
    rounded-2xl
    invisible
  `}

  ${({$isVisible}) => $isVisible && tw`visible`}
  ${({$isVisible}) => $isVisible && tw`block`}
`;

/*
 * Component.
 */

export const Popover: FC<PopoverProps> = props => {
  const {children, popoverChildren, isVisible, placement, onClick, onMouseEnter, onMouseLeave, className} =
    props;

  const containerRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const {styles, attributes} = usePopper(containerRef.current, popperRef.current, {
    modifiers: [{name: 'offset', options: {offset: [0, 2]}}],
    placement
  });

  // Do not display popover until after the initial render to avoid position issues.
  const [isMounted, setIsMounted] = useState(false);
  useInitialEffect(() => {
    setIsMounted(true);
  });

  return (
    <>
      <span ref={containerRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {children}
      </span>

      <StyledPopoverDiv
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
        $isVisible={isMounted && isVisible}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={className}
      >
        {isVisible && popoverChildren}
      </StyledPopoverDiv>
    </>
  );
};
