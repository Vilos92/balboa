import Image from 'next/image';
import {useRouter} from 'next/router';
import {FC} from 'react';
import tw from 'twin.macro';

import grueSvg from '../public/partyhat-grue_blocky.svg';

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
      <Image src={grueSvg} />
      <StyledLogoH1>Grueplan</StyledLogoH1>
    </StyledLogoDiv>
  );
};
