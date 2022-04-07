import axios from 'axios';
import {ChangeEvent, FC, FormEvent, useState} from 'react';
import tw from 'twin.macro';

import {Invitation} from '../models/invitation';
import {postInvitation} from '../pages/api/plans/[planId]/invitations';
import {Handler} from '../types/common';
import {useTimeout} from '../utils/hooks';
import {validateEmail} from '../utils/schema';
import {Button} from './Button';
import {EmailInput} from './inputs/EmailInput';
import {Tooltip} from './popover/Tooltip';

/*
 * Types.
 */

interface InvitationFormProps {
  planId: string;
  mutateInvitations: (invitation: Invitation) => void;
}

interface InvitationButtonProps {
  isInviteTooltipVisible: boolean;
  sendInvitation: Handler;
}

/*
 * Constants.
 */

const tooltipVisibilityDuration = 2000; // 2000 ms.

/*
 * Styles.
 */

const StyledInvitationDiv = tw.div`
  flex
  flex-row
  items-center
  gap-3
`;

const StyledInvitationTooltipDiv = tw.div`
  relative
`;

const StyledInvitationButton = tw(Button)`
  bg-purple-400
  mt-2
  h-10
`;

/*
 * Components.
 */

export const InvitationForm: FC<InvitationFormProps> = ({planId, mutateInvitations}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailError('');
    setEmail(event.target.value);
  };

  const [isInviteTooltipVisible, setIsInviteTooltipVisible] = useState(false);
  const [setInviteTooltipTimeout] = useTimeout();

  const sendInvitation = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    const invitationDraft = {email};
    try {
      const invitation = await postInvitation(planId, invitationDraft);
      mutateInvitations(invitation);
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        console.error(error);
      } else if (error.response?.status === 303) {
        setEmailError(error.response.data.error);
      }
      return;
    }

    setEmail('');

    setIsInviteTooltipVisible(true);
    setInviteTooltipTimeout(() => setIsInviteTooltipVisible(false), tooltipVisibilityDuration);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendInvitation();
  };

  return (
    <form onSubmit={onSubmit}>
      <StyledInvitationDiv>
        <EmailInput label='Email' value={email} error={emailError} onChange={onChangeEmail} />
        <InvitationButton isInviteTooltipVisible={isInviteTooltipVisible} sendInvitation={sendInvitation} />
      </StyledInvitationDiv>
    </form>
  );
};

const InvitationButton: FC<InvitationButtonProps> = ({isInviteTooltipVisible, sendInvitation}) => (
  <StyledInvitationTooltipDiv>
    <Tooltip text='Invited!' isVisible={isInviteTooltipVisible} placement='left'>
      <StyledInvitationButton type='button' onClick={sendInvitation}>
        Invite
      </StyledInvitationButton>
    </Tooltip>
  </StyledInvitationTooltipDiv>
);
