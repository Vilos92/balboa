import {ChangeEvent, FC, FormEvent, useState} from 'react';
import tw from 'twin.macro';

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

export const InvitationForm: FC<InvitationFormProps> = ({planId}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailError('');
    setEmail(event.target.value);
  };

  const [isInviteTooltipVisible, setIsInviteTooltipVisible] = useState(false);
  const [setInviteTooltipTimeout] = useTimeout();

  const sendInvitation = () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
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

const InvitationButton: FC<InvitationButtonProps> = ({isInviteTooltipVisible, sendInvitation}) => {
  return (
    <StyledInvitationTooltipDiv>
      <Tooltip text='Invited!' isVisible={isInviteTooltipVisible}>
        <StyledInvitationButton type='button' onClick={sendInvitation}>
          Invite
        </StyledInvitationButton>
      </Tooltip>
    </StyledInvitationTooltipDiv>
  );
};
