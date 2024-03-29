import {FC, ReactNode} from 'react';
import tw from 'twin.macro';

import {Popover, PopoverProps} from './Popover';

/*
 * Types.
 */

export interface TooltipProps extends Omit<PopoverProps, 'popoverChildren'> {
  text: ReactNode;
}

/*
 * Styles.
 */

const StyledPopover = tw(Popover)`
  box-content
  bg-gray-600
  text-gray-100
  border
  border-gray-200
  p-2.5
`;

const StyledTextDiv = tw.div`
    font-normal
    leading-normal
    text-sm
    no-underline
    break-words
`;

/*
 * Component.
 */

export const Tooltip: FC<TooltipProps> = props => {
  const {text, ...popoverProps} = props;

  const popoverChildren = <StyledTextDiv>{text}</StyledTextDiv>;

  return <StyledPopover popoverChildren={popoverChildren} {...popoverProps} />;
};
