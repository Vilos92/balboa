import {FC, PropsWithChildren} from 'react';
import tw from 'twin.macro';

/*
 * Types.
 */

type ColumnJustifiedProps = PropsWithChildren<unknown>;

type ColumnHorizontalCenteredProps = PropsWithChildren<unknown>;

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

/*
 * Components.
 */

export const ColumnJustified: FC<ColumnJustifiedProps> = ({children}) => (
  <StyledColumnJustifiedDiv>{children}</StyledColumnJustifiedDiv>
);

export const ColumnHorizontalCentered: FC<ColumnHorizontalCenteredProps> = ({children}) => (
  <StyledColumnHorizontalCenteredDiv>{children}</StyledColumnHorizontalCenteredDiv>
);
