import {FC} from 'react';
import {animated, useSpring} from 'react-spring';

import {Handler} from '../types/common';
import {useHover} from '../utils/hooks';
import {ChromelessButton} from './ChromelessButton';
import {Icon, IconTypesEnum} from './Icon';

/*
 * Types.
 */

interface IconButtonProps {
  iconType: IconTypesEnum;
  size: number;
  hoverFill?: string;
  computeTransform?: (hasHover: boolean) => string;
  onClick: Handler;
}

/*
 * Component.
 */

export const IconButton: FC<IconButtonProps> = ({iconType, size, hoverFill, computeTransform, onClick}) => {
  const [hoverRef, hasHover] = useHover<HTMLButtonElement>();

  const style = useSpring({
    transform: computeTransform ? computeTransform(hasHover) : undefined,
    reverse: !hasHover
  });

  const halfSize = size / 2;
  const transformOrigin = `${halfSize}px ${halfSize}px`;
  const animatedStyle = {...style, width: size, height: size, transformOrigin};

  return (
    <>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <animated.div style={animatedStyle}>
        <ChromelessButton ref={hoverRef} onClick={onClick}>
          <Icon type={iconType} size={size} hoverFill={hoverFill} />
        </ChromelessButton>
      </animated.div>
    </>
  );
};
