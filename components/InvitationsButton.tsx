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
`;

const StyledInvitationDiv = tw.div`
  pt-2
  not-last:pb-4
  not-last:border-b
  border-gray-200
`;

const StyledActionsDiv = tw.div`
  pt-1

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

  return (
    <Popover
      placement='bottom-end'
      isVisible={isPopoverVisible}
      popoverChildren={<InvitationsPopover invitations={invitations ?? []} closePopover={closePopover} />}
    >
      <StyledChromelessButton onClick={onClickButton}>
        <Icon
          type={IconTypesEnum.PENCIL}
          size={32}
          fill={theme`colors.white`}
          hoverFill={theme`colors.purple.200`}
          isActive={isPopoverVisible}
        />
      </StyledChromelessButton>
    </Popover>
  );
};

const InvitationsPopover: FC<InvitationsPopoverProps> = ({invitations, closePopover}) => {
  const cardRef = useClickWindow<HTMLDivElement>(closePopover);

  return (
    <Card ref={cardRef}>
      <StyledCardH1>Invitations</StyledCardH1>
      {invitations.map(invitation => (
        <InvitationRow key={invitation.plan.id} invitation={invitation} />
      ))}
    </Card>
  );
};

const InvitationRow: FC<InvitationRowProps> = ({invitation}) => (
  <StyledInvitationDiv>
    <VisualPlan plan={invitation.plan} />

    <StyledActionsDiv>
      <Button backgroundColor={theme`colors.purple.400`}>Accept</Button>
      <Button backgroundColor={theme`colors.red.400`}>Decline</Button>
    </StyledActionsDiv>
  </StyledInvitationDiv>
);
