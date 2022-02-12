import Image from 'next/image';
import {FC} from 'react';

import restartSvg from '../public/remixIcon/restart-line.svg';
import {AtLeastOne} from '../types/common';

/*
 * Types.
 */

export enum IconTypesEnum {
  RESTART = 'restart'
}

interface BasicIconProps {
  iconType: IconTypesEnum;
}

interface IconDimensionProps {
  width: number;
  height: number;
}

type IconProps = BasicIconProps & AtLeastOne<IconDimensionProps>;

/*
 * Constants.
 */

const iconSourceMap = {
  [IconTypesEnum.RESTART]: restartSvg
};

/*
 * Component.
 */

export const Icon: FC<IconProps> = ({iconType, width, height}) => (
  <Image src={iconSourceMap[iconType]} width={width} height={height} priority />
);
