import {MouseEvent, PropsWithChildren, forwardRef} from 'react';

import {StyledCardDiv} from './Commons';

/*
 * Types.
 */

interface CardProps {
  className?: string;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

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
