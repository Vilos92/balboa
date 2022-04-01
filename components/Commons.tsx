import {FC} from 'react';
import tw from 'twin.macro';

/*
 * Styles.
 */

const StyledColumnJustifiedDiv = tw.div`
  flex
  flex-col
  gap-6
  items-center
  justify-between
  h-full
  min-h-screen
  pl-1
  pr-1
  sm:pl-0
  sm:pr-0
`;

const StyledColumnHorizontalCenteredDiv = tw.div`
  flex
  flex-col
  items-center
  h-full
  min-h-screen
  pl-1
  pr-1
  sm:pl-0
  sm:pr-0
`;

export const StyledCardDiv = tw.div`
  filter
  drop-shadow-lg

  p-3
  bg-blend-lighten
  bg-white
  w-full
  rounded-lg
  sm:rounded-2xl
`;

/*
 * Components.
 */

export const ColumnJustified: FC = ({children}) => (
  <StyledColumnJustifiedDiv>{children}</StyledColumnJustifiedDiv>
);

export const ColumnHorizontalCentered: FC = ({children}) => (
  <StyledColumnHorizontalCenteredDiv>{children}</StyledColumnHorizontalCenteredDiv>
);
