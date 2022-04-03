import {MouseEvent, PropsWithChildren, forwardRef} from 'react';
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

const StyledCardDiv = tw.div`
  p-3
  bg-white
  shadow-xl

  w-full
  rounded-lg
  sm:rounded-2xl
`;

/*
 * Component.
 */

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
