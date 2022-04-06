import dynamic from 'next/dynamic';
import {FC, Suspense, useEffect, useState} from 'react';
import {animated, useSpring} from 'react-spring';
import tw, {styled} from 'twin.macro';

import {useInitialEffect} from '../../utils/hooks';
import {LocationVisualizerMock} from '../locationVisualizer/LocationVisualizer';

/*
 * SSR Imports.
 */

const LocationVisualizer = dynamic(() => import('../locationVisualizer/LocationVisualizer'), {
  loading: () => <LocationVisualizerMock />,
  ssr: false,
  suspense: true
});

/*
 * Types.
 */

interface LocationVisualizerAccordionProps {
  isExpanded: boolean;
  location: string;
}

/*
 * Styles.
 */

interface StyledLocationDivProps {
  $isExpanded: boolean;
}
const StyledLocationDiv = styled.div<StyledLocationDivProps>`
  ${tw`
    overflow-y-hidden
  `}

  ${({$isExpanded}) => !$isExpanded && tw`invisible`}
`;

/*
 * Component.
 */

export const LocationVisualizerAccordion: FC<LocationVisualizerAccordionProps> = ({isExpanded, location}) => {
  // Do not load the real visualizer until the accordion is fully expanded
  // to keep the transition smooth.
  const [isRested, setIsRested] = useState(false);
  const onRest = () => {
    setIsRested(true);
  };

  const [isExpandedLocal, setIsExpandedLocal] = useState(false);
  useEffect(() => {
    setIsExpandedLocal(isExpanded);
  }, [isExpanded]);

  const style = useSpring({
    from: {height: '0px', opacity: 0},
    to: {height: isExpandedLocal ? '200px' : '0px', opacity: isExpandedLocal ? 100 : 0},
    reverse: !isExpandedLocal,
    onRest
  });

  return (
    <StyledLocationDiv $isExpanded={isExpandedLocal}>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <animated.div style={style}>
        {isRested ? (
          <Suspense fallback={<LocationVisualizerMock />}>
            <LocationVisualizer location={location} />
          </Suspense>
        ) : (
          <LocationVisualizerMock />
        )}
      </animated.div>
    </StyledLocationDiv>
  );
};
