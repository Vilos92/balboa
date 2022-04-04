import React, {FC, MouseEvent, useState} from 'react';
import tw from 'twin.macro';

import {Invitation} from '../models/invitation';
import {useNetGetInvitationsForUser} from '../pages/api/invitations';
import {Handler} from '../types/common';
import {Providers, useAuthSession} from '../utils/auth';
import {useClickWindow} from '../utils/hooks';
import {Card} from './Card';
import {Icon, IconTypesEnum} from './Icon';
import {Logo} from './Logo';
import {MenuButton} from './MenuButton';
import {Popover} from './popover/Popover';

/*
 * Props.
 */

interface HeaderProps {
  providers?: Providers;
}

interface InvitationsPopoverProps {
  invitations: readonly Invitation[];
  closePopover: Handler;
}

/*
 * Styles.
 */

const StyledFalseHeaderDiv = tw.div`
  invisible 
  h-16
  w-full
`;

const StyledHeaderDiv = tw.div`
  box-border
  border-t
  border-b
  border-gray-50

  z-20
  bg-gray-800
  w-full
  h-16
  flex
  justify-between
  fixed
  top-0
`;

const StyledHeaderSpacerDiv = tw.div`
  flex-grow
  w-full
`;

const ActionsDiv = tw.div`
  flex-grow
  w-full

  flex
  flex-row
  justify-end
  items-center
`;

/*
 * Components.
 */

export const Header: FC<HeaderProps> = ({providers}) => {
  const {isAuthenticated} = useAuthSession();

  return (
    <>
      <StyledFalseHeaderDiv />
      <StyledHeaderDiv>
        <StyledHeaderSpacerDiv />
        <Logo />
        <ActionsDiv>
          {isAuthenticated && <InvitationButton />}
          <MenuButton providers={providers} />
        </ActionsDiv>
      </StyledHeaderDiv>
    </>
  );
};

const InvitationButton: FC = () => {
  const {data: invitations, error2, mutate} = useNetGetInvitationsForUser();

  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const onClickOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setIsPopoverVisible(true);
    event.stopPropagation();
  };
  const closePopover = () => setIsPopoverVisible(false);

  return (
    <Popover
      placement='bottom-end'
      isVisible={isPopoverVisible}
      popoverChildren={<InvitationsPopover invitations={invitations ?? []} closePopover={closePopover} />}
    >
      <button onClick={onClickOpen}>
        <Icon type={IconTypesEnum.PENCIL} size={20} />
      </button>
    </Popover>
  );
};

const InvitationsPopover: FC<InvitationsPopoverProps> = ({invitations, closePopover}) => {
  const cardRef = useClickWindow<HTMLDivElement>(closePopover);

  return (
    <Card ref={cardRef}>
      {invitations.map(invitation => (
        <div key={invitation.plan.id}>{invitation.plan.title}</div>
      ))}
    </Card>
  );
};
