import {Placement} from '@popperjs/core';
import {FC, MouseEventHandler, ReactNode, useRef} from 'react';
import {usePopper} from 'react-popper';
import tw, {styled} from 'twin.macro';

import {Handler} from '../types/common';

/*
 * Types.
 */

type PopoverPlacement = Placement;

export interface PopoverProps {
  popoverChildren: ReactNode;
  isVisible: boolean;
  placement?: PopoverPlacement;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: Handler;
  onMouseLeave?: Handler;
}

interface StyledPopoverDivProps {
  $isVisible: boolean;
}

/*
 * Styles.
 */

const StyledPopoverDiv = styled.div<StyledPopoverDivProps>`
  ${tw`
    bg-purple-900
    text-gray-100
    z-50
    font-normal
    leading-normal
    text-sm
    max-w-xs
    text-left
    no-underline
    break-words
    rounded-2xl
    border-gray-400
    border-2
    hidden
  `}

  ${({$isVisible}) => $isVisible && tw`block`}
`;

/*
 * Component.
 */

export const Popover: FC<PopoverProps> = props => {
  const {children, popoverChildren, isVisible, placement, onClick, onMouseEnter, onMouseLeave} = props;

  const containerRef = useRef<HTMLSpanElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);

  const {styles, attributes} = usePopper(containerRef.current, popperRef.current, {
    modifiers: [{name: 'offset', options: {offset: [0, 2]}}],
    placement
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
        $isVisible={isVisible}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {popoverChildren}
      </StyledPopoverDiv>
    </>
  );
};
