import {Placement} from '@popperjs/core';
import {FC, MouseEventHandler, ReactNode, useRef} from 'react';
import {usePopper} from 'react-popper';
import tw, {styled} from 'twin.macro';

import {Handler} from '../../types/common';

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
  className?: string;
}

interface StyledPopoverDivProps {
  $isVisible: boolean;
}

/*
 * Styles.
 */

const StyledPopoverDiv = styled.div<StyledPopoverDivProps>`
  ${tw`
    z-50
    max-w-xs
    text-left
    rounded-2xl
    hidden
  `}

  ${({$isVisible}) => $isVisible && tw`block`}
`;

/*
 * Component.
 */

export const Popover: FC<PopoverProps> = props => {
  const {children, popoverChildren, isVisible, placement, onClick, onMouseEnter, onMouseLeave, className} =
    props;

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
        className={className}
      >
        {popoverChildren}
      </StyledPopoverDiv>
    </>
  );
};
