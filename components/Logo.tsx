import {useRouter} from 'next/router';
import {FC} from 'react';
import tw, {theme} from 'twin.macro';

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

const StyledLogoSvgDiv = tw.div`
  mr-0.5
`;

const StyledLogoH1 = tw.h1`
  inline-block
  text-white
  text-3xl
  text-center
`;

/*
 * Component.
 */

export const Logo: FC = () => {
  const router = useRouter();
  const onClick = () => router.push(`/`);

  return (
    <StyledLogoDiv onClick={onClick}>
      <StyledLogoSvgDiv>
        <GrueSvg fill={theme`colors.white`} height='32px' />
      </StyledLogoSvgDiv>
      <StyledLogoH1>rueplan</StyledLogoH1>
    </StyledLogoDiv>
  );
};
