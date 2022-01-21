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

const StyledBodyDiv = tw.div`
  bg-gray-800
`;

const StyledCenteredContentDiv = tw.div`
  flex
  flex-col
  gap-6
  items-center
  sm:justify-between
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

export const Body: FC = ({children}) => <StyledBodyDiv>{children}</StyledBodyDiv>;

export const CenteredContent: FC = ({children}) => {
  return <StyledCenteredContentDiv>{children}</StyledCenteredContentDiv>;
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
