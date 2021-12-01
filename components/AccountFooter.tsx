import {FC} from 'react';
import tw, {styled} from 'twin.macro';

import {Button} from './Button';

/*
 * Styles.
 */

const StyledFalseFooterDiv = tw.div`
  invisible 
  h-16
  w-full
  mt-6
`;

const StyledFooterDiv = styled.div`
  ${tw`
    bg-purple-900
    text-gray-100
    flex
    justify-center
    h-16
    w-full
    fixed
    bottom-0
  `}
`;

const StyledContentDiv = tw.div`
  flex
  justify-center
  sm:justify-between
  items-center
  pl-8
  pr-8
  max-w-5xl
  w-full
`;

const StyledFooterBlurbDiv = tw.div`
  hidden
  sm:flex
  flex-col
`;

const StyledFooterH2 = tw.h2`
  font-bold
`;

const StyledFooterH3 = tw.h3`
  text-sm
`;

const StyledFooterButtonDiv = tw.div`
  flex
  flex-row
  gap-3
`;

const StyledFooterButton = tw(Button)`
  bg-purple-900
  border-2
  border-gray-200
  h-10
`;

/*
 * Component.
 */

export const AccountFooter: FC = () => (
  <>
    <StyledFalseFooterDiv />
    <StyledFooterDiv>
      <StyledContentDiv>
        <StyledFooterBlurbDiv>
          <StyledFooterH2>Stay on top of plans</StyledFooterH2>
          <StyledFooterH3>People on Grueplan stay coordinated</StyledFooterH3>
        </StyledFooterBlurbDiv>
        <StyledFooterButtonDiv>
          <StyledFooterButton>Log in</StyledFooterButton>
          <StyledFooterButton>Sign up</StyledFooterButton>
        </StyledFooterButtonDiv>
      </StyledContentDiv>
    </StyledFooterDiv>
  </>
);
