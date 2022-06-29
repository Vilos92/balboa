import {FC} from 'react';
import tw from 'twin.macro';

import {Handler} from '../types/common';
import {ChromelessButton} from './ChromelessButton';
import {Icon, IconTypesEnum} from './Icon';

/*
 * Types.
 */

interface LandingButtonProps {
  text: string;
  iconType: IconTypesEnum;
  onClick: Handler;
}

/*
 * Styles.
 */

const StyledButtonDiv = tw(ChromelessButton)`
  flex
  justify-center
  items-center
  
  h-24
  w-full
  sm:h-32
  sm:w-48
  sm:max-w-xl

  p-3
  sm:rounded-2xl

  bg-white
  shadow-xl
  hover:bg-purple-100
`;

const StyledButtonContentDiv = tw.div`
  flex
  flex-row
  items-center
  justify-evenly
  gap-3
  sm:gap-0

  text-black
  text-left
  text-xl
`;

const StyledTextDiv = tw.div`
  sm:w-24
`;

/*
 * Components.
 */
export const LandingButton: FC<LandingButtonProps> = ({text, iconType, onClick}) => (
  <StyledButtonDiv onClick={onClick}>
    <StyledButtonContentDiv>
      <StyledTextDiv>{text}</StyledTextDiv> <Icon type={iconType} size={32} />
    </StyledButtonContentDiv>
  </StyledButtonDiv>
);
