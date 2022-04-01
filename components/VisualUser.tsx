import Image from 'next/image';
import {FC} from 'react';
import tw from 'twin.macro';

import {User} from '../models/user';
import {HoverTooltip} from './popover/HoverTooltip';

/*
 * Types.
 */

export interface VisualUserProps {
  user: User;
}

/*
 * Styles.
 */

const StyledUserDiv = tw.div`
  flex
  flex-row
  items-center
  gap-2
  mb-1
`;

const StyledImage = tw(Image)`
  rounded-full
`;

/*
 * Component.
 */

export const VisualUser: FC<VisualUserProps> = ({user}) => {
  return (
    <HoverTooltip text={user.email} visibilityDuration={0}>
      <StyledUserDiv>
        <StyledImage src={user.image} width='20' height='20' />
        <span>{user.name}</span>
      </StyledUserDiv>
    </HoverTooltip>
  );
};
