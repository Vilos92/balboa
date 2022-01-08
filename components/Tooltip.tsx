import {FC, MouseEventHandler, useRef, useState} from 'react';
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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

type HoverTooltipProps = Omit<TooltipProps, 'isVisible' | 'onMouseEnter' | 'onMouseLeave'>;

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
    rounded-2xl
    border-gray-400
    border-2
    hidden
  `}

  ${({isVisible}) => isVisible && tw`block`}
`;

const StyledTextDiv = tw.div`
  p-1.5
`;

const StyledArrowDiv = tw.div`
  invisible
`;

/*
 * Component.
 */

export const HoverTooltip: FC<HoverTooltipProps> = props => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  const onMouseEnter = () => setIsTooltipVisible(true);
  const onMouseLeave = () => setIsTooltipVisible(false);

  return (
    <Tooltip
      {...props}
      isVisible={isTooltipVisible}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export const Tooltip: FC<TooltipProps> = props => {
  const {children, text, isVisible, placement, onClick, onMouseEnter, onMouseLeave} = props;

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
      <span ref={containerRef} onMouseEnter={onMouseEnter}>
        {children}
      </span>

      <StyledPopoverDiv
        ref={popperRef}
        style={styles.popper}
        {...attributes.popper}
        isVisible={isVisible}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
      >
        <StyledTextDiv>{text}</StyledTextDiv>
        <StyledArrowDiv ref={arrowRef} style={styles.arrow} {...attributes.arrow} />
      </StyledPopoverDiv>
    </>
  );
};
