import {useRouter} from 'next/router';
import {FC} from 'react';
import tw from 'twin.macro';

/*
 * Props
 */

interface LogoSvgProps {
  fill: string;
  height: string;
}

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
        <LogoSvg fill='#ffffff' height='32px' />
      </StyledLogoSvgDiv>
      <StyledLogoH1>rueplan</StyledLogoH1>
    </StyledLogoDiv>
  );
};

const LogoSvg: FC<LogoSvgProps> = ({fill, height}) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 42.4 54.93' height={height}>
    <path
      d='M41.85,36.54H41.1v-6.7a.79.79,0,0,0-1.4-.5l-6,7.2H28.12c-1.5,0-2.77-.91-2.77-2a2,2,0,0,0-4,0c0,3.31,3,6,6.77,6H39.85v11a2,2,0,0,1-2,2h-23a2,2,0,0,1-2-2v-32a2,2,0,0,1,.33-1.09l1-.78a2.09,2.09,0,0,1,.67-.12h6.24a9.83,9.83,0,0,0-.28,2.32c0,4.43,2.92,8,6.51,8a6.38,6.38,0,0,0,5.6-4,6.29,6.29,0,0,0,5.5,4c3.52,0,6.39-3.59,6.39-8s-2.87-8-6.39-8a5.57,5.57,0,0,0-3.91,1.69h-3.2a5.56,5.56,0,0,0-8,0H18.85v0a1,1,0,0,0-.43-.79L4,2.78a1,1,0,0,0-1.17,0,1,1,0,0,0-.35,1.11L7.9,20.85a1,1,0,0,0,.95.69v30a6,6,0,0,0,6,6h23a6,6,0,0,0,6-6v-13A2,2,0,0,0,41.85,36.54ZM27.32,25.88a4.52,4.52,0,0,1-4-3.13h7.91A4.5,4.5,0,0,1,27.32,25.88Zm11.1,0c-1.65,0-3.1-1.26-3.84-3.13h7.69C41.52,24.62,40.08,25.88,38.42,25.88Zm4.39-6a8.6,8.6,0,0,1-.12,1.36h-.95A6,6,0,0,0,41.88,20c0-2.27-1.18-4.11-2.64-4.11S36.59,17.73,36.59,20a6,6,0,0,0,.14,1.22H34.15A8.61,8.61,0,0,1,34,19.86c0-3.31,2-6,4.38-6S42.81,16.55,42.81,19.86Zm-15.49-6c2.49,0,4.51,2.7,4.51,6a7.56,7.56,0,0,1-.12,1.36h-1.2A5.36,5.36,0,0,0,30.65,20c0-2.27-1.18-4.11-2.64-4.11S25.37,17.73,25.37,20a6,6,0,0,0,.13,1.22H22.93a7.56,7.56,0,0,1-.12-1.36C22.81,16.55,24.83,13.85,27.32,13.85ZM5.26,6.09,12.45,11H6.85Zm2.23,7h7.86l.81.56L9.37,18.87Zm32,19v4.52H35.74Z'
      transform='translate(-2.41 -2.6)'
      style={{fill}}
    />
  </svg>
);
