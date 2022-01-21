import {FC} from 'react';
import tw from 'twin.macro';

import {Logo} from './Logo';

/*
 * Styles.
 */

const StyledFalseHeaderDiv = tw.div`
  invisible 
  h-16
  w-full
`;

export const StyledHeaderDiv = tw.div`
  bg-purple-900
  opacity-90
  w-full
  h-16
  flex
  justify-center
  fixed
  top-0
`;

/*
 * Component.
 */

export const Header: FC = () => {
  return (
    <>
      <StyledFalseHeaderDiv />
      <StyledHeaderDiv>
        <Logo />
      </StyledHeaderDiv>
    </>
  );
};
