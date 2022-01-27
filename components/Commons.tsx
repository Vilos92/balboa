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

const StyledColumnJustifiedContentDiv = tw.div`
  h-full
  flex
  flex-col
  gap-6
  items-center
  justify-between
  min-h-screen
`;

const StyledCardDiv = tw.div`
  p-3
  bg-white
  w-full
  sm:shadow-md
  sm:rounded-2xl
`;

/*
 * Components.
 */

export const ColumnJustifiedContent: FC = ({children}) => {
  return <StyledColumnJustifiedContentDiv>{children}</StyledColumnJustifiedContentDiv>;
};

export const Card = forwardRef<HTMLDivElement, PropsWithChildren<CardProps>>(
  ({children, className, onClick}, ref) => {
    return (
      <StyledCardDiv className={className} onClick={onClick} ref={ref}>
        {children}
      </StyledCardDiv>
    );
  }
);
