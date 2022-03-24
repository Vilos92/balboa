import dynamic from 'next/dynamic';
import {FC, useEffect, useState} from 'react';
import {animated, useSpring} from 'react-spring';

import {LocationVisualizerMock} from '../locationVisualizer/LocationVisualizer';
import {StyledLocationDiv} from './PlanForm';

/*
 * SSR Imports.
 */

const LocationVisualizer = dynamic(() => import('../locationVisualizer/LocationVisualizer'), {
  loading: () => <></>,
  ssr: false
});

/*
 * Types.
 */

interface LocationVisualizerAccordionProps {
  isExpanded: boolean;
  location: string;
}

/*
 * Component.
 */

export const LocationVisualizerAccordion: FC<LocationVisualizerAccordionProps> = ({isExpanded, location}) => {
  // Do not load the real visualizer until the accordion is fuly expanded
  // to keep the transition smooth.
  const [isRested, setIsRested] = useState(false);
  const onRest = () => {
    setIsRested(true);
  };

  const style = useSpring({
    from: {height: '0px', opacity: 0},
    to: {height: isExpanded ? '200px' : '0', opacity: 100},
    reverse: !isExpanded,
    onRest
  });

  return (
    <>
      {/* @ts-ignore: https://github.com/pmndrs/react-spring/issues/1515 */}
      <animated.div style={style}>
        <StyledLocationDiv $isExpanded={isExpanded}>
          {isRested ? <LocationVisualizer location={location} /> : <LocationVisualizerMock />}
        </StyledLocationDiv>
      </animated.div>
    </>
  );
};
