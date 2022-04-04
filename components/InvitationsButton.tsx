import {useRouter} from 'next/router';
import React, {FC, MouseEvent, useState} from 'react';
import tw, {styled, theme} from 'twin.macro';

import {Invitation} from '../models/invitation';
import {useNetGetInvitationsForUser} from '../pages/api/invitations';
import {Handler} from '../types/common';
import {useClickWindow} from '../utils/hooks';
import {Button} from './Button';
import {Card} from './Card';
import {ChromelessButton} from './ChromelessButton';
import {Icon, IconTypesEnum} from './Icon';
import {VisualPlan} from './VisualPlan';
import {Popover} from './popover/Popover';
import {colors} from '.pnpm/@react-spring+shared@9.4.4_react@18.0.0/node_modules/@react-spring/shared';

/*
 * Props.
 */

interface InvitationsPopoverProps {
  invitations: readonly Invitation[];
  closePopover: Handler;
}

interface InvitationRowProps {
  invitation: Invitation;
}

/*
 * Styles.
 */

const StyledCard = tw(Card)`
  pl-0
  pr-0
  pb-0
`;

const StyledContentDiv = tw.div`
`;

const StyledChromelessButton = tw(ChromelessButton)`
  h-full
  flex
  justify-center
  items-center
`;

const StyledCardH1 = tw.h1`
  w-full
  text-xl
  text-center
  tracking-wide
  border-b
  border-gray-200
  pb-2
`;

const StyledInvitationButton = styled(ChromelessButton)`
  ${tw`
    w-full
    pt-3
    pb-4
    not-last:border-b
    last:sm:rounded-b-2xl

    hover:bg-purple-100
    border-gray-200

    text-gray-600
    active:text-gray-600
    focus:text-gray-600
    hover:text-gray-600
  `}

  & > * {
    ${tw`
      pl-3
      pr-3
    `}
  }
`;

const StyledActionsDiv = tw.div`
  pt-2

  flex
  flex-row
  justify-center
  gap-1.5
`;

/*
 * Component.
 */

export const InvitationsButton: FC = () => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const {data: invitations, error} = useNetGetInvitationsForUser();
  if (error) return null;

  const onClickButton = (event: MouseEvent<HTMLButtonElement>) => {
    setIsPopoverVisible(!isPopoverVisible);
    event.stopPropagation();
  };
  const closePopover = () => setIsPopoverVisible(false);

  const isSomeUnread = invitations && invitations.length > 0;

  return (
    <Popover
      placement='bottom-end'
      isVisible={isPopoverVisible}
      popoverChildren={<InvitationsPopover invitations={invitations ?? []} closePopover={closePopover} />}
    >
      <StyledChromelessButton onClick={onClickButton}>
        <Icon
          type={isSomeUnread ? IconTypesEnum.MAIL_UNREAD : IconTypesEnum.MAIL}
          size={32}
          fill={isSomeUnread ? theme`colors.purple.400` : theme`colors.white`}
          hoverFill={isSomeUnread ? theme`colors.purple.400` : theme`colors.purple.200`}
          isActive={isPopoverVisible}
        />
      </StyledChromelessButton>
    </Popover>
  );
};

const InvitationsPopover: FC<InvitationsPopoverProps> = ({invitations, closePopover}) => {
  const cardRef = useClickWindow<HTMLDivElement>(closePopover);

  return (
    <StyledCard ref={cardRef}>
      <StyledCardH1>Invitations</StyledCardH1>
      <StyledContentDiv>
        {invitations.map(invitation => (
          <InvitationRow key={invitation.plan.id} invitation={invitation} />
        ))}
      </StyledContentDiv>
    </StyledCard>
  );
};

const InvitationRow: FC<InvitationRowProps> = ({invitation}) => {
  const router = useRouter();
  const onClick = () => router.push(`/plans/${invitation.plan.id}`);

  const onClickAccept = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const onClickDecline = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <StyledInvitationButton onClick={onClick}>
      <VisualPlan plan={invitation.plan} />

      <StyledActionsDiv>
        <Button backgroundColor={theme`colors.purple.400`} onClick={onClickAccept}>
          Accept
        </Button>
        <Button backgroundColor={theme`colors.red.400`} onClick={onClickDecline}>
          Decline
        </Button>
      </StyledActionsDiv>
    </StyledInvitationButton>
  );
};
