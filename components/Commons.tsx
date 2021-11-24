import {FC} from 'react';
import tw from 'twin.macro';

/*
 * Styles.
 */

const StyledBodyDiv = tw.div`
  bg-gray-800
`;

const StyledCardContainerDiv = tw.div`
  flex
  flex-col
  items-center
  justify-center
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
  mb-6
`;

/*
 * Components.
 */

export const Body: FC = ({children}) => <StyledBodyDiv>{children}</StyledBodyDiv>;

export const Card: FC = ({children}) => {
  return (
    <StyledCardContainerDiv>
      <StyledLogoH1>Grueplan</StyledLogoH1>
      <StyledCardDiv>{children}</StyledCardDiv>
    </StyledCardContainerDiv>
  );
};
