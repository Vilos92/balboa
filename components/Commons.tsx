import {FC, MouseEvent, PropsWithChildren, forwardRef} from 'react';
import tw from 'twin.macro';

/*
 * Types.
 */

interface CardProps {
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

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

const StyledCardDiv = tw.div`
  filter
  drop-shadow-lg

  p-3
  bg-blend-lighten
  bg-white
  w-full
  rounded-2xl
  shadow-md
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

export const Card = forwardRef<HTMLDivElement, PropsWithChildren<CardProps>>(function Card(
  {children, className, onClick},
  ref
) {
  return (
    <StyledCardDiv className={className} onClick={onClick} ref={ref}>
      {children}
    </StyledCardDiv>
  );
});
