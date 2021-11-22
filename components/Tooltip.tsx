import {FC, MouseEventHandler, useRef} from 'react';
import {usePopper} from 'react-popper';
import tw, {styled} from 'twin.macro';

/*
 * Types.
 */

interface TooltipProps {
  text: string;
  isVisible: boolean;
  placement?: 'auto' | 'top' | 'right' | 'bottom' | 'left';
  onClick?: MouseEventHandler<HTMLDivElement>;
}

interface StyledPopoverDivProps {
  isVisible: boolean;
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
    rounded-lg
    hidden
  `}

  ${({isVisible}) => isVisible && tw`block`}
`;

const StyledTextSpan = tw.span`
  p-2
`;

const StyledArrowDiv = tw.div`
  invisible
`;

/*
 * Component.
 */

export const Tooltip: FC<TooltipProps> = ({children, text, isVisible, placement, onClick}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  // TODO: style and actually use arrow.
  const arrowRef = useRef<HTMLDivElement>(null);

  const {styles, attributes} = usePopper(containerRef.current, popperRef.current, {
    modifiers: [{name: 'arrow', options: {element: arrowRef.current}}],
    placement
  });

  return (
    <>
      <span ref={containerRef}>{children}</span>

      <StyledPopoverDiv
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
        isVisible={isVisible}
        onClick={onClick}
      >
        <StyledTextSpan>{text}</StyledTextSpan>
        <StyledArrowDiv ref={arrowRef} style={styles.arrow} {...attributes.arrow} />
      </StyledPopoverDiv>
    </>
  );
};
