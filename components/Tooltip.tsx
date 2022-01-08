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

const StyledTextDiv = tw.div`
  p-1.5
`;

/*
 * Component.
 */

export const Tooltip: FC<TooltipProps> = props => {
  const {text, ...popoverProps} = props;

  const popoverChildren = <StyledTextDiv>{text}</StyledTextDiv>;

  return <Popover popoverChildren={popoverChildren} {...popoverProps} />;
};
