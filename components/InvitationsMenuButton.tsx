import {useRouter} from 'next/router';
import React, {FC, MouseEvent, useState} from 'react';
import tw, {styled, theme} from 'twin.macro';

import {Invitation, InvitationStatusesEnum} from '../models/invitation';
import {useNetGetInvitationsForUser} from '../pages/api/invitations';
import {PatchInvitation, patchInvitation} from '../pages/api/invitations/[invitationId]';
import {Handler} from '../types/common';
import {SessionStatusesEnum, useAuthSession} from '../utils/auth';
import {useClickWindow, useHover, useMediaBreakpoint} from '../utils/hooks';
import {Button} from './Button';
import {Card} from './Card';
import {ChromelessButton} from './ChromelessButton';
import {Icon, IconTypesEnum} from './Icon';
import {Modal} from './Modal';
import {VisualPlan} from './VisualPlan';
import {Popover} from './popover/Popover';

/*
 * Props.
 */

interface InvitationsPopoverProps {
  invitations: readonly Invitation[];
  closePopover: Handler;
}

interface InvitationsModalProps {
  invitations: readonly Invitation[];
  closeModal: Handler;
}

interface InvitationsContentProps {
  invitations: readonly Invitation[];
  closeMenu: Handler;
}

interface InvitationRowProps {
  invitation: Invitation;
  closeMenu: Handler;
}

interface InvitationResponseProps {
  status: Exclude<InvitationStatusesEnum, InvitationStatusesEnum.PENDING>;
}

/*
 * Styles.
 */

const StyledCard = tw(Card)`
  w-80
  pl-0
  pr-0
  pb-0
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
  font-bold
  tracking-wide
  border-b
  border-gray-200
  pb-2
`;

const StyledModalH1 = tw.h1`
  w-full
  text-2xl
  text-center
  font-bold
  tracking-wide
  border-b-2
  border-gray-200
  pb-3
`;

const StyledEmptyDiv = tw.div`
  flex
  justify-center
  items-center
  p-5
  text-lg
  text-gray-400
`;

interface StyledInvitationDivProps {
  $hasHover: boolean;
}
const StyledInvitationDiv = styled.div<StyledInvitationDivProps>`
  ${tw`
    w-full
    pt-3
    pb-4
    not-last:border-b
    last:sm:rounded-b-2xl

    border-gray-200

    text-gray-600
    active:text-gray-600
    focus:text-gray-600

    active:bg-purple-100
    focus:bg-purple-100

    cursor-pointer
  `}

  ${({$hasHover}) => $hasHover && tw`bg-purple-100 text-gray-600`}

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

const StyledActionButton = tw(Button)`
  w-full
`;

interface StyledInvitationResponseDivProps {
  $isAccepted?: boolean;
}
const StyledInvitationResponseDiv = styled.div<StyledInvitationResponseDivProps>`
  ${tw`
    flex
    justify-center
    items-center

    font-bold
    pt-2
  `}

  & > div {
    ${tw`
      p-3
      rounded-2xl
    `}

    ${({$isAccepted}) => ($isAccepted ? tw`bg-green-200` : tw`bg-red-200`)}
  }
`;

/*
 * Components.
 */

export const InvitationsMenuButton: FC = () => {
  const {status} = useAuthSession();
  const isLoadingSessionStatus = status === SessionStatusesEnum.LOADING;

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const {isScreenSmall, isScreenMobile} = useMediaBreakpoint();

  const {data: invitations = [], error, mutate} = useNetGetInvitationsForUser();
  if (error) return null;

  const onClickButton = () => {
    if (isLoadingSessionStatus) return;
    setTimeout(() => setIsMenuVisible(!isMenuVisible));
  };
  const closeMenu = () => {
    setIsMenuVisible(false);

    // Reload invitations to account for any changes in status.
    mutate();
  };

  const isSomeUnread = invitations.length > 0;

  return (
    <>
      <Popover
        placement='bottom-end'
        isVisible={isScreenSmall && isMenuVisible}
        popoverChildren={<InvitationsPopover invitations={invitations} closePopover={closeMenu} />}
      >
        <StyledChromelessButton onClick={onClickButton}>
          <Icon
            type={isSomeUnread ? IconTypesEnum.MAIL_UNREAD : IconTypesEnum.MAIL}
            size={32}
            fill={isSomeUnread ? theme`colors.red.400` : theme`colors.white`}
            hoverFill={isSomeUnread ? theme`colors.red.200` : theme`colors.purple.400`}
            isActive={isMenuVisible}
          />
        </StyledChromelessButton>
      </Popover>

      {isScreenMobile && isMenuVisible && (
        <InvitationsModal invitations={invitations} closeModal={closeMenu} />
      )}
    </>
  );
};

const InvitationsPopover: FC<InvitationsPopoverProps> = ({invitations, closePopover}) => {
  const cardRef = useClickWindow<HTMLDivElement>(closePopover);

  return (
    <StyledCard ref={cardRef}>
      <StyledCardH1>Invitations</StyledCardH1>
      <InvitationsContent invitations={invitations} closeMenu={closePopover} />
    </StyledCard>
  );
};

const InvitationsModal: FC<InvitationsModalProps> = ({invitations, closeModal}) => {
  return (
    <Modal closeModal={closeModal}>
      <StyledModalH1>Invitations</StyledModalH1>
      <InvitationsContent invitations={invitations} closeMenu={closeModal} />
    </Modal>
  );
};

const InvitationsContent: FC<InvitationsContentProps> = ({invitations, closeMenu}) => (
  <>
    {invitations.length > 0 ? (
      invitations.map(invitation => (
        <InvitationRow key={invitation.plan.id} invitation={invitation} closeMenu={closeMenu} />
      ))
    ) : (
      <StyledEmptyDiv>Waiting for invites...</StyledEmptyDiv>
    )}
  </>
);

const InvitationRow: FC<InvitationRowProps> = ({invitation, closeMenu: closePopover}) => {
  const router = useRouter();

  const [invitationHoverRef, hasInvitationHover] = useHover<HTMLDivElement>();
  const [acceptHoverRef, hasAcceptHover] = useHover<HTMLButtonElement>();
  const [declineHoverRef, hasDeclineHover] = useHover<HTMLButtonElement>();

  const onClick = async (event: MouseEvent<HTMLDivElement>) => {
    // We must cast the target to Node as per official rec:
    // https://github.com/Microsoft/TypeScript/issues/15394#issuecomment-297495746
    if (acceptHoverRef.current?.contains(event.target as Node)) return;
    if (declineHoverRef.current?.contains(event.target as Node)) return;

    await router.push(`/plans/${invitation.plan.id}`);
    closePopover();
  };

  const updateInvitation = async (invitationDraft: PatchInvitation) =>
    await patchInvitation(invitation.id, invitationDraft);

  const [localStatus, setLocalStatus] = useState<InvitationStatusesEnum>(invitation.status);
  const onClickAccept = async (event: MouseEvent<HTMLButtonElement>) => {
    await updateInvitation({status: InvitationStatusesEnum.ACCEPTED});
    setTimeout(() => setLocalStatus(InvitationStatusesEnum.ACCEPTED));
  };
  const onClickDecline = async (event: MouseEvent<HTMLButtonElement>) => {
    await updateInvitation({status: InvitationStatusesEnum.DECLINED});
    setTimeout(() => setLocalStatus(InvitationStatusesEnum.DECLINED));
  };

  const isPending = localStatus === InvitationStatusesEnum.PENDING;
  const hasHover = hasInvitationHover && (!isPending || !(hasAcceptHover || hasDeclineHover));

  return (
    <StyledInvitationDiv ref={invitationHoverRef} $hasHover={hasHover} onClick={onClick}>
      <VisualPlan plan={invitation.plan} />

      {localStatus === InvitationStatusesEnum.PENDING ? (
        <StyledActionsDiv>
          <StyledActionButton
            ref={acceptHoverRef}
            backgroundColor={theme`colors.purple.400`}
            onClick={onClickAccept}
          >
            Accept
          </StyledActionButton>
          <StyledActionButton
            ref={declineHoverRef}
            backgroundColor={theme`colors.red.400`}
            onClick={onClickDecline}
          >
            Decline
          </StyledActionButton>
        </StyledActionsDiv>
      ) : (
        <InvitationResponse status={localStatus} />
      )}
    </StyledInvitationDiv>
  );
};

const InvitationResponse: FC<InvitationResponseProps> = ({status}) => {
  switch (status) {
    case InvitationStatusesEnum.ACCEPTED:
      return (
        <StyledInvitationResponseDiv $isAccepted>
          <div>Accepted</div>
        </StyledInvitationResponseDiv>
      );
    case InvitationStatusesEnum.DECLINED:
      return (
        <StyledInvitationResponseDiv>
          <div>Declined</div>
        </StyledInvitationResponseDiv>
      );
    default:
      return null;
  }
};
