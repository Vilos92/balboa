import React, {FC, SVGProps} from 'react';
import {styled, theme} from 'twin.macro';

import CalendarEventSvg from '../public/remixIcon/calendar-event-line.svg';
import MapPinSvg from '../public/remixIcon/map-pin-line.svg';
import PencilSvg from '../public/remixIcon/pencil-line.svg';
import ProfileSvg from '../public/remixIcon/profile-line.svg';
import RestartSvg from '../public/remixIcon/restart-line.svg';

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
  fill?: string;
  hoverFill?: string;
  isActive?: boolean;
}

interface IconSvgProps {
  type: IconTypesEnum;
  size: number;
}

/*
 * Styles.
 */

interface StyledIconDivProps {
  $fill: string;
  $hoverFill: string;
}
const StyledIconDiv = styled.div<StyledIconDivProps>`
  svg {
    fill: ${({$fill}) => $fill};
  }

  svg:hover {
    fill: ${({$hoverFill}) => $hoverFill};
  }
`;

/*
 * Component.
 */

export const Icon: FC<IconProps> = ({type, size, fill: fillProp, hoverFill: hoverFillProp, isActive}) => {
  const fill = fillProp ?? theme`colors.black` ?? '';
  const hoverFill = hoverFillProp ?? fill;
  const currentFill = isActive ? hoverFill : fill;

  return (
    <StyledIconDiv $fill={currentFill} $hoverFill={hoverFill}>
      <IconSvg type={type} size={size} />
    </StyledIconDiv>
  );
};

const IconSvg: FC<IconSvgProps> = ({type, size}) => {
  const viewBox = '0 0 24 24';
  const iconProps: SVGProps<SVGElement> = {width: size, height: size, viewBox};

  switch (type) {
    case IconTypesEnum.CALENDAR_EVENT:
      return <CalendarEventSvg {...iconProps} />;
    case IconTypesEnum.MAP_PIN:
      return <MapPinSvg {...iconProps} />;
    case IconTypesEnum.PENCIL:
      return <PencilSvg {...iconProps} />;
    case IconTypesEnum.PROFILE:
      return <ProfileSvg {...iconProps} />;
    case IconTypesEnum.RESTART:
      return <RestartSvg {...iconProps} />;
    default:
      return null;
  }
};
