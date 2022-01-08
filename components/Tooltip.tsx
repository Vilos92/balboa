import {FC} from 'react';
import tw from 'twin.macro';

import {Popover, PopoverProps} from './Popover';

/*
 * Types.
 */

export interface TooltipProps extends Omit<PopoverProps, 'popoverChildren'> {
  text: string;
}

/*
 * Styles.
 */

const StyledPopover = tw(Popover)`
  bg-purple-900
  text-gray-100
`;

const StyledTextDiv = tw.div`
    font-normal
    leading-normal
    text-sm
    no-underline
    break-words

    p-1.5
`;

/*
 * Component.
 */

export const Tooltip: FC<TooltipProps> = props => {
  const {text, ...popoverProps} = props;

  const popoverChildren = <StyledTextDiv>{text}</StyledTextDiv>;

  return <StyledPopover popoverChildren={popoverChildren} {...popoverProps} />;
};
