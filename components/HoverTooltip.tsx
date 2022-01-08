import {FC, useState} from 'react';

import {useTimeout} from '../utils/hooks';
import {HoverTooltipProps, Tooltip} from './Tooltip';

/*
 * Constants.
 */

const tooltipVisibilityDuration = 500; // 500 ms.

/*
 * Component.
 */

export const HoverTooltip: FC<HoverTooltipProps> = props => {
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [setTooltipTimeout, clearTooltipTimeout] = useTimeout();

  const onMouseEnter = () => {
    clearTooltipTimeout();
    setIsTooltipVisible(true);
  };
  const onMouseLeave = () => {
    setTooltipTimeout(() => setIsTooltipVisible(false), tooltipVisibilityDuration);
  };

  return (
    <Tooltip
      {...props}
      isVisible={isTooltipVisible}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};
