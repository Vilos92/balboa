import React, {FC, SVGProps} from 'react';
import {styled, theme} from 'twin.macro';

import AccountCircleSvg from '../public/remixIcon/account-circle-line.svg';
import AddCircleSvg from '../public/remixIcon/add-circle-line.svg';
import CalendarEventSvg from '../public/remixIcon/calendar-event-line.svg';
import DeleteBackSvg from '../public/remixIcon/delete-back-2-line.svg';
import DeleteBinSvg from '../public/remixIcon/delete-bin-line.svg';
import GroupSvg from '../public/remixIcon/group-line.svg';
import InboxSvg from '../public/remixIcon/inbox-line.svg';
import ListUnorderedSvg from '../public/remixIcon/list-unordered.svg';
import MailSvg from '../public/remixIcon/mail-line.svg';
import MailSendSvg from '../public/remixIcon/mail-send-line.svg';
import MailUnreadSvg from '../public/remixIcon/mail-unread-line.svg';
import MapPinSvg from '../public/remixIcon/map-pin-line.svg';
import PencilSvg from '../public/remixIcon/pencil-line.svg';
import ProfileSvg from '../public/remixIcon/profile-line.svg';
import RestartSvg from '../public/remixIcon/restart-line.svg';

/*
 * Types.
 */

export enum IconTypesEnum {
  ACCOUNT_CIRCLE = 'account_circle',
  ADD_CIRCLE = 'add_circle',
  CALENDAR_EVENT = 'calendar_event',
  DELETE_BACK = 'delete_back',
  DELETE_BIN = 'delete_bin',
  GROUP = 'group',
  INBOX = 'inbox',
  LIST_UNORDERED = 'list_unordered',
  MAIL = 'mail',
  MAIL_SEND = 'mail_send',
  MAIL_UNREAD = 'mail_unread',
  MAP_PIN = 'map_pin',
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
  $size: number;
  $fill: string;
  $hoverFill: string;
}
const StyledIconDiv = styled.div<StyledIconDivProps>`
  width: ${({$size}) => `${$size}px`};
  height: ${({$size}) => `${$size}px`};

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
    <StyledIconDiv $size={size} $fill={currentFill} $hoverFill={hoverFill}>
      <IconSvg type={type} size={size} />
    </StyledIconDiv>
  );
};

const IconSvg: FC<IconSvgProps> = ({type, size}) => {
  const viewBox = '0 0 24 24';
  const iconProps: SVGProps<SVGElement> = {width: size, height: size, viewBox};

  switch (type) {
    case IconTypesEnum.ACCOUNT_CIRCLE:
      return <AccountCircleSvg {...iconProps} />;
    case IconTypesEnum.ADD_CIRCLE:
      return <AddCircleSvg {...iconProps} />;
    case IconTypesEnum.CALENDAR_EVENT:
      return <CalendarEventSvg {...iconProps} />;
    case IconTypesEnum.DELETE_BACK:
      return <DeleteBackSvg {...iconProps} />;
    case IconTypesEnum.DELETE_BIN:
      return <DeleteBinSvg {...iconProps} />;
    case IconTypesEnum.GROUP:
      return <GroupSvg {...iconProps} />;
    case IconTypesEnum.INBOX:
      return <InboxSvg {...iconProps} />;
    case IconTypesEnum.LIST_UNORDERED:
      return <ListUnorderedSvg {...iconProps} />;
    case IconTypesEnum.MAIL:
      return <MailSvg {...iconProps} />;
    case IconTypesEnum.MAIL_SEND:
      return <MailSendSvg {...iconProps} />;
    case IconTypesEnum.MAIL_UNREAD:
      return <MailUnreadSvg {...iconProps} />;
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
