import Image from 'next/image';
import {FC, MouseEvent, PropsWithChildren, forwardRef} from 'react';
import tw, {styled} from 'twin.macro';

import grueSvg from '../public/partyhat-grue_blocky.svg';

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
  items-center
  sm:justify-between
  min-h-screen
  py-2
`;

const StyledCardDiv = tw.div`
  p-3
  bg-white
  w-full
  sm:shadow-md
  sm:rounded-2xl
`;

const StyledLogoDiv = tw.div`
  flex
  flex-row
  items-center
  mb-6
`;

const StyledLogoH1 = tw.h1`
  inline-block
  text-white
  text-3xl
  text-center
`;

/*
 * Components.
 */

export const Body: FC = ({children}) => <StyledBodyDiv>{children}</StyledBodyDiv>;

export const Logo: FC = () => (
  <StyledLogoDiv>
    <Image src={grueSvg} />
    <StyledLogoH1>Grueplan</StyledLogoH1>
  </StyledLogoDiv>
);

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
