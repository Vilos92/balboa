import {FC, MouseEvent} from 'react';
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
  items-center
  justify-between
  min-h-screen
  py-2
`;

const StyledCardDiv = tw.div`
  p-3
  bg-white
  rounded-2xl
  shadow-md
  w-full
  sm:w-7/12
`;

const StyledLogoH1 = tw.h1`
  text-white
  text-3xl
  text-center
  mt-6
  mb-6
`;

/*
 * Components.
 */

export const Body: FC = ({children}) => <StyledBodyDiv>{children}</StyledBodyDiv>;

export const Logo: FC = () => <StyledLogoH1>Grueplan</StyledLogoH1>;

export const CenteredContent: FC = ({children}) => {
  return <StyledCenteredContentDiv>{children}</StyledCenteredContentDiv>;
};

export const Card: FC<CardProps> = ({children, className, onClick}) => {
  return (
    <StyledCardDiv className={className} onClick={onClick}>
      {children}
    </StyledCardDiv>
  );
};
