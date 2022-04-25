import React, {FC} from 'react';
import {animated, useSpring} from 'react-spring';
import {theme} from 'twin.macro';

import {GrueSvg} from './svg/GrueSvg';

/**
 * Component.
 */

export const LoadingGrue: FC = () => {
  const style = useSpring({
    loop: {reverse: true},
    from: {height: '128px', rotateZ: -10},
    to: {height: '192px', rotateZ: 15},
    config: {
      duration: 1500
    }
  });

  const height = style.height.get();

  return (
    <>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <animated.div style={style}>
        <GrueSvg fill={theme`textColor.primary`} height={height} />
      </animated.div>
    </>
  );
};
