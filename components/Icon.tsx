import Image from 'next/image';
import {FC} from 'react';

import calendarEventSvg from '../public/remixIcon/calendar-event-line.svg';
import mapPinSvg from '../public/remixIcon/map-pin-line.svg';
import pencilSvg from '../public/remixIcon/pencil-line.svg';
import profileSvg from '../public/remixIcon/profile-line.svg';
import restartSvg from '../public/remixIcon/restart-line.svg';

/*
 * Types.
 */

export enum IconTypesEnum {
  CALENDAR_EVENT = 'calendar_event',
  MAP_PIN = 'mapPin',
  PENCIL = 'pencil',
  PROFILE = 'profile',
  RESTART = 'restart'
}

interface IconProps {
  type: IconTypesEnum;
  size: number;
}

/*
 * Constants.
 */

const iconSourceMap = {
  [IconTypesEnum.CALENDAR_EVENT]: calendarEventSvg,
  [IconTypesEnum.MAP_PIN]: mapPinSvg,
  [IconTypesEnum.PENCIL]: pencilSvg,
  [IconTypesEnum.PROFILE]: profileSvg,
  [IconTypesEnum.RESTART]: restartSvg
};

/*
 * Component.
 */

export const Icon: FC<IconProps> = ({type, size}) => (
  <Image src={iconSourceMap[type]} width={size} height={size} priority />
);
