import Image from 'next/image';
import {useRouter} from 'next/router';
import {FC, MouseEvent, PropsWithChildren, forwardRef} from 'react';
import tw from 'twin.macro';

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

const StyledLogoDiv = tw.button`
  flex
  flex-row
  items-center
  mt-6
  mb-6
`;

const StyledLogoH1 = tw.h1`
  inline-block
  text-white
  text-3xl
  text-center
`;

const StyledTopBarDiv = tw.div`
  bg-purple-900
  w-full
  h-16
  flex
  justify-center
`;

/*
 * Components.
 */

export const Body: FC = ({children}) => <StyledBodyDiv>{children}</StyledBodyDiv>;

export const Logo: FC = () => {
  const router = useRouter();
  const onClick = () => router.push(`/`);

  return (
    <StyledLogoDiv onClick={onClick}>
      <Image src={grueSvg} />
      <StyledLogoH1>Grueplan</StyledLogoH1>
    </StyledLogoDiv>
  );
};

export const TopBar: FC = () => {
  return (
    <StyledTopBarDiv>
      <Logo />
    </StyledTopBarDiv>
  );
};

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
