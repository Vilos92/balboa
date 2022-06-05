import {useRouter} from 'next/router';
import {FC} from 'react';
import tw, {styled, theme} from 'twin.macro';

import {GrueSvg} from './svg/GrueSvg';

/*
 * Styles.
 */

const StyledLogoDiv = tw.button`
  flex
  flex-row
  items-center
  mt-6
  mb-6
`;

const StyledLogoSvgDiv = styled.div`
  ${tw`
    mr-0.5
  `};

  & > svg {
    ${tw`
      transition-colors
      duration-200
      ease-in-out
    `}
  }
`;

const StyledLogoH1 = tw.h1`
  inline-block
  text-secondary
  text-3xl
  text-center
`;

/*
 * Component.
 */

export const Logo: FC = () => {
  const router = useRouter();
  const onClick = () => router.push('/');

  return (
    <StyledLogoDiv onClick={onClick}>
      <StyledLogoSvgDiv>
        <GrueSvg fill={theme`textColor.secondary`} height='32px' />
      </StyledLogoSvgDiv>
      <StyledLogoH1>rueplan</StyledLogoH1>
    </StyledLogoDiv>
  );
};
